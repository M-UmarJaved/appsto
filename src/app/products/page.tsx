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

      <div className="min-h-screen bg-[#FAFAFA] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        {/* Subtle studio radial background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(114,60,251,0.04)_0%,_transparent_60%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-purple-50 px-3.5 py-1.5 rounded-full mb-5 border border-purple-100 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#723CFB]" />
              <span className="text-[#723CFB] font-semibold text-xs">Curated Software & SaaS</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 text-[#060C17]"
            >
              Appsto Catalog
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              Discover high-utility desktop software and modern AI SaaS applications. Authoritative licensing, multi-currency checkout, and instant delivery.
            </motion.p>
          </div>

          {/* Filter Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mb-14"
          >
            <div className="inline-flex bg-white rounded-full p-1.5 border border-slate-200 shadow-sm">
              {[
                { key: 'all', label: 'All Products' },
                { key: 'one_time', label: 'One-Time Purchase' },
                { key: 'subscription', label: 'Subscription' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as typeof filter)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    filter === tab.key
                      ? 'bg-[#723CFB] text-white shadow-md shadow-purple-500/20'
                      : 'text-slate-600 hover:text-[#060C17]'
                  }`}
                >
                  {tab.label}
                </button>
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
                  className="bg-white border border-slate-200 rounded-2xl h-[480px] shadow-sm"
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
                <Package className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-[#060C17] mb-2">No products found</h3>
              <p className="text-slate-500">Check back soon for new applications!</p>
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
                    className="relative overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-purple-200 rounded-3xl h-full transition-all duration-300"
                  >
                    {/* Native Product Brand Tag */}
                    {product.slug === 'desksweep' ? (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-[#F59E0B] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 uppercase tracking-wider">
                          <Sparkles className="w-3 h-3" /> LIFETIME ACCESS
                        </div>
                      </div>
                    ) : product.slug === 'skillnavo' ? (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-[#723CFB] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 uppercase tracking-wider">
                          <Sparkles className="w-3 h-3" /> MONTHLY SUBSCRIPTION
                        </div>
                      </div>
                    ) : (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-[#060C17] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 uppercase tracking-wider">
                          <Sparkles className="w-3 h-3" /> {product.product_type === 'one_time' ? 'LIFETIME' : 'SUBSCRIPTION'}
                        </div>
                      </div>
                    )}

                    <CardHeader>
                      {/* Product Image/Logo Box */}
                      <div 
                        className="w-full h-52 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative border border-slate-200/60"
                      >
                        {product.slug === 'desksweep' ? (
                          <Image
                            src="/DeskSweep/DeskSweepLogo.png"
                            alt={product.name}
                            width={200}
                            height={200}
                            className="object-contain transition-all group-hover:scale-105 duration-300 p-4"
                          />
                        ) : product.slug === 'skillnavo' ? (
                          <Image
                            src="/Skillnavo/SkillnavoIcon.png"
                            alt="Skillnavo"
                            width={130}
                            height={130}
                            className="object-contain rounded-3xl shadow-sm transition-all group-hover:scale-105 duration-300 p-2"
                          />
                        ) : product.icon_url ? (
                          <Image
                            src={product.icon_url}
                            alt={product.name}
                            width={140}
                            height={140}
                            className="object-contain transition-all group-hover:scale-105 duration-300"
                          />
                        ) : (
                          <Package className="w-20 h-20 text-slate-400" />
                        )}
                      </div>
                      
                      {/* Product Type Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        {product.slug === 'desksweep' ? (
                          <Badge variant="lifetime" className="font-semibold text-xs px-2.5 py-0.5 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" /> Desktop Utility (Lifetime)
                          </Badge>
                        ) : product.slug === 'skillnavo' ? (
                          <Badge variant="accent" className="font-semibold text-xs px-2.5 py-0.5 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" /> SaaS Platform (Subscription)
                          </Badge>
                        ) : (
                          <Badge variant={product.product_type === 'one_time' ? 'lifetime' : 'subscription'} className="font-semibold text-xs px-2.5 py-0.5 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" /> {product.product_type === 'one_time' ? 'One-Time License' : 'Subscription'}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-[#060C17] mt-2 group-hover:text-[#723CFB] transition-colors">
                        {product.name}
                      </h3>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-slate-600 mb-4 line-clamp-2 text-sm leading-relaxed">{product.short_description}</p>
                      
                      {/* Reviews Section */}
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= 5
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-slate-900">5.0</span>
                        <span className="text-xs text-slate-400">(Verified Users)</span>
                      </div>
                      
                      {/* Price Section */}
                      <div className="flex items-baseline mb-4">
                        {product.slug === 'desksweep' ? (
                          <>
                            {!paddleLoading && paddlePrices.get(PADDLE_PRICE_IDS.solo) ? (
                              <>
                                <span className="text-3xl font-extrabold text-[#060C17]">
                                  {paddlePrices.get(PADDLE_PRICE_IDS.solo)?.formattedPrice}
                                </span>
                                <span className="text-slate-500 ml-2 text-sm font-medium">one-time</span>
                              </>
                            ) : (
                              <>
                                <span className="text-3xl font-extrabold text-[#060C17]">
                                  {paddleLoading ? 'Loading...' : '$49.00'}
                                </span>
                                <span className="text-slate-500 ml-2 text-sm font-medium">one-time</span>
                              </>
                            )}
                          </>
                        ) : product.slug === 'skillnavo' ? (
                          <>
                            <span className="text-3xl font-extrabold text-[#060C17]">
                              $4.99
                            </span>
                            <span className="text-slate-500 ml-2 text-sm font-medium">/month</span>
                            <span className="text-xs text-[#723CFB] bg-purple-50 px-2.5 py-0.5 rounded-full font-medium ml-auto border border-purple-200/60">
                              Starter Tier
                            </span>
                          </>
                        ) : product.product_type === 'subscription' ? (
                          <>
                            <span className="text-3xl font-extrabold text-[#060C17]">
                              ${product.price}
                            </span>
                            <span className="text-slate-500 ml-2 text-sm">/month</span>
                          </>
                        ) : (
                          <>
                            <span className="text-3xl font-extrabold text-[#060C17]">
                              {formatPriceUtil(product.price, product.currency)}
                            </span>
                            <span className="text-slate-500 ml-2 text-sm">one-time</span>
                          </>
                        )}
                      </div>
                      
                      {/* Feature highlights */}
                      <div className="space-y-2">
                        {product.features && product.features.slice(0, 3).map((feature, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start text-xs text-slate-600"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Key Info Footer */}
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          {product.product_type === 'one_time' ? (
                            <>
                              <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                Solo License
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                Windows 10/11
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-[#723CFB] rounded-full"></span>
                                Cloud Web App
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                Cancel Anytime
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Link href={`/products/${product.slug}`} className="w-full">
                        {product.slug === 'skillnavo' ? (
                          <button
                            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold bg-[#723CFB] hover:bg-[#5F27E5] text-white shadow-md shadow-purple-500/20 hover:shadow-lg transition-all text-sm"
                          >
                            View Plans & Subscribe
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        ) : (
                          <button
                            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold bg-[#060C17] hover:bg-[#723CFB] text-white shadow-sm transition-all text-sm"
                          >
                            View Product Details
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}
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
            className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-slate-200 shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(114,60,251,0.05)_0%,_transparent_70%)] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-[#060C17]">
                Looking for Specific Software?
              </h2>
              <p className="text-slate-600 mb-8 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                We are constantly onboarding innovative software creators and enterprise utilities. Reach out to request a tool or partner with our marketplace.
              </p>
              <Link href="/contact">
                <button 
                  className="inline-flex items-center gap-2 bg-[#723CFB] hover:bg-[#5F27E5] text-white font-semibold py-3.5 px-8 rounded-full shadow-md shadow-purple-500/20 hover:shadow-lg transition-all text-sm"
                >
                  Contact Marketplace Team
                  <ArrowUpRight className="w-4 h-4" />
                </button>
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
    },
    {
      id: '2',
      name: 'Skillnavo',
      slug: 'skillnavo',
      description: 'AI-powered technical skill roadmap platform, interactive code diagnostics, and adaptive practice engineering. Master technical skills with personalized roadmaps and continuous feedback.',
      short_description: 'AI-powered technical skill roadmaps & interactive code diagnostics',
      price: 4.99,
      currency: 'USD',
      product_type: 'subscription',
      paddle_product_id: 'pro_skillnavo',
      features: [
        'AI-Powered Personalized Skill Roadmaps',
        'Interactive Code Diagnostics & Challenges',
        'Adaptive Practice Engineering & Streaks',
        'Milestone Certificates & Portfolio Badges',
        'Cloud Progress Sync Across All Devices',
        'Priority AI Model Inferences'
      ],
      screenshots: [],
      system_requirements: {
        os: ['Cross-Platform Web App'],
        processor: 'Modern Web Browser',
        memory: '2GB RAM minimum',
        storage: 'Web-based application'
      },
      icon_url: '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ]
}

