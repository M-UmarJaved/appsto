import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key (for admin operations)
export const getServiceSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Database Types
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  price: number
  currency: string
  product_type: 'one_time' | 'subscription'
  paddle_product_id: string
  features: string[]
  screenshots: string[]
  demo_video_url?: string
  system_requirements: {
    os: string[]
    processor: string
    memory: string
    storage: string
  }
  download_url?: string
  icon_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface License {
  id: string
  token: string
  product_id: string
  user_email: string
  is_used: boolean
  activated_at?: string
  device_info?: string
  paddle_transaction_id: string
  created_at: string
}

export interface Purchase {
  id: string
  product_id: string
  user_email: string
  user_name?: string
  amount: number
  currency: string
  paddle_transaction_id: string
  paddle_subscription_id?: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}
