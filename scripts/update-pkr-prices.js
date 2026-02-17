/**
 * Update PKR prices to match USD prices (for consistent global pricing)
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function updatePrices() {
  console.log('💰 Updating pricing to match USD globally...\n')

  // Solo: $9 USD
  const { error: soloError } = await supabase
    .from('pricing_plans')
    .update({
      price_usd: 9,
      price_inr: 9,  // Show as 9 in India too
      price_pkr: 9   // Show as 9 in Pakistan too
    })
    .eq('plan_slug', 'solo')

  if (soloError) {
    console.error('❌ Solo update failed:', soloError)
  } else {
    console.log('✅ Solo: $9 (all regions)')
  }

  // Squad: $29 USD
  const { error: squadError } = await supabase
    .from('pricing_plans')
    .update({
      price_usd: 29,
      price_inr: 29,
      price_pkr: 29
    })
    .eq('plan_slug', 'squad')

  if (squadError) {
    console.error('❌ Squad update failed:', squadError)
  } else {
    console.log('✅ Squad: $29 (all regions)')
  }

  // Studio: $79 USD
  const { error: studioError } = await supabase
    .from('pricing_plans')
    .update({
      price_usd: 79,
      price_inr: 79,
      price_pkr: 79
    })
    .eq('plan_slug', 'studio')

  if (studioError) {
    console.error('❌ Studio update failed:', studioError)
  } else {
    console.log('✅ Studio: $79 (all regions)')
  }

  console.log('\n🎉 Done! All regions now show same USD prices.')
  console.log('💡 Paddle will handle currency conversion at checkout.')
}

updatePrices()
