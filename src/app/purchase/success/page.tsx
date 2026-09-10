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
    <div className="min-h-screen bg-[#FAFAFA] pt-40 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-10 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-md shadow-emerald-500/20">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#060C17] mb-4">
            Purchase Successful! 🎉
          </h1>
          
          <p className="text-xl text-slate-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          
          {orderId && (
            <p className="text-sm text-slate-500 mt-2">
              Order ID: <span className="font-mono bg-white text-[#060C17] px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">{orderId}</span>
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-[#060C17] mb-6">What&apos;s Next?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#723CFB]/10 border border-[#723CFB]/20 rounded-2xl flex items-center justify-center mr-4">
                <Mail className="w-6 h-6 text-[#723CFB]" />
              </div>
              <div>
                <h3 className="font-bold text-[#060C17] mb-1">Check Your Email</h3>
                <p className="text-slate-600">
                  We&apos;ve sent a confirmation email with your license token and download link.
                  Please check your inbox (and spam folder just in case).
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#723CFB]/10 border border-[#723CFB]/20 rounded-2xl flex items-center justify-center mr-4">
                <Download className="w-6 h-6 text-[#723CFB]" />
              </div>
              <div>
                <h3 className="font-bold text-[#060C17] mb-1">Download Your Software</h3>
                <p className="text-slate-600">
                  Use the download link in your email to get the application installer.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#723CFB]/10 border border-[#723CFB]/20 rounded-2xl flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-[#723CFB]" />
              </div>
              <div>
                <h3 className="font-bold text-[#060C17] mb-1">Activate Your License</h3>
                <p className="text-slate-600">
                  Launch the application and enter your unique license token when prompted.
                  After activation, the software works 100% offline.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="font-bold text-[#060C17] mb-3 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-[#723CFB]" />
            Email Not Received?
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start">
              <span className="text-[#723CFB] font-bold mr-2">•</span>
              Check your spam/junk folder
            </li>
            <li className="flex items-start">
              <span className="text-[#723CFB] font-bold mr-2">•</span>
              Wait a few minutes (emails can take 5-10 minutes)
            </li>
            <li className="flex items-start">
              <span className="text-[#723CFB] font-bold mr-2">•</span>
              Make sure you entered the correct email address
            </li>
            <li className="flex items-start">
              <span className="text-[#723CFB] font-bold mr-2">•</span>
              Contact our support team at{' '}
              <a href="mailto:support@appsto.software" className="font-semibold text-[#723CFB] underline ml-1">
                support@appsto.software
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button 
              size="lg"
              className="bg-[#723CFB] hover:bg-[#5F27E5] text-white shadow-md shadow-purple-500/20"
            >
              Browse More Products <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/support">
            <Button 
              size="lg" 
              variant="outline"
              className="border-slate-300 text-[#060C17] hover:bg-slate-50"
            >
              Get Support
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@appsto.software" className="text-[#723CFB] hover:underline font-medium">
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
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#723CFB] mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <PurchaseSuccessContent />
    </Suspense>
  )
}
