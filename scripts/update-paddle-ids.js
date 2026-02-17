/**
 * Update Paddle Product and Price IDs in Supabase
 * Run this script to set your Paddle Sandbox IDs in the database
 * 
 * NOTE: Each Paddle price ID has regional pricing configured in Paddle Dashboard
 * One price ID (e.g., Solo) automatically handles USD, INR, PKR based on customer location
 * Paddle detects customer's region and shows the correct local price automatically
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Your Paddle Sandbox IDs
const PADDLE_IDS = {
  PRODUCT_ID: 'pro_01kgpjwr4e79gtsz3y11fn7k2f',
  PRICES: {
    SOLO: 'pri_01kgpm95qrxz1stv18mncjxqvg',
    SQUAD: 'pri_01kgpmb4vas7mswfsnz2w2j9w4',
    STUDIO: 'pri_01kgpmcddtc0ma04wh6bpza2xf'
  }        
}

async function updatePaddleIds() {
  console.log('🚀 Updating Paddle IDs in Supabase...\n')

  // Step 1: Update products table with Paddle Product ID
  console.log('📦 Updating products table...')
  const { data: productData, error: productError } = await supabase
    .from('products')
    .update({ paddle_product_id: PADDLE_IDS.PRODUCT_ID })
    .eq('slug', 'desksweep')
    .select()

  if (productError) {
    console.error('❌ Error updating products:', productError)
    return
  }

  console.log('✅ Product updated:', productData)
  console.log('')

  // Step 2: Update pricing_plans table with Paddle Price IDs
  // NOTE: Each price ID has regional pricing configured in Paddle Dashboard
  // One price ID per plan handles USD, INR, PKR automatically
  console.log('💰 Updating pricing_plans table...')

  // Update Solo plan (regional pricing configured in Paddle)
  const { data: soloData, error: soloError } = await supabase
    .from('pricing_plans')
    .update({
      paddle_price_id_usd: PADDLE_IDS.PRICES.SOLO
    })
    .eq('plan_slug', 'solo')
    .select()

  if (soloError) {
    console.error('❌ Error updating Solo plan:', soloError)
  } else {
    console.log('✅ Solo plan updated:', soloData)
  }

  // Update Squad plan (regional pricing configured in Paddle)
  const { data: squadData, error: squadError } = await supabase
    .from('pricing_plans')
    .update({
      paddle_price_id_usd: PADDLE_IDS.PRICES.SQUAD
    })
    .eq('plan_slug', 'squad')
    .select()

  if (squadError) {
    console.error('❌ Error updating Squad plan:', squadError)
  } else {
    console.log('✅ Squad plan updated:', squadData)
  }

  // Update Studio plan (regional pricing configured in Paddle)
  const { data: studioData, error: studioError } = await supabase
    .from('pricing_plans')
    .update({
      paddle_price_id_usd: PADDLE_IDS.PRICES.STUDIO
    })
    .eq('plan_slug', 'studio')
    .select()

  if (studioError) {
    console.error('❌ Error updating Studio plan:', studioError)
  } else {
    console.log('✅ Studio plan updated:', studioData)
  }

  console.log('\n🎉 Database updated successfully!')
  console.log('✨ Paddle will automatically show regional prices (USD/INR/PKR) based on customer location')
  console.log('💡 Each price ID has local pricing configured in Paddle Dashboard')
}

// Verify database first
async function verifyDatabase() {
  console.log('🔍 Checking current database state...\n')

  // Check products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('slug', 'desksweep')

  if (productsError || !products || products.length === 0) {
    console.error('❌ No DeskSweep product found in database!')
    console.log('💡 Please run: npm run seed-products')
    return false
  }

  console.log('✅ Product found:', products[0].name)
  console.log('   Current Paddle ID:', products[0].paddle_product_id)
  console.log('')

  // Check pricing plans
  const { data: plans, error: plansError } = await supabase
    .from('pricing_plans')
    .select('*')
    .order('price_usd', { ascending: true })

  if (plansError || !plans || plans.length === 0) {
    console.error('❌ No pricing plans found in database!')
    console.log('💡 Please run: npm run seed-products')
    return false
  }

  console.log('✅ Pricing plans found:')
  plans.forEach(plan => {
    console.log(`   ${plan.name}: $${plan.price_usd} (${plan.paddle_price_id_usd || 'No Paddle ID'})`)
  })
  console.log('')

  return true
}

// Main execution
async function main() {
  const isValid = await verifyDatabase()
  
  if (!isValid) {
    process.exit(1)
  }

  await updatePaddleIds()
}

main()
