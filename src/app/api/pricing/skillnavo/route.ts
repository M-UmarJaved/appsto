import { NextRequest, NextResponse } from 'next/server';
import { SKILLNAVO_PADDLE_PRICE_IDS, SKILLNAVO_PRICING, formatPrice, type Currency } from '@/lib/currency';

export const dynamic = 'force-dynamic';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://skillnavo.com',
  'https://www.skillnavo.com',
  'https://appsto.software',
  'https://www.appsto.software',
  'http://localhost:3000',
  'http://localhost:3001',
];

function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.skillnavo.com');

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : 'https://skillnavo.com',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);

  try {
    // 1. Detect Country: Query Param Override -> Cloudflare -> Vercel -> Custom Headers
    const queryCountry = request.nextUrl.searchParams.get('country')?.toUpperCase();
    const cfCountry = request.headers.get('cf-ipcountry')?.toUpperCase();
    const vercelCountry = request.headers.get('x-vercel-ip-country')?.toUpperCase();
    const customCountry = request.headers.get('x-country-code')?.toUpperCase();

    const country = queryCountry || cfCountry || vercelCountry || customCountry || 'US';

    // 2. Resolve Regional Pricing Configuration
    let currency: Currency = 'USD';
    let symbol = '$';
    let tier_name = 'Global (USD)';

    if (country === 'IN') {
      currency = 'INR';
      symbol = '₹';
      tier_name = 'India (INR)';
    } else if (country === 'PK') {
      currency = 'USD';
      symbol = '$';
      tier_name = 'Pakistan (USD)';
    }

    const region = {
      country,
      currency,
      symbol,
      tier_name,
    };

    const starterMonthly = SKILLNAVO_PRICING.find((p) => p.id === 'starter_monthly')!;
    const starterAnnual = SKILLNAVO_PRICING.find((p) => p.id === 'starter_annual')!;
    const proMonthly = SKILLNAVO_PRICING.find((p) => p.id === 'pro_monthly')!;
    const proAnnual = SKILLNAVO_PRICING.find((p) => p.id === 'pro_annual')!;

    const starterMonthlyPrice = starterMonthly.prices[currency] ?? starterMonthly.prices.USD;
    const starterAnnualPrice = starterAnnual.prices[currency] ?? starterAnnual.prices.USD;
    const proMonthlyPrice = proMonthly.prices[currency] ?? proMonthly.prices.USD;
    const proAnnualPrice = proAnnual.prices[currency] ?? proAnnual.prices.USD;

    const pricingTier = {
      starter_monthly: {
        price: starterMonthlyPrice,
        formatted: formatPrice(starterMonthlyPrice, currency),
        period: '/ mo',
        subtext: starterMonthly.description,
      },
      starter_annual: {
        price: starterAnnualPrice,
        formatted: formatPrice(starterAnnualPrice, currency),
        period: '/ yr',
        subtext: starterAnnual.description,
        savings: starterAnnual.savings,
      },
      pro_monthly: {
        price: proMonthlyPrice,
        formatted: formatPrice(proMonthlyPrice, currency),
        period: '/ mo',
        subtext: proMonthly.description,
      },
      pro_annual: {
        price: proAnnualPrice,
        formatted: formatPrice(proAnnualPrice, currency),
        period: '/ yr',
        subtext: proAnnual.description,
        savings: proAnnual.savings,
      },
    };

    // 3. Build Synchronized Plans Payload matching Skillnavo UI
    const payload = {
      success: true,
      product: 'skillnavo',
      product_name: 'Skillnavo AI Platform',
      paddle: {
        product_id: process.env.NEXT_PUBLIC_PADDLE_PRODUCT_SKILLNAVO || 'pro_01m2524ck45ckjmnh6yam91w01',
        environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'production',
        client_token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || 'live_d7847f9aa083b449ac00ca5849f',
      },
      region,
      trust_banner: '14-day Pro trial on signup — no card • 14-day money-back guarantee • Secure checkout by Paddle',
      plans: {
        free: {
          id: 'free',
          name: 'Free',
          tagline: 'Explore the platform and test core features.',
          description: 'Free forever',
          is_free: true,
          price: 0,
          currency: region.currency,
          formatted_price: 'Free',
          billing_period: 'forever',
          cta: 'Create free account',
          cta_url: 'https://skillnavo.com/register',
          section_header: 'INCLUDED IN FREE',
          features: [
            '1 active path',
            '25 AI credits / month',
            'Up to 2 AI roadmaps or 5 quizzes',
            '3 chat msgs / day',
            'Full curated library',
            'Streaks & checkpoints',
            'Certificate',
          ],
        },
        starter_monthly: {
          id: 'starter_monthly',
          name: 'Starter',
          tagline: 'For consistent learners building new skills.',
          description: pricingTier.starter_monthly.subtext,
          badge: 'MOST POPULAR',
          popular: true,
          price: pricingTier.starter_monthly.price,
          currency: region.currency,
          formatted_price: pricingTier.starter_monthly.formatted,
          period_suffix: pricingTier.starter_monthly.period,
          billing_period: 'monthly',
          paddle_price_id: SKILLNAVO_PADDLE_PRICE_IDS.starter_monthly,
          cta: 'Get Starter',
          checkout_url: `https://appsto.software/skillnavo/checkout?plan=starter_monthly`,
          section_header: 'EVERYTHING IN FREE, PLUS',
          features: [
            '3 active paths',
            '300 AI credits / month',
            'Up to 30 roadmaps or 60 quizzes',
            '15 chat msgs / day',
            'Personalized roadmap engine',
            'Weekly reports',
            'Certificate',
            'Priority updates',
          ],
        },
        starter_annual: {
          id: 'starter_annual',
          name: 'Starter',
          tagline: 'For consistent learners building new skills.',
          description: pricingTier.starter_annual.subtext,
          badge: 'MOST POPULAR',
          popular: true,
          savings: pricingTier.starter_annual.savings,
          price: pricingTier.starter_annual.price,
          currency: region.currency,
          formatted_price: pricingTier.starter_annual.formatted,
          period_suffix: pricingTier.starter_annual.period,
          billing_period: 'annual',
          paddle_price_id: SKILLNAVO_PADDLE_PRICE_IDS.starter_annual,
          cta: 'Get Starter',
          checkout_url: `https://appsto.software/skillnavo/checkout?plan=starter_annual`,
          section_header: 'EVERYTHING IN FREE, PLUS',
          features: [
            '3 active paths',
            '300 AI credits / month',
            'Up to 30 roadmaps or 60 quizzes',
            '15 chat msgs / day',
            'Personalized roadmap engine',
            'Weekly reports',
            'Certificate',
            'Priority updates',
          ],
        },
        pro_monthly: {
          id: 'pro_monthly',
          name: 'Pro',
          tagline: 'For professionals seeking mastery and speed.',
          description: pricingTier.pro_monthly.subtext,
          popular: false,
          price: pricingTier.pro_monthly.price,
          currency: region.currency,
          formatted_price: pricingTier.pro_monthly.formatted,
          period_suffix: pricingTier.pro_monthly.period,
          billing_period: 'monthly',
          paddle_price_id: SKILLNAVO_PADDLE_PRICE_IDS.pro_monthly,
          cta: 'Get Pro',
          checkout_url: `https://appsto.software/skillnavo/checkout?plan=pro_monthly`,
          section_header: 'EVERYTHING IN STARTER, PLUS',
          features: [
            'Unlimited paths',
            '1,200 credits / month',
            'Up to 120 roadmaps or 240 quizzes',
            'AI learning assistant (50 msgs / day)',
            'Advanced AI models',
            'Skill progress breakdown',
            'Verifiable certificates with share link',
            'Full analytics dashboard',
            'Priority support',
          ],
        },
        pro_annual: {
          id: 'pro_annual',
          name: 'Pro',
          tagline: 'For professionals seeking mastery and speed.',
          description: pricingTier.pro_annual.subtext,
          popular: false,
          savings: pricingTier.pro_annual.savings,
          price: pricingTier.pro_annual.price,
          currency: region.currency,
          formatted_price: pricingTier.pro_annual.formatted,
          period_suffix: pricingTier.pro_annual.period,
          billing_period: 'annual',
          paddle_price_id: SKILLNAVO_PADDLE_PRICE_IDS.pro_annual,
          cta: 'Get Pro',
          checkout_url: `https://appsto.software/skillnavo/checkout?plan=pro_annual`,
          section_header: 'EVERYTHING IN STARTER, PLUS',
          features: [
            'Unlimited paths',
            '1,200 credits / month',
            'Up to 120 roadmaps or 240 quizzes',
            'AI learning assistant (50 msgs / day)',
            'Advanced AI models',
            'Skill progress breakdown',
            'Verifiable certificates with share link',
            'Full analytics dashboard',
            'Priority support',
          ],
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        cached_ttl_seconds: 3600,
      },
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('❌ Error in /api/pricing/skillnavo:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve Skillnavo pricing', message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
