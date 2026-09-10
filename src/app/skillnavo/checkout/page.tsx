'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Script from 'next/script'
import Link from 'next/link'
import { 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  RefreshCw,
  CreditCard,
  Zap
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
  skillnavo_user_id: string
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const sessionToken = searchParams.get('session')
  const [error, setError] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<VerifiedSession | null>(null)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isOpeningOverlay, setIsOpeningOverlay] = useState(false)

  const isPro = sessionData?.plan.toLowerCase().includes('pro') || false
  const isAnnual = sessionData?.plan.toLowerCase().includes('annual') || false

  useEffect(() => {
    if (!sessionToken) {
      setError('Missing checkout session token. Please initiate checkout from Skillnavo.')
      setIsVerifying(false)
      return
    }

    let isMounted = true

    async function authenticateSession() {
      try {
        setIsVerifying(true)
        // Verify session token on Appsto server (keeps shared secret 100% private)
        const res = await fetch('/api/billing/validate-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken }),
        })

        const data = await res.json()

        if (!res.ok || !data.valid) {
          throw new Error(data.error || 'Failed to authenticate checkout session.')
        }

        if (!isMounted) return

        setSessionData({
          email: data.email,
          plan: data.plan,
          priceId: data.priceId,
          skillnavo_user_id: data.skillnavo_user_id,
        })
        setIsVerifying(false)
      } catch (err: any) {
        console.error('[SkillnavoCheckout] Verification error:', err)
        if (isMounted) {
          setError(err.message || 'An unexpected error occurred verifying your session.')
          setIsVerifying(false)
        }
      }
    }

    authenticateSession()

    return () => {
      isMounted = false
    }
  }, [sessionToken])

  const handleOpenPaddle = async () => {
    if (!sessionData) return
    setIsOpeningOverlay(true)

    try {
      // Ensure window.Paddle is ready
      let attempts = 0
      while (attempts < 50 && (!window.Paddle || typeof window.Paddle.Checkout === 'undefined')) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        attempts++
      }

      if (!window.Paddle) {
        throw new Error('Paddle payment gateway is still loading. Please try again in a moment.')
      }

      const paddle = window.Paddle
      const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN

      if (clientToken) {
        paddle.Initialize({
          token: clientToken,
          eventCallback: function (event: any) {
            if (event.name === 'checkout.closed') {
              setIsOpeningOverlay(false)
            } else if (event.name === 'checkout.error') {
              console.error('Paddle checkout error:', event)
              setError('Payment gateway error. Please try again.')
              setIsOpeningOverlay(false)
            }
          },
        })

        if (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'sandbox') {
          paddle.Environment?.set('sandbox')
        }
      }

      // Open Paddle Checkout modal
      paddle.Checkout.open({
        settings: {
          displayMode: 'overlay',
          variant: 'one-page',
          theme: 'light',
          locale: 'en',
          successUrl: 'https://skillnavo.com/billing/success',
          allowLogout: false,
          showAddDiscounts: true,
        },
        customer: {
          email: sessionData.email,
        },
        items: [
          {
            priceId: sessionData.priceId,
            quantity: 1,
          },
        ],
        customData: {
          product_slug: 'skillnavo',
          plan_slug: sessionData.plan,
          skillnavo_user_id: sessionData.skillnavo_user_id,
        },
      })
    } catch (err: any) {
      console.error('Failed to open Paddle overlay:', err)
      setError(err.message || 'Could not launch payment overlay.')
    } finally {
      setIsOpeningOverlay(false)
    }
  }

  // Auto-launch overlay once verified
  useEffect(() => {
    if (sessionData && !error) {
      handleOpenPaddle()
    }
  }, [sessionData])

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

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAFAFA]">
        <div className="text-center max-w-sm w-full p-8 bg-white rounded-3xl shadow-lg border border-slate-200">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-purple-100 animate-pulse" />
            <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-[#723CFB] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#723CFB]" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-[#060C17] mb-1">
            Skillnavo Checkout
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Verifying secure HMAC session credentials...
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full text-xs text-slate-600 border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Paddle Merchant of Record</span>
          </div>
        </div>
      </div>
    )
  }

  const proFeatures = [
    'Unlimited AI Roadmap Journeys',
    'Full AI Mentor & Coding Interviews',
    'Custom Skill Trees & Priority Mentor Reviews',
    'Downloadable Verified Certifications',
    'Cancel anytime with instant sync'
  ]

  const starterFeatures = [
    '3 Active AI Roadmap Journeys',
    'Guided AI Mentor Feedback',
    'Standard Skill Tree Progressions',
    'Verified Course Certifications',
    'Cancel anytime with instant sync'
  ]

  const features = isPro ? proFeatures : starterFeatures

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] flex flex-col justify-center items-center">
      <div className="max-w-xl w-full">
        {/* Marketplace Back Link */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/products/skillnavo"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#723CFB] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Skillnavo Overview
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            256-Bit SSL Encrypted
          </span>
        </div>

        {/* Themed Checkout Container Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#723CFB] via-[#6328E8] to-[#5F27E5] p-6 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium text-white mb-3">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Appsto Authoritative Checkout</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Complete Your Skillnavo Subscription
              </h1>
              <p className="text-sm text-purple-100 mt-1 max-w-sm">
                Instant access to AI-powered engineering roadmaps and interactive mentor coaching.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Plan Details Card */}
            <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-bold text-[#060C17]">
                    {isPro ? 'Skillnavo Pro' : 'Skillnavo Starter'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-[#723CFB]">
                    {isPro ? 'PRO TIER' : 'STARTER TIER'}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {isAnnual ? 'Billed annually (Save 33%)' : 'Billed monthly (Flexible cancellation)'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-[#060C17]">
                  {isPro ? (isAnnual ? '$79.99' : '$9.99') : (isAnnual ? '$39.99' : '$4.99')}
                </span>
                <span className="text-xs text-slate-500 block">
                  {isAnnual ? '/year' : '/month'}
                </span>
              </div>
            </div>

            {/* Purchaser / Student Confirmation Well */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Associated Skillnavo Account
                </p>
                <p className="text-sm font-semibold text-[#060C17] truncate">
                  {sessionData?.email}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Verified
              </span>
            </div>

            {/* Features Checklist */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-[#060C17] uppercase tracking-wider">
                Plan Inclusions
              </p>
              <div className="space-y-2">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#723CFB] flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={handleOpenPaddle}
                disabled={isOpeningOverlay}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-[#723CFB] hover:bg-[#5F27E5] active:scale-[0.99] transition-all shadow-md shadow-purple-500/20 hover:shadow-lg flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                {isOpeningOverlay ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Launching Payment Gateway...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Proceed to Payment via Paddle
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-500 mt-2.5">
                Payments processed securely by Paddle (Merchant of Record). VAT/GST calculated at checkout.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>14-Day Refund</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Activation</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Lock className="w-4 h-4 text-[#723CFB]" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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

