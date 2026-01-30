'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Lock, Eye, EyeOff, AlertCircle, Check } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Suspense } from 'react'

// Mark as dynamic route (requires search params at runtime)
export const dynamic = 'force-dynamic'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Calculate password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    if (newPassword.length >= 8) strength++
    if (newPassword.length >= 12) strength++
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) strength++
    if (/\d/.test(newPassword)) strength++
    if (/[^a-zA-Z0-9]/.test(newPassword)) strength++

    setPasswordStrength(strength)
  }, [newPassword])

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-[#EF4444]'
    if (passwordStrength <= 2) return 'bg-[#F59E0B]'
    if (passwordStrength <= 3) return 'bg-[#10B981]'
    return 'bg-[#10B981]'
  }

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak'
    if (passwordStrength <= 2) return 'Fair'
    if (passwordStrength <= 3) return 'Good'
    return 'Strong'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setMessage({ 
        type: 'success', 
        text: 'Password updated successfully! Redirecting to sign in...' 
      })

      setTimeout(() => {
        router.push('/signin')
      }, 2000)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to reset password. The link may have expired.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-xl border border-[#E5E7EB] dark:border-[#1F2937] p-8">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
              Reset Your Password
            </h1>
            <p className="text-[#9CA3AF]">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Input */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#0B1220] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-[#0B1220] dark:text-[#E5E7EB] pr-12"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#0B1220] dark:hover:text-[#E5E7EB] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < passwordStrength ? getStrengthColor() : 'bg-[#E5E7EB] dark:bg-[#1F2937]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#9CA3AF]">
                    Password strength: <span className={passwordStrength >= 3 ? 'text-[#10B981]' : 'text-[#F59E0B]'}>{getStrengthText()}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#0B1220] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-[#0B1220] dark:text-[#E5E7EB] pr-12"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#0B1220] dark:hover:text-[#E5E7EB] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Success/Error Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 p-4 rounded-xl ${
                  message.type === 'success'
                    ? 'bg-[#10B981]/10 text-[#10B981]'
                    : 'bg-[#EF4444]/10 text-[#EF4444]'
                }`}
              >
                {message.type === 'success' ? (
                  <Check className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
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
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Password Requirements */}
          <div className="mt-6 bg-[#F9FAFB] dark:bg-[#0B1220] rounded-xl p-4">
            <p className="text-xs font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
              Password Requirements:
            </p>
            <ul className="text-xs text-[#9CA3AF] space-y-1">
              <li className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-[#10B981]' : 'bg-[#E5E7EB] dark:bg-[#1F2937]'}`} />
                At least 8 characters
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? 'bg-[#10B981]' : 'bg-[#E5E7EB] dark:bg-[#1F2937]'}`} />
                Contains uppercase and lowercase letters
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(newPassword) ? 'bg-[#10B981]' : 'bg-[#E5E7EB] dark:bg-[#1F2937]'}`} />
                Contains at least one number
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${/[^a-zA-Z0-9]/.test(newPassword) ? 'bg-[#10B981]' : 'bg-[#E5E7EB] dark:bg-[#1F2937]'}`} />
                Contains at least one special character
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:bg-[#0B1220]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
