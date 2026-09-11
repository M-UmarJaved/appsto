'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Script from 'next/script'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  RefreshCw, 
  CreditCard, 
  Zap,
  Check
} from 'lucide-react'

declare global {
  interface Window {
    Paddle?: any
  }
}

interface VerifiedSession {
  email: string
  plan: string
  priceId: string
  paddle_price_id?: string
  skillnavo_user_id: string
  return_to?: string
}

interface LivePricingPlan {
  id: string
  name: string
  price: number
  currency: string
  formatted_price: string
  period_suffix?: string
  billing_period: string
  savings?: string
  features: string[]
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const sessionToken = searchParams.get('session')
  
  const [error, setError] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<VerifiedSession | null>(null)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isPaddleLoading, setIsPaddleLoading] = useState(true)
  const [isLaunchingOverlay, setIsLaunchingOverlay] = useState(false)
  const [livePlanData, setLivePlanData] = useState<LivePricingPlan | null>(null)
  const [currencySymbol, setCurrencySymbol] = useState('$')
  const [regionName, setRegionName] = useState('Global (USD)')

  const paddleInitializedRef = useRef(false)

  const isPro = sessionData?.plan.toLowerCase().includes('pro') || false
  const isAnnual = sessionData?.plan.toLowerCase().includes('annual') || false

  // 1. Authenticate Session Token & Fetch Live Pricing in parallel
  useEffect(() => {
    if (!sessionToken) {
      setError('Missing checkout session token. Please initiate checkout from Skillnavo.')
      setIsVerifying(false)
      return
    }

    let isMounted = true

    async function initCheckout() {
      try {
        setIsVerifying(true)

        // Authenticate session token on Appsto server & fetch live pricing
        const [validateRes, pricingRes] = await Promise.all([
          fetch('/api/billing/validate-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionToken }),
          }),
          fetch('/api/pricing/skillnavo').catch(() => null)
        ])

        const validateData = await validateRes.json()

        if (!validateRes.ok || !validateData.valid) {
          throw new Error(validateData.error || 'Failed to authenticate checkout session.')
        }

        if (!isMounted) return

        const planKey = validateData.plan
        setSessionData({
          email: validateData.email,
          plan: planKey,
          priceId: validateData.paddle_price_id || validateData.priceId,
          paddle_price_id: validateData.paddle_price_id || validateData.priceId,
          skillnavo_user_id: validateData.skillnavo_user_id,
          return_to: validateData.return_to || '/dashboard',
        })

        // Process live pricing if available
        if (pricingRes && pricingRes.ok) {
          const pricingJson = await pricingRes.json()
          if (pricingJson.success && pricingJson.plans) {
            const matchedPlan = pricingJson.plans[planKey]
            if (matchedPlan) {
              setLivePlanData(matchedPlan)
            }
            if (pricingJson.region) {
              setCurrencySymbol(pricingJson.region.symbol || '$')
              setRegionName(pricingJson.region.tier_name || 'Global')
            }
          }
        }

        setIsVerifying(false)
      } catch (err: any) {
        console.error('[SkillnavoCheckout] Verification error:', err)
        if (isMounted) {
          setError(err.message || 'An unexpected error occurred verifying your session.')
          setIsVerifying(false)
        }
      }
    }

    initCheckout()

    return () => {
      isMounted = false
    }
  }, [sessionToken])

  // 2. Launch Inline Paddle Checkout directly into our card container
  const openInlinePaddle = async () => {
    if (!sessionData) return
    setIsPaddleLoading(true)

    try {
      // Poll until window.Paddle is loaded
      let attempts = 0
      while (attempts < 60 && (!window.Paddle || typeof window.Paddle.Checkout === 'undefined')) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        attempts++
      }

      if (!window.Paddle) {
        throw new Error('Paddle payment gateway is taking longer than usual to load. Please refresh.')
      }

      // Ensure target DOM container exists
      let containerAttempts = 0
      while (containerAttempts < 30 && !document.getElementById('paddle-checkout-container')) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        containerAttempts++
      }

      const paddle = window.Paddle
      const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN

      if (clientToken && !paddleInitializedRef.current) {
        paddle.Initialize({
          token: clientToken,
          eventCallback: function (event: any) {
            if (event.name === 'checkout.loaded') {
              setIsPaddleLoading(false)
            } else if (event.name === 'checkout.error') {
              console.error('Paddle inline error:', event)
              setIsPaddleLoading(false)
            } else if (event.name === 'checkout.closed') {
              setIsPaddleLoading(false)
            }
          },
        })

        if (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'sandbox') {
          paddle.Environment?.set('sandbox')
        }

        paddleInitializedRef.current = true
      }

      const returnPath = sessionData.return_to || '/dashboard'
      const successUrl = `https://appsto.software/skillnavo/payment-success?session=${encodeURIComponent(sessionToken || '')}`

      // Launch INLINE checkout inside our styled HTML frame target
      paddle.Checkout.open({
        settings: {
          displayMode: 'inline',
          theme: 'light',
          locale: 'en',
          frameTarget: 'paddle-checkout-container',
          frameInitialHeight: 480,
          frameStyle: 'width: 100%; min-width: 312px; background-color: transparent; border: none;',
          successUrl: successUrl,
          allowLogout: false,
          showAddDiscounts: true,
          showAddTaxId: false,
        },
        customer: {
          email: sessionData.email,
        },
        items: [
          {
            priceId: sessionData.paddle_price_id || sessionData.priceId,
            quantity: 1,
          },
        ],
        customData: {
          product_slug: 'skillnavo',
          user_id: sessionData.skillnavo_user_id,
          skillnavo_user_id: sessionData.skillnavo_user_id,
          plan_id: sessionData.plan,
          plan: sessionData.plan,
          plan_slug: sessionData.plan,
          return_to: returnPath,
        },
      })
    } catch (err: any) {
      console.error('Failed to open Inline Paddle checkout:', err)
      setIsPaddleLoading(false)
    }
  }

  // Fallback: Open overlay modal if user prefers or if inline has issue
  const openOverlayPaddle = async () => {
    if (!sessionData) return
    setIsLaunchingOverlay(true)
    try {
      const paddle = window.Paddle
      if (!paddle) return

      const returnPath = sessionData.return_to || '/dashboard'
      const successUrl = `https://appsto.software/skillnavo/payment-success?session=${encodeURIComponent(sessionToken || '')}`

      paddle.Checkout.open({
        settings: {
          displayMode: 'overlay',
          variant: 'one-page',
          theme: 'light',
          locale: 'en',
          successUrl: successUrl,
          allowLogout: false,
          showAddDiscounts: true,
          showAddTaxId: false,
        },
        customer: {
          email: sessionData.email,
        },
        items: [
          {
            priceId: sessionData.paddle_price_id || sessionData.priceId,
            quantity: 1,
          },
        ],
        customData: {
          product_slug: 'skillnavo',
          user_id: sessionData.skillnavo_user_id,
          skillnavo_user_id: sessionData.skillnavo_user_id,
          plan_id: sessionData.plan,
          plan: sessionData.plan,
          plan_slug: sessionData.plan,
          return_to: returnPath,
        },
      })
    } catch (err) {
      console.error('Failed overlay:', err)
    } finally {
      setIsLaunchingOverlay(false)
    }
  }

  // Once verification passes and DOM mounts, initialize inline checkout
  useEffect(() => {
    if (!isVerifying && sessionData && !error) {
      const timer = setTimeout(() => {
        openInlinePaddle()
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [isVerifying, sessionData, error])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAFAFA]">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-red-200 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#060C17] mb-2">Checkout Error</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">{error}</p>
          <div className="flex flex-col gap-3">
            <a
              href="https://skillnavo.com/pricing"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#723CFB] hover:bg-[#5F27E5] text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-500/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Skillnavo Pricing
            </a>
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-[#060C17] py-1 transition-colors"
            >
              Back to Appsto Marketplace
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Verifying State
  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FAFAFA]">
        <div className="text-center max-w-sm w-full p-8 bg-white rounded-3xl shadow-lg border border-slate-200">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-purple-100 animate-pulse" />
            <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-[#723CFB] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#723CFB]" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-[#060C17] mb-1">
            Loading Checkout
          </h3>
          <p className="text-sm text-slate-500 mb-5">
            Authenticating your Skillnavo student session...
          </p>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 rounded-full text-xs text-slate-600 border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Appsto • Paddle Merchant of Record</span>
          </div>
        </div>
      </div>
    )
  }

  // Fallback feature sets if live pricing not yet ready
  const defaultProFeatures = [
    'Unlimited AI Roadmap Journeys',
    'Interactive Code Quizzes & AI Mentor',
    'Custom Skill Trees & Priority Review',
    'Verifiable Course Completion Certificates',
    'Cancel anytime with instant sync'
  ]

  const defaultStarterFeatures = [
    '3 Active AI Roadmap Journeys',
    'Guided AI Mentor Feedback & Quizzes',
    'Standard Skill Tree Progressions',
    'Verifiable Course Completion Certificates',
    'Cancel anytime with instant sync'
  ]

  const displayFeatures = livePlanData?.features || (isPro ? defaultProFeatures : defaultStarterFeatures)
  const displayPrice = livePlanData?.formatted_price || (isPro ? (isAnnual ? '$199.00' : '$29.00') : (isAnnual ? '$96.00' : '$12.00'))
  const displayPeriodSuffix = livePlanData?.period_suffix || (isAnnual ? '/ yr' : '/ mo')

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#060C17]">
      {/* 1. Dedicated Appsto Checkout Header (No overlapping Navbar) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/Logo.png" 
                alt="Appsto" 
                width={105} 
                height={30} 
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>
            <span className="hidden sm:inline-block text-slate-300">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-[#723CFB]" />
              <span>Skillnavo Checkout</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Encrypted</span>
            </div>
            <a
              href="https://skillnavo.com/pricing"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#723CFB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Skillnavo</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. Main 2-Column Checkout Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column (5 Cols): Plan Details, Student Well & Value Summary */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Plan Summary Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
              {/* Product Header */}
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-[#723CFB] p-2 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                  <Image
                    src="/Skillnavo/SkillnavoIcon.png"
                    alt="Skillnavo"
                    width={36}
                    height={36}
                    className="w-8 h-8 object-contain rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#060C17]">Skillnavo</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-purple-50 text-[#723CFB] border border-purple-100 uppercase">
                      Official
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">AI-Powered Engineering Roadmaps</p>
                </div>
              </div>

              {/* Selected Tier & Price Card */}
              <div className="py-5 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-[#060C17]">
                      {isPro ? 'Skillnavo Pro' : 'Skillnavo Starter'}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#723CFB] text-white">
                      {isPro ? 'PRO' : 'STARTER'}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-3xl font-black text-[#060C17] tracking-tight">
                    {displayPrice}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    {displayPeriodSuffix}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  {isAnnual 
                    ? 'Billed annually with 7-day free trial on Paddle. Save up to 43%.' 
                    : 'Billed monthly with 7-day free trial on Paddle. Cancel anytime.'}
                </p>
              </div>

              {/* Student Account Well */}
              <div className="py-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Linked Student Account
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-[#060C17] truncate mt-0.5">
                      {sessionData?.email}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                    Verified
                  </span>
                </div>
              </div>

              {/* Plan Inclusions Checklist */}
              <div className="pt-2 space-y-3">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Plan Inclusions
                </p>
                <div className="space-y-2.5">
                  {displayFeatures.slice(0, 5).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <div className="w-4 h-4 rounded-full bg-purple-50 text-[#723CFB] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-[11px] font-medium">14-Day Money-Back</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="text-[11px] font-medium">Instant AI Unlock</span>
                </div>
              </div>
            </div>

            {/* Merchant of Record & Guarantee Note */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-500 text-[11px] leading-relaxed shadow-sm">
              <p className="font-semibold text-slate-700 mb-1">
                Merchant of Record Notice
              </p>
              <p>
                This subscription is processed by <strong>Appsto</strong> via Paddle, our authorized Merchant of Record. Your card statement will read <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono text-[10px]">PADDLE.NET* APPSTO</code>.
              </p>
            </div>
          </div>

          {/* Right Column (7 Cols): Embedded Inline Paddle Checkout */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
              
              {/* Payment Box Header */}
              <div className="p-6 sm:p-7 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#060C17] flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#723CFB]" />
                    <span>Payment Information</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter your payment method below to complete your order.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 self-start sm:self-auto">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Secure SSL</span>
                </div>
              </div>

              {/* Inline Checkout Frame Container */}
              <div className="p-6 sm:p-8 min-h-[500px] relative">
                
                {/* Clean Loading Overlay while Paddle initializes */}
                {isPaddleLoading && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center">
                    <div className="relative w-14 h-14 mb-4">
                      <div className="w-14 h-14 rounded-full border-4 border-purple-100 border-t-[#723CFB] animate-spin" />
                    </div>
                    <p className="text-sm font-bold text-[#060C17]">
                      Loading Secure Payment Gateway...
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Connecting to Paddle for tax-inclusive billing and instant payment verification.
                    </p>
                  </div>
                )}

                {/* 
                  Target HTML Element for Paddle Inline Checkout
                  Paddle.js will inject the responsive payment form directly here.
                */}
                <div 
                  id="paddle-checkout-container" 
                  className="paddle-checkout-container w-full min-h-[460px]"
                />

                {/* Secondary Fallback button if user has aggressive browser blockers */}
                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                  <button
                    onClick={openOverlayPaddle}
                    disabled={isLaunchingOverlay}
                    className="text-xs text-slate-500 hover:text-[#723CFB] font-medium transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Trouble viewing the payment fields?</span>
                    <span className="underline font-semibold">Open in modal window</span>
                    {isLaunchingOverlay && <RefreshCw className="w-3 h-3 animate-spin" />}
                  </button>
                </div>
              </div>

              {/* Footer Trust Signal */}
              <div className="bg-slate-50/60 px-6 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Backed by 14-day refund guarantee</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span>Powered by Paddle Billing v2</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default function SkillnavoCheckoutPage() {
  return (
    <>
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="afterInteractive"
      />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#723CFB]" />
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </>
  )
}

