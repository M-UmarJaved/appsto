import crypto from 'crypto'

export interface SkillnavoSyncEvent {
  event:
    | 'subscription.created'
    | 'subscription.updated'
    | 'subscription.canceled'
    | 'subscription.past_due'
    | string
  event_id: string
  subscription_id: string
  customer_id?: string | null
  customer_email?: string | null
  customer_name?: string | null
  skillnavo_user_id: string
  plan: string
  status: string
  currency?: string | null
  price?: number | string | null
  current_period_start?: string | null
  current_period_end?: string | null
  cancel_at_period_end?: boolean
}

/**
 * Dispatch subscription lifecycle events from Appsto to Skillnavo
 * Authenticated using HMAC-SHA256 with timestamp verification and automated retries.
 */
export async function dispatchSkillnavoSync(payload: SkillnavoSyncEvent): Promise<boolean> {
  const syncUrl =
    process.env.SKILLNAVO_SYNC_URL || 'https://skillnavo.com/api/internal/billing/sync'
  const sharedSecret = process.env.APPSTO_BILLING_SHARED_SECRET

  if (!sharedSecret) {
    console.error('❌ APPSTO_BILLING_SHARED_SECRET not configured!')
    return false
  }

  const timestamp = Math.floor(Date.now() / 1000).toString()
  const rawBody = JSON.stringify(payload)

  // Generate HMAC-SHA256 signature
  const signature = crypto
    .createHmac('sha256', sharedSecret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex')

  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `📡 [Attempt ${attempt}/${maxAttempts}] Dispatching sync to Skillnavo for user: ${payload.skillnavo_user_id} (Event: ${payload.event})`
      )
      const response = await fetch(syncUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appsto-Signature': signature,
          'X-Appsto-Timestamp': timestamp,
        },
        body: rawBody,
      })

      if (response.ok) {
        console.log(`✅ Synced subscription to Skillnavo (Event: ${payload.event_id})`)
        return true
      }

      const errText = await response.text()
      console.warn(`⚠️ Skillnavo sync returned status ${response.status}: ${errText}`)
    } catch (err) {
      console.error(`❌ Skillnavo sync attempt ${attempt} failed:`, err)
    }

    if (attempt < maxAttempts) {
      await new Promise((res) => setTimeout(res, attempt * 1500))
    }
  }

  console.error(`❌ Failed to sync to Skillnavo after ${maxAttempts} attempts.`)
  return false
}
