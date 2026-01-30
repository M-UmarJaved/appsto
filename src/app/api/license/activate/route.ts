import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

/**
 * License Activation/Verification API
 * 
 * This endpoint is called by desktop applications to activate and verify licenses.
 * 
 * Flow:
 * 1. Desktop app sends license token
 * 2. API verifies token exists and is not used
 * 3. API marks token as used and stores device info
 * 4. Returns success/failure
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, deviceInfo } = body

    if (!token) {
      return NextResponse.json(
        { error: 'License token is required' },
        { status: 400 }
      )
    }

    const supabase = getServiceSupabase()

    // Find the license
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('*, products(*)')
      .eq('token', token)
      .single()

    if (licenseError || !license) {
      return NextResponse.json(
        { 
          error: 'Invalid license token',
          valid: false 
        },
        { status: 404 }
      )
    }

    // Check if already activated
    if (license.is_used) {
      return NextResponse.json(
        {
          error: 'License already activated',
          valid: false,
          activatedAt: license.activated_at,
        },
        { status: 400 }
      )
    }

    // Activate the license
    const { error: updateError } = await supabase
      .from('licenses')
      .update({
        is_used: true,
        activated_at: new Date().toISOString(),
        device_info: deviceInfo || {},
      })
      .eq('id', license.id)

    if (updateError) {
      console.error('Failed to activate license:', updateError)
      return NextResponse.json(
        { error: 'Failed to activate license' },
        { status: 500 }
      )
    }

    // Return success with product info
    return NextResponse.json({
      valid: true,
      activated: true,
      product: {
        id: license.products.id,
        name: license.products.name,
        version: '1.0.0', // You can add version field to products table
      },
      activatedAt: new Date().toISOString(),
      message: 'License activated successfully',
    })
  } catch (error) {
    console.error('License activation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Verify license (for checking if already activated)
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'License token is required' },
        { status: 400 }
      )
    }

    const supabase = getServiceSupabase()

    // Find the license
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('*, products(*)')
      .eq('token', token)
      .single()

    if (licenseError || !license) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'Invalid license token'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      valid: true,
      activated: license.is_used,
      activatedAt: license.activated_at,
      product: {
        id: license.products.id,
        name: license.products.name,
      },
    })
  } catch (error) {
    console.error('License verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
