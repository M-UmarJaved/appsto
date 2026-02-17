'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { motion } from 'motion/react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { supabase, type Product } from '@/lib/supabase'
import { formatPrice as formatPriceUtil } from '@/lib/utils'
import { Package, ArrowRight, ArrowUpRight, Sparkles, CheckCircle, Star } from 'lucide-react'
import { DESKSWEEP_PRICING } from '@/lib/currency'
import { usePaddlePrices, PADDLE_PRICE_IDS } from '@/hooks/usePaddlePrices'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'one_time' | 'subscription'>('all')
  const { prices: paddlePrices, isLoading: paddleLoading } = usePaddlePrices()

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading products:', error)
        setProducts(getMockProducts())
      } else {
        setProducts(data || getMockProducts())
      }
    } catch (err) {
      console.error('Error:', err)
      setProducts(getMockProducts())
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) => filter === 'all' || product.product_type === filter
  )

  return (
    <>
      {/* Load Paddle.js for price fetching */}
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F8FAFC] to-[#EFF6FF] dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#0B1220]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08)_0%,_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15)_0%,_transparent_50%)]" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 rounded-full blur-[100px]"
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-[#22D3EE]/10 dark:bg-[#22D3EE]/15 rounded-full blur-[120px]"
          animate={{ y: [0, 20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-[#3B82F6] font-semibold text-sm">Premium Software</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-[#0B1220] dark:text-[#E5E7EB]"
            >
              Our{' '}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">
                Products
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[#9CA3AF] max-w-3xl mx-auto leading-relaxed"
            >
              Explore our curated collection of enterprise-grade SaaS applications. From productivity tools to development platforms—find the perfect software solution for your business with secure licensing and instant delivery.
            </motion.p>
          </div>

          {/* Filter Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mb-16"
          >
            <div className="inline-flex bg-white dark:bg-[#111827] rounded-2xl p-1.5 shadow-xl border border-[#E5E7EB] dark:border-[#1F2937]">
              {[
                { key: 'all', label: 'All Products' },
                { key: 'one_time', label: 'One-Time Purchase' },
                { key: 'subscription', label: 'Subscription' }
              ].map((tab) => (
                <motion.button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as typeof filter)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    filter === tab.key
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-lg'
                      : 'text-[#9CA3AF] hover:text-[#3B82F6]'
                  }`}
                  whileHover={{ scale: filter === tab.key ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div 
                  key={i} 
                  className="bg-white dark:bg-[#111827] rounded-2xl h-[480px] shadow-lg"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Package className="w-20 h-20 text-[#9CA3AF] mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-2">No products found</h3>
              <p className="text-[#9CA3AF]">Check back soon for new applications!</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card
                    hover
                    className="relative overflow-hidden bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-lg h-full"
                  >
                    {/* Premium Badge */}
                    {product.product_type === 'one_time' && (
                      <motion.div 
                        className="absolute top-4 right-4 z-10"
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                      >
                        <div className="bg-gradient-to-r from-[#F59E0B] to-[#EAB308] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" /> LIFETIME ACCESS
                        </div>
                      </motion.div>
                    )}

                    <CardHeader>
                      {/* Product Image/Logo */}
                      <motion.div 
                        className="w-full h-52 bg-gradient-to-br from-white to-[#F9FAFB] dark:from-[#1F2937] dark:to-[#111827] rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative border border-[#E5E7EB] dark:border-[#1F2937]"
                        whileHover={{ scale: 1.02 }}
                      >
                        {product.slug === 'desksweep' ? (
                          <Image
                            src="/DeskSweep/DeskSweepLogo.png"
                            alt={product.name}
                            width={200}
                            height={200}
                            className="object-contain transition-all group-hover:scale-110 duration-500 p-4"
                          />
                        ) : product.icon_url ? (
                          <Image
                            src={product.icon_url}
                            alt={product.name}
                            width={140}
                            height={140}
                            className="object-contain transition-all group-hover:scale-110 duration-500"
                          />
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <Package className="w-24 h-24 text-[#9CA3AF]" />
                          </motion.div>
                        )}
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#3B82F6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </motion.div>
                      
                      {/* Product Type Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <Badge 
                          variant={product.product_type === 'one_time' ? 'success' : 'default'}
                          className="font-semibold text-xs px-3 py-1 flex items-center gap-1.5">
                          {product.product_type === 'one_time' ? (
                            <><Sparkles className="w-3 h-3" /> One-Time Purchase</>
                          ) : (
                            <><ArrowRight className="w-3 h-3" /> Subscription</>
                          )}
                        </Badge>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mt-4 group-hover:text-[#3B82F6] transition-colors">
                        {product.name}
                      </h3>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-[#9CA3AF] mb-4 line-clamp-2">{product.short_description}</p>
                      
                      {/* Reviews Section */}
                      <motion.div 
                        className="flex items-center gap-2 mb-4 pb-4 border-b border-[#E5E7EB] dark:border-[#1F2937]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= 4.8
                                  ? 'fill-[#F59E0B] text-[#F59E0B]'
                                  : 'text-[#D1D5DB] dark:text-[#4B5563]'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB]">4.8</span>
                        <span className="text-sm text-[#9CA3AF]">(234 reviews)</span>
                      </motion.div>
                      
                      {/* Price - Solo Plan with Paddle Pricing */}
                      <div className="flex items-baseline mb-4">
                        {product.slug === 'desksweep' ? (
                          <>
                            {!paddleLoading && paddlePrices.get(PADDLE_PRICE_IDS.solo) ? (
                              <>
                                <span className="text-3xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#2563EB] bg-clip-text text-transparent">
                                  {paddlePrices.get(PADDLE_PRICE_IDS.solo)?.formattedPrice}
                                </span>
                                <span className="text-[#9CA3AF] ml-2 text-sm">one-time</span>
                              </>
                            ) : (
                              <>
                                <span className="text-3xl font-bold text-[#9CA3AF]">
                                  {paddleLoading ? 'Loading...' : 'N/A'}
                                </span>
                                <span className="text-[#9CA3AF] ml-2 text-sm">one-time</span>
                              </>
                            )}
                          </>
                        ) : product.product_type === 'subscription' ? (
                          <>
                            <span className="text-3xl font-bold text-[#10B981]">FREE</span>
                            <span className="text-[#9CA3AF] ml-2 text-sm">then from ${product.price}/mo</span>
                          </>
                        ) : (
                          <>
                            <span className="text-3xl font-bold text-[#3B82F6]">
                              {formatPriceUtil(product.price, product.currency)}
                            </span>
                            <span className="text-[#9CA3AF] ml-2 text-sm line-through">
                              {formatPriceUtil(product.price * 1.5, product.currency)}
                            </span>
                          </>
                        )}
                      </div>
                      
                      {/* Feature highlights */}
                      <div className="space-y-2">
                        {product.features && product.features.slice(0, 3).map((feature, idx) => (
                          <motion.div 
                            key={idx} 
                            className="flex items-start text-sm text-[#9CA3AF]"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                          >
                            <CheckCircle className="w-4 h-4 text-[#10B981] mr-2 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Key Info */}
                      <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-[#1F2937]">
                        <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                          {product.product_type === 'one_time' ? (
                            <>
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 bg-[#10B981] rounded-full"></span>
                                Instant License
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 bg-[#3B82F6] rounded-full"></span>
                                Offline Usage
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 bg-[#8B5CF6] rounded-full"></span>
                                In-App Billing
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 bg-[#F59E0B] rounded-full"></span>
                                Cancel Anytime
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Link href={`/products/${product.slug}`} className="w-full">
                        <motion.button
                          className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all ${
                            product.product_type === 'one_time'
                              ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white'
                              : 'border-2 border-[#3B82F6] text-[#3B82F6]'
                          }`}
                          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {product.product_type === 'one_time' ? 'Buy Now' : 'Free Download'}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden"
          >
            {/* Background effects */}
            <motion.div
              className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-48 h-48 bg-[#22D3EE]/20 rounded-full blur-3xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            />
            
            <div className="relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Can&apos;t Find What You Need?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-white/90 mb-8 text-lg"
              >
                We&apos;re constantly expanding our SaaS marketplace. Tell us what enterprise software your business needs, and we&apos;ll work to add it to our platform!
              </motion.p>
              <Link href="/contact">
                <motion.button 
                  className="inline-flex items-center gap-2 bg-white text-[#3B82F6] font-semibold py-4 px-8 rounded-full"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Us
                  <ArrowUpRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  )
}

// Mock products for demo/development
function getMockProducts(): Product[] {
  return [
    {
      id: '1',
      name: 'DeskSweep',
      slug: 'desksweep',
      description: 'The ultimate desktop cleaner and file organizer for Windows. DeskSweep automatically sorts your files with intelligent rules, scheduled cleaning, and background automation. Keep your workspace organized with one-click clean and auto-pilot mode.',
      short_description: 'Intelligent desktop cleaner with auto-sorting and file organization',
      price: 49.00,
      currency: 'USD',
      product_type: 'one_time',
      paddle_product_id: 'pro_desksweep001',
      features: [
        'One-Click Clean: Instant desktop organization',
        'Auto-Pilot Mode: Background file watching',
        'Scheduled Cleaning: Set daily cleanup times',
        'Smart Rules: Sort by type, name, size, date',
        'Preview Mode: See before you clean',
        'Activity History: Complete file movement log',
        'System Tray Integration',
        'Low memory usage with .NET 8'
      ],
      screenshots: [],
      system_requirements: {
        os: ['Windows 10/11 (64-bit)'],
        processor: 'Dual-core processor or higher',
        memory: '4GB RAM minimum',
        storage: '100MB available space'
      },
      icon_url: '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ]
}
