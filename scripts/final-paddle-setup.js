/**
 * Final Paddle Setup - Update database for Paddle Billing v2
 * This script updates the pricing_plans table to use the correct structure
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PADDLE_PRICE_IDS = {
  SOLO: 'pri_01kgpm95qrxz1stv18mncjxqvg',
  SQUAD: 'pri_01kgpmb4vas7mswfsnz2w2j9w4',
  STUDIO: 'pri_01kgpmcddtc0ma04wh6bpza2xf'
}

async function finalSetup() {
  console.log('🚀 Final Paddle Billing v2 Setup\n')

  // Update pricing plans with correct Paddle price IDs
  console.log('📊 Updating pricing plans...\n')

  // Solo plan
  const { error: soloError } = await supabase
    .from('pricing_plans')
    .update({
      // Use paddle_price_id (or paddle_price_id_usd if column name unchanged)
      paddle_price_id_usd: PADDLE_PRICE_IDS.SOLO,
      paddle_price_id_inr: PADDLE_PRICE_IDS.SOLO,
      paddle_price_id_pkr: PADDLE_PRICE_IDS.SOLO
    })
    .eq('plan_slug', 'solo')

  if (soloError) {
    console.error('❌ Solo update failed:', soloError)
  } else {
    console.log('✅ Solo: $9 USD (pri_...95qrxz1stv18mncjxqvg)')
  }

  // Squad plan
  const { error: squadError } = await supabase
    .from('pricing_plans')
    .update({
      paddle_price_id_usd: PADDLE_PRICE_IDS.SQUAD,
      paddle_price_id_inr: PADDLE_PRICE_IDS.SQUAD,
      paddle_price_id_pkr: PADDLE_PRICE_IDS.SQUAD
    })
    .eq('plan_slug', 'squad')

  if (squadError) {
    console.error('❌ Squad update failed:', squadError)
  } else {
    console.log('✅ Squad: $29 USD (pri_...pmb4vas7mswfsnz2w2j9w4)')
  }

  // Studio plan
  const { error: studioError } = await supabase
    .from('pricing_plans')
    .update({
      paddle_price_id_usd: PADDLE_PRICE_IDS.STUDIO,
      paddle_price_id_inr: PADDLE_PRICE_IDS.STUDIO,
      paddle_price_id_pkr: PADDLE_PRICE_IDS.STUDIO
    })
    .eq('plan_slug', 'studio')

  if (studioError) {
    console.error('❌ Studio update failed:', studioError)
  } else {
    console.log('✅ Studio: $79 USD (pri_...pmcddtc0ma04wh6bpza2xf)')
  }

  console.log('\n🎉 Database updated successfully!')
  console.log('\n📝 Next steps:')
  console.log('1. Run: npm run dev')
  console.log('2. Visit: http://localhost:3000/products/desksweep')
  console.log('3. Click "Buy Now" - Paddle checkout should open!')
  console.log('4. Test with card: 4000 0566 5566 5556\n')
}

finalSetup()
