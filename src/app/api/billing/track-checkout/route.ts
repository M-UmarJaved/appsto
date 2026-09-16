import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Track Skillnavo checkout sessions for funnel analytics & cart abandonment recovery.
 * Captures prospective students arriving on checkout, their plan interest, and email.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      email,
      name,
      plan_slug,
      skillnavo_user_id,
      paddle_price_id,
      status = 'pending',
      country_code,
      currency = 'USD',
      amount,
      metadata = {},
    } = body

    if (!email || !plan_slug) {
      return NextResponse.json(
        { error: 'Email and plan_slug are required for checkout tracking.' },
        { status: 400 }
      )
    }

    // Upsert or insert new checkout session
    const { data, error } = await supabase
      .from('skillnavo_checkout_sessions')
      .insert({
        customer_email: email.trim().toLowerCase(),
        customer_name: name || null,
        plan_slug,
        skillnavo_user_id: skillnavo_user_id || null,
        paddle_price_id: paddle_price_id || null,
        status,
        country_code: country_code || null,
        currency,
        amount: amount ? Number(amount) : null,
        recovery_email_sent: false,
        metadata: {
          ...metadata,
          user_agent: req.headers.get('user-agent'),
          ip_country: req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || null,
        },
      })
      .select('id')
      .single()

    if (error) {
      console.warn('[TrackCheckout] DB tracking insertion warning:', error.message)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, tracking_id: data?.id }, { status: 200 })
  } catch (err: any) {
    console.error('[TrackCheckout] Unexpected tracking error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
