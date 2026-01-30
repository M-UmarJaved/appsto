import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { generateLicenseToken } from '@/lib/crypto'
import { sendLicenseEmail } from '@/lib/email'

/**
 * Paddle Webhook Handler
 * 
 * This endpoint receives webhook events from Paddle when a purchase is completed.
 * CRITICAL: This only triggers license generation for ONE-TIME PURCHASE products.
 * 
 * Paddle Webhook Events:
 * - transaction.completed: Payment successful
 * - transaction.updated: Payment updated
 * - subscription.created: Subscription created (we don't generate tokens for this)
 */
export async function POST(req: NextRequest) {
  try {
    // Get the webhook signature from headers
    const signature = req.headers.get('paddle-signature')
    const rawBody = await req.text()

    // Verify webhook signature (important for security)
    if (!verifyPaddleWebhook(signature, rawBody)) {
      console.error('Invalid Paddle webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Parse the webhook payload
    const event = JSON.parse(rawBody)
    
    console.log('Paddle webhook received:', event.event_type)

    // Handle transaction completed event
    if (event.event_type === 'transaction.completed') {
      await handleTransactionCompleted(event.data)
    }

    // Handle subscription events (for future subscription products)
    if (event.event_type === 'subscription.created') {
      await handleSubscriptionCreated(event.data)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle transaction completed webhook
 */
async function handleTransactionCompleted(data: any) {
  const supabase = getServiceSupabase()

  try {
    // Extract transaction data
    const transactionId = data.id
    const customerEmail = data.customer.email
    const customerName = data.customer.name || ''
    const items = data.items || []

    // Process each item in the transaction
    for (const item of items) {
      const paddleProductId = item.price.product_id
      const amount = parseFloat(item.price.unit_price.amount)
      const currency = item.price.unit_price.currency_code

      // Get product from database
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('paddle_product_id', paddleProductId)
        .single()

      if (productError || !product) {
        console.error('Product not found:', paddleProductId)
        continue
      }

      // Create purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          product_id: product.id,
          user_email: customerEmail,
          user_name: customerName,
          amount: amount,
          currency: currency,
          paddle_transaction_id: transactionId,
          status: 'completed',
          metadata: data,
        })
        .select()
        .single()

      if (purchaseError) {
        console.error('Failed to create purchase record:', purchaseError)
        continue
      }

      // ⚠️ CRITICAL: Only generate license token for ONE-TIME PURCHASE products
      if (product.product_type === 'one_time') {
        // Generate unique license token
        const licenseToken = generateLicenseToken()

        // Create license record
        const { data: license, error: licenseError } = await supabase
          .from('licenses')
          .insert({
            token: licenseToken,
            product_id: product.id,
            user_email: customerEmail,
            paddle_transaction_id: transactionId,
            is_used: false,
          })
          .select()
          .single()

        if (licenseError) {
          console.error('Failed to create license:', licenseError)
          continue
        }

        // Send email with license token and download link
        await sendLicenseEmail({
          to: customerEmail,
          productName: product.name,
          licenseToken: licenseToken,
          downloadUrl: product.download_url || `${process.env.NEXT_PUBLIC_SITE_URL}/download/${product.slug}`,
          demoVideoUrl: product.demo_video_url,
        })

        console.log(`License generated and email sent for ${product.name} to ${customerEmail}`)
      } else {
        // For subscription products, just send a confirmation email (no license token)
        console.log(`Subscription purchase recorded for ${product.name} - No license token generated`)
      }
    }
  } catch (error) {
    console.error('Error handling transaction:', error)
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
 * Verify Paddle webhook signature
 * 
 * SECURITY: This validates that webhook requests actually come from Paddle
 * and haven't been tampered with. Critical for preventing fraudulent transactions.
 */
function verifyPaddleWebhook(signature: string | null, body: string): boolean {
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

    // In development, optionally skip verification for testing
    // Set SKIP_WEBHOOK_VERIFICATION=true in .env for local testing only
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_WEBHOOK_VERIFICATION === 'true') {
      console.warn('⚠️ WARNING: Webhook verification skipped in development mode')
      return true
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
