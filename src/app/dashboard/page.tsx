'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

/**
 * Dashboard Page - Currently Disabled
 * Redirects to account page until dashboard features are implemented
 * based on customer feedback
 */
export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to account page for now
    router.replace('/account')
  }, [router])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#723CFB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Redirecting to account...</p>
        </div>
      </div>
    </ProtectedRoute>
  )
}
