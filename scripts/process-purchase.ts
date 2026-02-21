/**
 * Manual Purchase Processing Script
 * 
 * Use this to manually process a purchase that:
 * - Payment completed in Paddle
 * - Webhook didn't fire or failed
 * - License keys not generated
 * - Email not sent
 * 
 * HOW TO USE:
 * 1. Find the purchase in your database (purchases table)
 * 2. Get the purchase ID (UUID)
 * 3. Update PURCHASE_ID below
 * 4. Run: npx tsx scripts/process-purchase.ts
 */

import { createClient } from '@supabase/supabase-js'
import { createLicenses, syncPurchaseLicenses } from '../src/lib/license'
import { sendPurchaseConfirmationEmail } from '../src/lib/purchase-email'
import { sendPurchaseNotification } from '../src/lib/discord'

// =====================================================
// 🔧 CONFIGURATION - UPDATE THESE
// =====================================================

const PURCHASE_ID = 'YOUR_PURCHASE_ID_HERE' // Get from database

// =====================================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function processExistingPurchase() {
  try {
    console.log('🔍 Looking up purchase:', PURCHASE_ID)

    // Get purchase with all related data
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select(`
        *,
        products (*),
        pricing_plans (*),
        licenses (*)
      `)
      .eq('id', PURCHASE_ID)
      .single()

    if (purchaseError || !purchase) {
      console.error('❌ Purchase not found:', purchaseError)
      return
    }

    console.log('✅ Purchase found:', {
      id: purchase.id,
      customer: purchase.customer_email,
      product: purchase.products.name,
      plan: purchase.pricing_plans.plan_name,
      amount: purchase.amount,
      currency: purchase.currency,
      status: purchase.status,
    })

    // Check if licenses already exist
    if (purchase.licenses && purchase.licenses.length > 0) {
      console.log('⚠️  Licenses already exist:', purchase.licenses.length)
      console.log('Do you want to regenerate? (Ctrl+C to cancel, or comment out this check)')
      // Uncomment below to proceed anyway:
      // console.log('Proceeding with regeneration...')
      return
    }

    console.log('🎫 Generating license keys...')

    // Get user if exists
    const { data: authUser } = await supabase.auth.admin.listUsers()
    const user = authUser?.users?.find(u => u.email === purchase.customer_email)

    if (user) {
      console.log('✅ User account found:', user.email)
    } else {
      console.log('ℹ️  Guest purchase - no user account')
    }

    // Generate licenses
    const licenses = await createLicenses({
      purchaseId: purchase.id,
      productId: purchase.products.id,
      userId: user?.id || null,
      count: purchase.pricing_plans.devices,
      plan: purchase.pricing_plans.plan_name,
      licenseType: 'standard',
    })

    console.log(`✅ Generated ${licenses.length} license keys:`)
    licenses.forEach((license, i) => {
      console.log(`   ${i + 1}. ${license.license_key}`)
    })

    // Sync to product database
    console.log('🔄 Syncing licenses to product database...')
    await syncPurchaseLicenses(purchase.id)
    console.log('✅ Licenses synced')

    // Generate download URL
    const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/download?token=${Buffer.from(`${purchase.products.id}:${purchase.id}`).toString('base64')}`

    // Send confirmation email
    console.log('📧 Sending confirmation email...')
    try {
      const amount = parseFloat(purchase.amount)
      await sendPurchaseConfirmationEmail({
        purchaseId: purchase.id,
        customerName: purchase.customer_name || 'Customer',
        customerEmail: purchase.customer_email,
        productName: purchase.products.name,
        planName: purchase.pricing_plans.plan_name,
        subtotal: amount,
        discount: 0, // Historical data - discount info not available
        amount: amount,
        currency: purchase.currency,
        licenseKeys: licenses.map((l) => l.license_key),
        downloadUrl,
        downloadExpiryDays: 7,
      })
      console.log('✅ Email sent to:', purchase.customer_email)
    } catch (emailError) {
      console.error('❌ Email failed:', emailError)
    }

    // Send Discord notification
    console.log('📢 Sending Discord notification...')
    try {
      const amount = parseFloat(purchase.amount)
      await sendPurchaseNotification({
        customerName: purchase.customer_name || 'Customer',
        customerEmail: purchase.customer_email,
        productName: purchase.products.name,
        planName: purchase.pricing_plans.plan_name,
        subtotal: amount,
        discount: 0, // Historical data - discount info not available
        amount: amount,
        currency: purchase.currency,
        licensesCount: purchase.pricing_plans.devices,
        purchaseId: purchase.id,
        productImage: `${process.env.NEXT_PUBLIC_SITE_URL}/DeskSweep/DeskSweep.png`,
      })
      console.log('✅ Discord notification sent')
    } catch (discordError) {
      console.error('❌ Discord notification failed:', discordError)
    }

    console.log('🎉 Purchase processed successfully!')
    console.log('\nSummary:')
    console.log(`- Customer: ${purchase.customer_email}`)
    console.log(`- Product: ${purchase.products.name} (${purchase.pricing_plans.plan_name})`)
    console.log(`- Licenses: ${licenses.length} keys generated`)
    console.log(`- Email: Sent to ${purchase.customer_email}`)
    console.log(`- Discord: Notification sent`)

  } catch (error) {
    console.error('❌ Error processing purchase:', error)
  }
}

// Run the script
processExistingPurchase()
