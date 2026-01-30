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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-10 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4">
            Purchase Successful! 🎉
          </h1>
          
          <p className="text-xl text-dark-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          
          {orderId && (
            <p className="text-sm text-dark-500 mt-2">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}
        </div>

        <Card className="animate-slide-up mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-dark-900 mb-6">What's Next?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center mr-4">
                  <Mail className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-900 mb-1">Check Your Email</h3>
                  <p className="text-dark-600">
                    We've sent a confirmation email with your license token and download link.
                    Please check your inbox (and spam folder just in case).
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center mr-4">
                  <Download className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-900 mb-1">Download Your Software</h3>
                  <p className="text-dark-600">
                    Use the download link in your email to get the application installer.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center mr-4">
                  <FileText className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-900 mb-1">Activate Your License</h3>
                  <p className="text-dark-600">
                    Launch the application and enter your unique license token when prompted.
                    After activation, the software works 100% offline.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-50 border-brand-200 animate-slide-up mb-8" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <h3 className="font-bold text-brand-900 mb-3">📧 Email Not Received?</h3>
            <ul className="space-y-2 text-sm text-brand-800">
              <li>• Check your spam/junk folder</li>
              <li>• Wait a few minutes (emails can take 5-10 minutes)</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Contact our support team at{' '}
                <a href="mailto:support@appsto.software" className="font-semibold underline">
                  support@appsto.software
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button size="lg">
              Browse More Products <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/support">
            <Button size="lg" variant="outline">
              Get Support
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-dark-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@appsto.software" className="text-brand-600 hover:text-brand-700 font-medium">
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
