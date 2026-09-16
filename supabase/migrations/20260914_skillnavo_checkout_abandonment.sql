-- ========================================================================
-- MIGRATION: 20260914_skillnavo_checkout_abandonment.sql
-- TARGET DATABASE: Appsto Supabase Database (appsto.software)
-- PURPOSE: Track Skillnavo checkout attempts, abandonment, conversions,
--          and automated discount recovery email dispatch.
-- ========================================================================

CREATE TABLE IF NOT EXISTS public.skillnavo_checkout_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token TEXT NULL,
    skillnavo_user_id UUID NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT NULL,
    plan_slug TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'abandoned', 'recovered'
    paddle_price_id TEXT NULL,
    paddle_transaction_id TEXT NULL,
    paddle_subscription_id TEXT NULL,
    currency TEXT NULL DEFAULT 'USD',
    amount NUMERIC(10,2) NULL,
    country_code TEXT NULL,
    recovery_email_sent BOOLEAN DEFAULT false,
    recovery_email_sent_at TIMESTAMPTZ NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy cron lookups of unrecovered abandoned sessions
CREATE INDEX IF NOT EXISTS idx_skillnavo_checkout_abandonment 
ON public.skillnavo_checkout_sessions (status, recovery_email_sent, created_at);

-- Index for customer email lookups
CREATE INDEX IF NOT EXISTS idx_skillnavo_checkout_email 
ON public.skillnavo_checkout_sessions (customer_email, status);

-- Enable RLS
ALTER TABLE public.skillnavo_checkout_sessions ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DROP POLICY IF EXISTS "Service role full access on skillnavo_checkout_sessions" ON public.skillnavo_checkout_sessions;
CREATE POLICY "Service role full access on skillnavo_checkout_sessions" 
ON public.skillnavo_checkout_sessions 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Allow authenticated users to view their own sessions
DROP POLICY IF EXISTS "Users view own checkout sessions" ON public.skillnavo_checkout_sessions;
CREATE POLICY "Users view own checkout sessions" 
ON public.skillnavo_checkout_sessions 
FOR SELECT 
TO authenticated 
USING (customer_email = auth.jwt() ->> 'email');
