/**
 * Fix Paddle Price IDs - Use USD prices for all currencies
 * Paddle will handle currency conversion automatically
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Your Paddle Sandbox IDs (all USD)
const PADDLE_PRICES = {
  SOLO: 'pri_01kgpm95qrxz1stv18mncjxqvg',
  SQUAD: 'pri_01kgpmb4vas7mswfsnz2w2j9w4',
  STUDIO: 'pri_01kgpmcddtc0ma04wh6bpza2xf'
}

async function fixPrices() {
  console.log('🔧 Fixing Paddle price IDs...\n')

  // Update Solo - use USD price for all currencies
  const { data: solo, error: soloError } = await supabase
    .from('pricing_plans')
    .update({
      paddle_price_id_usd: PADDLE_PRICES.SOLO,
      paddle_price_id_inr: PADDLE_PRICES.SOLO, // Same USD price, Paddle converts
      paddle_price_id_pkr: PADDLE_PRICES.SOLO  // Same USD price, Paddle converts
    })
    .eq('plan_slug', 'solo')
    .select()

  if (soloError) {
    console.error('❌ Error updating Solo:', soloError)
  } else {
    console.log('✅ Solo plan fixed')
  }

  // Update Squad
  const { data: squad, error: squadError } = await supabase
    .from('pricing_plans')
    .update({
      paddle_price_id_usd: PADDLE_PRICES.SQUAD,
      paddle_price_id_inr: PADDLE_PRICES.SQUAD,
      paddle_price_id_pkr: PADDLE_PRICES.SQUAD
    })
    .eq('plan_slug', 'squad')
    .select()

  if (squadError) {
    console.error('❌ Error updating Squad:', squadError)
  } else {
    console.log('✅ Squad plan fixed')
  }

  // Update Studio
  const { data: studio, error: studioError } = await supabase
    .from('pricing_plans')
    .update({
      paddle_price_id_usd: PADDLE_PRICES.STUDIO,
      paddle_price_id_inr: PADDLE_PRICES.STUDIO,
      paddle_price_id_pkr: PADDLE_PRICES.STUDIO
    })
    .eq('plan_slug', 'studio')
    .select()

  if (studioError) {
    console.error('❌ Error updating Studio:', studioError)
  } else {
    console.log('✅ Studio plan fixed')
  }

  console.log('\n🎉 Done! All plans now use USD Paddle price IDs.')
  console.log('💡 Paddle will automatically convert USD to PKR/INR at checkout.')
}

fixPrices()
