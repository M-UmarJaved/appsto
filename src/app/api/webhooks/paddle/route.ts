import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createLicenses, syncPurchaseLicenses } from '@/lib/license'
import { sendPurchaseConfirmationEmail } from '@/lib/purchase-email'
import { sendPurchaseNotification } from '@/lib/discord'

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
    console.log('🎯 Paddle webhook received!')
    
    // Get the webhook signature from headers
    const signature = req.headers.get('paddle-signature')
    const rawBody = await req.text()

    console.log('📧 Webhook signature:', signature ? 'Present' : 'Missing')
    console.log('📦 Webhook body preview:', rawBody.substring(0, 200))

    // Verify webhook signature (important for security)
    if (!verifyPaddleWebhook(signature, rawBody)) {
      console.error('❌ Invalid Paddle webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    console.log('✅ Webhook signature verified')

    // Parse the webhook payload
    const event = JSON.parse(rawBody)
    
    console.log('📨 Paddle webhook event type:', event.event_type)
    console.log('📨 Full event data:', JSON.stringify(event, null, 2))

    // Handle transaction completed event
    if (event.event_type === 'transaction.completed') {
      console.log('🎯 Processing transaction.completed event')
      await handleTransactionCompleted(event.data)
    }

    // Handle subscription events (for future subscription products)
    if (event.event_type === 'subscription.created') {
      console.log('🎯 Processing subscription.created event')
      await handleSubscriptionCreated(event.data)
    }

    // Handle refund events
    if (event.event_type === 'transaction.payment_failed' || event.event_type === 'transaction.refunded') {
      console.log('🎯 Processing refund/payment failure event')
      await handleTransactionRefunded(event.data)
    }

    console.log('✅ Webhook processed successfully')
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * Handle transaction completed webhook
 * Same logic as test purchase - creates purchase, generates licenses, sends emails
 */
async function handleTransactionCompleted(data: any) {
  try {
    console.log('🎯 Processing Paddle transaction:', data.id)

    // Extract transaction data
    const transactionId = data.id
    const customerId = data.customer_id
    const customerEmail = data.customer.email
    const customerName = data.customer.name || 'Customer'
    const billingCountry = data.billing_details?.country_code || data.address?.country_code || 'US'
    const items = data.items || []
    const customData = data.custom_data || {}

    // Process each item in the transaction
    for (const item of items) {
      const paddlePriceId = item.price.id
      const paddleProductId = item.price.product_id
      const amount = parseFloat(item.totals.total) / 100 // Convert cents to dollars
      const currency = data.currency_code
      const planSlug = customData.plan_slug || item.price.description?.toLowerCase() || 'solo'

      console.log('📦 Processing item:', { paddlePriceId, paddleProductId, amount, currency, planSlug })

      // Get product from database
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('paddle_product_id', paddleProductId)
        .single()

      if (productError || !product) {
        console.error('❌ Product not found:', paddleProductId, productError)
        continue
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

      // Create purchase record
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
          licenses_count: pricingPlan.devices,
          payment_method: data.payment_method_type || 'card',
          purchased_at: new Date(data.created_at).toISOString(),
          metadata: {
            paddle_data: data,
            custom_data: customData,
          },
        })
        .select()
        .single()

      if (purchaseError || !purchase) {
        console.error('❌ Failed to create purchase:', purchaseError)
        continue
      }

      console.log('✅ Purchase record created:', purchase.id)

      // Generate licenses (works for both logged-in users and guest checkouts)
      // Guest purchases: userId will be null, but license is still tied to customer_email
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
      
      // Send purchase confirmation email (same as test purchase)
      try {
        await sendPurchaseConfirmationEmail({
          purchaseId: purchase.id,
          customerName: customerName,
          customerEmail: customerEmail,
          productName: product.name,
          planName: pricingPlan.plan_name,
          amount: amount,
          currency: currency,
          licenseKeys: licenses.map((l) => l.license_key),
          downloadUrl,
          downloadExpiryDays: 7,
        })
        console.log('✅ Purchase confirmation email sent to', customerEmail)
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError)
        // Don't throw - continue to Discord notification
      }

      console.log('📢 Sending Discord notification...')
      
      // Send Discord notification
      try {
        await sendPurchaseNotification({
          customerName: customerName,
          customerEmail: customerEmail,
          productName: product.name,
          planName: pricingPlan.plan_name,
          amount: amount,
          currency: currency,
          licensesCount: pricingPlan.devices,
          purchaseId: purchase.id,
          productImage: `${process.env.NEXT_PUBLIC_SITE_URL}/DeskSweep/DeskSweep.png`,
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
 * Handle subscription created webhook (for future subscription products)
 */
async function handleSubscriptionCreated(data: any) {
  // For subscription products, we don't generate license tokens
  // Instead, we manage access through subscription status
  console.log('Subscription created:', data.id)
  
  // You can implement subscription management logic here
  // e.g., grant access to the application through API keys or user accounts
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
 * Verify Paddle webhook signature
 * 
 * SECURITY: This validates that webhook requests actually come from Paddle
 * and haven't been tampered with. Critical for preventing fraudulent transactions.
 */
function verifyPaddleWebhook(signature: string | null, body: string): boolean {
  // In development, optionally skip verification for testing
  // Set SKIP_WEBHOOK_VERIFICATION=true in .env for local testing only
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_WEBHOOK_VERIFICATION === 'true') {
    console.warn('⚠️ WARNING: Webhook verification skipped in development mode')
    return true
  }

  if (!signature) {
    console.error('⚠️ Missing webhook signature header')
    return false
  }

  try {
    // Paddle uses TS (timestamp) and H1 (HMAC signature) in the header
    // Format: ts=timestamp;h1=signature
    const parts = signature.split(';')
    const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1]
    const h1 = parts.find(p => p.startsWith('h1='))?.split('=')[1]

    if (!ts || !h1) {
      console.error('⚠️ Invalid signature format')
      return false
    }

    // PRODUCTION: Verify signature using webhook secret
    const crypto = require('crypto')
    const secret = process.env.PADDLE_WEBHOOK_SECRET
    
    if (!secret) {
      console.error('❌ PADDLE_WEBHOOK_SECRET not configured!')
      return false
    }

    // Construct the signed payload (Paddle format)
    const payload = ts + ':' + body
    
    // Calculate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    // Timing-safe comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(h1, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )

    if (!isValid) {
      console.error('❌ Invalid webhook signature - possible fraud attempt')
    }

    return isValid
  } catch (error) {
    console.error('❌ Error verifying webhook signature:', error)
    return false
  }
}
