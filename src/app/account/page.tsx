'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { User, Mail, Lock, Camera, AlertCircle, Check } from 'lucide-react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function AccountPage() {
  const { user } = useAuth()
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordMessage(null)

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' })
      setPasswordLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      setPasswordLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to change password' })
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    // Here you would implement the actual account deletion
    // For now, we'll just show an alert
    alert('Account deletion functionality will be implemented with proper backend integration.')
    setShowDeleteConfirm(false)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-2">Account Settings</h1>
            <p className="text-[#9CA3AF]">Manage your account information and security</p>
          </motion.div>

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-[#111827] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm mb-6"
          >
            <h2 className="text-xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-6 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#E5E7EB] dark:border-[#1F2937]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center text-white text-3xl font-bold border-4 border-[#E5E7EB] dark:border-[#1F2937]">
                    {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#0B1220] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-[#0B1220] dark:text-[#E5E7EB]"
                  placeholder="Your full name"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-[#0B1220]/5 dark:bg-[#E5E7EB]/5 border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl text-[#9CA3AF] cursor-not-allowed"
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                </div>
                <p className="text-xs text-[#9CA3AF] mt-2">Email cannot be changed after account creation</p>
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
                    <Check className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">{message.text}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>

          {/* Password Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-[#111827] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm mb-6"
          >
            <h2 className="text-xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-6">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#0B1220] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-[#0B1220] dark:text-[#E5E7EB]"
                  placeholder="Enter current password"
                />
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#0B1220] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-[#0B1220] dark:text-[#E5E7EB]"
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#0B1220] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-[#0B1220] dark:text-[#E5E7EB]"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Success/Error Message */}
              {passwordMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 p-4 rounded-xl ${
                    passwordMessage.type === 'success'
                      ? 'bg-[#10B981]/10 text-[#10B981]'
                      : 'bg-[#EF4444]/10 text-[#EF4444]'
                  }`}
                >
                  {passwordMessage.type === 'success' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">{passwordMessage.text}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-[#EF4444] shadow-sm"
          >
            <h2 className="text-base font-bold text-[#EF4444] mb-1.5">Danger Zone</h2>
            <p className="text-xs text-[#9CA3AF] mb-3">
              Once you delete your account, there is no going back.
            </p>
            <button 
              onClick={handleDeleteAccount}
              className="px-3 py-1.5 text-xs bg-[#EF4444] text-white font-semibold rounded-lg hover:bg-[#DC2626] transition-colors"
            >
              {showDeleteConfirm ? 'Click again to confirm deletion' : 'Delete Account'}
            </button>
            {showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="ml-2 px-3 py-1.5 text-xs bg-[#9CA3AF] text-white font-semibold rounded-lg hover:bg-[#6B7280] transition-colors"
              >
                Cancel
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
