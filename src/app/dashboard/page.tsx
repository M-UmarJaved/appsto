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
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#9CA3AF]">Redirecting...</p>
        </div>
      </div>
    </ProtectedRoute>
  )
}
