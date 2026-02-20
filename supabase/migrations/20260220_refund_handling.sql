-- =====================================================
-- ADD REFUND HANDLING COLUMNS
-- Migration: 20260220_refund_handling
-- =====================================================

-- Add deactivation tracking to licenses table
ALTER TABLE public.licenses 
ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deactivation_reason TEXT;

-- Add index for faster queries on deactivated licenses
CREATE INDEX IF NOT EXISTS idx_licenses_deactivated 
ON public.licenses(deactivated_at) 
WHERE deactivated_at IS NOT NULL;

-- Add index for refunded purchases
CREATE INDEX IF NOT EXISTS idx_purchases_refunded 
ON public.purchases(refunded_at) 
WHERE refunded_at IS NOT NULL;

-- Add comment
COMMENT ON COLUMN public.licenses.deactivation_reason IS 'Reason for deactivation: refund, expired, manual, abuse';
