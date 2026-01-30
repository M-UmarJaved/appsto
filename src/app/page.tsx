'use client'

import Link from 'next/link'
import Image from 'next/image'
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
  Plus
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
    <div className="overflow-hidden bg-[#F9FAFB] dark:bg-[#0B1220]">
      {/* Hero Section - Matching Template */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Clean gradient background - Light mode: soft white with subtle blue tints, Dark mode: deep navy */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F8FAFC] to-[#EFF6FF] dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#0B1220]" />
        
        {/* Subtle mesh gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08)_0%,_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(34,211,238,0.06)_0%,_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_right,_rgba(34,211,238,0.1)_0%,_transparent_50%)]" />
        
        {/* Floating decorative elements - more subtle */}
        <motion.div
          className="absolute top-32 left-20 w-80 h-80 bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 rounded-full blur-[100px]"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-96 h-96 bg-[#22D3EE]/8 dark:bg-[#22D3EE]/15 rounded-full blur-[120px]"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.08, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#3B82F6]/5 to-[#22D3EE]/5 dark:from-[#3B82F6]/10 dark:to-[#22D3EE]/10 rounded-full blur-[80px]"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          {/* Main Heading with staggered word animation */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl md:text-7xl font-medium mb-8 leading-tight text-[#0B1220] dark:text-[#E5E7EB]"
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
            className="text-lg md:text-xl text-[#9CA3AF] mb-12 max-w-2xl mx-auto"
          >
            Your premium SaaS software marketplace. Discover, purchase, and manage professional applications with secure licensing, instant delivery, and lifetime support—all in one powerful platform.
          </motion.p>
          
          {/* CTA Button + Social Proof Row */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            {/* CTA Button with glow effect */}
            <Link href="/products">
              <motion.button 
                className="group relative flex items-center gap-4 bg-[#3B82F6] text-white font-medium py-3 pl-6 pr-3 rounded-full overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <span className="relative z-10">Get Started</span>
                <motion.span 
                  className="relative z-10 w-10 h-10 bg-[#22D3EE] rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 45 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <ArrowUpRight className="w-5 h-5 text-[#0B1220]" />
                </motion.span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-[#2563EB] to-[#3B82F6]"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
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
                    className="relative w-11 h-11 rounded-full border-2 border-white dark:border-[#0B1220] cursor-pointer shadow-lg overflow-hidden"
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
                  className="text-sm text-[#9CA3AF]"
                >
                  Trusted by 1000+ clients
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Section - Loved by brands */}
      <section className="py-16 bg-[#F9FAFB] dark:bg-[#0B1220] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Decorative text with animated lines */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 128 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-px bg-gradient-to-r from-transparent to-[#0B1220]/20 dark:to-[#E5E7EB]/20" 
            />
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-[#9CA3AF] text-sm whitespace-nowrap"
            >
              Loved by 1000+ big and small brands around the worlds
            </motion.p>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 128 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-px bg-gradient-to-l from-transparent to-[#0B1220]/20 dark:to-[#E5E7EB]/20" 
            />
          </motion.div>
          
          {/* Animated Logo Slider with hover effects */}
          <div className="flex justify-center items-center gap-12 flex-wrap">
            {['Microsoft', 'Adobe', 'Google', 'Slack', 'Figma', 'Notion'].map((brand, i) => (
              <motion.div 
                key={brand}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.6, y: 0 }}
                whileHover={{ opacity: 1, scale: 1.1, y: -5 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                className="flex items-center gap-2 text-[#0B1220] dark:text-[#E5E7EB] cursor-pointer"
              >
                <motion.div 
                  className="w-8 h-8 rounded-lg bg-[#0B1220]/10 dark:bg-[#E5E7EB]/10 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="font-bold text-sm">{brand.charAt(0)}</span>
                </motion.div>
                <span className="font-medium">{brand}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Colored Badges */}
      <section className="py-24 bg-[#F9FAFB] dark:bg-[#0B1220]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-medium mb-8 text-[#0B1220] dark:text-[#E5E7EB] leading-tight"
          >
            Empowering professionals with enterprise-grade SaaS<br />
            solutions through a unified marketplace built on
          </motion.h2>
          
          {/* Colored Pill Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] font-medium text-lg italic font-serif">
              <Sparkles className="w-5 h-5" /> Creativity
            </span>
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#22D3EE]/20 text-[#22D3EE] font-medium text-lg italic font-serif">
              <Lightbulb className="w-5 h-5" /> Innovation
            </span>
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] font-medium text-lg italic font-serif">
              <Target className="w-5 h-5" /> Strategy
            </span>
          </motion.div>
          
          {/* Big Stats Row with animated counters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { value: 1, prefix: '', label: 'Enterprise Software' },
              { value: 99.9, prefix: '', suffix: '%', label: 'Uptime Guarantee' },
              { value: 10, prefix: '+', suffix: 'K', label: 'Happy Customers' },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 100 }}
              >
                <motion.div 
                  className="text-6xl md:text-7xl font-medium text-[#0B1220] dark:text-[#E5E7EB] mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {stat.prefix}{stat.value}{stat.suffix}
                </motion.div>
                <motion.div 
                  className="text-[#9CA3AF]"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section - Colored Cards */}
      <section className="py-24 bg-[#F9FAFB] dark:bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-medium text-center mb-16 text-[#0B1220] dark:text-[#E5E7EB]"
          >
            Premium SaaS marketplace<br />where <span className="italic font-serif font-normal">quality meets value</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Layers, title: 'Centralized Marketplace', desc: 'All your software in one secure platform', color: 'bg-[#3B82F6]/20 dark:bg-[#3B82F6]/10', iconColor: 'text-[#3B82F6]', hoverGlow: 'rgba(59, 130, 246, 0.3)' },
              { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level encryption & PCI-DSS compliance', color: 'bg-[#22D3EE]/20 dark:bg-[#22D3EE]/10', iconColor: 'text-[#22D3EE]', hoverGlow: 'rgba(34, 211, 238, 0.3)' },
              { icon: Zap, title: 'Instant Activation', desc: 'License delivery in seconds, not hours', color: 'bg-[#3B82F6]/20 dark:bg-[#3B82F6]/10', iconColor: 'text-[#3B82F6]', hoverGlow: 'rgba(59, 130, 246, 0.3)' },
              { icon: BarChart3, title: 'Flexible Licensing', desc: 'Choose perpetual or subscription models', color: 'bg-[#22D3EE]/20 dark:bg-[#22D3EE]/10', iconColor: 'text-[#22D3EE]', hoverGlow: 'rgba(34, 211, 238, 0.3)' },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  boxShadow: `0 25px 50px -12px ${service.hoverGlow}`,
                  transition: { type: 'spring', stiffness: 300, damping: 20 }
                }}
                className={`${service.color} rounded-3xl p-8 h-72 flex flex-col justify-between cursor-pointer`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div>
                  <service.icon className={`w-10 h-10 ${service.iconColor} mb-4`} />
                </div>
                <div>
                  <h3 className={`text-2xl font-medium ${service.iconColor} mb-2`}>{service.title}</h3>
                  <p className="text-[#9CA3AF] text-sm">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark CTA Bar */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0B1220] dark:bg-[#111827] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <p className="text-[#9CA3AF] text-lg">Explore Our Software Collection</p>
              <p className="text-[#E5E7EB] text-xl font-medium">Browse Premium SaaS Products Today!</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <motion.button 
                  className="group relative flex items-center gap-3 bg-[#3B82F6] text-white font-medium py-3 pl-5 pr-3 rounded-full overflow-hidden"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <span className="relative z-10">Let&apos;s Collaborate</span>
                  <motion.span 
                    className="relative z-10 w-8 h-8 bg-[#22D3EE] rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 45 }}
                  >
                    <ArrowUpRight className="w-4 h-4 text-[#0B1220]" />
                  </motion.span>
                </motion.button>
              </Link>
              <Link href="/products">
                <motion.button 
                  className="flex items-center gap-3 border border-[#E5E7EB]/30 text-[#E5E7EB] font-medium py-3 pl-5 pr-3 rounded-full"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(229, 231, 235, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  View Products
                  <motion.span 
                    className="w-8 h-8 border border-[#E5E7EB]/30 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 45, borderColor: '#22D3EE' }}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section - Single Featured Product */}
      <section className="py-24 bg-[#F9FAFB] dark:bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-medium text-center mb-16 text-[#0B1220] dark:text-[#E5E7EB]"
          >
            Featured enterprise solution<br />trusted by <span className="italic font-serif font-normal">thousands worldwide</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-2xl"
          >
            <Link href="/products" className="group block">
              {/* Top Section - Header with gradient */}
              <div className="relative bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] p-8 md:p-12">
                <motion.div 
                  className="absolute top-6 right-6"
                  whileHover={{ scale: 1.2, rotate: 45 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="w-12 h-12 bg-[#22D3EE] rounded-xl flex items-center justify-center shadow-lg">
                    <ArrowUpRight className="w-5 h-5 text-[#0B1220]" />
                  </span>
                </motion.div>

                <div className="max-w-xl">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6"
                  >
                    <Layers className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">DeskSweep</h3>
                  <p className="text-lg text-white/90 mb-6">Intelligent desktop organization and file management solution that keeps your workspace clean and productive</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {['Desktop Cleaner', 'File Organizer', 'Auto-Sorting'].map((tag, j) => (
                      <motion.span 
                        key={j} 
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white border border-white/30"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + j * 0.1 }}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Section - Product Image */}
              <div className="relative bg-gradient-to-b from-white to-[#F9FAFB] dark:from-[#111827] dark:to-[#0B1220] p-8 md:p-12">
                <motion.div 
                  className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#E5E7EB] dark:border-[#1F2937]"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/DeskSweep/DeskSweep.png"
                    alt="DeskSweep Software Interface"
                    width={1200}
                    height={800}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  {/* Overlay gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                {/* Feature highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {[
                    { label: 'Active Users', value: '10K+' },
                    { label: 'Files Organized', value: '1M+' },
                    { label: 'Time Saved', value: '50K hrs' },
                    { label: 'Rating', value: '4.9/5' }
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="text-center p-4 rounded-xl bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151]"
                    >
                      <p className="text-2xl font-bold text-[#3B82F6] mb-1">{stat.value}</p>
                      <p className="text-xs text-[#9CA3AF]">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Customer Stories Section */}
      <section className="py-24 bg-[#F9FAFB] dark:bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-medium text-center mb-16 text-[#0B1220] dark:text-[#E5E7EB]"
          >
            Trusted by professionals<br />worldwide <span className="italic font-serif font-normal">for quality software</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Large Testimonial Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 relative rounded-3xl overflow-hidden h-[400px] bg-gradient-to-br from-[#111827] to-[#0B1220]"
            >
              <motion.div 
                className="absolute inset-0 bg-black/40"
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
              />
              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <motion.span 
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[#9CA3AF] text-sm uppercase tracking-wider"
                >
                  Customer Stories
                </motion.span>
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-1 mb-4"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, rotate: -180 }}
                        whileInView={{ opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                      >
                        <Star className="w-6 h-6 fill-[#F59E0B] text-[#F59E0B]" />
                      </motion.div>
                    ))}
                  </motion.div>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl md:text-4xl text-[#E5E7EB] font-medium mb-6 leading-tight"
                  >
                    &ldquo;{formatReviewText(featuredReview, currency)}&rdquo;
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-3"
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image 
                        src={featuredReview.avatar} 
                        alt={featuredReview.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[#E5E7EB] font-medium">{featuredReview.name}</p>
                      <p className="text-[#9CA3AF] text-sm">{featuredReview.title}, {featuredReview.company}</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(34, 211, 238, 0.3)' }}
              className="bg-[#22D3EE] rounded-3xl p-8 h-[400px] flex flex-col justify-between cursor-pointer"
            >
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[#0B1220]/60 text-sm uppercase tracking-wider"
              >
                Facts & Numbers
              </motion.span>
              <div>
                <motion.p 
                  className="text-7xl font-medium text-[#0B1220] mb-4"
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                  whileHover={{ scale: 1.1 }}
                >
                  4.9★
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-[#0B1220] text-lg"
                >
                  Average rating from<br />10,000+ happy customers
                </motion.p>
              </div>
            </motion.div>
          </div>

          {/* Additional Review Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Michael Rodriguez',
                role: 'Freelance Designer',
                img: 'https://i.pravatar.cc/150?img=13',
                review: 'Finally, a tool that actually keeps my desktop clean! The auto-sorting is incredible.',
                rating: 5
              },
              {
                name: 'Emily Watson',
                role: 'Software Developer',
                img: 'https://i.pravatar.cc/150?img=44',
                review: 'DeskSweep saved me hours of manual file organization. Worth every penny!',
                rating: 5
              },
              {
                name: 'David Kim',
                role: 'Marketing Director',
                img: 'https://i.pravatar.cc/150?img=33',
                review: 'Best desktop organizer I have used. The duplicate finder alone is worth the price.',
                rating: 5
              }
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)' }}
                className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#1F2937]"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-[#0B1220] dark:text-[#E5E7EB] mb-4 leading-relaxed">
                  &ldquo;{review.review}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB] dark:border-[#1F2937]">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image 
                      src={review.img} 
                      alt={review.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[#0B1220] dark:text-[#E5E7EB] font-medium text-sm">{review.name}</p>
                    <p className="text-[#9CA3AF] text-xs">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <section className="py-24 bg-[#F9FAFB] dark:bg-[#0B1220]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-medium text-center mb-16 text-[#0B1220] dark:text-[#E5E7EB]"
          >
            Frequently asked<br />questions <span className="italic font-serif font-normal">answered</span>
          </motion.h2>
          
          <div className="space-y-4">
            {[
              { q: 'What is Appsto?', a: 'Appsto is a premium SaaS marketplace offering professional software solutions with secure licensing, instant delivery, and lifetime support. We connect businesses with enterprise-grade applications in one unified platform.' },
              { q: 'How does licensing work?', a: 'We offer two models: One-Time Purchase (pay once, own forever with instant license delivery) and Subscription (flexible monthly/yearly plans with automatic updates and premium support).' },
              { q: 'Is my payment information secure?', a: 'Absolutely! All transactions are processed through Paddle, a globally trusted payment processor. We never store your payment information—everything is encrypted and PCI-DSS compliant.' },
              { q: 'Do you offer ongoing support after purchase?', a: 'Yes! All purchases include dedicated lifetime support, free updates for your major version, and access to our knowledge base. Premium support is available 24/7 for enterprise customers.' },
              { q: 'How quickly can I start using the software?', a: 'Instantly! For one-time purchases, you receive your license key via email immediately after payment. For subscriptions, simply download and activate within minutes.' },
              { q: 'What is your refund policy?', a: 'We offer a 14-day money-back guarantee on all purchases, no questions asked. Your satisfaction is our priority.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="border border-[#0B1220]/10 dark:border-[#E5E7EB]/10 rounded-2xl overflow-hidden"
              >
                <motion.button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[#0B1220]/5 dark:hover:bg-[#E5E7EB]/5 transition-colors"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="text-lg font-medium text-[#0B1220] dark:text-[#E5E7EB]">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                  >
                    <Plus className="w-5 h-5 text-[#3B82F6]" />
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
                    className="px-6 pb-6 text-[#9CA3AF]"
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

      {/* CTA Section - Gradient Background with animations */}
      <section className="py-8 px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.01 }}
            className="relative bg-gradient-to-r from-[#3B82F6]/20 via-[#F9FAFB] to-[#22D3EE]/20 dark:from-[#111827] dark:via-[#0B1220] dark:to-[#111827] dark:border dark:border-[#E5E7EB]/10 rounded-3xl p-16 text-center overflow-hidden"
          >
            {/* Animated background orbs */}
            <motion.div
              className="absolute top-0 left-0 w-64 h-64 bg-[#3B82F6]/20 rounded-full blur-3xl"
              animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-64 h-64 bg-[#22D3EE]/20 rounded-full blur-3xl"
              animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 text-4xl md:text-5xl font-medium mb-6 text-[#0B1220] dark:text-[#E5E7EB]"
            >
              Ready to transform your <span className="italic font-serif font-normal">workflow?</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10 text-[#9CA3AF] text-lg mb-8 max-w-2xl mx-auto"
            >
              Join thousands of professionals who trust Appsto for premium SaaS solutions. Discover enterprise-grade software with secure licensing, instant delivery, and dedicated support.
            </motion.p>
            <Link href="/contact">
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10 flex items-center gap-3 bg-[#3B82F6] text-white font-medium py-3 pl-6 pr-3 rounded-full mx-auto"
              >
                Let&apos;s Collaborate
                <motion.span 
                  className="w-8 h-8 bg-[#22D3EE] rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 45 }}
                >
                  <ArrowUpRight className="w-4 h-4 text-[#0B1220]" />
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
