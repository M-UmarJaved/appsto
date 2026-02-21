import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createLicenses, syncPurchaseLicenses } from '@/lib/license';
import { sendPurchaseConfirmationEmail } from '@/lib/purchase-email';
import { sendPurchaseNotification } from '@/lib/discord';
import { validateRequest, TestPurchaseSchema } from '@/lib/validation';
import { withRateLimit } from '@/lib/ratelimit';
import { DESKSWEEP_PRICING, type Currency } from '@/lib/currency';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Test Purchase API (Development Only)
 * 
 * SECURITY: This endpoint is protected by:
 * - Environment check (disabled in production unless explicitly allowed)
 * - Input validation (Zod schema)
 * - Rate limiting (10 requests per 5 minutes per client)
 * 
 * Simulates a complete purchase flow for testing purposes
 * Uses the TEST100 coupon (100% off) to create test purchases
 * 
 * POST /api/test/purchase
 * Body: {
 *   userId: string (UUID),
 *   email: string (valid email),
 *   name: string (optional),
 *   productSlug: 'desksweep' (default),
 *   planSlug: 'solo' | 'squad' | 'studio' (default: 'solo')
 * }
 */
async function handleTestPurchase(req: NextRequest) {
  // SECURITY: Only allow in development or if explicitly enabled
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_TEST_PURCHASES !== 'true') {
    return NextResponse.json(
      { 
        error: 'Test purchases are disabled in production',
        message: 'This endpoint is only available in development mode'
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    
    // SECURITY: Validate and sanitize input
    const validation = validateRequest(TestPurchaseSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error },
        { status: 400 }
      );
    }
    
    const { userId, productSlug, planSlug, email, name, currency } = validation.data;

    console.log('🧪 Creating test purchase:', { userId, productSlug, planSlug, currency });

    // Get the actual price for the selected plan and currency
    const selectedPlan = DESKSWEEP_PRICING.find(p => p.id === planSlug);
    const actualPrice = selectedPlan ? selectedPlan.prices[currency as Currency] : 0;

    // Get product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', productSlug)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: `Product not found: ${productSlug}` },
        { status: 404 }
      );
    }

    // Get pricing plan
    const { data: pricingPlan, error: planError } = await supabase
      .from('pricing_plans')
      .select('*')
      .eq('product_id', product.id)
      .eq('plan_slug', planSlug)
      .single();

    if (planError || !pricingPlan) {
      return NextResponse.json(
        { error: `Pricing plan not found: ${planSlug}` },
        { status: 404 }
      );
    }

    // Create purchase record with TEST prefix
    const testTransactionId = `TEST-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        product_id: product.id,
        pricing_plan_id: pricingPlan.id,
        paddle_transaction_id: testTransactionId,
        amount: actualPrice,
        currency: currency,
        status: 'completed',
        customer_email: email,
        customer_name: name || 'Test Customer',
        billing_country: currency === 'PKR' ? 'PK' : currency === 'INR' ? 'IN' : 'US',
        licenses_count: pricingPlan.devices,
        purchased_at: new Date().toISOString(),
        metadata: {
          test_purchase: true,
          coupon_code: 'TEST100',
        },
      })
      .select()
      .single();

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: `Failed to create purchase: ${purchaseError?.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Test purchase created:', purchase.id);

    // Generate licenses
    const licenses = await createLicenses({
      purchaseId: purchase.id,
      productId: product.id,
      userId: userId,
      count: pricingPlan.devices,
      plan: pricingPlan.plan_name, // Pass plan name for prefix generation
      licenseType: 'standard',
    });

    console.log(`✅ Generated ${licenses.length} licenses`);

    // Sync licenses to My Softwares database
    await syncPurchaseLicenses(purchase.id);

    console.log('✅ Licenses synced to product database');

    // Generate download URL
    const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/download?token=${Buffer.from(`${product.id}:${purchase.id}`).toString('base64')}`;

    // Send purchase confirmation email
    await sendPurchaseConfirmationEmail({
      purchaseId: purchase.id,
      customerName: name || 'Test Customer',
      customerEmail: email,
      productName: product.name,
      planName: pricingPlan.plan_name,
      subtotal: actualPrice,
      discount: 0, // Test purchase - no discount applied
      amount: actualPrice,
      currency: currency,
      licenseKeys: licenses.map((l) => l.license_key),
      downloadUrl,
      downloadExpiryDays: 7,
    });

    console.log('✅ Purchase email sent');

    // Send Discord notification for instant mobile alert
    await sendPurchaseNotification({
      customerName: name || 'Test Customer',
      customerEmail: email,
      productName: product.name,
      planName: pricingPlan.plan_name,
      subtotal: actualPrice,
      discount: 0, // Test purchase - no discount applied
      amount: actualPrice,
      currency: currency,
      licensesCount: pricingPlan.devices,
      purchaseId: purchase.id,
      productImage: `${process.env.NEXT_PUBLIC_SITE_URL}/DeskSweep/DeskSweep.png`,
    });

    console.log('✅ Discord notification sent');

    return NextResponse.json({
      success: true,
      message: 'Test purchase created successfully',
      data: {
        purchaseId: purchase.id,
        transactionId: testTransactionId,
        licenseKeys: licenses.map((l) => l.license_key),
        downloadUrl,
        product: product.name,
        plan: pricingPlan.plan_name,
        deviceCount: pricingPlan.devices,
      },
    });
  } catch (error) {
    console.error('❌ Test purchase error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if test purchases are enabled
 */
export async function GET() {
  const enabled = process.env.NODE_ENV !== 'production' || process.env.ALLOW_TEST_PURCHASES === 'true';
  
  return NextResponse.json({
    enabled,
    environment: process.env.NODE_ENV,
    message: enabled 
      ? 'Test purchases are enabled. Use POST with userId, productSlug, planSlug, email, and name.'
      : 'Test purchases are disabled in production',
  });
}

// SECURITY: Wrap handler with rate limiting (10 requests per 5 minutes)
export const POST = withRateLimit(handleTestPurchase, '/api/test/purchase');
