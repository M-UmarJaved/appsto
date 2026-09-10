import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Test Webhook Simulator
 * Simulates a Paddle webhook call for local testing
 * Production: Requires x-api-key header or key query param
 * 
 * This bypasses the need for ngrok/tunneling by directly calling the webhook handler
 * with properly formatted Paddle webhook data
 */
export async function POST(req: NextRequest) {
  // SECURITY: Check for API key in production
  if (process.env.NODE_ENV === 'production') {
    const apiKey = req.nextUrl.searchParams.get('key') || req.headers.get('x-api-key')
    const validKey = process.env.API_SECRET_KEY

    if (!apiKey || !validKey || apiKey !== validKey) {
      console.warn('⚠️ Unauthorized test endpoint access attempt')
      return NextResponse.json(
        { error: 'Unauthorized - API key required' },
        { status: 401 }
      )
    }
  }

  try {
    const body = await req.json()
    const { 
      email = 'test@example.com',
      name = 'Test Customer',
      planSlug = 'solo',
      amount = 3.0,
      currency = 'USD'
    } = body

    console.log('🧪 Simulating Paddle webhook with:', { email, name, planSlug, amount, currency })

    // Create a mock Paddle transaction.completed event
    const mockPaddleEvent = {
      event_id: 'evt_test_' + Date.now(),
      event_type: 'transaction.completed',
      occurred_at: new Date().toISOString(),
      data: {
        id: 'txn_test_' + Date.now(),
        status: 'completed',
        customer_id: 'ctm_test_' + Date.now(),
        currency_code: currency,
        created_at: new Date().toISOString(),
        customer: {
          email: email,
          name: name,
        },
        billing_details: {
          country_code: currency === 'PKR' ? 'PK' : currency === 'INR' ? 'IN' : 'US',
        },
        address: {
          country_code: currency === 'PKR' ? 'PK' : currency === 'INR' ? 'IN' : 'US',
        },
        items: [
          {
            price: {
              id: getPriceIdForPlan(planSlug),
              product_id: 'pro_01kgpjwpj8pj3jvs44hjp5h77v', // DeskSweep product ID
              description: planSlug.toUpperCase() + ' Plan',
            },
            totals: {
              total: Math.round(amount * 100).toString(), // Convert to cents
            },
          },
        ],
        custom_data: {
          plan_slug: planSlug,
        },
        payment_method_type: 'card',
      },
    }

    console.log('📦 Mock Paddle event created:', JSON.stringify(mockPaddleEvent, null, 2))

    // Call the actual webhook endpoint
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/paddle`
    
    console.log('🚀 Calling webhook endpoint:', webhookUrl)

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Skip signature for local testing
      },
      body: JSON.stringify(mockPaddleEvent),
    })

    const result = await response.json()

    console.log('📨 Webhook response:', response.status, result)

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Webhook simulation completed',
        webhookResponse: result,
        event: mockPaddleEvent,
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Webhook call failed',
        status: response.status,
        webhookResponse: result,
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Webhook simulation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

function getPriceIdForPlan(planSlug: string): string {
  const priceIds: Record<string, string> = {
    solo: 'pri_01kgpm95qrxz1stv18mncjxqvg',
    squad: 'pri_01kgpmb4vas7mswfsnz2w2j9w4',
    studio: 'pri_01kgpmcddtc0ma04wh6bpza2xf',
  }
  return priceIds[planSlug] || priceIds.solo
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Paddle Webhook Simulator',
    usage: 'POST /api/test/webhook',
    description: 'Simulates a Paddle transaction.completed webhook for local testing',
    body: {
      email: 'customer@example.com',
      name: 'Customer Name',
      planSlug: 'solo | squad | studio',
      amount: 3.0,
      currency: 'USD | INR | PKR',
    },
    example: `
      curl -X POST http://localhost:3000/api/test/webhook \\
        -H "Content-Type: application/json" \\
        -d '{"email": "test@example.com", "planSlug": "solo", "amount": 3.0, "currency": "USD"}'
    `,
    note: 'Make sure SKIP_WEBHOOK_VERIFICATION=true is set in .env for local testing',
  })
}
