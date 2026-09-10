-- =====================================================
-- SKILLNAVO PRODUCTION PADDLE PRODUCT & PRICING SEED
-- Date: September 2026
-- Product ID: pro_01m2524ck45ckjmnh6yam91w01
-- =====================================================

-- 1. Insert or Update Skillnavo in public.products
INSERT INTO public.products (
  name,
  slug,
  description,
  short_description,
  price,
  currency,
  product_type,
  paddle_product_id,
  paddle_price_ids,
  features,
  system_requirements,
  icon_url,
  screenshots,
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
  'pro_01m2524ck45ckjmnh6yam91w01',
  '{
    "starter_monthly": "pri_01m252y0prb2nrjmay8ecgc1q0",
    "starter_annual": "pri_01m2531e1n85b5hx6zfmphp1rz",
    "pro_monthly": "pri_01m2535m78g4tpvj5bwzvnbhhh",
    "pro_annual": "pri_01m2538wa1msvncrk76528d433"
  }'::jsonb,
  '[
    "1 active learning path or unlimited with Pro",
    "Interactive Code Diagnostics & Practice Quizzes",
    "Personalized AI-Powered Skill Roadmaps",
    "Progress Tracking, Streaks & Checkpoints",
    "Verifiable Course Completion Certificates",
    "Continuous Priority Content Updates"
  ]'::jsonb,
  '{
    "platform": "Web Application (Cross-Platform)",
    "browsers": "Chrome, Firefox, Safari, Edge",
    "requirements": "Modern web browser with JavaScript enabled"
  }'::jsonb,
  '/Skillnavo/SkillnavoIcon.png',
  '["/Skillnavo/Skillnavo.png"]'::jsonb,
  '1.0.0',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  product_type = EXCLUDED.product_type,
  paddle_product_id = EXCLUDED.paddle_product_id,
  paddle_price_ids = EXCLUDED.paddle_price_ids,
  features = EXCLUDED.features,
  icon_url = EXCLUDED.icon_url,
  screenshots = EXCLUDED.screenshots,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- 2. Insert or Update Free Plan
INSERT INTO public.pricing_plans (
  product_id,
  plan_name,
  plan_slug,
  devices,
  price_usd,
  price_inr,
  price_pkr,
  paddle_price_id_usd,
  is_popular,
  features
)
SELECT
  id,
  'Free',
  'free',
  1,
  0.00,
  0.00,
  0.00,
  NULL,
  false,
  '[
    "1 active learning path",
    "25 AI credits / month",
    "Up to 2 AI roadmaps or 5 practice quizzes",
    "3 AI chat messages / day",
    "Full curated content library",
    "Progress tracking, streaks & checkpoints",
    "Certificate of completion"
  ]'::jsonb
FROM public.products WHERE slug = 'skillnavo'
ON CONFLICT (product_id, plan_slug) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  price_usd = EXCLUDED.price_usd,
  price_inr = EXCLUDED.price_inr,
  price_pkr = EXCLUDED.price_pkr,
  paddle_price_id_usd = EXCLUDED.paddle_price_id_usd,
  is_popular = EXCLUDED.is_popular,
  features = EXCLUDED.features,
  updated_at = NOW();

-- 3. Insert or Update Starter Monthly Plan
INSERT INTO public.pricing_plans (
  product_id,
  plan_name,
  plan_slug,
  devices,
  price_usd,
  price_inr,
  price_pkr,
  paddle_price_id_usd,
  is_popular,
  features
)
SELECT
  id,
  'Starter',
  'starter_monthly',
  1,
  4.99,
  399.00,
  1399.00,
  'pri_01m252y0prb2nrjmay8ecgc1q0',
  true,
  '[
    "3 active learning paths",
    "300 AI credits / month",
    "Up to 30 AI roadmaps or 60 practice quizzes",
    "15 AI chat messages / day",
    "Personalized roadmap engine",
    "Weekly progress reports",
    "Certificate of completion",
    "Priority content updates"
  ]'::jsonb
FROM public.products WHERE slug = 'skillnavo'
ON CONFLICT (product_id, plan_slug) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  price_usd = EXCLUDED.price_usd,
  price_inr = EXCLUDED.price_inr,
  price_pkr = EXCLUDED.price_pkr,
  paddle_price_id_usd = EXCLUDED.paddle_price_id_usd,
  is_popular = EXCLUDED.is_popular,
  features = EXCLUDED.features,
  updated_at = NOW();

-- 4. Insert or Update Starter Annual Plan
INSERT INTO public.pricing_plans (
  product_id,
  plan_name,
  plan_slug,
  devices,
  price_usd,
  price_inr,
  price_pkr,
  paddle_price_id_usd,
  is_popular,
  features
)
SELECT
  id,
  'Starter Annual',
  'starter_annual',
  1,
  39.99,
  3999.00,
  11199.00,
  'pri_01m2531e1n85b5hx6zfmphp1rz',
  false,
  '[
    "3 active learning paths",
    "300 AI credits / month",
    "Up to 30 AI roadmaps or 60 practice quizzes",
    "15 AI chat messages / day",
    "Personalized roadmap engine",
    "Weekly progress reports",
    "Certificate of completion",
    "Priority content updates"
  ]'::jsonb
FROM public.products WHERE slug = 'skillnavo'
ON CONFLICT (product_id, plan_slug) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  price_usd = EXCLUDED.price_usd,
  price_inr = EXCLUDED.price_inr,
  price_pkr = EXCLUDED.price_pkr,
  paddle_price_id_usd = EXCLUDED.paddle_price_id_usd,
  is_popular = EXCLUDED.is_popular,
  features = EXCLUDED.features,
  updated_at = NOW();

-- 5. Insert or Update Pro Monthly Plan
INSERT INTO public.pricing_plans (
  product_id,
  plan_name,
  plan_slug,
  devices,
  price_usd,
  price_inr,
  price_pkr,
  paddle_price_id_usd,
  is_popular,
  features
)
SELECT
  id,
  'Pro',
  'pro_monthly',
  3,
  9.99,
  699.00,
  2799.00,
  'pri_01m2535m78g4tpvj5bwzvnbhhh',
  false,
  '[
    "Unlimited active learning paths",
    "1,200 AI credits / month",
    "Up to 120 AI roadmaps or 240 practice quizzes",
    "AI learning assistant (50 msgs/day)",
    "Advanced AI models for complex questions",
    "Detailed skill progress breakdown",
    "Verifiable certificates with share link",
    "Full analytics dashboard",
    "Priority support"
  ]'::jsonb
FROM public.products WHERE slug = 'skillnavo'
ON CONFLICT (product_id, plan_slug) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  price_usd = EXCLUDED.price_usd,
  price_inr = EXCLUDED.price_inr,
  price_pkr = EXCLUDED.price_pkr,
  paddle_price_id_usd = EXCLUDED.paddle_price_id_usd,
  is_popular = EXCLUDED.is_popular,
  features = EXCLUDED.features,
  updated_at = NOW();

-- 6. Insert or Update Pro Annual Plan
INSERT INTO public.pricing_plans (
  product_id,
  plan_name,
  plan_slug,
  devices,
  price_usd,
  price_inr,
  price_pkr,
  paddle_price_id_usd,
  is_popular,
  features
)
SELECT
  id,
  'Pro Annual',
  'pro_annual',
  3,
  79.99,
  6999.00,
  21999.00,
  'pri_01m2538wa1msvncrk76528d433',
  false,
  '[
    "Unlimited active learning paths",
    "1,200 AI credits / month",
    "Up to 120 AI roadmaps or 240 practice quizzes",
    "AI learning assistant (50 msgs/day)",
    "Advanced AI models for complex questions",
    "Detailed skill progress breakdown",
    "Verifiable certificates with share link",
    "Full analytics dashboard",
    "Priority support"
  ]'::jsonb
FROM public.products WHERE slug = 'skillnavo'
ON CONFLICT (product_id, plan_slug) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  price_usd = EXCLUDED.price_usd,
  price_inr = EXCLUDED.price_inr,
  price_pkr = EXCLUDED.price_pkr,
  paddle_price_id_usd = EXCLUDED.paddle_price_id_usd,
  is_popular = EXCLUDED.is_popular,
  features = EXCLUDED.features,
  updated_at = NOW();
