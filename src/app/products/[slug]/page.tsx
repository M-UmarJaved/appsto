'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Script from 'next/script'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { supabase, type Product } from '@/lib/supabase'
import { useCurrency } from '@/components/ui/CurrencySwitcher'
import { DESKSWEEP_PRICING, formatPrice } from '@/lib/currency'
import { getRegionalReviews, formatReviewText } from '@/lib/reviews'
import { useAuth } from '@/contexts/AuthContext'
import { fetchPaddlePrices } from '@/lib/paddle-api'
import {
  Package,
  Download,
  Shield,
  CheckCircle,
  ArrowLeft,
  Star,
  Zap,
  Clock,
  FileText,
  Sparkles,
  FolderSync,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Declare Paddle types
declare global {
  interface Window {
    Paddle?: any
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [pricingPlans, setPricingPlans] = useState<any[]>([])
  const [paddlePrices, setPaddlePrices] = useState<Map<string, any>>(new Map())
  const [fetchingPrices, setFetchingPrices] = useState(false)
  const [paddleReady, setPaddleReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const { currency, isLoading: currencyLoading } = useCurrency()
  const regionalReviews = getRegionalReviews(currency)
  const { user } = useAuth()

  // Load product and pricing on mount
  useEffect(() => {
    console.log('🔄 useEffect: Loading product and pricing plans')
    loadProduct()
    loadPricingPlans()
  }, [params.slug])

  // Initialize Paddle when component mounts
  useEffect(() => {
    console.log('🎯 Checking for Paddle.js...')
    let attempts = 0
    const maxAttempts = 50 // 5 seconds
    
    const checkPaddle = setInterval(() => {
      attempts++
      console.log(`🔍 Attempt ${attempts}: Checking for window.Paddle...`)
      
      if (window.Paddle) {
        clearInterval(checkPaddle)
        console.log('✅ Paddle.js found! Initializing...')
        initializePaddle()
      } else if (attempts >= maxAttempts) {
        clearInterval(checkPaddle)
        console.error('❌ Paddle.js failed to load after 5 seconds')
      }
    }, 100)

    return () => clearInterval(checkPaddle)
  }, [])

  // Fetch Paddle prices when Paddle is ready and pricing plans are loaded
  useEffect(() => {
    console.log('🔄 useEffect: Paddle ready?', paddleReady, 'Plans loaded?', pricingPlans.length)
    if (paddleReady && pricingPlans.length > 0 && !fetchingPrices) {
      console.log('✅ Conditions met, fetching Paddle prices...')
      fetchPaddlePricesForPlans()
    }
  }, [paddleReady, pricingPlans])

  function initializePaddle() {
    console.log('🚀 initializePaddle called!')
    
    if (typeof window === 'undefined' || !window.Paddle) {
      console.error('❌ Paddle not available')
      return
    }

    try {
      console.log('🚀 Initializing Paddle Billing v2...')
      
      const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
      if (!token) {
        console.error('❌ NEXT_PUBLIC_PADDLE_CLIENT_TOKEN not set')
        return
      }

      console.log('🔑 Using client token:', token)
      
      // Initialize Paddle Billing with client-side token + Custom Theme
      window.Paddle.Initialize({
        token: token,
        
        // 🎨 OVERLAY CHECKOUT SETTINGS (Limited Customization - Only theme & basic settings)
        // ⚠️ Note: Overlay checkouts CANNOT customize button colors, fonts, or detailed styling
        // For full branding control, need inline checkout + Paddle Dashboard brand settings
        checkout: {
          settings: {
            displayMode: 'overlay', // Keeps overlay (better UX than inline for SaaS)
            variant: 'one-page', // ✅ Single-page checkout (better conversion than multi-page)
            theme: 'light', // Can be 'dark' or 'light' only
            locale: 'en', // Auto-detect: navigator.language if not set
            allowLogout: false, // ✅ Prevent email changes (reduce friction)
            showAddDiscounts: true, // ✅ Allow discount codes
            showAddTaxId: false, // Hide tax number for B2C focus
            successUrl: `${window.location.origin}/purchase/success`,
          }
        },
        
        // 🎨 CUSTOM PWA APPEARANCE (Paddle Billing v2)
        pwCustomer: {
          enableCheckoutTheme: true,
        },
        
        eventCallback: function(event: any) {
          console.log('🎯 Paddle event:', event.name, event)
          
          // Handle checkout events
          if (event.name === 'checkout.closed') {
            setPurchasing(false)
          } else if (event.name === 'checkout.error') {
            console.error('Checkout error:', event)
            setPurchasing(false)
          } else if (event.name === 'checkout.completed') {
            console.log('🎉 Purchase completed!', event)
            // Optional: Track conversion
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'purchase', {
                transaction_id: event.data?.id,
                value: event.data?.amount,
                currency: event.data?.currency
              })
            }
          } else if (event.name === 'checkout.loaded') {
            console.log('✅ Paddle checkout loaded successfully')
          }
        }
      })

      // Set environment to sandbox
      if (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'sandbox') {
        window.Paddle.Environment.set('sandbox')
        console.log('✅ Paddle initialized in SANDBOX mode')
      } else {
        console.log('✅ Paddle initialized in PRODUCTION mode')
      }

      setPaddleReady(true)
    } catch (error) {
      console.error('❌ Paddle initialization error:', error)
    }
  }

  async function loadProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', params.slug)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error loading product:', error)
        setProduct(null)
      } else {
        setProduct(data)
      }
    } catch (err) {
      console.error('Error:', err)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  async function loadPricingPlans() {
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('price_usd', { ascending: true })

      if (error) {
        console.error('Error loading pricing plans:', error)
      } else {
        console.log('Loaded pricing plans:', data)
        setPricingPlans(data || [])
      }
    } catch (err) {
      console.error('Error loading pricing plans:', err)
    }
  }

  /**
   * Fetch live prices from Paddle API
   * This gets the exact price customer will pay including regional overrides
   */
  async function fetchPaddlePricesForPlans() {
    if (fetchingPrices) return
    
    setFetchingPrices(true)
    console.log('💰 Fetching live prices from Paddle...')
    console.log('💱 Current currency:', currency)
    
    try {
      // Get all Paddle price IDs from pricing plans
      // Each price ID has regional pricing configured in Paddle
      const priceIds = pricingPlans
        .map(plan => plan.paddle_price_id_usd) // Single price ID with regional pricing
        .filter(Boolean)
      
      if (priceIds.length === 0) {
        console.warn('⚠️ No Paddle price IDs found in database')
        return
      }
      
      // Fetch prices from Paddle (includes regional overrides)
      // DON'T pass currency - let Paddle auto-detect based on customer's IP location
      const prices = await fetchPaddlePrices(priceIds)
      
      if (prices.size > 0) {
        console.log('✅ Paddle prices fetched successfully:', prices)
        setPaddlePrices(prices)
      } else {
        console.log('ℹ️ Using fallback database prices')
      }
      
    } catch (error) {
      console.error('❌ Error fetching Paddle prices:', error)
      console.log('ℹ️ Falling back to database prices')
    } finally {
      setFetchingPrices(false)
    }
  }

  async function handlePurchase(planSlug: string) {
    if (!product) return

    // Check if Paddle is ready
    if (!paddleReady) {
      alert('Payment system is still loading. Please wait a moment and try again.')
      return
    }

    // ✅ GUEST CHECKOUT ENABLED - No sign-in required!
    // Users can purchase with or without an account
    // If signed in: Better experience with saved payment methods and dashboard access
    // If guest: Simple checkout, license keys sent via email

    // Find the selected pricing plan
    const selectedPlan = pricingPlans.find(p => p.plan_slug === planSlug)
    if (!selectedPlan) {
      console.error('❌ Pricing plan not found:', planSlug)
      alert('Please select a pricing plan')
      return
    }

    // Get Paddle price ID (single ID with regional pricing configured in Paddle)
    const paddlePriceId = selectedPlan.paddle_price_id_usd

    if (!paddlePriceId) {
      console.error('❌ No Paddle price ID found for plan:', selectedPlan)
      alert('Pricing configuration error. Please contact support.')
      return
    }

    console.log('🌍 Paddle will auto-detect region and apply price overrides')

    console.log('🚀 Opening Paddle checkout:', {
      priceId: paddlePriceId,
      plan: selectedPlan.plan_name,
      email: user?.email || 'Guest (Paddle will prompt)',
      currency,
      guestCheckout: !user
    })

    setPurchasing(true)

    try {
      // 💳 Check if customer has saved payment methods (only for authenticated users)
      let customerAuthToken = null
      
      if (user) {
        // Only check for saved payment methods if user is signed in
        try {
          // Fetch customer's Paddle customer ID from our database
          const { data: purchases } = await supabase
            .from('purchases')
            .select('paddle_customer_id')
            .eq('user_id', user.id)
            .not('paddle_customer_id', 'is', null)
            .limit(1)
            .single()

          if (purchases?.paddle_customer_id) {
            console.log('♻️ Returning customer detected, fetching saved payment methods...')
            
            // Generate customer authentication token for saved payment methods
            const tokenResponse = await fetch('/api/paddle/customer-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ customerId: purchases.paddle_customer_id })
            })

            if (tokenResponse.ok) {
              const { customerAuthToken: token } = await tokenResponse.json()
              customerAuthToken = token
              console.log('✅ Customer auth token generated - saved payment methods enabled')
            } else {
              console.warn('⚠️ Failed to generate customer token, proceeding without saved methods')
            }
          } else {
            console.log('👤 Signed-in user, first purchase - no saved payment methods')
          }
        } catch (error) {
          console.warn('⚠️ Could not check for saved payment methods:', error)
          // Continue without saved payment methods
        }
      } else {
        console.log('👤 Guest checkout - Paddle will prompt for email')
      }

      // Build checkout configuration
      const checkoutConfig: any = {
        items: [
          {
            priceId: paddlePriceId,
            quantity: 1  // ✅ LOCKED TO 1 - Users choose plan (Solo/Squad/Studio), not quantity
          }
        ],
        // ✅ Prefill email if user is signed in, otherwise Paddle will prompt
        customer: user ? {
          email: user.email || ''
        } : undefined,
        settings: {
          // 🎨 OVERLAY CHECKOUT (Recommended for SaaS)
          // Note: Overlay checkouts do NOT support frameTarget/frameStyle - those are for inline only
          displayMode: 'overlay', // Opens as modal overlay
          variant: 'one-page', // Single-page checkout (better conversion)
          theme: 'light', // 'light' or 'dark' only
          locale: 'en',
          successUrl: `${window.location.origin}/purchase/success?product=${product.slug}&plan=${planSlug}`,
          allowLogout: false, // Prevent email changes mid-checkout (reduce friction)
          
          // 🎯 CONVERSION OPTIMIZATION
          showAddTaxId: false, // Hide tax ID field (B2C focus)
          showAddDiscounts: true, // ✅ Allow coupon codes (TEST100, LAUNCH50, etc.)
        },
        // ✅ Include user_id only if user is signed in
        customData: {
          product_slug: product.slug,
          plan_slug: planSlug,
          ...(user && { user_id: user.id }) // Only add user_id for authenticated users
        }
      }

      // 💳 Add customer auth token for saved payment methods (if available)
      if (customerAuthToken) {
        checkoutConfig.customerAuthToken = customerAuthToken
        console.log('💳 Saved payment methods will be available at checkout')
      }

      // Open Paddle Checkout
      // @ts-ignore
      window.Paddle.Checkout.open(checkoutConfig)
      
      console.log('✅ Overlay checkout opened successfully')
      
    } catch (error) {
      console.error('❌ Checkout error:', error)
      alert('Failed to open checkout. Please try again or contact support.')
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#3B82F6]" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] flex items-center justify-center">
        <div className="text-center">
          <Package className="w-20 h-20 text-[#9CA3AF] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-2">Product not found</h2>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Load Paddle.js v2 directly */}
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="afterInteractive"
        onLoad={() => console.log('📦 Paddle.js script tag loaded')}
        onError={() => console.error('❌ Failed to load Paddle.js script')}
      />

      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link
          href="/products"
          className="inline-flex items-center text-[#3B82F6] hover:text-[#2563EB] mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        {/* Hero Section - Image and Description */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] rounded-2xl overflow-hidden shadow-2xl min-h-[500px] relative">
              <Image
                src="/DeskSweep/DeskSweepProductPage.png"
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Right Column - Description Aligned with Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center space-y-6"
          >
            {/* Badges */}
            <div className="flex items-center gap-2">
              <Badge 
                variant="success"
                className="text-base font-semibold"
              >
                💎 One-Time Purchase
              </Badge>
              <div className="bg-gradient-to-r from-[#F59E0B] to-[#EAB308] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                LIFETIME ACCESS
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-[#0B1220] dark:text-[#E5E7EB]">{product.name}</h1>
            
            {/* Description */}
            <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
                ))}
              </div>
              <span className="text-[#6B7280] dark:text-[#9CA3AF] font-medium">4.8 (234 reviews)</span>
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">14-day guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-[#3B82F6]" />
                <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Instant delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Lifetime updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Works offline</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pricing Section - Horizontal Cards */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF]">
              One-time payment. Lifetime access. No subscriptions.
            </p>
          </div>

          {/* 🎯 CONVERSION OPTIMIZATION - Trust Signals */}
          <div className="max-w-4xl mx-auto mb-12 space-y-6">
            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex justify-center items-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <p className="text-lg font-semibold text-[#0B1220] dark:text-[#E5E7EB]">
                4.8/5 from 234+ happy customers
              </p>
            </motion.div>

            {/* Money-Back Guarantee */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-4 bg-[#ECFDF5] dark:bg-[#064E3B]/20 border border-[#10B981]/30 rounded-xl p-4 max-w-md">
                <Shield className="w-10 h-10 text-[#10B981] flex-shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-[#0B1220] dark:text-[#E5E7EB]">14-Day Money-Back Guarantee</p>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Try risk-free. Full refund if not satisfied.</p>
                </div>
              </div>
            </motion.div>

            {/* What You Get */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] dark:from-[#1E3A8A]/20 dark:to-[#1E40AF]/20 border border-[#3B82F6]/20 rounded-xl p-6"
            >
              <h3 className="font-bold text-[#1E40AF] dark:text-[#60A5FA] mb-3 text-center">
                What Happens After You Buy?
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0B1220] dark:text-[#E5E7EB]">Instant Delivery</p>
                    <p className="text-[#6B7280] dark:text-[#9CA3AF]">License key via email in 2 minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0B1220] dark:text-[#E5E7EB]">Download Link</p>
                    <p className="text-[#6B7280] dark:text-[#9CA3AF]">Get the installer immediately</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0B1220] dark:text-[#E5E7EB]">Lifetime Updates</p>
                    <p className="text-[#6B7280] dark:text-[#9CA3AF]">Works 100% offline after activation</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-4 flex-wrap text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-[#10B981]" />
                  <span>SSL Encrypted</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-[#3B82F6]" />
                  <span>Secure Payment via Paddle</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-[#F59E0B]" />
                  <span>Instant License Delivery</span>
                </div>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-2">
                Payments processed by Paddle (Authorized Reseller) • Your card details never touch our servers
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => {
              const isPopular = plan.is_popular
              
              // Get matching plan from DESKSWEEP_PRICING for features
              const pricingPlanData = DESKSWEEP_PRICING.find(p => p.id === plan.plan_slug)
              
              // Get Paddle price ID (single ID, Paddle handles regional pricing)
              const currentPriceId = plan.paddle_price_id_usd
              
              // Get live price from Paddle (includes regional pricing)
              const paddlePrice = paddlePrices.get(currentPriceId)
              let formattedPrice: string
              
              if (paddlePrice) {
                // Use live Paddle price (includes regional overrides!)
                formattedPrice = paddlePrice.formattedPrice
              } else {
                // Fallback message while loading
                formattedPrice = 'Loading...'
              }
              
              // COMMENTED OUT DATABASE FALLBACK:
              // else {
              //   if (currency === 'PKR') {
              //     displayPrice = plan.price_pkr
              //     displayCurrency = 'PKR'
              //   } else if (currency === 'INR') {
              //     displayPrice = plan.price_inr
              //     displayCurrency = 'INR'
              //   } else {
              //     displayPrice = plan.price_usd
              //     displayCurrency = 'USD'
              //   }
              //   formattedPrice = formatPrice(displayPrice, displayCurrency as any)
              //   console.log(`💾 Using database price for ${plan.plan_slug}:`, formattedPrice)
              // }
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)' }}
                  className={`relative ${
                    isPopular 
                      ? 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-2xl scale-105' 
                      : 'bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937]'
                  } rounded-2xl p-8`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#F59E0B] text-white px-4 py-1.5 text-sm font-bold shadow-lg">
                        MOST POPULAR
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-[#0B1220] dark:text-[#E5E7EB]'}`}>
                      {plan.plan_name}
                    </h3>
                    <p className={`text-sm ${isPopular ? 'text-white/80' : 'text-[#6B7280] dark:text-[#9CA3AF]'}`}>
                      {plan.devices} Device{plan.devices > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-4xl font-bold ${isPopular ? 'text-white' : 'text-[#3B82F6]'}`}>
                        {fetchingPrices ? '...' : formattedPrice}
                      </span>
                    </div>
                    <p className={`text-sm mt-2 ${isPopular ? 'text-white/70' : 'text-[#9CA3AF]'}`}>
                      one-time payment • lifetime access
                    </p>
                  </div>

                  <Button
                    className={`w-full mb-6 ${
                      isPopular
                        ? 'bg-white text-[#3B82F6] hover:bg-[#F9FAFB]'
                        : 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white hover:from-[#2563EB] hover:to-[#1D4ED8]'
                    }`}
                    onClick={() => handlePurchase(plan.plan_slug)}
                    isLoading={purchasing}
                    disabled={!paddleReady || fetchingPrices}
                  >
                    {purchasing ? 'Processing...' : 'Buy Now'}
                  </Button>

                  <div className="space-y-3">
                    {pricingPlanData?.features && pricingPlanData.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isPopular ? 'text-white' : 'text-[#10B981]'}`} />
                        <span className={`text-sm ${isPopular ? 'text-white/90' : 'text-[#6B7280] dark:text-[#9CA3AF]'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Customer Reviews - Infinite Scroll */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20 overflow-hidden"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-4">
              Loved by Thousands
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF]">
              See what our customers are saying about DeskSweep
            </p>
          </div>

          <div className="relative">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F9FAFB] dark:from-[#0B1220] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F9FAFB] dark:from-[#0B1220] to-transparent z-10" />

            {/* Scrolling Reviews Container */}
            <motion.div
              className="flex gap-6"
              animate={{
                x: [0, -2400],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
              whileHover={{ animationPlayState: "paused" }}
            >
              {[...Array(2)].map((_, setIndex: number) => (
                <div key={setIndex} className="flex gap-6 flex-shrink-0">
                  {regionalReviews.map((review: any, idx: number) => (
                    <motion.div
                      key={`${setIndex}-${idx}`}
                      whileHover={{ scale: 1.02, animationPlayState: "paused" }}
                      className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#1F2937] w-[400px] flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex gap-1 mb-4">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                        ))}
                      </div>
                      <p className="text-[#0B1220] dark:text-[#E5E7EB] mb-6 leading-relaxed">
                        &ldquo;{formatReviewText(review, currency)}&rdquo;
                      </p>
                      <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#1F2937]">
                        <p className="text-[#0B1220] dark:text-[#E5E7EB] font-semibold">{review.name}</p>
                        <p className="text-[#9CA3AF] text-sm">{review.title}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section - Horizontal Layout */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF]">
              Everything you need to keep your desktop organized
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-[#3B82F6]" />,
                title: 'One-Click Clean',
                description: 'Instantly scan your desktop and solve chaos in seconds. No manual sorting required.'
              },
              {
                icon: <Zap className="w-8 h-8 text-[#F59E0B]" />,
                title: 'Auto-Pilot Mode',
                description: 'File Watcher runs silently in the background, organizing files the second they are downloaded.'
              },
              {
                icon: <Clock className="w-8 h-8 text-[#10B981]" />,
                title: 'Daily Clean-up',
                description: 'Schedule automated organization that safely moves files to specific folders based on your rules. No files are ever permanently deleted—they are simply sorted to keep your workspace clutter-free.'
              },
              {
                icon: <FolderSync className="w-8 h-8 text-[#8B5CF6]" />,
                title: 'Smart Rules Engine',
                description: 'Sort by file type, name, size, or date. Create powerful rules like "Move .jpg to Images" or "Archive files older than 30 days."'
              },
              {
                icon: <Shield className="w-8 h-8 text-[#06B6D4]" />,
                title: 'Preview & Safety',
                description: 'See exactly what will happen before it happens. Files are moved, never deleted. Complete activity history included.'
              },
              {
                icon: <FileText className="w-8 h-8 text-[#EF4444]" />,
                title: 'System Integration',
                description: 'Tray agent keeps taskbar clean. Auto-startup with Windows. Optimized .NET 8 performance with low memory usage.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)' }}
                className="bg-white dark:bg-[#111827] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#1F2937] hover:border-[#3B82F6] dark:hover:border-[#3B82F6] transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
    </>
  )
}
