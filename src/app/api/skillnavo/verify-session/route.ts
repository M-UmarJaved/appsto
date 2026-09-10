import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { SKILLNAVO_PADDLE_PRICE_IDS } from '@/lib/currency'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface SessionPayload {
  skillnavo_user_id: string
  email: string
  plan: string
  tier?: string
  interval?: string
  iat: number
  exp: number
  nonce?: string
}

/**
 * High-Security Server Endpoint: Verify Skillnavo Checkout Session Token
 * Ensures APPSTO_BILLING_SHARED_SECRET never leaks to client browser.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionToken } = body

    if (!sessionToken || typeof sessionToken !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid checkout session token.' },
        { status: 400 }
      )
    }

    const parts = sessionToken.split('.')
    if (parts.length !== 2) {
      return NextResponse.json(
        { error: 'Malformed checkout session token.' },
        { status: 400 }
      )
    }

    const [payloadBase64, signature] = parts
    const sharedSecret = process.env.APPSTO_BILLING_SHARED_SECRET || process.env.APPSTO_SKILLNAVO_SYNC_SECRET

    if (!sharedSecret) {
      console.error('❌ APPSTO_BILLING_SHARED_SECRET is not configured on server!')
      return NextResponse.json(
        { error: 'Server billing configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Compute expected HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', sharedSecret)
      .update(payloadBase64)
      .digest('hex')

    // Timing-safe signature check
    const sigBuffer = Buffer.from(signature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')

    if (
      sigBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      console.warn('⚠️ Invalid session token signature received.')
      return NextResponse.json(
        { error: 'Invalid or tampered checkout session token.' },
        { status: 401 }
      )
    }

    // Parse payload (Base64Url decode)
    const base64Standard = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
    const payloadJson = Buffer.from(base64Standard, 'base64').toString('utf8')
    const payload: SessionPayload = JSON.parse(payloadJson)

    // Verify expiration (allow up to 15 mins, reject expired)
    const nowEpoch = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < nowEpoch) {
      return NextResponse.json(
        { error: 'Checkout session has expired. Please initiate checkout again from Skillnavo.' },
        { status: 410 }
      )
    }

    if (!payload.skillnavo_user_id || !payload.email || !payload.plan) {
      return NextResponse.json(
        { error: 'Missing required session properties (user, email, or plan).' },
        { status: 400 }
      )
    }

    // Resolve Paddle Price ID from database or fallback map
    let priceId = SKILLNAVO_PADDLE_PRICE_IDS[payload.plan]

    try {
      const { data: planRecord } = await supabase
        .from('pricing_plans')
        .select('paddle_price_id_usd, products!inner(slug)')
        .eq('products.slug', 'skillnavo')
        .eq('plan_slug', payload.plan)
        .single()

      if (planRecord?.paddle_price_id_usd) {
        priceId = planRecord.paddle_price_id_usd
      }
    } catch (dbErr) {
      console.warn('⚠️ Could not resolve price from DB, using fallback price map:', dbErr)
    }

    return NextResponse.json({
      valid: true,
      email: payload.email,
      plan: payload.plan,
      priceId: priceId || 'pri_skillnavo_starter_monthly',
      skillnavo_user_id: payload.skillnavo_user_id,
      payload,
    })
  } catch (err) {
    console.error('❌ Error verifying checkout session:', err)
    return NextResponse.json(
      { error: 'Failed to process checkout session token.' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const sessionToken = req.nextUrl.searchParams.get('session') || req.nextUrl.searchParams.get('token')
  if (!sessionToken) {
    return NextResponse.json(
      { error: 'Missing checkout session token query parameter.' },
      { status: 400 }
    )
  }
  return POST(new NextRequest(req.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionToken }),
  }))
}
