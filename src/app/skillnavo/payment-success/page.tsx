'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Sparkles, ShieldCheck, ExternalLink } from 'lucide-react'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionToken = searchParams.get('session')
  const [countdown, setCountdown] = useState(3)
  const [tier, setTier] = useState<string>('pro')
  const [returnTo, setReturnTo] = useState<string>('/dashboard')
  const [studentEmail, setStudentEmail] = useState<string | null>(null)

  useEffect(() => {
    // 1. Check query parameters first
    const queryTier = searchParams.get('tier')
    const queryReturnTo = searchParams.get('returnTo') || searchParams.get('return_to')
    const queryEmail = searchParams.get('email')

    if (queryTier) setTier(queryTier)
    if (queryReturnTo) setReturnTo(queryReturnTo)
    if (queryEmail) setStudentEmail(queryEmail)

    // 2. Decode session token if available
    if (sessionToken) {
      try {
        const parts = sessionToken.split('.')
        if (parts.length === 2) {
          const base64Standard = parts[0].replace(/-/g, '+').replace(/_/g, '/')
          const payloadJson = decodeURIComponent(
            atob(base64Standard)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          )
          const payload = JSON.parse(payloadJson)
          if (payload.tier || payload.plan) {
            setTier(payload.tier || payload.plan)
          }
          if (payload.returnTo || payload.return_to) {
            setReturnTo(payload.returnTo || payload.return_to)
          }
          if (payload.email) {
            setStudentEmail(payload.email)
          }
        }
      } catch (err) {
        console.warn('Could not decode session token on client:', err)
      }
    }
  }, [sessionToken, searchParams])

  const redirectUrl = `https://skillnavo.com/billing/success?tier=${encodeURIComponent(tier)}&returnTo=${encodeURIComponent(returnTo)}${sessionToken ? `&session=${encodeURIComponent(sessionToken)}` : ''}`

  // Countdown timer from 3 to 0, then auto-redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = redirectUrl
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [redirectUrl])

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-purple-100 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-emerald-100 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Checkmark Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200 shadow-sm"
        >
          <CheckCircle2 className="w-10 h-10" />
        </motion.div>

        {/* Header Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-[#723CFB] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Subscription Activated</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#060C17] tracking-tight mb-2">
          Payment Confirmed! 🎉
        </h1>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Thank you! Your payment was processed successfully by Appsto. Your Skillnavo learning journey is unlocked.
        </p>

        {/* Student Well */}
        {studentEmail && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 mb-6 flex items-center justify-between">
            <span className="text-slate-500 font-medium">Account:</span>
            <span className="font-semibold text-[#060C17]">{studentEmail}</span>
          </div>
        )}

        {/* Progress Countdown Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center text-xs font-medium text-slate-500">
            <span>Redirecting to Skillnavo...</span>
            <span className="text-[#723CFB] font-bold">{countdown}s</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'linear' }}
              className="bg-[#723CFB] h-full rounded-full"
            />
          </div>
        </div>

        {/* Immediate Action Button */}
        <a
          href={redirectUrl}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-[#723CFB] hover:bg-[#5F27E5] active:scale-[0.99] transition-all shadow-md shadow-purple-500/20 hover:shadow-lg flex items-center justify-center gap-2 mb-4 text-sm"
        >
          <span>Return to Skillnavo Now</span>
          <ArrowRight className="w-4 h-4" />
        </a>

        {/* Trust Note */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Processed by Appsto (Merchant of Record)</span>
        </div>
      </div>
    </div>
  )
}

export default function SkillnavoPaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#723CFB]" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}
