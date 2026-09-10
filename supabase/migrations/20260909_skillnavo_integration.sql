-- =====================================================
-- APPSTO & SKILLNAVO SUBSCRIPTION INTEGRATION SEED
-- Date: September 2026
-- Description: Registers Skillnavo as a subscription product
--              and sets up the 4 recurring pricing plans.
-- =====================================================

-- 1. Insert Skillnavo Product Record
INSERT INTO public.products (
  name,
  slug,
  description,
  short_description,
  price,
  currency,
  product_type,
  features,
  system_requirements,
  version,
  is_active
) VALUES (
  'Skillnavo',
  'skillnavo',
  'AI-powered technical skill roadmap platform, interactive code diagnostics, and adaptive practice engineering. Master technical skills with personalized roadmaps and continuous feedback.',
  'AI-powered technical skill roadmaps & interactive code diagnostics',
  4.99,
  'USD',
  'subscription',
  '[
    "AI-Powered Personalized Skill Roadmaps",
    "Interactive Code Diagnostics & Challenges",
    "Adaptive Practice Engineering & Streaks",
    "Full Journey Milestones & Verified Certificates",
    "Cloud Progress Sync Across All Devices",
    "Priority AI Model Inferences"
  ]'::jsonb,
  '{
    "platform": "Web Application (Cross-Platform)",
    "browsers": "Chrome, Firefox, Safari, Edge",
    "requirements": "Modern web browser with JavaScript enabled"
  }'::jsonb,
  '1.0.0',
  true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  product_type = EXCLUDED.product_type,
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- 2. Insert Pricing Plans (Starter Monthly/Annual, Pro Monthly/Annual)
-- Note: Replace placeholder paddle_price_ids with your production Paddle price IDs once created.
INSERT INTO public.pricing_plans (
  product_id,
  plan_name,
  plan_slug,
  devices,
  price_usd,
  price_inr,
  price_pkr,
  paddle_price_id_usd,
  paddle_price_id_inr,
  paddle_price_id_pkr,
  is_popular,
  features
)
SELECT
  id,
  'Starter Monthly',
  'starter_monthly',
  1,
  4.99,
  349.00,
  1399.00,
  'pri_skillnavo_starter_monthly',
  'pri_skillnavo_starter_monthly_inr',
  NULL,
  true,
  '[
    "1 Active Learning Journey",
    "50 AI Practice Queries/mo",
    "Core Skill Diagnostics",
    "Streak & Milestone Tracking",
    "Community Discord Access"
  ]'::jsonb
FROM public.products WHERE slug = 'skillnavo'
ON CONFLICT (product_id, plan_slug) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  price_usd = EXCLUDED.price_usd,
  price_inr = EXCLUDED.price_inr,
  price_pkr = EXCLUDED.price_pkr,
  paddle_price_id_usd = EXCLUDED.paddle_price_id_usd,
  paddle_price_id_inr = EXCLUDED.paddle_price_id_inr,
  is_popular = EXCLUDED.is_popular,
  features = EXCLUDED.features,
  updated_at = NOW();

INSERT INTO public.pricing_plans (
  product_id,
  plan_name,
  plan_slug,
  devices,
  price_usd,
  price_inr,
  price_pkr,
  paddle_price_id_usd,
  paddle_price_id_inr,
  paddle_price_id_pkr,
  is_popular,
  features
)
SELECT
  id,
  'Starter Annual',
  'starter_annual',
  1,
  39.99,
  2799.00,
  11199.00,
  'pri_skillnavo_starter_annual',
  'pri_skillnavo_starter_annual_inr',
  NULL,
  false,
  '[
    "Save 33% over monthly billing",
    "1 Active Learning Journey",
    "600 AI Practice Queries/yr",
    "Core Skill Diagnostics",
    "Streak & Milestone Tracking",
    "Annual Learner Badge"
  ]'::jsonb
FROM public.products WHERE slug = 'skillnavo'
ON CONFLICT (product_id, plan_slug) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  price_usd = EXCLUDED.price_usd,
  price_inr = EXCLUDED.price_inr,
  price_pkr = EXCLUDED.price_pkr,
  paddle_price_id_usd = EXCLUDED.paddle_price_id_usd,
  paddle_price_id_inr = EXCLUDED.paddle_price_id_inr,
  is_popular = EXCLUDED.is_popular,
  features = EXCLUDED.features,
  updated_at = NOW();

INSERT INTO public.pricing_plans (
  product_id,
  plan_name,
  plan_slug,
  devices,
  price_usd,
  price_inr,
  price_pkr,
  paddle_price_id_usd,
  paddle_price_id_inr,
  paddle_price_id_pkr,
  is_popular,
  features
)
SELECT
  id,
  'Pro Monthly',
  'pro_monthly',
  3,
  9.99,
  699.00,
  2799.00,
  'pri_skillnavo_pro_monthly',
  'pri_skillnavo_pro_monthly_inr',
  NULL,
  false,
  '[
    "Unlimited Active Journeys",
    "Unlimited AI Code Diagnostics",
    "Advanced Skill Trees & System Design",
    "Priority AI Response Times",
    "Verified Course Certificates",
    "Private Mentor Community"
  ]'::jsonb
FROM public.products WHERE slug = 'skillnavo'
ON CONFLICT (product_id, plan_slug) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  price_usd = EXCLUDED.price_usd,
  price_inr = EXCLUDED.price_inr,
  price_pkr = EXCLUDED.price_pkr,
  paddle_price_id_usd = EXCLUDED.paddle_price_id_usd,
  paddle_price_id_inr = EXCLUDED.paddle_price_id_inr,
  is_popular = EXCLUDED.is_popular,
  features = EXCLUDED.features,
  updated_at = NOW();

INSERT INTO public.pricing_plans (
  product_id,
  plan_name,
  plan_slug,
  devices,
  price_usd,
  price_inr,
  price_pkr,
  paddle_price_id_usd,
  paddle_price_id_inr,
  paddle_price_id_pkr,
  is_popular,
  features
)
SELECT
  id,
  'Pro Annual',
  'pro_annual',
  3,
  79.99,
  5499.00,
  21999.00,
  'pri_skillnavo_pro_annual',
  'pri_skillnavo_pro_annual_inr',
  NULL,
  false,
  '[
    "Best Value - Save 33% annually",
    "Unlimited Active Journeys",
    "Unlimited AI Code Diagnostics",
    "Advanced Skill Trees & System Design",
    "Verified Course Certificates",
    "VIP Access & Mentorship"
  ]'::jsonb
FROM public.products WHERE slug = 'skillnavo'
ON CONFLICT (product_id, plan_slug) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  price_usd = EXCLUDED.price_usd,
  price_inr = EXCLUDED.price_inr,
  price_pkr = EXCLUDED.price_pkr,
  paddle_price_id_usd = EXCLUDED.paddle_price_id_usd,
  paddle_price_id_inr = EXCLUDED.paddle_price_id_inr,
  is_popular = EXCLUDED.is_popular,
  features = EXCLUDED.features,
  updated_at = NOW();
