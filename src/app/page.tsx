'use client'

import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowUpRight,
  Sparkles,
  Star,
  Lightbulb,
  Target,
  BarChart3,
  Layers,
  Cpu,
  Plus,
  Users,
  Activity,
  Folder
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { PricingSection } from '@/components/sections/PricingSection'
import { useCurrency } from '@/components/ui/CurrencySwitcher'
import { getFeaturedReview, formatReviewText } from '@/lib/reviews'
import { formatPrice } from '@/lib/currency'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { currency } = useCurrency()
  const featuredReview = getFeaturedReview(currency)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Load Paddle.js for price fetching */}
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="afterInteractive"
      />
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Appsto',
            url: 'https://appsto.software',
            description: 'The premier marketplace for student entrepreneurs and solo developers to buy and sell software tools like DeskSweep.',
            publisher: {
              '@type': 'Organization',
              name: 'Appsto.Software',
              logo: {
                '@type': 'ImageObject',
                url: 'https://appsto.software/Logo.png',
              },
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://appsto.software/products?search={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      <div className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-16 bg-white">
        {/* Subtle studio radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(114,60,251,0.05)_0%,_transparent_60%)] pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-32 text-center">
          {/* Main Heading with staggered word animation */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight text-[#060C17]"
          >
            {['Building', 'bold', 'software', 'with'].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="inline-block mr-4"
              >
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span 
              initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="italic font-normal font-serif inline-block"
            >
              thoughtful
            </motion.span>
            <br />
            <motion.span 
              initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="italic font-normal font-serif inline-block"
            >
              design
            </motion.span>
          </motion.h1>
          
          {/* Subtitle with fade-up */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            The software and SaaS marketplace. Discover, purchase, and manage professional applications with secure licensing, instant delivery, and lifetime support—all in one powerful platform.
          </motion.p>
          
          {/* CTA Button + Social Proof Row */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            {/* CTA Button */}
            <Link href="/products">
              <motion.button 
                className="group relative flex items-center gap-3 bg-[#723CFB] hover:bg-[#5F27E5] text-white font-semibold py-3.5 px-8 rounded-full shadow-lg shadow-purple-500/25 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Explore Marketplace</span>
                <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
            </Link>
            
            {/* Avatar Group + Rating */}
            <div className="flex items-center gap-4">
              {/* Animated Avatar Stack */}
              <div className="flex -space-x-3">
                {[
                  { img: 'https://i.pravatar.cc/150?img=12' },
                  { img: 'https://i.pravatar.cc/150?img=47' },
                  { img: 'https://i.pravatar.cc/150?img=32' },
                  { img: 'https://i.pravatar.cc/150?img=68' }
                ].map((avatar, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 1.3 + i * 0.1, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    className="relative w-11 h-11 rounded-full border-2 border-white cursor-pointer shadow-md overflow-hidden"
                  >
                    <Image 
                      src={avatar.img} 
                      alt="Client" 
                      fill 
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              
              {/* Animated Stars */}
              <div className="text-left">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 1.5 + i * 0.1, type: 'spring', stiffness: 300 }}
                    >
                      <Star className={`w-5 h-5 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-400/30 text-yellow-400'}`} />
                    </motion.div>
                  ))}
                </div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="text-sm text-slate-500 font-medium"
                >
                  Trusted by 1000+ clients
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Flagship Applications Section (Skillnavo Priority & DeskSweep) */}
      <section className="py-16 sm:py-24 bg-[#FAFAFA] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-[#723CFB] text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#723CFB]" />
              <span>Flagship Software</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#060C17] mb-4">
              Featured Applications
            </h2>
            <p className="text-lg text-slate-600">
              Built for performance, engineered for scale. Explore our premier software tools designed for ambitious creators and developers.
            </p>
          </motion.div>

          <div className="space-y-12">
            {/* 1. Skillnavo Flagship Card (Top Priority) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 80 }}
              className="relative rounded-3xl overflow-hidden bg-white border-2 border-purple-200/80 shadow-xl hover:shadow-2xl transition-all"
            >
              <Link href="/products/skillnavo" className="group block">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Left Section - Content */}
                  <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <Image
                          src="/Skillnavo/SkillnavoIcon.png"
                          alt="Skillnavo Logo"
                          width={48}
                          height={48}
                          className="rounded-xl shadow-xs"
                        />
                        <div>
                          <span className="text-xs font-bold text-[#723CFB] uppercase tracking-wider block">AI Platform • Flagship SaaS</span>
                          <span className="text-xs text-slate-500">Subscription Platform</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-[#060C17] mb-3">Skillnavo</h3>
                      <p className="text-sm font-semibold text-[#723CFB] mb-4">
                        Master Modern Software Engineering with AI Diagnostics
                      </p>
                      <p className="text-base text-slate-600 leading-relaxed mb-6">
                        Personalized engineering roadmaps, interactive code diagnostics, real-time AI mentoring, and verified certificates designed for ambitious developers.
                      </p>
                      
                      {/* Features Tags */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {['AI Code Diagnostics', 'Personalized Roadmaps', 'Interactive Coding', 'Verified Certificates'].map((tag, j) => (
                          <motion.span 
                            key={j} 
                            className="px-3 py-1.5 bg-purple-50 rounded-lg text-xs font-semibold text-[#723CFB] border border-purple-100"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + j * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                          { label: '50K+ Inferences', Icon: Cpu },
                          { label: '4.9★ Rating', Icon: Star },
                          { label: '100+ Roadmaps', Icon: Target }
                        ].map((stat, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="text-left"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <stat.Icon className="w-4 h-4 text-[#723CFB]" />
                              <p className="text-sm font-bold text-[#060C17]">{stat.label.split(' ')[0]}</p>
                            </div>
                            <p className="text-xs text-slate-500">{stat.label.split(' ')[1]}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-8">
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 px-6 py-3.5 bg-[#723CFB] hover:bg-[#5F27E5] text-white font-semibold rounded-xl transition-all shadow-md shadow-purple-500/20"
                      >
                        Explore Skillnavo
                        <ArrowUpRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Right Section - Product Image */}
                  <div className="relative bg-slate-50 p-0 flex items-center justify-center min-h-96 lg:min-h-full border-t lg:border-t-0 lg:border-l border-slate-100">
                    <motion.div 
                      className="relative w-full h-full overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src="/Skillnavo/Skillnavo.png"
                        alt="Skillnavo AI Platform Interface"
                        width={1200}
                        height={800}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* 2. DeskSweep Featured Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 80 }}
              className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/products/desksweep" className="group block">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Left Section - Content */}
                  <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-white">
                    <div>
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 border border-amber-100">
                        <Layers className="w-6 h-6 text-amber-500" />
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-[#060C17] mb-3">DeskSweep</h3>
                      <p className="text-sm font-semibold text-amber-600 mb-4">
                        Intelligent Desktop Organizer & File Manager
                      </p>
                      <p className="text-base text-slate-600 leading-relaxed mb-6">
                        Transform your messy desktop into an organized workspace. Auto-sort files, find duplicates, and boost productivity with intelligent file management.
                      </p>
                      
                      {/* Features Tags */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {['Desktop Cleaner', 'Auto-Sorting', 'Duplicate Finder'].map((tag, j) => (
                          <motion.span 
                            key={j} 
                            className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + j * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                          { label: '10K+ Users', Icon: Users },
                          { label: '4.9★ Rating', Icon: Star },
                          { label: '1M+ Files', Icon: Folder }
                        ].map((stat, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="text-left"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <stat.Icon className="w-4 h-4 text-amber-500" />
                              <p className="text-sm font-bold text-[#060C17]">{stat.label.split(' ')[0]}</p>
                            </div>
                            <p className="text-xs text-slate-500">{stat.label.split(' ')[1]}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-8">
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 px-6 py-3.5 bg-[#060C17] hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-sm"
                      >
                        Explore DeskSweep
                        <ArrowUpRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Right Section - Product Image */}
                  <div className="relative bg-slate-50 p-0 flex items-center justify-center min-h-96 lg:min-h-full border-t lg:border-t-0 lg:border-l border-slate-100">
                    <motion.div 
                      className="relative w-full h-full overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src="/DeskSweep/DeskSweep.png"
                        alt="DeskSweep Software Interface"
                        width={1200}
                        height={800}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Merged Trust & Stats Section */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-slate-500 font-medium text-base mb-10"
            >
              Trusted by professionals worldwide
            </motion.p>
            {/* 2x2 Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 max-w-2xl mx-auto"
            >
              {[
                { value: '2,847+', label: 'Active Users', Icon: Users },
                { value: '4.7★', label: 'Rating', Icon: Star },
                { value: '99.8%', label: 'Uptime', Icon: Activity },
                { value: '487K+', label: 'Files Organized', Icon: Folder },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  className="flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-white border border-slate-200 min-h-[170px] shadow-sm hover:shadow-md transition-all"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                >
                  <stat.Icon className="w-8 h-8 text-[#723CFB] mb-4" />
                  <div className="text-3xl font-bold text-[#060C17] mb-2">{stat.value}</div>
                  <div className="text-base text-slate-500 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-20 bg-[#FAFAFA] border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-semibold text-center mb-12 text-[#060C17]"
          >
            Why choose <span className="italic font-serif font-normal">Appsto</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level encryption & PCI-DSS compliance for your peace of mind' },
              { icon: Zap, title: 'Instant Delivery', desc: 'Get your license key immediately after purchase - no waiting' },
              { icon: CheckCircle, title: 'Lifetime Support', desc: 'Dedicated support and free updates included with every purchase' },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -4,
                  boxShadow: '0 20px 30px -10px rgba(114, 60, 251, 0.1)',
                }}
                className="bg-white border border-slate-200 rounded-3xl p-8 h-64 flex flex-col justify-between cursor-pointer hover:border-purple-200 shadow-sm transition-all"
              >
                <div>
                  <service.icon className="w-10 h-10 text-[#723CFB] mb-4" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#060C17] mb-2">{service.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="max-w-full mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-semibold text-center mb-12 text-[#060C17] px-4"
          >
            Loved by <span className="italic font-serif font-normal">thousands</span> of users
          </motion.h2>
          
          {/* Infinite Scroll Container */}
          <div className="relative w-full overflow-hidden py-4">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: -960 }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: 'linear',
                repeatType: 'loop'
              }}
              className="flex gap-6 min-w-[960px] sm:min-w-0"
            >
              {[
                {
                  name: 'Michael Rodriguez',
                  role: 'Freelance Designer',
                  review: 'Finally, a tool that actually keeps my desktop clean! The auto-sorting is incredible.',
                  rating: 5,
                  initials: 'MR',
                  color: 'bg-slate-900'
                },
                {
                  name: 'Emily Watson',
                  role: 'Software Developer',
                  review: 'DeskSweep saved me hours of manual file organization. Worth every penny!',
                  rating: 5,
                  initials: 'EW',
                  color: 'bg-[#723CFB]'
                },
                {
                  name: 'David Kim',
                  role: 'Marketing Director',
                  review: 'Best desktop organizer I have used. The duplicate finder alone is worth the price.',
                  rating: 5,
                  initials: 'DK',
                  color: 'bg-pink-600'
                },
                {
                  name: 'Sarah Johnson',
                  role: 'Content Creator',
                  review: 'Appsto platform makes purchasing software seamless. Instant licenses and great support!',
                  rating: 5,
                  initials: 'SJ',
                  color: 'bg-emerald-600'
                },
                {
                  name: 'Alex Martinez',
                  role: 'IT Manager',
                  review: 'We use Appsto for all our software needs. Secure, fast, and reliable platform.',
                  rating: 5,
                  initials: 'AM',
                  color: 'bg-indigo-600'
                },
                {
                  name: 'Jessica Lee',
                  role: 'Product Manager',
                  review: 'The licensing system is so intuitive. Made managing software licenses effortless for our team.',
                  rating: 5,
                  initials: 'JL',
                  color: 'bg-amber-600'
                }
              ].map((review, idx) => (
                <motion.div
                  key={idx}
                  className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300 shadow-sm"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 leading-relaxed text-sm min-h-16">
                    &ldquo;{review.review}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className={`w-10 h-10 ${review.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <p className="text-white font-semibold text-sm">{review.initials}</p>
                    </div>
                    <div>
                      <p className="text-[#060C17] font-semibold text-sm">{review.name}</p>
                      <p className="text-slate-500 text-xs">{review.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Gradient Overlays for smooth fade effect */}
            <div className="absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
            <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-[#FAFAFA] border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-semibold text-center mb-12 text-[#060C17]"
          >
            Common <span className="italic font-serif font-normal">questions</span>
          </motion.h2>
          
          <div className="space-y-4">
            {[
              { q: 'How does licensing work?', a: 'We offer two models: One-Time Purchase (pay once, own forever with instant license delivery) and Subscription (flexible monthly/yearly plans with automatic updates and premium support).' },
              { q: 'Is my payment secure?', a: 'Yes! All transactions are processed through Paddle, a globally trusted payment processor with bank-level encryption and PCI-DSS compliance.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-xs"
              >
                <motion.button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="text-lg font-semibold text-[#060C17]">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                  >
                    <Plus className="w-5 h-5 text-[#723CFB]" />
                  </motion.div>
                </motion.button>
                <motion.div
                  initial={false}
                  animate={{ 
                    height: openFaq === i ? 'auto' : 0,
                    opacity: openFaq === i ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <motion.div 
                    className="px-6 pb-6 text-slate-600 text-sm leading-relaxed"
                    initial={{ y: -10 }}
                    animate={{ y: openFaq === i ? 0 : -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {faq.a}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Crisp White Theme with Logo Arrow Head Accent */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.01 }}
            className="relative bg-white border-2 border-slate-200 rounded-3xl p-8 sm:p-16 text-center overflow-hidden shadow-xl"
          >
            {/* Subtle purple accent glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-100 rounded-full blur-3xl pointer-events-none opacity-60" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-100 rounded-full blur-3xl pointer-events-none opacity-60" />
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 text-4xl md:text-5xl font-bold mb-6 text-[#060C17]"
            >
              Ready to transform your <span className="italic font-serif font-normal">workflow?</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10 text-slate-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Join thousands of professionals who trust Appsto for premium SaaS solutions. Discover enterprise-grade software with secure licensing, instant delivery, and dedicated support.
            </motion.p>
            <Link href="/contact">
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10 inline-flex items-center gap-3 bg-[#723CFB] hover:bg-[#5F27E5] text-white font-semibold py-3.5 pl-8 pr-4 rounded-full mx-auto shadow-lg shadow-purple-500/25 transition-all"
              >
                Let&apos;s Collaborate
                <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  )
}
