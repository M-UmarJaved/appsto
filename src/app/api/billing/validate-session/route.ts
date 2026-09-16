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
  return_to?: string
  iat: number
  exp: number
  nonce?: string
}

function verifyAndDecodeToken(sessionToken: string): { status: number; error?: string; payload?: SessionPayload } {
  const parts = sessionToken.split('.')
  if (parts.length !== 2) {
    return { status: 400, error: 'Malformed checkout session token.' }
  }

  const [payloadBase64, signature] = parts
  const sharedSecret = process.env.APPSTO_BILLING_SHARED_SECRET || process.env.APPSTO_SKILLNAVO_SYNC_SECRET

  if (!sharedSecret) {
    console.error('❌ Billing shared secret is not configured on server!')
    return { status: 500, error: 'Server billing configuration error. Please contact support.' }
  }

  // Compute expected HMAC-SHA256 signature
  const expectedSignature = crypto
    .createHmac('sha256', sharedSecret)
    .update(payloadBase64)
    .digest('hex')

  // Timing-safe signature check
  try {
    const sigBuffer = Buffer.from(signature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')

    if (
      sigBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      return { status: 401, error: 'Invalid or tampered checkout session token.' }
    }
  } catch {
    return { status: 401, error: 'Invalid checkout session signature format.' }
  }

  // Parse payload (Base64Url decode)
  try {
    const base64Standard = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
    const payloadJson = Buffer.from(base64Standard, 'base64').toString('utf8')
    const payload: SessionPayload = JSON.parse(payloadJson)

    // Verify expiration (allow up to 15 mins, reject expired)
    const nowEpoch = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < nowEpoch) {
      return { status: 410, error: 'Checkout session has expired. Please initiate checkout again from Skillnavo.' }
    }

    if (!payload.skillnavo_user_id || !payload.email || !payload.plan) {
      return { status: 400, error: 'Missing required session properties (user, email, or plan).' }
    }

    return { status: 200, payload }
  } catch {
    return { status: 400, error: 'Unable to decode session payload.' }
  }
}

async function resolvePriceId(plan: string): Promise<string> {
  let priceId = SKILLNAVO_PADDLE_PRICE_IDS[plan]
  try {
    const { data: planRecord } = await supabase
      .from('pricing_plans')
      .select('paddle_price_id_usd, products!inner(slug)')
      .eq('products.slug', 'skillnavo')
      .eq('plan_slug', plan)
      .single()

    if (planRecord?.paddle_price_id_usd) {
      priceId = planRecord.paddle_price_id_usd
    }
  } catch (dbErr) {
    console.warn('⚠️ Could not resolve price from DB, using fallback price map:', dbErr)
  }
  return priceId || 'pri_skillnavo_starter_monthly'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const sessionToken = body.sessionToken || body.session || body.token

    if (!sessionToken || typeof sessionToken !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid checkout session token.' },
        { status: 400 }
      )
    }

    const result = verifyAndDecodeToken(sessionToken)
    if (result.error || !result.payload) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    const priceId = await resolvePriceId(result.payload.plan)

    // Record checkout session attempt for conversion & cart abandonment tracking
    try {
      await supabase.from('skillnavo_checkout_sessions').insert({
        session_token: sessionToken.substring(0, 32) + '...',
        skillnavo_user_id: result.payload.skillnavo_user_id,
        customer_email: result.payload.email.toLowerCase(),
        plan_slug: result.payload.plan,
        paddle_price_id: priceId,
        status: 'pending',
        metadata: {
          return_to: result.payload.return_to || '/dashboard',
          source: 'skillnavo_direct',
        },
      })
    } catch (logErr) {
      console.warn('⚠️ Could not log checkout session tracking:', logErr)
    }

    return NextResponse.json({
      valid: true,
      email: result.payload.email,
      plan: result.payload.plan,
      priceId,
      paddle_price_id: priceId,
      skillnavo_user_id: result.payload.skillnavo_user_id,
      return_to: result.payload.return_to || '/dashboard',
      payload: result.payload,
    })
  } catch (err) {
    console.error('❌ Error validating checkout session (POST):', err)
    return NextResponse.json(
      { error: 'Failed to process checkout session token.' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.nextUrl.searchParams.get('session') || req.nextUrl.searchParams.get('token')

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Missing checkout session token query parameter.' },
        { status: 400 }
      )
    }

    const result = verifyAndDecodeToken(sessionToken)
    if (result.error || !result.payload) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    const priceId = await resolvePriceId(result.payload.plan)

    return NextResponse.json({
      valid: true,
      email: result.payload.email,
      plan: result.payload.plan,
      priceId,
      paddle_price_id: priceId,
      skillnavo_user_id: result.payload.skillnavo_user_id,
      return_to: result.payload.return_to || '/dashboard',
      payload: result.payload,
    })
  } catch (err) {
    console.error('❌ Error validating checkout session (GET):', err)
    return NextResponse.json(
      { error: 'Failed to process checkout session token.' },
      { status: 500 }
    )
  }
}
