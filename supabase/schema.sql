-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  product_type TEXT NOT NULL CHECK (product_type IN ('one_time', 'subscription')),
  paddle_product_id TEXT UNIQUE NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  screenshots JSONB DEFAULT '[]',
  demo_video_url TEXT,
  system_requirements JSONB NOT NULL,
  download_url TEXT,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Licenses Table (for one-time purchases)
-- Enhanced with product_id, user_email, and used_at for security and lifecycle tracking
CREATE TABLE licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  activated_at TIMESTAMP WITH TIME ZONE,
  device_info JSONB,
  paddle_transaction_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints for secure one-time activation
  CONSTRAINT check_used_consistency CHECK (
    (is_used = false AND used_at IS NULL AND activated_at IS NULL) OR
    (is_used = true AND used_at IS NOT NULL)
  )
);

-- Purchases Table (transaction history)
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  paddle_transaction_id TEXT UNIQUE NOT NULL,
  paddle_subscription_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_licenses_token ON licenses(token);
CREATE INDEX idx_licenses_email ON licenses(user_email);
CREATE INDEX idx_licenses_product ON licenses(product_id);
CREATE INDEX idx_licenses_paddle_tx ON licenses(paddle_transaction_id);
CREATE INDEX idx_purchases_email ON purchases(user_email);
CREATE INDEX idx_purchases_product ON purchases(product_id);
CREATE INDEX idx_purchases_paddle_tx ON purchases(paddle_transaction_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to products table
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional but recommended)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Policies (adjust based on your auth requirements)
-- Public read access to active products
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Service role has full access
CREATE POLICY "Service role has full access to licenses"
  ON licenses FOR ALL
  USING (true);

CREATE POLICY "Service role has full access to purchases"
  ON purchases FOR ALL
  USING (true);

-- Insert sample products (optional for testing)
INSERT INTO products (
  name, 
  slug, 
  description, 
  short_description, 
  price, 
  currency, 
  product_type, 
  paddle_product_id,
  features,
  system_requirements
) VALUES (
  'ProEdit Studio',
  'proedit-studio',
  'Professional video editing software with advanced AI-powered features for content creators, filmmakers, and video professionals.',
  'Professional video editing with AI-powered tools',
  149.99,
  'USD',
  'one_time',
  'pro_proedit123',
  '["AI-powered video editing", "4K/8K export support", "Unlimited projects", "Advanced color grading", "Motion graphics tools"]',
  '{"os": ["Windows 10/11", "macOS 11+"], "processor": "Intel i5 or equivalent", "memory": "8GB RAM", "storage": "2GB available space"}'
);
