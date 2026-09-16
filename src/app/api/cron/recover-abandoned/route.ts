import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendCartRecoveryEmail } from '@/lib/abandonment-email'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Cron Endpoint: Recover Abandoned Skillnavo Checkouts
 * 
 * Identifies checkouts that were initiated > 20 minutes ago but never completed,
 * sends a targeted recovery email with an incentive, and updates session state.
 */
export async function GET(req: NextRequest) {
  return handleRecovery(req)
}

export async function POST(req: NextRequest) {
  return handleRecovery(req)
}

async function handleRecovery(req: NextRequest) {
  try {
    // Basic auth protection for cron
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || process.env.APPSTO_BILLING_SHARED_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // In development or if no auth header passed, allow checking query param secret
      const querySecret = req.nextUrl.searchParams.get('secret')
      if (querySecret !== cronSecret && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized cron request.' }, { status: 401 })
      }
    }

    // Cutoff: pending checkouts older than 20 minutes and newer than 48 hours
    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000).toISOString()
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

    const { data: abandonedSessions, error } = await supabase
      .from('skillnavo_checkout_sessions')
      .select('*')
      .eq('status', 'pending')
      .eq('recovery_email_sent', false)
      .lt('created_at', twentyMinutesAgo)
      .gt('created_at', fortyEightHoursAgo)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('[RecoveryCron] Error querying abandoned checkouts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!abandonedSessions || abandonedSessions.length === 0) {
      return NextResponse.json({
        message: 'No pending abandoned checkout sessions found.',
        count: 0,
      })
    }

    let recoveredCount = 0

    for (const session of abandonedSessions) {
      // Check if user has already completed ANY purchase since this session was created
      const { data: existingPurchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('customer_email', session.customer_email)
        .gte('created_at', session.created_at)
        .maybeSingle()

      if (existingPurchase) {
        // Already purchased; mark completed without spamming with recovery email
        await supabase
          .from('skillnavo_checkout_sessions')
          .update({ status: 'completed', updated_at: new Date().toISOString() })
          .eq('id', session.id)
        continue
      }

      const recoveryUrl = `https://appsto.software/skillnavo/checkout?plan=${session.plan_slug}&coupon=LEARN10`

      const sent = await sendCartRecoveryEmail({
        to: session.customer_email,
        customerName: session.customer_name,
        planSlug: session.plan_slug,
        recoveryUrl,
      })

      if (sent) {
        await supabase
          .from('skillnavo_checkout_sessions')
          .update({
            status: 'abandoned',
            recovery_email_sent: true,
            recovery_email_sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', session.id)

        recoveredCount++
      }
    }

    return NextResponse.json({
      success: true,
      processed: abandonedSessions.length,
      recovery_emails_sent: recoveredCount,
    })
  } catch (err: any) {
    console.error('[RecoveryCron] Fatal error running recovery cron:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
