import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createLicenses, syncPurchaseLicenses } from '@/lib/license'
import { sendPurchaseConfirmationEmail } from '@/lib/purchase-email'
import { sendPurchaseNotification } from '@/lib/discord'
import { checkRateLimit, getClientId } from '@/lib/ratelimit'
import { dispatchSkillnavoSync } from '@/lib/skillnavo-sync'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Paddle Webhook Handler
 * 
 * This endpoint receives webhook events from Paddle when a purchase is completed.
 * Handles the complete purchase flow:
 * 1. Creates purchase record in database
 * 2. Generates license keys (for one-time purchases)
 * 3. Sends confirmation email with licenses and download link
 * 4. Sends Discord notification
 * 
 * Paddle Webhook Events:
 * - transaction.completed: Payment successful (main event)
 * - transaction.updated: Payment updated
 * - subscription.created: Subscription created
 */
export async function POST(req: NextRequest) {
  try {
    // SECURITY: Rate limiting to prevent DoS attacks
    const clientId = getClientId(req)
    const rateLimit = checkRateLimit(clientId, '/api/webhooks/paddle')
    
    if (rateLimit.limited) {
      console.warn('⚠️ Rate limit exceeded for webhook requests from:', clientId)
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
          }
        }
      )
    }
    
    console.log('🎯 Paddle webhook received!')
    
    // Get the webhook signature from headers
    const signature = req.headers.get('paddle-signature')
    const rawBody = await req.text()

    console.log('📧 Webhook signature:', signature ? 'Present' : 'Missing')
    // SECURITY: Don't log full body - may contain sensitive customer data
    
    // Verify webhook signature (important for security)
    if (!verifyPaddleWebhook(signature, rawBody)) {
      console.error('❌ Invalid Paddle webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    console.log('✅ Webhook signature verified')

    // Parse the webhook payload
    const event = JSON.parse(rawBody)
    
    // SECURITY: Input validation
    if (!event || typeof event !== 'object') {
      console.error('❌ Invalid webhook payload format')
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    
    if (!event.event_type || typeof event.event_type !== 'string') {
      console.error('❌ Missing or invalid event_type')
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }
    
    console.log('📨 Paddle webhook event type:', event.event_type)
    // SECURITY: Don't log full event data - contains sensitive information

    // Handle transaction completed event
    if (event.event_type === 'transaction.completed') {
      console.log('🎯 Processing transaction.completed event')
      const isSimulation = event.event_id?.startsWith('ntfsimevt_') || event.notification_id?.startsWith('ntfsimntf_')
      await handleTransactionCompleted(event.data, isSimulation)
    }

    // Handle subscription events (for future subscription products and Skillnavo)
    if (event.event_type === 'subscription.created') {
      console.log('🎯 Processing subscription.created event')
      await handleSubscriptionCreated(event.data)
    }

    if (event.event_type === 'subscription.updated') {
      console.log('🎯 Processing subscription.updated event')
      await handleSubscriptionUpdated(event.data, event.event_id)
    }

    if (event.event_type === 'subscription.canceled') {
      console.log('🎯 Processing subscription.canceled event')
      await handleSubscriptionCanceled(event.data, event.event_id)
    }

    if (event.event_type === 'subscription.past_due') {
      console.log('🎯 Processing subscription.past_due event')
      await handleSubscriptionPastDue(event.data, event.event_id)
    }

    // Handle refund events (legacy Paddle v1 style)
    if (event.event_type === 'transaction.payment_failed' || event.event_type === 'transaction.refunded') {
      console.log('🎯 Processing refund/payment failure event')
      await handleTransactionRefunded(event.data)
    }

    // Handle adjustment events (Paddle v2 refunds)
    if (event.event_type === 'adjustment.updated') {
      console.log('🎯 Processing adjustment.updated event')
      await handleAdjustmentUpdated(event.data)
    }

    console.log('✅ Webhook processed successfully')
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Webhook error:', error)
    // SECURITY: Don't leak internal error details to potential attackers
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle transaction completed webhook
 * Same logic as test purchase - creates purchase, generates licenses, sends emails
 */
async function handleTransactionCompleted(data: any, isSimulation: boolean = false) {
  try {
    // SECURITY: Input validation - ensure required fields exist
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid transaction data: missing data object')
    }
    
    if (!data.id || typeof data.id !== 'string') {
      throw new Error('Invalid transaction data: missing or invalid transaction ID')
    }
    
    if (!data.customer_id || typeof data.customer_id !== 'string') {
      throw new Error('Invalid transaction data: missing or invalid customer ID')
    }
    
    console.log('🎯 Processing Paddle transaction:', data.id)
    if (isSimulation) {
      console.log('ℹ️ This is a simulation webhook')
    }

    // Extract transaction data
    const transactionId = data.id
    const customerId = data.customer_id

    // SECURITY: Idempotency check - prevent duplicate processing of same transaction
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('paddle_transaction_id', transactionId)
      .single()
    
    if (existingPurchase) {
      console.log('ℹ️ Transaction already processed:', transactionId)
      console.log('✅ Returning success (idempotent)')
      return // Return success - this is not an error
    }

    // Handle customer data - fetch from Paddle API if not in payload
    let customerEmail: string
    let customerName: string
    
    if (data.customer && data.customer.email) {
      // Customer data included in webhook (normal case)
      customerEmail = data.customer.email
      customerName = data.customer.name || 'Customer'
    } else {
      // Customer data missing - fetch from Paddle API
      console.log('⚠️ Customer data missing in webhook, fetching from Paddle API...')
      try {
        // Use environment-aware Paddle API URL
        const paddleApiUrl = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'production' 
          ? 'https://api.paddle.com'
          : 'https://sandbox-api.paddle.com'
        
        const response = await fetch(`${paddleApiUrl}/customers/${customerId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
            'Content-Type': 'application/json',
          }
        })
        
        if (!response.ok) {
          throw new Error(`Paddle API returned ${response.status}: ${response.statusText}`)
        }
        
        const customerData = await response.json()
        if (!customerData.data?.email) {
          throw new Error('Customer email not found in Paddle API response')
        }
        customerEmail = customerData.data.email
        customerName = customerData.data?.name || 'Customer'
        console.log('✅ Fetched customer data from Paddle API:', customerEmail)
      } catch (fetchError) {
        console.error('❌ Failed to fetch customer data:', fetchError)
        
        // For simulations, use a fallback email instead of failing
        if (isSimulation) {
          console.log('ℹ️ Using fallback test email for simulation')
          customerEmail = process.env.TEST_EMAIL || 'simulation-test@example.com'
          customerName = 'Simulation Test Customer'
        } else {
          console.error('⚠️ Skipping transaction - cannot process without customer email')
          throw new Error('Customer email required but not available')
        }
      }
    }

    const billingCountry = data.billing_details?.country_code || data.address?.country_code || 'US'
    const items = data.items || []
    const customData = data.custom_data || {}

    // Process each item in the transaction
    for (const item of items) {
      // SECURITY: Validate item structure
      if (!item.price || !item.price.id || !item.price.product_id) {
        console.error('❌ Invalid item structure - missing price data')
        continue
      }
      
      const paddlePriceId = item.price.id
      const paddleProductId = item.price.product_id
      
      // Calculate amount and extract discount info - handle different payload structures
      let amount: number
      let subtotal: number
      let discount: number
      
      if (item.totals && item.totals.total) {
        // Standard payload with item totals (real Paddle webhooks)
        amount = parseFloat(item.totals.total) / 100
        subtotal = parseFloat(item.totals.subtotal || item.totals.total) / 100
        discount = parseFloat(item.totals.discount || '0') / 100
      } else if (item.price.unit_price && item.price.unit_price.amount) {
        // Fallback: calculate from unit price * quantity (simulations)
        amount = (parseFloat(item.price.unit_price.amount) * item.quantity) / 100
        subtotal = amount
        discount = 0
      } else if (data.details && data.details.totals && data.details.totals.total) {
        // Last resort: use transaction total (single-item transactions)
        amount = parseFloat(data.details.totals.total) / 100
        subtotal = parseFloat(data.details.totals.subtotal || data.details.totals.total) / 100
        discount = parseFloat(data.details.totals.discount || '0') / 100
      } else {
        console.error('❌ Cannot determine amount from item:', item)
        console.error('⚠️ Skipping item - invalid amount')
        continue
      }
      
      // Validate amount is reasonable (allow 0 for free trials / Skillnavo subscriptions)
      const isZeroAllowed = customData?.product_slug === 'skillnavo' || Boolean(customData?.trial_eligible) || Boolean(data.subscription_id)
      if (amount < 0 || (amount === 0 && !isZeroAllowed)) {
        console.error('❌ Invalid amount detected:', amount)
        console.error('⚠️ Skipping item - amount must be greater than 0')
        continue
      }
      
      const currency = data.currency_code
      // SECURITY: Sanitize planSlug - must be one of the valid values
      const rawPlanSlug = customData.plan_slug || item.price.description?.toLowerCase() || 'solo'
      const validPlanSlugs = [
        'solo',
        'squad',
        'studio',
        'starter_monthly',
        'starter_annual',
        'pro_monthly',
        'pro_annual',
      ]
      const planSlug = validPlanSlugs.includes(rawPlanSlug) ? rawPlanSlug : 'solo'
      
      if (rawPlanSlug !== planSlug) {
        console.warn(`⚠️ Invalid plan slug '${rawPlanSlug}' sanitized to '${planSlug}'`)
      }

      console.log('📦 Processing item:', { paddlePriceId, paddleProductId, subtotal, discount, amount, currency, planSlug })

      // Determine if this is a Skillnavo subscription purchase
      const isSkillnavo = customData.product_slug === 'skillnavo'

      // Get product from database
      let product: any = null
      if (isSkillnavo) {
        const { data: skillnavoProd, error: skillnavoErr } = await supabase
          .from('products')
          .select('*')
          .eq('slug', 'skillnavo')
          .single()

        if (skillnavoErr || !skillnavoProd) {
          console.error('❌ Skillnavo product not found in database:', skillnavoErr)
          continue
        }
        product = skillnavoProd
      } else {
        const { data: prodData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('paddle_product_id', paddleProductId)
          .single()

        if (productError || !prodData) {
          console.error('❌ Product not found:', paddleProductId, productError)
          continue
        }
        product = prodData
      }

      // Get pricing plan
      const { data: pricingPlan, error: planError } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('product_id', product.id)
        .eq('plan_slug', planSlug)
        .single()

      if (planError || !pricingPlan) {
        console.error('❌ Pricing plan not found:', planSlug, planError)
        continue
      }

      // Try to get user_id from auth by email
      const { data: authUser } = await supabase.auth.admin.listUsers()
      const user = authUser?.users?.find(u => u.email === customerEmail)

      // Create purchase record (retains purchaser data for both DeskSweep & Skillnavo)
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: user?.id || null,
          product_id: product.id,
          pricing_plan_id: pricingPlan.id,
          paddle_transaction_id: transactionId,
          paddle_subscription_id: data.subscription_id || null,
          paddle_customer_id: customerId,
          amount: amount,
          currency: currency,
          status: 'completed',
          customer_email: customerEmail,
          customer_name: customerName,
          billing_country: billingCountry,
          licenses_count: isSkillnavo ? 0 : pricingPlan.devices,
          payment_method: data.payment_method_type || 'card',
          purchased_at: new Date(data.created_at).toISOString(),
          metadata: {
            paddle_data: data,
            custom_data: customData,
            product_slug: product.slug,
          },
        })
        .select()
        .single()

      if (purchaseError || !purchase) {
        console.error('❌ Failed to create purchase:', purchaseError)
        continue
      }

      console.log('✅ Purchase record created:', purchase.id)

      if (!isSkillnavo) {
        // --- DESKSWEEP ONE-TIME PURCHASE FULFILLMENT ---
        // Generate licenses (works for both logged-in users and guest checkouts)
        if (!user?.id) {
          console.log('ℹ️ Guest checkout detected - no user account for:', customerEmail)
          console.log('ℹ️ License will be generated and emailed to customer')
        }

        const licenses = await createLicenses({
          purchaseId: purchase.id,
          productId: product.id,
          userId: user?.id || null,
          count: pricingPlan.devices,
          plan: pricingPlan.plan_name,
          licenseType: 'standard',
        })

        console.log(`✅ Generated ${licenses.length} licenses`)

        // Sync licenses to product database
        await syncPurchaseLicenses(purchase.id)
        console.log('✅ Licenses synced to product database')

        // Generate download URL
        const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/download?token=${Buffer.from(`${product.id}:${purchase.id}`).toString('base64')}`

        console.log('📧 Sending purchase confirmation email...')
        
        // Send purchase confirmation email
        try {
          await sendPurchaseConfirmationEmail({
            purchaseId: purchase.id,
            customerName: customerName,
            customerEmail: customerEmail,
            productName: product.name,
            planName: pricingPlan.plan_name,
            subtotal: subtotal,
            discount: discount,
            amount: amount,
            currency: currency,
            licenseKeys: licenses.map((l) => l.license_key),
            downloadUrl,
            downloadExpiryDays: 7,
          })
          console.log('✅ Purchase confirmation email sent to', customerEmail)
        } catch (emailError) {
          console.error('❌ Failed to send email:', emailError)
        }
      } else {
        console.log('ℹ️ Skillnavo Subscription: Purchaser retained in public.purchases. DeskSweep licensing bypassed.')

        // Dispatch instant unlock notification to Skillnavo
        const skillnavoUserId = customData?.skillnavo_user_id || customData?.user_id || ''
        if (skillnavoUserId || customerEmail) {
          console.log('🚀 Dispatching instant subscription unlock sync to Skillnavo for:', customerEmail || skillnavoUserId)
          try {
            const isTrialTransaction =
              (amount === 0 || !amount) &&
              (Boolean(customData?.trial_eligible) || customData?.plan_slug?.includes('pro') || customData?.plan?.includes('pro'))
            const txStatus = isTrialTransaction ? 'trialing' : 'active'
            const nowIso = new Date().toISOString()
            const trialEndIso = new Date(Date.now() + 7 * 86400000).toISOString()

            await dispatchSkillnavoSync({
              event: 'subscription.created',
              event_id: transactionId + '_tx_completed',
              subscription_id: data.subscription_id || transactionId,
              customer_id: customerId,
              customer_email: customerEmail,
              customer_name: customerName,
              skillnavo_user_id: skillnavoUserId,
              plan: customData?.plan_slug || customData?.plan || pricingPlan.plan_slug,
              status: txStatus,
              currency: currency,
              price: amount,
              current_period_start: nowIso,
              current_period_end: isTrialTransaction ? trialEndIso : null,
            })

            // Mark checkout session as completed
            if (customerEmail) {
              await supabase
                .from('skillnavo_checkout_sessions')
                .update({
                  status: 'completed',
                  paddle_transaction_id: transactionId,
                  paddle_subscription_id: data.subscription_id || null,
                  amount: amount,
                  currency: currency,
                  updated_at: new Date().toISOString(),
                })
                .eq('customer_email', customerEmail.toLowerCase())
                .eq('status', 'pending')
            }
          } catch (syncErr) {
            console.error('❌ Error during Skillnavo dispatch on transaction.completed:', syncErr)
          }
        }
      }

      console.log('📢 Sending Discord notification...')
      
      // Send Discord notification
      try {
        await sendPurchaseNotification({
          customerName: customerName,
          customerEmail: customerEmail,
          productName: product.name,
          planName: pricingPlan.plan_name,
          subtotal: subtotal,
          discount: discount,
          amount: amount,
          currency: currency,
          licensesCount: isSkillnavo ? 0 : pricingPlan.devices,
          purchaseId: purchase.id,
          productImage: isSkillnavo ? undefined : `${process.env.NEXT_PUBLIC_SITE_URL}/DeskSweep/DeskSweep.png`,
        })
        console.log('✅ Discord notification sent')
      } catch (discordError) {
        console.error('❌ Failed to send Discord notification:', discordError)
        // Don't throw - purchase is complete
      }


      console.log(`🎉 Transaction ${transactionId} processed successfully!`)
    }
  } catch (error) {
    console.error('❌ Error handling transaction:', error)
    throw error
  }
}

/**
 * Handle subscription created webhook (Skillnavo and future subscription products)
 */
async function handleSubscriptionCreated(data: any) {
  console.log('🎯 Subscription created event received:', data.id)
  const customData = data.custom_data || {}
  const skillnavoUserId = customData.skillnavo_user_id || customData.user_id || ''
  const planSlug = customData.plan_id || customData.plan_slug || customData.plan || 'starter_monthly'
  const customerEmail = data.customer?.email || customData.email || ''
  const customerName = data.customer?.name || 'Customer'

  if (customData.product_slug === 'skillnavo' && (skillnavoUserId || customerEmail)) {
    await dispatchSkillnavoSync({
      event: 'subscription.created',
      event_id: data.id + '_created',
      subscription_id: data.id,
      customer_id: data.customer_id,
      customer_email: customerEmail,
      customer_name: customerName,
      skillnavo_user_id: skillnavoUserId,
      plan: planSlug,
      status: data.status || 'active',
      currency: data.currency_code || 'USD',
      price: data.items?.[0]?.price?.unit_price?.amount
        ? parseFloat(data.items[0].price.unit_price.amount) / 100
        : null,
      current_period_start: data.current_billing_period?.starts_at || null,
      current_period_end: data.current_billing_period?.ends_at || null,
      cancel_at_period_end: data.scheduled_change?.action === 'cancel',
    })
  }
}

/**
 * Handle subscription updated webhook
 */
async function handleSubscriptionUpdated(data: any, eventId?: string) {
  console.log('🎯 Subscription updated event received:', data.id)
  const customData = data.custom_data || {}
  const skillnavoUserId = customData.skillnavo_user_id || customData.user_id || ''
  const planSlug = customData.plan_id || customData.plan_slug || customData.plan || 'starter_monthly'
  const customerEmail = data.customer?.email || customData.email || ''
  const customerName = data.customer?.name || 'Customer'

  if (customData.product_slug === 'skillnavo' && (skillnavoUserId || customerEmail)) {
    await dispatchSkillnavoSync({
      event: 'subscription.updated',
      event_id: eventId || data.id + '_updated',
      subscription_id: data.id,
      customer_id: data.customer_id,
      customer_email: customerEmail,
      customer_name: customerName,
      skillnavo_user_id: skillnavoUserId,
      plan: planSlug,
      status: data.status || 'active',
      currency: data.currency_code || 'USD',
      price: data.items?.[0]?.price?.unit_price?.amount
        ? parseFloat(data.items[0].price.unit_price.amount) / 100
        : null,
      current_period_start: data.current_billing_period?.starts_at || null,
      current_period_end: data.current_billing_period?.ends_at || null,
      cancel_at_period_end: data.scheduled_change?.action === 'cancel',
    })
  }
}

/**
 * Handle subscription canceled webhook
 */
async function handleSubscriptionCanceled(data: any, eventId?: string) {
  console.log('🎯 Subscription canceled event received:', data.id)
  const customData = data.custom_data || {}
  const skillnavoUserId = customData.skillnavo_user_id || customData.user_id || ''
  const planSlug = customData.plan_id || customData.plan_slug || customData.plan || 'starter_monthly'
  const customerEmail = data.customer?.email || customData.email || ''
  const customerName = data.customer?.name || 'Customer'

  if (customData.product_slug === 'skillnavo' && (skillnavoUserId || customerEmail)) {
    await dispatchSkillnavoSync({
      event: 'subscription.canceled',
      event_id: eventId || data.id + '_canceled',
      subscription_id: data.id,
      customer_id: data.customer_id,
      customer_email: customerEmail,
      customer_name: customerName,
      skillnavo_user_id: skillnavoUserId,
      plan: planSlug,
      status: 'canceled',
      current_period_end: data.current_billing_period?.ends_at || null,
      cancel_at_period_end: true,
    })
  }
}

/**
 * Handle subscription past due webhook
 */
async function handleSubscriptionPastDue(data: any, eventId?: string) {
  console.log('🎯 Subscription past_due event received:', data.id)
  const customData = data.custom_data || {}
  const skillnavoUserId = customData.skillnavo_user_id || customData.user_id
  const planSlug = customData.plan_id || customData.plan_slug || customData.plan || 'starter_monthly'

  if (customData.product_slug === 'skillnavo' && skillnavoUserId) {
    const customerEmail = data.customer?.email || customData.email || ''
    const customerName = data.customer?.name || 'Customer'

    await dispatchSkillnavoSync({
      event: 'subscription.past_due',
      event_id: eventId || data.id + '_past_due',
      subscription_id: data.id,
      customer_id: data.customer_id,
      customer_email: customerEmail,
      customer_name: customerName,
      skillnavo_user_id: skillnavoUserId,
      plan: planSlug,
      status: 'past_due',
      current_period_end: data.current_billing_period?.ends_at || null,
    })
  }
}


/**
 * Handle transaction refunded webhook
 * Deactivates license keys when a refund is processed
 */
async function handleTransactionRefunded(data: any) {
  try {
    console.log('🔄 Processing refund for transaction:', data.id)
    const transactionId = data.id

    // Find the purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('*, licenses(*)')
      .eq('paddle_transaction_id', transactionId)
      .single()

    if (purchaseError || !purchase) {
      console.error('❌ Purchase not found for transaction:', transactionId)
      return
    }

    console.log('📝 Found purchase:', purchase.id)

    // Update purchase status to refunded
    await supabase
      .from('purchases')
      .update({ 
        status: 'refunded',
        refunded_at: new Date().toISOString()
      })
      .eq('id', purchase.id)

    console.log('✅ Purchase status updated to refunded')

    // Deactivate all associated license keys
    if (purchase.licenses && purchase.licenses.length > 0) {
      const licenseIds = purchase.licenses.map((l: any) => l.id)
      
      await supabase
        .from('licenses')
        .update({ 
          is_active: false,
          deactivated_at: new Date().toISOString(),
          deactivation_reason: 'refund'
        })
        .in('id', licenseIds)

      console.log(`✅ Deactivated ${licenseIds.length} license keys`)

      // Also deactivate in product database
      for (const license of purchase.licenses) {
        try {
          const productDB = createClient(
            process.env.PRODUCT_DB_SUPABASE_URL!,
            process.env.PRODUCT_DB_SUPABASE_KEY!
          )
          
          await productDB
            .from('license_keys')
            .update({ 
              is_active: false,
              status: 'revoked'
            })
            .eq('license_key', license.license_key)

          console.log(`✅ License ${license.license_key} revoked in product DB`)
        } catch (syncError) {
          console.error('❌ Failed to sync license deactivation:', syncError)
        }
      }
    }

    console.log('🎉 Refund processed successfully!')
  } catch (error) {
    console.error('❌ Error handling refund:', error)
    throw error
  }
}

/**
 * Handle adjustment.updated webhook (Paddle v2 Refunds)
 * Paddle v2 sends adjustment.updated events when refunds are processed
 * This is the modern way to handle refunds in Paddle Billing API v2
 */
async function handleAdjustmentUpdated(data: any) {
  try {
    console.log('🔄 Processing adjustment:', data.id)
    
    // SECURITY: Validate adjustment data structure
    if (!data || typeof data !== 'object') {
      console.error('❌ Invalid adjustment data')
      return
    }
    
    // Check if this is a refund adjustment that's been approved
    if (data.action !== 'refund' || data.status !== 'approved') {
      console.log('ℹ️ Adjustment is not an approved refund, skipping:', {
        action: data.action,
        status: data.status
      })
      return
    }
    
    console.log('⚠️ Approved refund detected!')
    
    // Extract transaction ID from the adjustment
    const transactionId = data.transaction_id
    
    if (!transactionId) {
      console.error('❌ Missing transaction_id in adjustment data')
      return
    }
    
    console.log('🔍 Looking up purchase for transaction:', transactionId)

    // Find the purchase record using the transaction ID
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('*, licenses(*), products(name)')
      .eq('paddle_transaction_id', transactionId)
      .single()

    if (purchaseError || !purchase) {
      console.error('❌ Purchase not found for transaction:', transactionId, purchaseError)
      
      // Send Discord notification about failed refund processing
      try {
        await sendRefundNotification({
          transactionId,
          success: false,
          error: 'Purchase record not found in database'
        })
      } catch (discordError) {
        console.error('❌ Failed to send Discord notification:', discordError)
      }
      
      return
    }

    console.log('📝 Found purchase:', {
      id: purchase.id,
      customer: purchase.customer_email,
      product: purchase.products?.name,
      amount: purchase.amount,
      currency: purchase.currency
    })

    // Update purchase status to refunded
    const { error: updateError } = await supabase
      .from('purchases')
      .update({ 
        status: 'refunded',
        refunded_at: new Date().toISOString()
      })
      .eq('id', purchase.id)
    
    if (updateError) {
      console.error('❌ Failed to update purchase status:', updateError)
      throw updateError
    }

    console.log('✅ Purchase status updated to refunded')

    // Deactivate all associated license keys
    if (purchase.licenses && purchase.licenses.length > 0) {
      const licenseIds = purchase.licenses.map((l: any) => l.id)
      const licenseKeys = purchase.licenses.map((l: any) => l.license_key)
      
      // Deactivate in main database
      const { error: deactivateError } = await supabase
        .from('licenses')
        .update({ 
          is_active: false,
          deactivated_at: new Date().toISOString(),
          deactivation_reason: 'refund'
        })
        .in('id', licenseIds)
      
      if (deactivateError) {
        console.error('❌ Failed to deactivate licenses:', deactivateError)
        throw deactivateError
      }

      console.log(`✅ Deactivated ${licenseIds.length} license keys in main database`)

      // Also deactivate in product database
      const productDB = createClient(
        process.env.PRODUCT_DB_SUPABASE_URL!,
        process.env.PRODUCT_DB_SUPABASE_KEY!
      )
      
      for (const licenseKey of licenseKeys) {
        try {
          await productDB
            .from('license_keys')
            .update({ 
              is_active: false,
              status: 'revoked'
            })
            .eq('license_key', licenseKey)

          console.log(`✅ License ${licenseKey} revoked in product database`)
        } catch (syncError) {
          console.error(`❌ Failed to sync license deactivation for ${licenseKey}:`, syncError)
          // Continue with other licenses even if one fails
        }
      }
      
      // Send Discord notification about successful refund
      try {
        await sendRefundNotification({
          transactionId,
          purchaseId: purchase.id,
          customerEmail: purchase.customer_email,
          customerName: purchase.customer_name,
          productName: purchase.products?.name || 'Unknown Product',
          amount: purchase.amount,
          currency: purchase.currency,
          licensesRevoked: licenseKeys.length,
          licenseKeys: licenseKeys,
          success: true
        })
        console.log('✅ Discord refund notification sent')
      } catch (discordError) {
        console.error('❌ Failed to send Discord notification:', discordError)
        // Don't throw - refund processing is complete
      }
    } else {
      console.log('ℹ️ No licenses associated with this purchase')
      
      // Still send Discord notification
      try {
        await sendRefundNotification({
          transactionId,
          purchaseId: purchase.id,
          customerEmail: purchase.customer_email,
          customerName: purchase.customer_name,
          productName: purchase.products?.name || 'Unknown Product',
          amount: purchase.amount,
          currency: purchase.currency,
          licensesRevoked: 0,
          success: true
        })
      } catch (discordError) {
        console.error('❌ Failed to send Discord notification:', discordError)
      }
    }

    console.log('🎉 Adjustment.updated (refund) processed successfully!')
  } catch (error) {
    console.error('❌ Error handling adjustment.updated:', error)
    
    // Try to send error notification
    try {
      await sendRefundNotification({
        transactionId: data?.transaction_id || 'unknown',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } catch (discordError) {
      console.error('❌ Failed to send error notification:', discordError)
    }
    
    throw error
  }
}

/**
 * Send refund notification to Discord
 */
async function sendRefundNotification(data: {
  transactionId: string
  purchaseId?: string
  customerEmail?: string
  customerName?: string
  productName?: string
  amount?: number
  currency?: string
  licensesRevoked?: number
  licenseKeys?: string[]
  success: boolean
  error?: string
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('⚠️ DISCORD_WEBHOOK_URL not configured - skipping Discord notification')
    return
  }

  try {
    const embed: any = {
      title: data.success ? '⚠️ Refund Processed - Licenses Revoked' : '❌ Refund Processing Failed',
      color: data.success ? 15844367 : 15158332, // Orange for refund, Red for error
      fields: [
        {
          name: '🆔 Transaction ID',
          value: `\`${data.transactionId}\``,
          inline: true,
        }
      ],
      footer: {
        text: 'Appsto Refund Monitor',
      },
      timestamp: new Date().toISOString(),
    }

    if (data.success) {
      // Success - add purchase details
      if (data.purchaseId) {
        embed.fields.push({
          name: '📦 Purchase ID',
          value: `\`${data.purchaseId.substring(0, 8)}...\``,
          inline: true,
        })
      }
      
      if (data.customerEmail) {
        embed.fields.push({
          name: '👤 Customer',
          value: data.customerEmail,
          inline: true,
        })
      }
      
      if (data.productName) {
        embed.fields.push({
          name: '🛍️ Product',
          value: data.productName,
          inline: true,
        })
      }
      
      if (data.amount && data.currency) {
        const formattedAmount = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: data.currency,
        }).format(data.amount)
        
        embed.fields.push({
          name: '💰 Refunded Amount',
          value: formattedAmount,
          inline: true,
        })
      }
      
      if (data.licensesRevoked !== undefined) {
        embed.fields.push({
          name: '🔑 Licenses Revoked',
          value: `${data.licensesRevoked} license${data.licensesRevoked !== 1 ? 's' : ''}`,
          inline: true,
        })
      }
      
      if (data.licenseKeys && data.licenseKeys.length > 0) {
        const keysPreview = data.licenseKeys.slice(0, 3).map(k => `\`${k.substring(0, 20)}...\``).join('\n')
        const moreText = data.licenseKeys.length > 3 ? `\n_and ${data.licenseKeys.length - 3} more..._` : ''
        
        embed.fields.push({
          name: '🗝️ Revoked Keys',
          value: keysPreview + moreText,
          inline: false,
        })
      }
      
      embed.description = `A refund has been processed and customer access has been revoked.`
    } else {
      // Error
      embed.description = `Failed to process refund for transaction.`
      embed.fields.push({
        name: '❌ Error',
        value: data.error || 'Unknown error',
        inline: false,
      })
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Appsto Refund Bot',
        avatar_url: 'https://appsto.software/Logo.png',
        embeds: [embed],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Discord webhook failed: ${response.status} - ${errorText}`)
    }

    console.log('✅ Discord refund notification sent successfully')
  } catch (error) {
    console.error('❌ Error sending Discord refund notification:', error)
    // Don't throw - we don't want to break refund processing if Discord fails
  }
}

/**
 * Verify Paddle webhook signature
 * 
 * SECURITY: This validates that webhook requests actually come from Paddle
 * and haven't been tampered with. Critical for preventing fraudulent transactions.
 */
function verifyPaddleWebhook(signature: string | null, body: string): boolean {
  // SECURITY: In development, optionally skip verification for LOCAL testing only
  // NEVER enable this in production - attackers could forge webhooks
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_WEBHOOK_VERIFICATION === 'true') {
    console.warn('⚠️ WARNING: Webhook verification skipped in development mode')
    return true
  }

  if (!signature) {
    console.error('⚠️ Missing webhook signature header')
    return false
  }

  try {
    // SECURITY: Simulation bypass ONLY in development environment
    // In production, ALL webhooks must have valid signatures
    if (process.env.NODE_ENV === 'development') {
      const parsedBody = JSON.parse(body)
      if (parsedBody.event_id?.startsWith('ntfsimevt_') || parsedBody.notification_id?.startsWith('ntfsimntf_')) {
        console.log('ℹ️ Simulation webhook detected - skipping signature verification (DEV ONLY)')
        return true
      }
    }

    // Paddle uses TS (timestamp) and H1 (HMAC signature) in the header
    // Format: ts=timestamp;h1=signature
    const parts = signature.split(';')
    const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1]
    const h1 = parts.find(p => p.startsWith('h1='))?.split('=')[1]

    if (!ts || !h1) {
      console.error('⚠️ Invalid signature format')
      return false
    }

    // SECURITY: Validate timestamp is recent (within 5 minutes) to prevent replay attacks
    const webhookTimestamp = parseInt(ts, 10)
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const timeDifference = Math.abs(currentTimestamp - webhookTimestamp)
    
    if (timeDifference > 300) { // 5 minutes
      console.error('❌ Webhook timestamp too old - possible replay attack')
      console.error(`Timestamp difference: ${timeDifference} seconds`)
      return false
    }

    // PRODUCTION: Verify signature using webhook secret
    const crypto = require('crypto')
    const secret = process.env.PADDLE_WEBHOOK_SECRET
    
    if (!secret) {
      console.error('❌ PADDLE_WEBHOOK_SECRET not configured!')
      return false
    }
    
    // TEMPORARY: Diagnostic logging for debugging signature issues
    console.log('🔍 Signature Debug Info:')
    console.log('  - Timestamp:', ts)
    console.log('  - Secret prefix:', secret.substring(0, 10) + '...')
    console.log('  - Secret length:', secret.length)
    console.log('  - Received signature prefix:', h1.substring(0, 10) + '...')
    console.log('  - Time difference:', timeDifference, 'seconds')

    // Construct the signed payload (Paddle format)
    const payload = ts + ':' + body
    
    // Calculate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
    
    // TEMPORARY: Show signature comparison
    console.log('  - Expected signature prefix:', expectedSignature.substring(0, 10) + '...')
    console.log('  - Signatures match:', h1 === expectedSignature)

    // Timing-safe comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(h1, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )

    if (!isValid) {
      console.error('❌ Invalid webhook signature - possible fraud attempt')
      console.error('🔍 This likely means:')
      console.error('   1. Wrong webhook secret in PADDLE_WEBHOOK_SECRET env var')
      console.error('   2. Multiple webhook destinations with different secrets')
      console.error('   3. Webhook sent to wrong destination')
    }

    return isValid
  } catch (error) {
    console.error('❌ Error verifying webhook signature:', error)
    return false
  }
}
