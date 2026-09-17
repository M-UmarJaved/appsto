'use client'

import { useEffect, useState, useRef, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft, 
  Lock, 
  RefreshCw, 
  CreditCard, 
  Zap,
  Check,
  Shield,
  ExternalLink
} from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'
import { SKILLNAVO_PADDLE_PRICE_IDS } from '@/lib/currency'

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
  isDirect?: boolean
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
  const initialPlanParam = searchParams.get('plan') || 'starter_monthly'
  const { user } = useAuth()
  
  const [error, setError] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<VerifiedSession | null>(null)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isPaddleLoading, setIsPaddleLoading] = useState(true)
  const [isLaunchingOverlay, setIsLaunchingOverlay] = useState(false)
  const [allLivePlans, setAllLivePlans] = useState<Record<string, LivePricingPlan> | null>(null)
  const [livePlanData, setLivePlanData] = useState<LivePricingPlan | null>(null)
  const [currencySymbol, setCurrencySymbol] = useState('$')
  const [regionName, setRegionName] = useState('Global (USD)')

  const paddleInitializedRef = useRef(false)
  const checkoutOpenedRef = useRef(false)
  const observerRef = useRef<MutationObserver | null>(null)

  // Normalize initial plan key
  const normalizePlan = useCallback((rawPlan: string | null): string => {
    if (!rawPlan) return 'starter_monthly'
    const lower = rawPlan.toLowerCase()
    if (lower === 'starter') return 'starter_monthly'
    if (lower === 'pro') return 'pro_monthly'
    if (SKILLNAVO_PADDLE_PRICE_IDS[lower]) return lower
    return 'starter_monthly'
  }, [])

  const activePlanKey = sessionData?.plan || normalizePlan(initialPlanParam)
  const isPro = activePlanKey.toLowerCase().includes('pro')
  const isAnnual = activePlanKey.toLowerCase().includes('annual')
  const isDirectCheckout = !sessionToken || sessionData?.isDirect

  // 1. Authenticate Session Token OR Setup Direct Appsto Checkout & Fetch Live Pricing
  useEffect(() => {
    let isMounted = true

    async function initCheckout() {
      try {
        setIsVerifying(true)
        setError(null)

        // Fetch live pricing from Appsto Paddle pricing engine
        const pricingPromise = fetch('/api/pricing/skillnavo')
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)

        if (sessionToken) {
          // Token session from Skillnavo app
          const [validateRes, pricingJson] = await Promise.all([
            fetch('/api/billing/validate-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionToken }),
            }),
            pricingPromise,
          ])

          const validateData = await validateRes.json()

          if (!validateRes.ok || !validateData.valid) {
            throw new Error(validateData.error || 'Failed to authenticate checkout session.')
          }

          if (!isMounted) return

          const planKey = normalizePlan(validateData.plan)
          const resolvedPriceId =
            validateData.paddle_price_id ||
            validateData.priceId ||
            SKILLNAVO_PADDLE_PRICE_IDS[planKey]

          setSessionData({
            email: validateData.email || '',
            plan: planKey,
            priceId: resolvedPriceId,
            paddle_price_id: resolvedPriceId,
            skillnavo_user_id: validateData.skillnavo_user_id || '',
            return_to: validateData.return_to || '/dashboard',
            isDirect: false,
          })

          if (pricingJson?.success && pricingJson.plans) {
            setAllLivePlans(pricingJson.plans)
            if (pricingJson.plans[planKey]) {
              setLivePlanData(pricingJson.plans[planKey])
            }
            if (pricingJson.region) {
              setCurrencySymbol(pricingJson.region.symbol || '$')
              setRegionName(pricingJson.region.tier_name || 'Global')
            }
          }
        } else {
          // Direct checkout from Appsto (e.g. /products/skillnavo or homepage)
          const planKey = normalizePlan(initialPlanParam)
          const resolvedPriceId =
            SKILLNAVO_PADDLE_PRICE_IDS[planKey] || 'pri_01m252y0prb2nrjmay8ecgc1q0'

          const pricingJson = await pricingPromise

          if (!isMounted) return

          setSessionData({
            email: user?.email || '',
            plan: planKey,
            priceId: resolvedPriceId,
            paddle_price_id: resolvedPriceId,
            skillnavo_user_id: user?.id || '',
            return_to: 'https://skillnavo.com/dashboard',
            isDirect: true,
          })

          if (user?.email) {
            void fetch('/api/billing/track-checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                plan_slug: planKey,
                paddle_price_id: resolvedPriceId,
                skillnavo_user_id: user?.id || null,
              }),
            }).catch(() => {})
          }

          if (pricingJson?.success && pricingJson.plans) {
            setAllLivePlans(pricingJson.plans)
            if (pricingJson.plans[planKey]) {
              setLivePlanData(pricingJson.plans[planKey])
            }
            if (pricingJson.region) {
              setCurrencySymbol(pricingJson.region.symbol || '$')
              setRegionName(pricingJson.region.tier_name || 'Global')
            }
          }
        }

        setIsVerifying(false)
      } catch (err: any) {
        console.error('[SkillnavoCheckout] Initialization error:', err)
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
  }, [sessionToken, initialPlanParam, user, normalizePlan])

  // Function to switch plans when in direct checkout mode
  const handleSelectPlan = (newPlanKey: string) => {
    const resolvedPriceId = SKILLNAVO_PADDLE_PRICE_IDS[newPlanKey]
    if (!resolvedPriceId) return

    setSessionData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        plan: newPlanKey,
        priceId: resolvedPriceId,
        paddle_price_id: resolvedPriceId,
      }
    })

    if (allLivePlans && allLivePlans[newPlanKey]) {
      setLivePlanData(allLivePlans[newPlanKey])
    }

    // Seamlessly update already open inline checkout without remounting iframe
    try {
      if (window.Paddle?.Checkout?.updateCheckout) {
        window.Paddle.Checkout.updateCheckout({
          items: [{ priceId: resolvedPriceId, quantity: 1 }],
          customData: {
            product_slug: 'skillnavo',
            plan_id: newPlanKey,
            plan_slug: newPlanKey,
          },
        })
      } else {
        // Fallback: reload inline checkout
        checkoutOpenedRef.current = false
        openInlinePaddle()
      }
    } catch (e) {
      console.warn('Paddle updateCheckout note:', e)
    }
  }

  // 2. Launch Inline Paddle Checkout directly into our card container
  const openInlinePaddle = useCallback(async () => {
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
      let container = document.getElementById('paddle-checkout-container')
      while (containerAttempts < 30 && !container) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        container = document.getElementById('paddle-checkout-container')
        containerAttempts++
      }

      if (!container) {
        throw new Error('Checkout container element could not be found.')
      }

      const paddle = window.Paddle
      const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
      const isSandbox = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'sandbox'

      // Master event listener for Paddle lifecycle
      const handlePaddleEvent = (event: any) => {
        console.log('💳 [Paddle Checkout Event]', event?.name, event)
        if (
          event?.name === 'checkout.loaded' ||
          event?.name === 'checkout.payment_selected' ||
          event?.name === 'checkout.customer.created'
        ) {
          setIsPaddleLoading(false)
        } else if (event?.name === 'checkout.completed') {
          setIsPaddleLoading(false)
          const destUrl = sessionToken
            ? `https://appsto.software/skillnavo/payment-success?session=${encodeURIComponent(sessionToken)}`
            : `https://appsto.software/skillnavo/payment-success?tier=${encodeURIComponent(sessionData.plan)}&returnTo=${encodeURIComponent(sessionData.return_to || '/dashboard')}${sessionData.email ? `&email=${encodeURIComponent(sessionData.email)}` : ''}`
          window.location.href = destUrl
        } else if (event?.name === 'checkout.error') {
          console.error('Paddle inline error event:', event)
          setIsPaddleLoading(false)
        } else if (event?.name === 'checkout.closed') {
          setIsPaddleLoading(false)
        }
      }

      // Initialize Paddle (Strictly ONCE per page per Paddle.js v2 docs)
      if (clientToken && !paddle.Initialized && !paddleInitializedRef.current) {
        if (isSandbox) {
          paddle.Environment?.set('sandbox')
        }
        paddle.Initialize({
          token: clientToken,
          checkout: {
            settings: {
              displayMode: 'inline',
              theme: 'light',
              locale: 'en',
              frameTarget: 'paddle-checkout-container',
              frameInitialHeight: 450,
              frameStyle: 'width: 100%; min-width: 312px; background-color: transparent; border: none;',
              allowLogout: false,
              showAddDiscounts: true,
              showAddTaxId: false,
            },
          },
          eventCallback: handlePaddleEvent,
        })
        paddleInitializedRef.current = true
      } else if (paddle.Update) {
        // If already initialized on a previous client navigation, update callback
        try {
          paddle.Update({
            eventCallback: handlePaddleEvent,
          })
        } catch (updateErr) {
          console.warn('Paddle.Update callback note:', updateErr)
        }
      }

      // Setup DOM MutationObserver on container to dismiss loader as soon as iframe mounts
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (container.querySelector('iframe')) {
        setIsPaddleLoading(false)
      } else {
        const observer = new MutationObserver(() => {
          if (container && (container.querySelector('iframe') || container.children.length > 0)) {
            setIsPaddleLoading(false)
            observer.disconnect()
          }
        })
        observer.observe(container, { childList: true, subtree: true })
        observerRef.current = observer
      }

      // Safety fail-safe timeout: Never keep the user locked in a spinner for > 3.5s
      const safetyTimeout = setTimeout(() => {
        setIsPaddleLoading(false)
      }, 3500)

      const returnPath = sessionData.return_to || '/dashboard'
      const successUrl = sessionToken
        ? `https://appsto.software/skillnavo/payment-success?session=${encodeURIComponent(sessionToken)}`
        : `https://appsto.software/skillnavo/payment-success?tier=${encodeURIComponent(sessionData.plan)}&returnTo=${encodeURIComponent(returnPath)}${sessionData.email ? `&email=${encodeURIComponent(sessionData.email)}` : ''}`

      const customerConfig =
        sessionData.email && sessionData.email.trim().length > 0
          ? { email: sessionData.email.trim() }
          : undefined

      // Open Inline checkout
      paddle.Checkout.open({
        settings: {
          displayMode: 'inline',
          theme: 'light',
          locale: 'en',
          frameTarget: 'paddle-checkout-container',
          frameInitialHeight: 450,
          frameStyle: 'width: 100%; min-width: 312px; background-color: transparent; border: none;',
          successUrl: successUrl,
          allowLogout: false,
          showAddDiscounts: true,
          showAddTaxId: false,
        },
        customer: customerConfig,
        items: [
          {
            priceId: sessionData.paddle_price_id || sessionData.priceId,
            quantity: 1,
          },
        ],
        customData: {
          product_slug: 'skillnavo',
          ...(sessionData.skillnavo_user_id ? { user_id: sessionData.skillnavo_user_id } : {}),
          ...(sessionData.skillnavo_user_id ? { skillnavo_user_id: sessionData.skillnavo_user_id } : {}),
          plan_id: sessionData.plan,
          plan: sessionData.plan,
          plan_slug: sessionData.plan,
          return_to: returnPath,
        },
      })

      checkoutOpenedRef.current = true

      return () => {
        clearTimeout(safetyTimeout)
      }
    } catch (err: any) {
      console.error('Failed to open Inline Paddle checkout:', err)
      setIsPaddleLoading(false)
    }
  }, [sessionData, sessionToken])

  // Fallback: Open overlay modal if user has aggressive browser blockers
  const openOverlayPaddle = async () => {
    if (!sessionData) return
    setIsLaunchingOverlay(true)
    try {
      const paddle = window.Paddle
      if (!paddle) return

      const returnPath = sessionData.return_to || '/dashboard'
      const successUrl = sessionToken
        ? `https://appsto.software/skillnavo/payment-success?session=${encodeURIComponent(sessionToken)}`
        : `https://appsto.software/skillnavo/payment-success?tier=${encodeURIComponent(sessionData.plan)}&returnTo=${encodeURIComponent(returnPath)}${sessionData.email ? `&email=${encodeURIComponent(sessionData.email)}` : ''}`

      const customerConfig =
        sessionData.email && sessionData.email.trim().length > 0
          ? { email: sessionData.email.trim() }
          : undefined

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
        customer: customerConfig,
        items: [
          {
            priceId: sessionData.paddle_price_id || sessionData.priceId,
            quantity: 1,
          },
        ],
        customData: {
          product_slug: 'skillnavo',
          ...(sessionData.skillnavo_user_id ? { user_id: sessionData.skillnavo_user_id } : {}),
          ...(sessionData.skillnavo_user_id ? { skillnavo_user_id: sessionData.skillnavo_user_id } : {}),
          plan_id: sessionData.plan,
          plan: sessionData.plan,
          plan_slug: sessionData.plan,
          return_to: returnPath,
        },
      })
    } catch (err) {
      console.error('Failed overlay fallback:', err)
    } finally {
      setIsLaunchingOverlay(false)
    }
  }

  // Once verification passes and DOM mounts, initialize inline checkout
  useEffect(() => {
    if (!isVerifying && sessionData && !error) {
      const timer = setTimeout(() => {
        openInlinePaddle()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isVerifying, sessionData?.priceId, error, openInlinePaddle])

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

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

  // Plan features fallback
  const defaultProFeatures = [
    'Unlimited AI Roadmap Journeys',
    'Interactive Code Quizzes & AI Mentor',
    'Custom Skill Trees & Priority Review',
    'Verifiable Course Completion Certificates',
    'Cancel anytime with instant sync',
  ]

  const defaultStarterFeatures = [
    '3 Active AI Roadmap Journeys',
    'Guided AI Mentor Feedback & Quizzes',
    'Standard Skill Tree Progressions',
    'Verifiable Course Completion Certificates',
    'Cancel anytime with instant sync',
  ]

  const displayFeatures =
    livePlanData?.features || (isPro ? defaultProFeatures : defaultStarterFeatures)
  const displayPrice =
    livePlanData?.formatted_price ||
    (isPro ? (isAnnual ? '$79.99' : '$7.99') : isAnnual ? '$39.99' : '$3.99')
  const displayPeriodSuffix = livePlanData?.period_suffix || (isAnnual ? '/ yr' : '/ mo')

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#060C17]">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 Cols): Unified Order Summary & Student Credentials */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
              {/* Product Brand Header */}
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-[#723CFB] p-2 flex items-center justify-center text-white shadow-md shadow-purple-500/20 flex-shrink-0">
                  <Image
                    src="/Skillnavo/SkillnavoIcon.png"
                    alt="Skillnavo"
                    width={36}
                    height={36}
                    className="w-8 h-8 object-contain rounded-lg"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#060C17] truncate">Skillnavo</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-purple-50 text-[#723CFB] border border-purple-100 uppercase flex-shrink-0">
                      Official
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">AI-Powered Engineering Roadmaps</p>
                </div>
              </div>

              {/* Direct Plan Selector (only visible if user arrived without a signed token) */}
              {isDirectCheckout && (
                <div className="py-4 border-b border-slate-100">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                    Select Plan & Billing
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'starter_monthly', label: 'Starter Monthly', badge: 'Flexible' },
                      { key: 'starter_annual', label: 'Starter Annual', badge: 'Save 33%' },
                      { key: 'pro_monthly', label: 'Pro Monthly', badge: 'Full AI Access' },
                      { key: 'pro_annual', label: 'Pro Annual', badge: 'Save 43%' },
                    ].map((p) => {
                      const isSelected = activePlanKey === p.key
                      return (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() => handleSelectPlan(p.key)}
                          className={`p-2.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-[#723CFB] bg-purple-50/70 text-[#723CFB] ring-2 ring-[#723CFB]/20 shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold leading-tight flex items-center justify-between">
                            <span>{p.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#723CFB] stroke-[3]" />}
                          </div>
                          <span className={`text-[10px] font-semibold block mt-0.5 ${isSelected ? 'text-[#723CFB]' : 'text-slate-400'}`}>
                            {p.badge}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Selected Tier & Pricing */}
              <div className="py-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-[#060C17]">
                      {isPro ? 'Skillnavo Pro' : 'Skillnavo Starter'}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#723CFB] text-white">
                      {isPro ? 'PRO' : 'STARTER'}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    7-Day Free Trial
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-3xl font-black text-[#060C17] tracking-tight">
                    {displayPrice}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    {displayPeriodSuffix}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {isAnnual 
                    ? 'Billed annually with 7-day free trial on Paddle. Save up to 43%.' 
                    : 'Billed monthly with 7-day free trial on Paddle. Cancel anytime.'}
                </p>
              </div>

              {/* Student Account Badge */}
              <div className="py-3.5 border-b border-slate-100">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {sessionData?.email ? 'Linked Student Account' : 'Student Account Email'}
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-[#060C17] truncate mt-0.5">
                      {sessionData?.email || 'Enter in checkout form'}
                    </p>
                  </div>
                  {sessionData?.email ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-[#723CFB] border border-purple-200/80 flex-shrink-0">
                      <Sparkles className="w-3 h-3 text-[#723CFB]" />
                      Instant Setup
                    </span>
                  )}
                </div>
              </div>

              {/* Plan Inclusions Checklist */}
              <div className="pt-3.5 pb-4 border-b border-slate-100 space-y-2.5">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Plan Inclusions
                </p>
                <div className="space-y-2">
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

              {/* Trust Guarantees */}
              <div className="pt-3.5 grid grid-cols-2 gap-3 text-xs text-slate-600">
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

            {/* Merchant of Record Notice (Clean Integrated Box) */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-500 text-[11px] leading-relaxed shadow-xs flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-700">Merchant of Record: </span>
                This subscription is securely processed by <strong>Appsto</strong> via Paddle. Statement will read <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono text-[10px]">PADDLE.NET* APPSTO</code>.
              </div>
            </div>

          </div>

          {/* Right Column (7 Cols): Embedded Inline Paddle Checkout Frame */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
              
              {/* Payment Box Header */}
              <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#060C17] flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#723CFB]" />
                    <span>Payment Information</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter your payment method below to activate your Skillnavo access.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 self-start sm:self-auto">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Secure SSL</span>
                </div>
              </div>

              {/* Inline Checkout Frame Container */}
              <div className="p-5 sm:p-6 min-h-[420px] relative flex flex-col justify-between">
                
                {/* Clean Branded Loading Overlay while Paddle mounts */}
                {isPaddleLoading && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="relative w-12 h-12 mb-3">
                      <div className="w-12 h-12 rounded-full border-3 border-purple-100 border-t-[#723CFB] animate-spin" />
                    </div>
                    <p className="text-sm font-bold text-[#060C17]">
                      Connecting to Secure Gateway...
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                      Loading Paddle encrypted payment fields and verifying tax compliance.
                    </p>

                    {/* Subtle Payment Skeleton Outline */}
                    <div className="w-full max-w-sm mt-5 space-y-2.5 opacity-40 pointer-events-none">
                      <div className="h-9 bg-slate-200 rounded-xl animate-pulse" />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-9 bg-slate-200 rounded-xl animate-pulse" />
                        <div className="h-9 bg-slate-200 rounded-xl animate-pulse" />
                      </div>
                      <div className="h-10 bg-[#723CFB]/30 rounded-xl animate-pulse mt-3" />
                    </div>
                  </div>
                )}

                {/* 
                  Target HTML Element for Paddle Inline Checkout
                  Paddle.js will inject the responsive payment form directly here.
                */}
                <div 
                  id="paddle-checkout-container" 
                  className="paddle-checkout-container w-full min-h-[380px]"
                />

                {/* Fallback button if user has aggressive browser ad/tracker blockers */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                  <button
                    onClick={openOverlayPaddle}
                    disabled={isLaunchingOverlay}
                    className="text-xs text-slate-500 hover:text-[#723CFB] font-medium transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Having trouble viewing the payment fields?</span>
                    <span className="underline font-semibold">Open in modal window</span>
                    {isLaunchingOverlay ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <ExternalLink className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Footer Trust Signal */}
              <div className="bg-slate-50/60 px-5 sm:px-6 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#723CFB]" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}


