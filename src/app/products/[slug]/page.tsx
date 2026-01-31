'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { supabase, type Product } from '@/lib/supabase'
import { useCurrency } from '@/components/ui/CurrencySwitcher'
import { DESKSWEEP_PRICING, formatPrice } from '@/lib/currency'
import { getRegionalReviews, formatReviewText } from '@/lib/reviews'
import { useAuth } from '@/contexts/AuthContext'
import {
  Package,
  Download,
  Shield,
  CheckCircle,
  ArrowLeft,
  Star,
  Zap,
  Clock,
  FileText,
  Sparkles,
  FolderSync,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const { currency, isLoading: currencyLoading } = useCurrency()
  const regionalReviews = getRegionalReviews(currency)
  const { user } = useAuth()

  useEffect(() => {
    loadProduct()
  }, [params.slug])

  async function loadProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', params.slug)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error loading product:', error)
        // Use mock data for demo
        setProduct(getMockProduct(params.slug as string))
      } else {
        setProduct(data)
      }
    } catch (err) {
      console.error('Error:', err)
      setProduct(getMockProduct(params.slug as string))
    } finally {
      setLoading(false)
    }
  }

  async function handlePurchase() {
    if (!product) return

    // Check if user is authenticated
    if (!user) {
      // Redirect to login page with return URL
      router.push(`/signin?redirect=/products/${params.slug}`)
      return
    }

    setPurchasing(true)

    try {
      // Initialize Paddle Checkout
      // @ts-ignore - Paddle is loaded via script tag
      if (window.Paddle) {
        // @ts-ignore
        window.Paddle.Environment.set(process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox')
        
        // @ts-ignore
        window.Paddle.Checkout.open({
          product: product.paddle_product_id,
          email: user.email || '', // Pre-fill with logged-in user's email
          successCallback: (data: any) => {
            console.log('Purchase successful:', data)
            // Redirect to success page
            window.location.href = `/purchase/success?order=${data.checkout.id}`
          },
          closeCallback: () => {
            setPurchasing(false)
          },
        })
      } else {
        alert('Payment system not initialized. Please refresh the page.')
        setPurchasing(false)
      }
    } catch (error) {
      console.error('Purchase error:', error)
      alert('An error occurred. Please try again.')
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#3B82F6]" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] flex items-center justify-center">
        <div className="text-center">
          <Package className="w-20 h-20 text-[#9CA3AF] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-2">Product not found</h2>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] pt-24">
      {/* Load Paddle.js */}
      <script
        src={`https://cdn.paddle.com/paddle/paddle.js`}
        async
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link
          href="/products"
          className="inline-flex items-center text-[#3B82F6] hover:text-[#2563EB] mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        {/* Hero Section - Image and Description */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] rounded-2xl overflow-hidden shadow-2xl min-h-[500px] relative">
              <Image
                src="/DeskSweep/DeskSweepProductPage.png"
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Right Column - Description Aligned with Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center space-y-6"
          >
            {/* Badges */}
            <div className="flex items-center gap-2">
              <Badge 
                variant="success"
                className="text-base font-semibold"
              >
                💎 One-Time Purchase
              </Badge>
              <div className="bg-gradient-to-r from-[#F59E0B] to-[#EAB308] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                LIFETIME ACCESS
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-[#0B1220] dark:text-[#E5E7EB]">{product.name}</h1>
            
            {/* Description */}
            <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
                ))}
              </div>
              <span className="text-[#6B7280] dark:text-[#9CA3AF] font-medium">4.8 (234 reviews)</span>
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">14-day guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-[#3B82F6]" />
                <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Instant delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Lifetime updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Works offline</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pricing Section - Horizontal Cards */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF]">
              One-time payment. Lifetime access. No subscriptions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {DESKSWEEP_PRICING.map((plan, index) => {
              const isPopular = plan.id === 'squad'
              const price = plan.prices[currency]
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)' }}
                  className={`relative ${
                    isPopular 
                      ? 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-2xl scale-105' 
                      : 'bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937]'
                  } rounded-2xl p-8`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#F59E0B] text-white px-4 py-1.5 text-sm font-bold shadow-lg">
                        MOST POPULAR
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-[#0B1220] dark:text-[#E5E7EB]'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${isPopular ? 'text-white/80' : 'text-[#6B7280] dark:text-[#9CA3AF]'}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-4xl font-bold ${isPopular ? 'text-white' : 'text-[#3B82F6]'}`}>
                        {formatPrice(price, currency)}
                      </span>
                    </div>
                    <p className={`text-sm mt-2 ${isPopular ? 'text-white/70' : 'text-[#9CA3AF]'}`}>
                      one-time payment
                    </p>
                    {plan.savings && (
                      <Badge className="mt-2 bg-[#10B981] text-white">
                        Save {plan.savings}
                      </Badge>
                    )}
                  </div>

                  <Button
                    className={`w-full mb-6 ${
                      isPopular
                        ? 'bg-white text-[#3B82F6] hover:bg-[#F9FAFB]'
                        : 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white hover:from-[#2563EB] hover:to-[#1D4ED8]'
                    }`}
                    onClick={handlePurchase}
                    isLoading={purchasing}
                  >
                    {purchasing ? 'Processing...' : user ? 'Buy Now' : 'Sign In to Purchase'}
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isPopular ? 'text-white' : 'text-[#10B981]'}`} />
                        <span className={`text-sm ${isPopular ? 'text-white/90' : 'text-[#6B7280] dark:text-[#9CA3AF]'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Customer Reviews - Infinite Scroll */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20 overflow-hidden"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-4">
              Loved by Thousands
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF]">
              See what our customers are saying about DeskSweep
            </p>
          </div>

          <div className="relative">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F9FAFB] dark:from-[#0B1220] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F9FAFB] dark:from-[#0B1220] to-transparent z-10" />

            {/* Scrolling Reviews Container */}
            <motion.div
              className="flex gap-6"
              animate={{
                x: [0, -2400],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
              whileHover={{ animationPlayState: "paused" }}
            >
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-6 flex-shrink-0">
                  {regionalReviews.map((review, idx) => (
                    <motion.div
                      key={`${setIndex}-${idx}`}
                      whileHover={{ scale: 1.02, animationPlayState: "paused" }}
                      className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#1F2937] w-[400px] flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex gap-1 mb-4">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                        ))}
                      </div>
                      <p className="text-[#0B1220] dark:text-[#E5E7EB] mb-6 leading-relaxed">
                        &ldquo;{formatReviewText(review, currency)}&rdquo;
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB] dark:border-[#1F2937]">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          <Image 
                            src={review.avatar} 
                            alt={review.name} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-[#0B1220] dark:text-[#E5E7EB] font-semibold">{review.name}</p>
                          <p className="text-[#9CA3AF] text-sm">{review.title}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section - Horizontal Layout */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF]">
              Everything you need to keep your desktop organized
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-[#3B82F6]" />,
                title: 'One-Click Clean',
                description: 'Instantly scan your desktop and solve chaos in seconds. No manual sorting required.'
              },
              {
                icon: <Zap className="w-8 h-8 text-[#F59E0B]" />,
                title: 'Auto-Pilot Mode',
                description: 'File Watcher runs silently in the background, organizing files the second they are downloaded.'
              },
              {
                icon: <Clock className="w-8 h-8 text-[#10B981]" />,
                title: 'Scheduled Cleaning',
                description: 'Set it to run every day at 6 PM or any time you choose. Completely automated desktop maintenance.'
              },
              {
                icon: <FolderSync className="w-8 h-8 text-[#8B5CF6]" />,
                title: 'Smart Rules Engine',
                description: 'Sort by file type, name, size, or date. Create powerful rules like "Move .jpg to Images" or "Archive files older than 30 days."'
              },
              {
                icon: <Shield className="w-8 h-8 text-[#06B6D4]" />,
                title: 'Preview & Safety',
                description: 'See exactly what will happen before it happens. Files are moved, never deleted. Complete activity history included.'
              },
              {
                icon: <FileText className="w-8 h-8 text-[#EF4444]" />,
                title: 'System Integration',
                description: 'Tray agent keeps taskbar clean. Auto-startup with Windows. Optimized .NET 8 performance with low memory usage.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)' }}
                className="bg-white dark:bg-[#111827] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#1F2937] hover:border-[#3B82F6] dark:hover:border-[#3B82F6] transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  )
}

// Mock product for demo
function getMockProduct(slug: string): Product {
  // Single product: DeskSweep
  return {
    id: '1',
    name: 'DeskSweep',
    slug: 'desksweep',
    description: 'The ultimate desktop cleaner and file organizer for Windows. DeskSweep automatically sorts your files with intelligent rules, scheduled cleaning, and background automation. One-click clean, auto-pilot mode, and smart sorting rules keep your workspace organized. Non-destructive file movement with complete activity history. Say goodbye to desktop chaos and hello to productivity.',
    short_description: 'Intelligent desktop cleaner with auto-sorting and file organization',
    price: 49.00,
    currency: 'USD',
    product_type: 'one_time',
    paddle_product_id: 'pro_desksweep001',
    features: [
      'One-Click Clean: Instantly scan and solve desktop chaos',
      'Auto-Pilot Mode: Silent background file organization',
      'Scheduled Cleaning: Daily automation at your chosen time',
      'Smart Rules Engine: Sort by type, name, size, or date',
      'Preview Mode: See changes before they happen',
      'Non-Destructive: Files moved, never deleted',
      'Activity History: Complete log of every file moved',
      'Tray Agent: Minimizes to system tray',
      'Auto-Startup: Launches with Windows',
      'Lifetime free updates and email support'
    ],
    screenshots: [],
    demo_video_url: 'https://youtube.com/demo',
    system_requirements: {
      os: ['Windows 10/11 (64-bit)'],
      processor: 'Dual-core processor 2.0 GHz or higher',
      memory: '4GB RAM minimum (8GB recommended)',
      storage: '100MB available space for installation'
    },
    icon_url: '',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}
