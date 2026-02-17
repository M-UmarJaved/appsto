-- =====================================================
-- APPSTO PAYMENT & LICENSE SYSTEM - PRODUCTION
-- Professional Database Schema for Production Environment
-- Date: February 2026
-- =====================================================

-- =====================================================
-- 1. PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  product_type TEXT DEFAULT 'one_time', -- one_time, subscription
  paddle_product_id TEXT UNIQUE, -- Paddle's product ID
  paddle_price_ids JSONB, -- Store price IDs for different currencies
  features JSONB,
  screenshots JSONB,
  demo_video_url TEXT,
  system_requirements JSONB,
  icon_url TEXT,
  download_url TEXT, -- GitHub release or storage URL
  version TEXT DEFAULT '1.0.0',
  file_size_mb DECIMAL(10,1), -- File size in megabytes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. PRICING PLANS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL, -- 'Solo', 'Squad', 'Studio'
  plan_slug TEXT NOT NULL,
  devices INTEGER NOT NULL DEFAULT 1, -- Number of devices/licenses
  price_usd DECIMAL(10,2) NOT NULL,
  price_inr DECIMAL(10,2) NOT NULL,
  price_pkr DECIMAL(10,2) NOT NULL,
  paddle_price_id_usd TEXT,
  paddle_price_id_inr TEXT,
  paddle_price_id_pkr TEXT,
  is_popular BOOLEAN DEFAULT false,
  features JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, plan_slug)
);

-- =====================================================
-- 3. PURCHASES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  pricing_plan_id UUID REFERENCES public.pricing_plans(id) ON DELETE SET NULL,
  
  -- Paddle Data
  paddle_transaction_id TEXT UNIQUE,
  paddle_subscription_id TEXT,
  paddle_customer_id TEXT,
  
  -- Purchase Details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method TEXT,
  
  -- Customer Info
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  billing_country TEXT,
  
  -- License Info
  licenses_count INTEGER NOT NULL DEFAULT 1,
  
  -- Metadata
  metadata JSONB, -- Store additional Paddle data
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  purchased_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. LICENSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- License Details
  license_key TEXT UNIQUE NOT NULL, -- The actual token/key
  license_type TEXT DEFAULT 'standard', -- standard, trial, lifetime
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_used BOOLEAN DEFAULT false, -- Has it been activated?
  activation_count INTEGER DEFAULT 0,
  max_activations INTEGER DEFAULT 1,
  
  -- Activation Details
  activated_at TIMESTAMPTZ,
  activated_by_email TEXT,
  activated_device_info JSONB, -- Store device fingerprint
  
  -- Expiration (for subscriptions)
  expires_at TIMESTAMPTZ,
  
  -- Synced to product database
  synced_to_product_db BOOLEAN DEFAULT false,
  synced_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. LICENSE ACTIVATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.license_activations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID REFERENCES public.licenses(id) ON DELETE CASCADE,
  
  -- Device Info
  device_name TEXT,
  device_id TEXT, -- Hardware fingerprint
  os_info TEXT,
  app_version TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMPTZ,
  
  -- Timestamps
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  deactivated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. DOWNLOAD LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Download Info
  download_url TEXT,
  ip_address INET,
  user_agent TEXT,
  country TEXT,
  
  -- Timestamps
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. EMAIL LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE SET NULL,
  
  -- Email Details
  recipient_email TEXT NOT NULL,
  email_type TEXT NOT NULL, -- purchase_confirmation, license_delivery, refund_confirmation
  subject TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, sent, failed, bounced
  sent_at TIMESTAMPTZ,
  failed_reason TEXT,
  
  -- Email Service Response
  message_id TEXT,
  provider_response JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. COUPONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  
  -- Discount
  discount_type TEXT NOT NULL, -- percentage, fixed_amount
  discount_value DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Restrictions
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  min_purchase_amount DECIMAL(10,2),
  max_uses INTEGER, -- NULL = unlimited
  uses_count INTEGER DEFAULT 0,
  
  -- Validity
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  
  -- Metadata
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

-- Products
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_paddle_id ON public.products(paddle_product_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);

-- Purchases
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_paddle_tx ON public.purchases(paddle_transaction_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON public.purchases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchases_customer_email ON public.purchases(customer_email);

-- Licenses
CREATE INDEX IF NOT EXISTS idx_licenses_key ON public.licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_purchase_id ON public.licenses(purchase_id);
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON public.licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_is_used ON public.licenses(is_used);
CREATE INDEX IF NOT EXISTS idx_licenses_synced ON public.licenses(synced_to_product_db);

-- License Activations
CREATE INDEX IF NOT EXISTS idx_activations_license_id ON public.license_activations(license_id);
CREATE INDEX IF NOT EXISTS idx_activations_device_id ON public.license_activations(device_id);

-- Email Logs
CREATE INDEX IF NOT EXISTS idx_email_logs_purchase_id ON public.email_logs(purchase_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);

-- Coupons
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(is_active, valid_until);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Products - Public Read (only active products)
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (is_active = true);

-- Pricing Plans - Public Read
CREATE POLICY "Pricing plans are viewable by everyone"
  ON public.pricing_plans FOR SELECT
  USING (true);

-- Purchases - Users can view their own
CREATE POLICY "Users can view own purchases"
  ON public.purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Licenses - Users can view their own
CREATE POLICY "Users can view own licenses"
  ON public.licenses FOR SELECT
  USING (auth.uid() = user_id);

-- License Activations - Users can view their own
CREATE POLICY "Users can view own activations"
  ON public.license_activations FOR SELECT
  USING (
    license_id IN (
      SELECT id FROM public.licenses WHERE user_id = auth.uid()
    )
  );

-- Download Logs - Users can insert their own
CREATE POLICY "Users can log own downloads"
  ON public.download_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Email Logs - Only service role can access
-- (no public policy needed)

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATE
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_plans_updated_at 
  BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at 
  BEFORE UPDATE ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licenses_updated_at 
  BEFORE UPDATE ON public.licenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PRODUCTION DATA - DeskSweep
-- =====================================================

-- Insert DeskSweep Product with Production Paddle ID
INSERT INTO public.products (
  name,
  slug,
  description,
  short_description,
  price,
  currency,
  product_type,
  paddle_product_id,
  features,
  system_requirements,
  download_url,
  version,
  file_size_mb,
  is_active
) VALUES (
  'DeskSweep',
  'desksweep',
  'The ultimate desktop cleaner and file organizer for Windows. DeskSweep automatically sorts your files with intelligent rules, scheduled cleaning, and background automation. Keep your desktop clean and organized effortlessly.',
  'Intelligent desktop cleaner with auto-sorting and file organization',
  9.00,
  'USD',
  'one_time',
  'pro_01khb6caewhmc5wzgf9mgzc3bc', -- PRODUCTION PADDLE PRODUCT ID
  '["One-Click Clean", "Auto-Pilot Mode", "Scheduled Cleaning", "Smart Rules Engine", "Preview Mode", "Activity History", "System Tray Integration", "Drag & Drop Support", "Custom File Rules", "Lifetime Updates"]'::jsonb,
  '{"os": ["Windows 10/11 (64-bit)"], "processor": "Dual-core 2.0 GHz or higher", "memory": "4GB RAM minimum", "storage": "100MB available space", "additional": "Administrator rights for installation"}'::jsonb,
  'https://github.com/M-UmarJaved/DeskSweepSoftware/releases/download/DeskSwepp/DeskSweep_Setup.exe',
  '1.0.0',
  56.7,
  true
) ON CONFLICT (slug) DO UPDATE SET
  paddle_product_id = EXCLUDED.paddle_product_id,
  download_url = EXCLUDED.download_url,
  file_size_mb = EXCLUDED.file_size_mb,
  updated_at = NOW();

-- Insert Pricing Plans with Production Paddle Price IDs
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
  'Solo',
  'solo',
  1,
  9.00,
  299.00,
  2500.00,
  'pri_01khb858xxexa8chhc45gvdvwk', -- PRODUCTION PADDLE PRICE ID (USD)
  NULL, -- Add later when INR price is created in Paddle
  NULL, -- Add later when PKR price is created in Paddle
  false,
  '["1 Device License", "One-Click Desktop Clean", "Auto-Pilot Mode", "Scheduled Cleaning", "Smart Rules Engine", "Activity History", "Lifetime Updates", "Email Support"]'::jsonb
FROM public.products WHERE slug = 'desksweep'
ON CONFLICT (product_id, plan_slug) DO UPDATE SET
  paddle_price_id_usd = EXCLUDED.paddle_price_id_usd,
  price_usd = EXCLUDED.price_usd,
  price_inr = EXCLUDED.price_inr,
  price_pkr = EXCLUDED.price_pkr,
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
  'Squad',
  'squad',
  5,
  29.00,
  999.00,
  8000.00,
  'pri_01khb8e6ez5hm3afq5y39ksx4c', -- PRODUCTION PADDLE PRICE ID (USD)
  NULL, -- Add later when INR price is created in Paddle
  NULL, -- Add later when PKR price is created in Paddle
  true,
  '["5 Device Licenses", "All Solo Features", "Team Sharing", "Priority Email Support", "Commercial Use License", "Volume Licensing", "Lifetime Updates"]'::jsonb
FROM public.products WHERE slug = 'desksweep'
ON CONFLICT (product_id, plan_slug) DO UPDATE SET
  paddle_price_id_usd = EXCLUDED.paddle_price_id_usd,
  price_usd = EXCLUDED.price_usd,
  price_inr = EXCLUDED.price_inr,
  price_pkr = EXCLUDED.price_pkr,
  is_popular = EXCLUDED.is_popular,
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
  'Studio',
  'studio',
  20,
  79.00,
  2999.00,
  22000.00,
  'pri_01khb8rm4c5rs6vxw4byzyhhnw', -- PRODUCTION PADDLE PRICE ID (USD)
  NULL, -- Add later when INR price is created in Paddle
  NULL, -- Add later when PKR price is created in Paddle
  false,
  '["20 Device Licenses", "All Squad Features", "24/7 Priority Support", "Dedicated Account Manager", "Custom Licensing Terms", "Enterprise Volume Pricing", "Lifetime Updates"]'::jsonb
FROM public.products WHERE slug = 'desksweep'
ON CONFLICT (product_id, plan_slug) DO UPDATE SET
  paddle_price_id_usd = EXCLUDED.paddle_price_id_usd,
  price_usd = EXCLUDED.price_usd,
  price_inr = EXCLUDED.price_inr,
  price_pkr = EXCLUDED.price_pkr,
  updated_at = NOW();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Authenticated users - Read products/plans, write purchases/licenses
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT ON public.pricing_plans TO authenticated;
GRANT SELECT, INSERT ON public.purchases TO authenticated;
GRANT SELECT, INSERT ON public.licenses TO authenticated;
GRANT SELECT, INSERT ON public.license_activations TO authenticated;
GRANT INSERT ON public.download_logs TO authenticated;

-- Anonymous users - Read only products/plans
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.pricing_plans TO anon;

-- Service role - Full access for webhooks and background jobs
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- =====================================================
-- PRODUCTION SETUP COMPLETE
-- =====================================================
-- Next Steps:
-- 1. Run this script in your Supabase production database
-- 2. Verify all tables created successfully
-- 3. Check that production Paddle IDs are correctly set
-- 4. Update .env.production with production credentials
-- 5. Configure Paddle webhooks to point to production URL
-- 6. Test with small transaction before going live
-- =====================================================
