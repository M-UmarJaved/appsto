'use client'

import Link from 'next/link';
import { Target, Users, Zap, Shield, Code, TrendingUp, ArrowUpRight, Sparkles, Store, Key, Lock, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

export default function AboutPage() {
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const values = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Every transaction is protected by military-grade encryption. Our partnership with Paddle ensures PCI-DSS compliance, secure tokenization, and fraud prevention. Your business data and payment information remain completely private and protected at all times.',
      color: '#3B82F6'
    },
    {
      icon: Zap,
      title: 'Instant Delivery',
      description: 'Purchase today, activate in seconds. Our automated delivery system sends license keys immediately upon payment confirmation. No delays, no manual processing—just instant access to the software your business needs to move forward.',
      color: '#22D3EE'
    },
    {
      icon: Code,
      title: 'Quality Curated Software',
      description: 'Every application in our marketplace undergoes rigorous vetting. We partner exclusively with established vendors offering production-ready, enterprise-grade solutions. Our curation process ensures you invest in reliable, professionally maintained software.',
      color: '#8B5CF6'
    },
    {
      icon: Users,
      title: 'Customer Success First',
      description: 'Your success drives ours. Our dedicated support team provides multi-channel assistance, comprehensive documentation, and proactive guidance. Backed by our 14-day money-back guarantee and transparent policies, we ensure complete satisfaction with every purchase.',
      color: '#10B981'
    }
  ];

  const stats = [
    { number: 1000, suffix: '+', label: 'Happy Customers' },
    { number: 1, suffix: '', label: 'Premium Software' },
    { number: 99.9, suffix: '%', label: 'Uptime SLA', decimals: 1 },
    { number: 14, suffix: '-Day', label: 'Money-Back' }
  ];

  const whatWeDo = [
    {
      title: 'Curated Software Marketplace',
      description: 'Appsto is your destination for discovering premium desktop productivity tools. We launch with DeskSweep, a powerful file organization solution, and are actively expanding our catalog with carefully vetted applications that deliver real value. Every product undergoes rigorous quality testing before joining our marketplace.',
      icon: Store
    },
    {
      title: 'Simple, Fair Licensing',
      description: 'We believe software licensing should be straightforward. Choose One-Time Lifetime Licenses with instant delivery—pay once, own forever. No hidden fees, no confusing subscription tiers. Your license includes all features, free updates, and priority email support. Multi-device options available for teams and families.',
      icon: Key
    },
    {
      title: 'Secure Payment Processing',
      description: 'Your security is our priority. All transactions use industry-standard encryption and secure payment gateways. We never store your payment information, and every purchase is protected by our 14-day money-back guarantee. Shop with confidence knowing your data and investment are safe.',
      icon: Lock
    },
    {
      title: 'Instant License Delivery',
      description: 'No waiting, no hassle. Purchase DeskSweep and receive your license key instantly via email. Our streamlined activation process gets you up and running in minutes. Access your licenses anytime from your account dashboard, with easy device management and transfer options when you need them.',
      icon: Settings
    },
  ];

  const roadmap = [
    { title: 'Expanded Product Catalog', desc: 'Launching new productivity tools across categories: design software, developer utilities, creative applications, and business automation tools—all hand-picked for quality and value' },
    { title: 'Enhanced User Dashboard', desc: 'Complete license management portal with download history, device tracking, renewal reminders, and one-click reinstallation for all your purchased software' },
    { title: 'Multi-Currency Support', desc: 'Already supporting USD, INR, and PKR with automatic location detection. Expanding to EUR, GBP, and more currencies to serve customers in every corner of the globe' },
    { title: 'Customer Review System', desc: 'Verified buyer reviews, star ratings, and detailed feedback to help you make informed decisions. Authentic testimonials from real users building trust in our community' },
    { title: 'Team & Volume Licensing', desc: 'Special pricing for businesses, educational institutions, and organizations. Centralized billing, easy seat management, and flexible license transfers for growing teams' },
    { title: 'Mobile App Launch', desc: 'Native iOS and Android apps for managing licenses on the go. Quick access to download links, activation codes, and 24/7 support from any device, anywhere' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] overflow-hidden">
      {/* Hero Section with gradient background */}
      <section className="relative pt-32 pb-20">
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

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          {/* Hero Content */}
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-[#3B82F6] font-semibold text-sm">About Our Platform</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-8 text-[#0B1220] dark:text-[#E5E7EB]"
            >
              About{' '}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">
                Appsto
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-[#9CA3AF] max-w-3xl mx-auto leading-relaxed"
            >
              Your trusted digital marketplace for premium desktop software. Currently featuring DeskSweep, our flagship file organization solution, with an expanding catalog of professional-grade applications designed to boost productivity and streamline workflows for individuals and teams worldwide.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] rounded-3xl p-12 md:p-16 text-white shadow-2xl overflow-hidden"
          >
            {/* Floating particles */}
            <motion.div 
              className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-10 left-10 w-40 h-40 bg-[#22D3EE]/20 rounded-full blur-3xl"
              animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Target className="w-8 h-8" />
                </motion.div>
                <h2 className="text-4xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg md:text-xl leading-relaxed text-white/95 max-w-4xl">
                To revolutionize how people discover and purchase desktop productivity software. Starting with DeskSweep, our mission is to curate a marketplace of exceptional tools that solve real problems—offering transparent pricing, secure licensing, and instant delivery that puts the customer experience first. We&apos;re building trust, one quality product at a time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section removed as requested */}

      {/* What We Do Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-12 text-center"
          >
            What We <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">Do</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-[#111827] rounded-3xl p-10 md:p-12 border border-[#E5E7EB] dark:border-[#1F2937] shadow-xl"
          >
            <div className="space-y-6">
              {whatWeDo.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  className="group rounded-2xl p-6 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-3 flex items-center gap-3">
                    <motion.div 
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#22D3EE]/20 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <item.icon className="w-5 h-5 text-[#3B82F6]" />
                    </motion.div>
                    <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">
                      {item.title}
                    </span>
                  </h3>
                  <p className="text-[#9CA3AF] leading-relaxed pl-12">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-12 text-center"
          >
            Our Core <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">Values</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  boxShadow: `0 25px 50px ${value.color}20`
                }}
                className="bg-white dark:bg-[#111827] rounded-3xl p-8 border border-[#E5E7EB] dark:border-[#1F2937] shadow-lg group"
              >
                <div className="flex items-start gap-5">
                  <motion.div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: value.color }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <value.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-4">
                      {value.title}
                    </h3>
                    <p className="text-[#9CA3AF] leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-[#111827] rounded-3xl p-12 md:p-16 border border-[#E5E7EB] dark:border-[#1F2937] shadow-xl text-center relative overflow-hidden"
          >
            {/* Background orbs */}
            <motion.div
              className="absolute top-10 left-10 w-40 h-40 bg-[#3B82F6]/10 rounded-full blur-[60px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-48 h-48 bg-[#22D3EE]/10 rounded-full blur-[60px]"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            />
            
            <div className="relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent mb-6"
              >
                Ready to Explore?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-[#9CA3AF] mb-10 max-w-2xl mx-auto text-lg"
              >
                Browse our curated collection of enterprise SaaS solutions. Find the perfect tools to scale your business, streamline operations, and drive innovation.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <motion.button 
                    className="group flex items-center justify-center gap-3 bg-[#3B82F6] text-white font-medium py-4 px-8 rounded-full"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Browse Products
                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button 
                    className="flex items-center justify-center gap-3 bg-transparent border-2 border-[#3B82F6] text-[#3B82F6] font-medium py-4 px-8 rounded-full"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Contact Us
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#3B82F6]/5 to-[#22D3EE]/5 dark:from-[#3B82F6]/10 dark:to-[#22D3EE]/10 rounded-3xl p-10 border border-[#3B82F6]/20 dark:border-[#3B82F6]/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center"
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-[#0B1220] dark:text-[#E5E7EB]">
                Looking Ahead
              </h2>
            </div>
            <p className="text-lg text-[#9CA3AF] leading-relaxed mb-6">
              We&apos;re just getting started. From our first product, DeskSweep, to becoming a comprehensive software marketplace, our roadmap is focused on sustainable growth, customer satisfaction, and delivering exceptional value:
            </p>
            <ul className="space-y-4">
              {roadmap.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 text-[#9CA3AF]"
                >
                  <motion.div 
                    className="w-2 h-2 bg-[#3B82F6] rounded-full mt-2 flex-shrink-0"
                    whileHover={{ scale: 1.5 }}
                  />
                  <span>
                    <strong className="text-[#0B1220] dark:text-[#E5E7EB]">{item.title}:</strong> {item.desc}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
