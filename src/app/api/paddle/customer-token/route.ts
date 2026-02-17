import { NextRequest, NextResponse } from 'next/server'

/**
 * Generate Customer Authentication Token for Saved Payment Methods
 * 
 * This endpoint generates a secure token that allows customers to:
 * - See their saved payment methods at checkout
 * - Complete purchases with one-click using saved cards/PayPal
 * 
 * Security: Token is valid for 30 minutes and tied to specific customer ID
 */
export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json()

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // Validate customer ID format
    if (!customerId.startsWith('ctm_')) {
      return NextResponse.json(
        { error: 'Invalid customer ID format. Must start with "ctm_"' },
        { status: 400 }
      )
    }

    const paddleApiKey = process.env.PADDLE_API_KEY
    if (!paddleApiKey) {
      console.error('❌ PADDLE_API_KEY not configured')
      return NextResponse.json(
        { error: 'Payment system configuration error' },
        { status: 500 }
      )
    }

    // Determine API endpoint based on environment
    const isProd = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'production'
    const apiUrl = isProd 
      ? 'https://api.paddle.com'
      : 'https://sandbox-api.paddle.com'

    console.log(`🔑 Generating customer auth token for: ${customerId}`)

    // Call Paddle API to generate customer authentication token
    const response = await fetch(
      `${apiUrl}/customers/${customerId}/auth-token`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${paddleApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Paddle API error:', errorData)
      
      return NextResponse.json(
        { error: 'Failed to generate customer token', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    console.log('✅ Customer auth token generated successfully')
    console.log(`⏰ Token expires at: ${data.data.expires_at}`)

    return NextResponse.json({
      customerAuthToken: data.data.customer_auth_token,
      expiresAt: data.data.expires_at
    })

  } catch (error: any) {
    console.error('❌ Error generating customer token:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
