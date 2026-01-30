-- =====================================================
-- APPSTO PAYMENT & LICENSE SYSTEM
-- Professional Database Schema for Scalability
-- =====================================================

-- 1. PRODUCTS TABLE
-- Stores all software products available for sale
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
  download_url TEXT, -- S3/Storage URL for the software file
  version TEXT DEFAULT '1.0.0',
  file_size_mb INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRICING PLANS TABLE
-- Different pricing tiers for each product
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

-- 3. PURCHASES TABLE
-- Record of all purchases made
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

-- 4. LICENSES TABLE
-- Individual license keys generated per purchase
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
  
  -- Synced to My Softwares database
  synced_to_product_db BOOLEAN DEFAULT false,
  synced_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LICENSE ACTIVATIONS TABLE
-- Track each device that uses a license
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

-- 6. DOWNLOAD LOGS TABLE
-- Track software downloads for analytics
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

-- 7. EMAIL LOGS TABLE
-- Track all emails sent to customers
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

-- 8. COUPONS TABLE (For Testing & Promotions)
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  
  -- Discount
  discount_type TEXT NOT NULL, -- percentage, fixed_amount
  discount_value DECIMAL(10,2) NOT NULL, -- 100 for 100% off, or $10 for fixed
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
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Products
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_paddle_id ON public.products(paddle_product_id);
CREATE INDEX idx_products_active ON public.products(is_active);

-- Purchases
CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX idx_purchases_paddle_tx ON public.purchases(paddle_transaction_id);
CREATE INDEX idx_purchases_status ON public.purchases(status);
CREATE INDEX idx_purchases_created_at ON public.purchases(created_at DESC);

-- Licenses
CREATE INDEX idx_licenses_key ON public.licenses(license_key);
CREATE INDEX idx_licenses_purchase_id ON public.licenses(purchase_id);
CREATE INDEX idx_licenses_user_id ON public.licenses(user_id);
CREATE INDEX idx_licenses_is_used ON public.licenses(is_used);
CREATE INDEX idx_licenses_synced ON public.licenses(synced_to_product_db);

-- License Activations
CREATE INDEX idx_activations_license_id ON public.license_activations(license_id);
CREATE INDEX idx_activations_device_id ON public.license_activations(device_id);

-- Coupons
CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_active ON public.coupons(is_active, valid_until);

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

-- Products - Public Read
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

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON public.licenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL DATA - DeskSweep Product
-- =====================================================

-- Insert DeskSweep Product
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
  'DeskSweep',
  'desksweep',
  'The ultimate desktop cleaner and file organizer for Windows. DeskSweep automatically sorts your files with intelligent rules, scheduled cleaning, and background automation.',
  'Intelligent desktop cleaner with auto-sorting and file organization',
  9.00,
  'USD',
  'one_time',
  '["One-Click Clean", "Auto-Pilot Mode", "Scheduled Cleaning", "Smart Rules Engine", "Preview Mode", "Activity History", "System Tray Integration"]'::jsonb,
  '{"os": ["Windows 10/11 (64-bit)"], "processor": "Dual-core 2.0 GHz+", "memory": "4GB RAM", "storage": "100MB"}'::jsonb,
  '1.0.0',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Insert Pricing Plans for DeskSweep
INSERT INTO public.pricing_plans (
  product_id,
  plan_name,
  plan_slug,
  devices,
  price_usd,
  price_inr,
  price_pkr,
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
  false,
  '["1 Device License", "One-Click Clean", "Auto-Pilot Mode", "Scheduled Cleaning", "Lifetime Updates"]'::jsonb
FROM public.products WHERE slug = 'desksweep'
ON CONFLICT (product_id, plan_slug) DO NOTHING;

INSERT INTO public.pricing_plans (
  product_id,
  plan_name,
  plan_slug,
  devices,
  price_usd,
  price_inr,
  price_pkr,
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
  true,
  '["5 Device Licenses", "All Solo Features", "Priority Support", "Team Sharing"]'::jsonb
FROM public.products WHERE slug = 'desksweep'
ON CONFLICT (product_id, plan_slug) DO NOTHING;

INSERT INTO public.pricing_plans (
  product_id,
  plan_name,
  plan_slug,
  devices,
  price_usd,
  price_inr,
  price_pkr,
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
  false,
  '["20 Device Licenses", "All Squad Features", "24/7 Support", "Volume Licensing"]'::jsonb
FROM public.products WHERE slug = 'desksweep'
ON CONFLICT (product_id, plan_slug) DO NOTHING;

-- Create test coupon (100% OFF for testing)
INSERT INTO public.coupons (
  code,
  discount_type,
  discount_value,
  description,
  is_active,
  valid_until
) VALUES (
  'TEST100',
  'percentage',
  100.00,
  'Testing coupon - 100% OFF',
  true,
  NOW() + INTERVAL '1 year'
) ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant access to authenticated users
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT ON public.pricing_plans TO authenticated;
GRANT SELECT, INSERT ON public.purchases TO authenticated;
GRANT SELECT, INSERT ON public.licenses TO authenticated;
GRANT SELECT, INSERT ON public.license_activations TO authenticated;
GRANT INSERT ON public.download_logs TO authenticated;

-- Service role needs full access for webhooks
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
