'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { CheckCircle, Download, Mail, FileText, ArrowRight } from 'lucide-react'

function PurchaseSuccessContent() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const orderId = searchParams.get('order')

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] pt-40 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-10 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-4">
            Purchase Successful! 🎉
          </h1>
          
          <p className="text-xl text-[#6B7280] dark:text-[#9CA3AF]">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          
          {orderId && (
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-2">
              Order ID: <span className="font-mono bg-[#F3F4F6] dark:bg-[#1F2937] px-2 py-1 rounded">{orderId}</span>
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-xl border border-[#E5E7EB] dark:border-[#1F2937] p-8 mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-6">What's Next?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] dark:from-[#1E3A8A] dark:to-[#1E40AF] rounded-full flex items-center justify-center mr-4">
                <Mail className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-1">Check Your Email</h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                  We've sent a confirmation email with your license token and download link.
                  Please check your inbox (and spam folder just in case).
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] dark:from-[#1E3A8A] dark:to-[#1E40AF] rounded-full flex items-center justify-center mr-4">
                <Download className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-1">Download Your Software</h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                  Use the download link in your email to get the application installer.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] dark:from-[#1E3A8A] dark:to-[#1E40AF] rounded-full flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-1">Activate Your License</h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                  Launch the application and enter your unique license token when prompted.
                  After activation, the software works 100% offline.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] dark:from-[#1E3A8A]/20 dark:to-[#1E40AF]/20 border border-[#3B82F6]/20 dark:border-[#3B82F6]/30 rounded-2xl p-6 mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="font-bold text-[#1E40AF] dark:text-[#60A5FA] mb-3 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Email Not Received?
          </h3>
          <ul className="space-y-2 text-sm text-[#374151] dark:text-[#D1D5DB]">
            <li className="flex items-start">
              <span className="text-[#3B82F6] mr-2">•</span>
              Check your spam/junk folder
            </li>
            <li className="flex items-start">
              <span className="text-[#3B82F6] mr-2">•</span>
              Wait a few minutes (emails can take 5-10 minutes)
            </li>
            <li className="flex items-start">
              <span className="text-[#3B82F6] mr-2">•</span>
              Make sure you entered the correct email address
            </li>
            <li className="flex items-start">
              <span className="text-[#3B82F6] mr-2">•</span>
              Contact our support team at{' '}
              <a href="mailto:support@appsto.software" className="font-semibold text-[#3B82F6] hover:text-[#2563EB] underline ml-1">
                support@appsto.software
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white shadow-lg"
            >
              Browse More Products <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/support">
            <Button 
              size="lg" 
              variant="outline"
              className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/10"
            >
              Get Support
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            Need help? Contact us at{' '}
            <a href="mailto:support@appsto.software" className="text-[#3B82F6] hover:text-[#2563EB] font-medium">
              support@appsto.software
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PurchaseSuccessContent />
    </Suspense>
  )
}
