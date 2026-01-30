'use client'

import { motion } from 'motion/react'
import { Package, Download, Shield, TrendingUp } from 'lucide-react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    {
      icon: Package,
      label: 'Active Products',
      value: '0',
      change: '+0%',
      color: 'from-[#3B82F6] to-[#2563EB]'
    },
    {
      icon: Download,
      label: 'Total Downloads',
      value: '0',
      change: '+0%',
      color: 'from-[#10B981] to-[#059669]'
    },
    {
      icon: Shield,
      label: 'Active Licenses',
      value: '0',
      change: '+0%',
      color: 'from-[#8B5CF6] to-[#7C3AED]'
    },
    {
      icon: TrendingUp,
      label: 'This Month',
      value: '$0',
      change: '+0%',
      color: 'from-[#F59E0B] to-[#D97706]'
    }
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-[#9CA3AF]">Here's what's happening with your account</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-1">{stat.value}</p>
                <p className="text-sm text-[#9CA3AF]">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-[#111827] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm"
          >
            <h2 className="text-xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-6">Recent Activity</h2>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#0B1220]/5 dark:bg-[#E5E7EB]/5 flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-[#9CA3AF]" />
              </div>
              <p className="text-[#9CA3AF] text-center mb-4">No recent activity yet</p>
              <a
                href="/products"
                className="px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Browse Products
              </a>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <a
              href="/products"
              className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#1F2937] hover:border-[#3B82F6] dark:hover:border-[#3B82F6] transition-all group"
            >
              <Package className="w-8 h-8 text-[#3B82F6] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-2">Browse Products</h3>
              <p className="text-sm text-[#9CA3AF]">Explore our enterprise software catalog</p>
            </a>
            <a
              href="/account"
              className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#1F2937] hover:border-[#3B82F6] dark:hover:border-[#3B82F6] transition-all group"
            >
              <Shield className="w-8 h-8 text-[#10B981] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-2">Account Settings</h3>
              <p className="text-sm text-[#9CA3AF]">Manage your profile and preferences</p>
            </a>
            <a
              href="/support"
              className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#1F2937] hover:border-[#3B82F6] dark:hover:border-[#3B82F6] transition-all group"
            >
              <Download className="w-8 h-8 text-[#8B5CF6] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-2">Get Support</h3>
              <p className="text-sm text-[#9CA3AF]">Need help? Contact our support team</p>
            </a>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
