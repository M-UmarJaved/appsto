'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Mail, ArrowLeft, AlertCircle, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setEmailSent(true)
      setMessage({ 
        type: 'success', 
        text: 'Password reset link sent! Please check your email.' 
      })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to send reset email' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#EFF6FF] dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#0B1220] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Background orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 rounded-full blur-[120px] pointer-events-none"
        animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-[#22D3EE]/10 dark:bg-[#22D3EE]/15 rounded-full blur-[120px] pointer-events-none"
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <Link href="/" className="inline-block">
            <Image
              src="/Logo.png"
              alt="Appsto"
              width={200}
              height={50}
              className="h-[50px] w-auto object-contain mx-auto"
              priority
            />
          </Link>
        </motion.div>

        {/* Forgot Password Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-[#E5E7EB] dark:border-[#1F2937] p-8 md:p-10"
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-2"
            >
              Forgot Password?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[#9CA3AF]"
            >
              {emailSent 
                ? "We've sent you a password reset link"
                : "No worries, we'll send you reset instructions"}
            </motion.p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#0B1220] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-[#0B1220] dark:text-[#E5E7EB]"
                  placeholder="name@company.com"
                  required
                />
              </div>

              {/* Error Message */}
              {message && message.type === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 bg-[#EF4444]/10 text-[#EF4444] rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{message.text}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              {message && message.type === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 bg-[#10B981]/10 text-[#10B981] rounded-xl"
                >
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{message.text}</span>
                </motion.div>
              )}

              {/* Instructions */}
              <div className="bg-[#F9FAFB] dark:bg-[#0B1220] rounded-xl p-4 space-y-2">
                <p className="text-sm text-[#0B1220] dark:text-[#E5E7EB]">
                  <strong>What's next?</strong>
                </p>
                <ul className="text-sm text-[#9CA3AF] space-y-1 list-disc list-inside">
                  <li>Check your email inbox for {email}</li>
                  <li>Click the reset password link in the email</li>
                  <li>Create a new password for your account</li>
                </ul>
              </div>

              {/* Resend Button */}
              <button
                onClick={() => {
                  setEmailSent(false)
                  setMessage(null)
                }}
                className="w-full px-6 py-3 bg-[#0B1220]/5 dark:bg-[#E5E7EB]/5 text-[#0B1220] dark:text-[#E5E7EB] font-semibold rounded-xl hover:bg-[#0B1220]/10 dark:hover:bg-[#E5E7EB]/10 transition-colors"
              >
                Send Another Link
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#E5E7EB] dark:border-[#1F2937] text-center">
            <p className="text-sm text-[#9CA3AF]">
              Remember your password?{' '}
              <Link href="/signin" className="text-[#3B82F6] hover:text-[#2563EB] font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
