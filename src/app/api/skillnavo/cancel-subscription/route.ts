import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { dispatchSkillnavoSync } from '@/lib/skillnavo-sync'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface CancelPayload {
  skillnavo_user_id?: string
  email?: string
  subscription_id?: string | null
  effective_from?: 'immediately' | 'next_billing_period'
}

/**
 * Server-to-Server endpoint: Skillnavo -> Appsto Subscription Cancellation Bridge
 * 
 * Authenticated with APPSTO_BILLING_SHARED_SECRET using HMAC-SHA256.
 * Invokes Paddle cancellation via REST API, updates Appsto records,
 * and triggers dispatchSkillnavoSync back to Skillnavo.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-appsto-signature')
    const timestampStr = req.headers.get('x-appsto-timestamp')

    // 1. Verify HMAC-SHA256 Signature & Timestamp freshness (anti-replay)
    const sharedSecret =
      process.env.APPSTO_BILLING_SHARED_SECRET ||
      process.env.APPSTO_SKILLNAVO_SYNC_SECRET

    if (!sharedSecret) {
      console.error('[Appsto Cancel Bridge] FATAL: APPSTO_BILLING_SHARED_SECRET is not configured.')
      return NextResponse.json(
        { error: 'Server configuration error: missing shared billing secret' },
        { status: 500 }
      )
    }

    if (!signature || !timestampStr) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing X-Appsto-Signature or X-Appsto-Timestamp header' },
        { status: 401 }
      )
    }

    const timestamp = parseInt(timestampStr, 10)
    if (isNaN(timestamp)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid timestamp' }, { status: 401 })
    }

    const nowEpoch = Math.floor(Date.now() / 1000)
    const drift = Math.abs(nowEpoch - timestamp)
    if (drift > 300) {
      return NextResponse.json(
        { error: `Unauthorized: Timestamp expired or out of window (drift: ${drift}s)` },
        { status: 401 }
      )
    }

    const payloadToSign = `${timestampStr}.${rawBody}`
    const expectedSignature = crypto
      .createHmac('sha256', sharedSecret)
      .update(payloadToSign)
      .digest('hex')

    const sigBuf = Buffer.from(signature, 'hex')
    const expSigBuf = Buffer.from(expectedSignature, 'hex')

    if (sigBuf.length !== expSigBuf.length || !crypto.timingSafeEqual(sigBuf, expSigBuf)) {
      console.warn('[Appsto Cancel Bridge] Invalid HMAC signature received.')
      return NextResponse.json({ error: 'Unauthorized: Invalid HMAC signature' }, { status: 401 })
    }

    // 2. Parse payload
    let payload: CancelPayload
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { skillnavo_user_id, email, effective_from = 'immediately' } = payload
    let subscription_id = payload.subscription_id

    if (!skillnavo_user_id && !email && !subscription_id) {
      return NextResponse.json(
        { error: 'Missing required identifier (skillnavo_user_id, email, or subscription_id)' },
        { status: 400 }
      )
    }

    console.log('[Appsto Cancel Bridge] Cancellation requested for:', {
      skillnavo_user_id,
      email,
      subscription_id,
      effective_from,
    })

    // 3. Look up existing purchase or customer record in Appsto
    let matchedPurchase: any = null
    let customerId: string | null = null

    if (subscription_id) {
      const { data } = await supabase
        .from('purchases')
        .select('*')
        .eq('paddle_subscription_id', subscription_id)
        .maybeSingle()
      matchedPurchase = data
    }

    if (!matchedPurchase && email) {
      const { data } = await supabase
        .from('purchases')
        .select('*')
        .ilike('customer_email', email.trim().toLowerCase())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      matchedPurchase = data
    }

    if (matchedPurchase) {
      subscription_id = subscription_id || matchedPurchase.paddle_subscription_id
      customerId = matchedPurchase.paddle_customer_id || null
    }

    // 4. Execute Paddle Cancellation via REST API
    let paddleCancelled = false
    let paddleError: { status?: number; code?: string; detail?: string } | null = null
    let customerPortalUrl: string | null = null

    const paddleApiKey = process.env.PADDLE_API_KEY
    const isSandbox = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'sandbox'
    const paddleBaseUrl = isSandbox ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com'

    if (subscription_id && paddleApiKey) {
      try {
        console.log(`[Appsto Cancel Bridge] Calling Paddle REST API to cancel subscription: ${subscription_id}`)
        const paddleRes = await fetch(`${paddleBaseUrl}/subscriptions/${encodeURIComponent(subscription_id)}/cancel`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${paddleApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            effective_from: effective_from === 'immediately' ? 'immediately' : 'next_billing_period',
          }),
        })

        if (paddleRes.ok) {
          const paddleData = await paddleRes.json()
          paddleCancelled = true
          console.log('[Appsto Cancel Bridge] Successfully cancelled on Paddle:', paddleData?.data?.id)
        } else {
          const errorJson = await paddleRes.json().catch(() => null)
          paddleError = {
            status: paddleRes.status,
            code: errorJson?.error?.code || `HTTP_${paddleRes.status}`,
            detail:
              errorJson?.error?.detail ||
              (paddleRes.status === 403
                ? 'Paddle API key lacks subscriptions:write scope in Paddle Dashboard'
                : 'Paddle API cancel failed'),
          }
          console.warn('[Appsto Cancel Bridge] Paddle cancellation API response error:', paddleError)
        }
      } catch (err: any) {
        console.error('[Appsto Cancel Bridge] Paddle API network error during cancel:', err)
        paddleError = {
          code: 'NETWORK_ERROR',
          detail: err.message || 'Could not connect to Paddle API',
        }
      }
    } else {
      if (!subscription_id) {
        paddleError = {
          code: 'NO_SUBSCRIPTION_ID',
          detail: 'No paddle_subscription_id was found or provided to cancel on Paddle.',
        }
      }
      if (!paddleApiKey) {
        paddleError = {
          code: 'MISSING_PADDLE_KEY',
          detail: 'PADDLE_API_KEY is not configured on Appsto server.',
        }
      }
    }

    // 5. Attempt customer portal generation if Paddle API key allows it and customerId is present
    if (!paddleCancelled && customerId && paddleApiKey) {
      try {
        const portalRes = await fetch(`${paddleBaseUrl}/customers/${encodeURIComponent(customerId)}/portal-sessions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${paddleApiKey}`,
            'Content-Type': 'application/json',
          },
        })
        if (portalRes.ok) {
          const portalJson = await portalRes.json()
          customerPortalUrl = portalJson?.data?.urls?.general?.overview || null
        }
      } catch {
        // Non-critical fallback
      }
    }

    // 6. Update Appsto database records
    if (matchedPurchase?.id) {
      try {
        await supabase
          .from('purchases')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
            metadata: {
              ...(matchedPurchase.metadata || {}),
              cancelled_at: new Date().toISOString(),
              cancelled_via: 'skillnavo_bridge',
              paddle_cancelled: paddleCancelled,
              paddle_error: paddleError,
            },
          })
          .eq('id', matchedPurchase.id)
        console.log('[Appsto Cancel Bridge] Updated Appsto purchase record status to cancelled.')
      } catch (dbErr) {
        console.error('[Appsto Cancel Bridge] Error updating Appsto purchase record:', dbErr)
      }
    }

    // 7. Dispatch authoritative sync event back to Skillnavo
    const targetUserId = skillnavo_user_id || matchedPurchase?.user_id || ''
    const targetEmail = email || matchedPurchase?.customer_email || ''

    if (targetUserId || targetEmail) {
      try {
        console.log('[Appsto Cancel Bridge] Dispatching subscription.canceled event to Skillnavo...')
        await dispatchSkillnavoSync({
          event: 'subscription.canceled',
          event_id: `cancel_${Date.now()}_${targetUserId || 'sub'}`,
          subscription_id: subscription_id || `sub_cancelled_${Date.now()}`,
          customer_id: customerId,
          customer_email: targetEmail,
          skillnavo_user_id: targetUserId,
          plan: 'free',
          status: 'canceled',
          cancel_at_period_end: effective_from === 'next_billing_period',
        })
      } catch (syncErr) {
        console.error('[Appsto Cancel Bridge] Error dispatching sync back to Skillnavo:', syncErr)
      }
    }

    // 8. Return comprehensive status to Skillnavo
    return NextResponse.json({
      success: true,
      paddle_cancelled: paddleCancelled,
      subscription_id: subscription_id || null,
      customer_portal_url: customerPortalUrl,
      diagnostics: {
        paddle_error: paddleError,
        appsto_record_updated: Boolean(matchedPurchase?.id),
        skillnavo_sync_dispatched: Boolean(targetUserId || targetEmail),
      },
    })
  } catch (error: any) {
    console.error('[Appsto Cancel Bridge] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error processing cancellation', detail: error.message },
      { status: 500 }
    )
  }
}
