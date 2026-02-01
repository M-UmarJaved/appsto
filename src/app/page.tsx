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
    <div className="overflow-hidden bg-[#F9FAFB] dark:bg-[#0B1220]">
      {/* Hero Section - Matching Template */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-16">
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
        
        <div className="relative max-w-6xl mx-auto px-2 sm:px-4 sm:px-6 lg:px-8 py-12 sm:py-32 text-center">
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

      {/* Featured Product Section - Moved to Top for Conversion */}
      <section className="py-10 sm:py-20 md:py-28 bg-[#F9FAFB] dark:bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-3">
              Meet DeskSweep
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#D1D5DB] max-w-2xl">
              Your intelligent desktop organizer that transforms messy workspaces into organized, productive environments.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80 }}
            className="relative rounded-2xl overflow-hidden bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-lg"
          >
            <Link href="/products/desksweep" className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left Section - Content */}
                <div className="p-4 sm:p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-white to-[#F9FAFB] dark:from-[#111827] dark:to-[#0F1419]">
                  <div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                      className="w-12 h-12 bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 rounded-xl flex items-center justify-center mb-6"
                    >
                      <Layers className="w-6 h-6 text-[#3B82F6] dark:text-[#60A5FA]" />
                    </motion.div>
                    
                    <h3 className="text-2xl md:text-3xl font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-4">DeskSweep</h3>
                    <p className="text-base text-[#4B5563] dark:text-[#D1D5DB] leading-relaxed mb-6">
                      Transform your messy desktop into an organized workspace. Auto-sort files, find duplicates, and boost productivity with intelligent file management.
                    </p>
                    
                    {/* Features Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {['Desktop Cleaner', 'Auto-Sorting', 'Duplicate Finder'].map((tag, j) => (
                        <motion.span 
                          key={j} 
                          className="px-3 py-1.5 bg-[#EFF6FF] dark:bg-[#1E3A8A]/20 rounded-lg text-xs font-medium text-[#3B82F6] dark:text-[#93C5FD] border border-[#BFDBFE] dark:border-[#1E40AF]/40"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + j * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>

                    {/* Quick Stats - Horizontal Layout */}
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
                            <stat.Icon className="w-4 h-4 text-[#3B82F6] dark:text-[#60A5FA]" />
                            <p className="text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB]">{stat.label.split(' ')[0]}</p>
                          </div>
                          <p className="text-xs text-[#9CA3AF] dark:text-[#9CA3AF]">{stat.label.split(' ')[1]}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                  >
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 px-5 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Explore DeskSweep
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                </div>

                {/* Right Section - Product Image */}
                <div className="relative bg-gradient-to-br from-[#F0F9FF] to-white dark:from-[#0F1419] dark:to-[#111827] p-0 flex items-center justify-center min-h-96 lg:min-h-full">
                  <motion.div 
                    className="relative w-full h-full overflow-hidden shadow-lg"
                    whileHover={{ scale: 1.02, y: -4 }}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section - Moved Up for Better Conversion */}
      <PricingSection />

      {/* Merged Trust & Stats Section - 2x2 Grid, Centered, All Cards Visible */}
      <section className="py-8 sm:py-16 bg-[#F9FAFB] dark:bg-[#0B1220] overflow-hidden">
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
              className="text-[#9CA3AF] text-base mb-10"
            >
              Trusted by professionals worldwide
            </motion.p>
            {/* 2x2 Grid, All Cards Always Visible, Centered */}
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
                  className="flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] min-h-[170px]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <stat.Icon className="w-8 h-8 text-[#3B82F6] mb-4" />
                  <div className="text-3xl font-bold text-[#3B82F6] mb-2">{stat.value}</div>
                  <div className="text-base text-[#9CA3AF]">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section - Simplified */}
      <section className="py-10 sm:py-20 bg-[#F9FAFB] dark:bg-[#0B1220]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-medium text-center mb-12 text-[#0B1220] dark:text-[#E5E7EB]"
          >
            Why choose <span className="italic font-serif font-normal">Appsto</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level encryption & PCI-DSS compliance for your peace of mind', color: 'bg-[#3B82F6]/20 dark:bg-[#3B82F6]/10', iconColor: 'text-[#3B82F6]', hoverGlow: 'rgba(59, 130, 246, 0.3)' },
              { icon: Zap, title: 'Instant Delivery', desc: 'Get your license key immediately after purchase - no waiting', color: 'bg-[#22D3EE]/20 dark:bg-[#22D3EE]/10', iconColor: 'text-[#22D3EE]', hoverGlow: 'rgba(34, 211, 238, 0.3)' },
              { icon: CheckCircle, title: 'Lifetime Support', desc: 'Dedicated support and free updates included with every purchase', color: 'bg-[#3B82F6]/20 dark:bg-[#3B82F6]/10', iconColor: 'text-[#3B82F6]', hoverGlow: 'rgba(59, 130, 246, 0.3)' },
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
                className={`${service.color} rounded-3xl p-8 h-64 flex flex-col justify-between cursor-pointer`}
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

      {/* Customer Reviews - Infinite Scroll */}
      <section className="py-8 sm:py-16 bg-[#F9FAFB] dark:bg-[#0B1220] overflow-hidden">
        <div className="max-w-full mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-medium text-center mb-12 text-[#0B1220] dark:text-[#E5E7EB] px-4"
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
                  color: 'bg-blue-500'
                },
                {
                  name: 'Emily Watson',
                  role: 'Software Developer',
                  review: 'DeskSweep saved me hours of manual file organization. Worth every penny!',
                  rating: 5,
                  initials: 'EW',
                  color: 'bg-purple-500'
                },
                {
                  name: 'David Kim',
                  role: 'Marketing Director',
                  review: 'Best desktop organizer I have used. The duplicate finder alone is worth the price.',
                  rating: 5,
                  initials: 'DK',
                  color: 'bg-pink-500'
                },
                {
                  name: 'Sarah Johnson',
                  role: 'Content Creator',
                  review: 'Appsto platform makes purchasing software seamless. Instant licenses and great support!',
                  rating: 5,
                  initials: 'SJ',
                  color: 'bg-green-500'
                },
                {
                  name: 'Alex Martinez',
                  role: 'IT Manager',
                  review: 'We use Appsto for all our software needs. Secure, fast, and reliable platform.',
                  rating: 5,
                  initials: 'AM',
                  color: 'bg-red-500'
                },
                {
                  name: 'Jessica Lee',
                  role: 'Product Manager',
                  review: 'The licensing system is so intuitive. Made managing software licenses effortless for our team.',
                  rating: 5,
                  initials: 'JL',
                  color: 'bg-amber-500'
                },
                {
                  name: 'Thomas Brown',
                  role: 'System Administrator',
                  review: 'Enterprise-grade security with consumer-friendly interface. Exactly what we needed.',
                  rating: 5,
                  initials: 'TB',
                  color: 'bg-indigo-500'
                },
                {
                  name: 'Maria Garcia',
                  role: 'UX Designer',
                  review: 'The user experience on Appsto is outstanding. Purchased and activated in minutes!',
                  rating: 5,
                  initials: 'MG',
                  color: 'bg-cyan-500'
                },
                {
                  name: 'James Wilson',
                  role: 'Startup Founder',
                  review: 'Perfect solution for our growing team. Flexible licensing options and excellent service.',
                  rating: 5,
                  initials: 'JW',
                  color: 'bg-teal-500'
                },
                // Duplicate for seamless looping
                {
                  name: 'Michael Rodriguez',
                  role: 'Freelance Designer',
                  review: 'Finally, a tool that actually keeps my desktop clean! The auto-sorting is incredible.',
                  rating: 5,
                  initials: 'MR',
                  color: 'bg-blue-500'
                },
                {
                  name: 'Emily Watson',
                  role: 'Software Developer',
                  review: 'DeskSweep saved me hours of manual file organization. Worth every penny!',
                  rating: 5,
                  initials: 'EW',
                  color: 'bg-purple-500'
                },
                {
                  name: 'David Kim',
                  role: 'Marketing Director',
                  review: 'Best desktop organizer I have used. The duplicate finder alone is worth the price.',
                  rating: 5,
                  initials: 'DK',
                  color: 'bg-pink-500'
                },
                {
                  name: 'Sarah Johnson',
                  role: 'Content Creator',
                  review: 'Appsto platform makes purchasing software seamless. Instant licenses and great support!',
                  rating: 5,
                  initials: 'SJ',
                  color: 'bg-green-500'
                },
                {
                  name: 'Alex Martinez',
                  role: 'IT Manager',
                  review: 'We use Appsto for all our software needs. Secure, fast, and reliable platform.',
                  rating: 5,
                  initials: 'AM',
                  color: 'bg-red-500'
                },
                {
                  name: 'Jessica Lee',
                  role: 'Product Manager',
                  review: 'The licensing system is so intuitive. Made managing software licenses effortless for our team.',
                  rating: 5,
                  initials: 'JL',
                  color: 'bg-amber-500'
                },
                {
                  name: 'Thomas Brown',
                  role: 'System Administrator',
                  review: 'Enterprise-grade security with consumer-friendly interface. Exactly what we needed.',
                  rating: 5,
                  initials: 'TB',
                  color: 'bg-indigo-500'
                },
                {
                  name: 'Maria Garcia',
                  role: 'UX Designer',
                  review: 'The user experience on Appsto is outstanding. Purchased and activated in minutes!',
                  rating: 5,
                  initials: 'MG',
                  color: 'bg-cyan-500'
                },
                {
                  name: 'James Wilson',
                  role: 'Startup Founder',
                  review: 'Perfect solution for our growing team. Flexible licensing options and excellent service.',
                  rating: 5,
                  initials: 'JW',
                  color: 'bg-teal-500'
                }
              ].map((review, idx) => (
                <motion.div
                  key={idx}
                  className="flex-shrink-0 w-80 bg-white dark:bg-[#111827] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#1F2937] hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="text-[#0B1220] dark:text-[#E5E7EB] mb-4 leading-relaxed text-sm min-h-16">
                    &ldquo;{review.review}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB] dark:border-[#1F2937]">
                    <div className={`w-10 h-10 ${review.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <p className="text-white font-semibold text-sm">{review.initials}</p>
                    </div>
                    <div>
                      <p className="text-[#0B1220] dark:text-[#E5E7EB] font-medium text-sm">{review.name}</p>
                      <p className="text-[#9CA3AF] text-xs">{review.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Gradient Overlays for smooth fade effect */}
            <div className="absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-[#F9FAFB] dark:from-[#0B1220] to-transparent pointer-events-none z-10" />
            <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-[#F9FAFB] dark:from-[#0B1220] to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </section>

      {/* FAQ Section - Simplified */}
      <section className="py-8 sm:py-16 bg-[#F9FAFB] dark:bg-[#0B1220]">
        <div className="max-w-3xl mx-auto px-2 sm:px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-medium text-center mb-12 text-[#0B1220] dark:text-[#E5E7EB]"
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
      <section className="py-6 px-2 sm:py-8 sm:px-4 pb-10 sm:pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.01 }}
            className="relative bg-gradient-to-r from-[#3B82F6]/20 via-[#F9FAFB] to-[#22D3EE]/20 dark:from-[#111827] dark:via-[#0B1220] dark:to-[#111827] dark:border dark:border-[#E5E7EB]/10 rounded-3xl p-6 sm:p-16 text-center overflow-hidden"
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
