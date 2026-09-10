'use client'

import Link from 'next/link';
import { Target, Users, Zap, Shield, Code, TrendingUp, ArrowUpRight, Sparkles, Store, Key, Lock, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Every transaction is protected by military-grade encryption. Our partnership with Paddle ensures PCI-DSS compliance, secure tokenization, and fraud prevention. Your business data and payment information remain completely private and protected at all times.',
    },
    {
      icon: Zap,
      title: 'Instant Delivery',
      description: 'Purchase today, activate in seconds. Our automated delivery system sends license keys immediately upon payment confirmation. No delays, no manual processing—just instant access to the software your business needs to move forward.',
    },
    {
      icon: Code,
      title: 'Quality Curated Software',
      description: 'Every application in our marketplace undergoes rigorous vetting. We partner exclusively with established vendors offering production-ready, enterprise-grade solutions. Our curation process ensures you invest in reliable, professionally maintained software.',
    },
    {
      icon: Users,
      title: 'Customer Success First',
      description: 'Your success drives ours. Our dedicated support team provides multi-channel assistance, comprehensive documentation, and proactive guidance. Backed by our 14-day money-back guarantee and transparent policies, we ensure complete satisfaction with every purchase.',
    }
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
      description: 'No waiting, no hassle. Purchase DeskSweep and receive your license key instantly via email. Our streamlined activation process gets you up and running in minutes. Access your licenses anytime from your email or account, with easy device management and transfer options when you need them.',
      icon: Settings
    },
  ];

  const roadmap = [
    { title: 'Expanded Product Catalog', desc: 'Launching new productivity tools across categories: design software, developer utilities, creative applications, and business automation tools—all hand-picked for quality and value' },
    { title: 'User License Management', desc: 'Complete license management system with easy access to your purchase history, download links, device tracking, and one-click reinstallation for all your purchased software' },
    { title: 'Multi-Currency Support', desc: 'Already supporting USD, INR, and PKR with automatic location detection. Expanding to EUR, GBP, and more currencies to serve customers in every corner of the globe' },
    { title: 'Customer Review System', desc: 'Verified buyer reviews, star ratings, and detailed feedback to help you make informed decisions. Authentic testimonials from real users building trust in our community' },
    { title: 'Team & Volume Licensing', desc: 'Special pricing for businesses, educational institutions, and organizations. Centralized billing, easy seat management, and flexible license transfers for growing teams' },
    { title: 'Mobile App Launch', desc: 'Native iOS and Android apps for managing licenses on the go. Quick access to download links, activation codes, and 24/7 support from any device, anywhere' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] overflow-hidden">
      {/* Hero Section with subtle purple glow background */}
      <section className="relative pt-32 pb-20">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-[#FAFAFA]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(114,60,251,0.06)_0%,_transparent_50%)]" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-200/40 rounded-full blur-[100px] pointer-events-none"
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-100/40 rounded-full blur-[120px] pointer-events-none"
          animate={{ y: [0, 20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Content */}
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200/60 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#723CFB]" />
              <span className="text-[#723CFB] font-semibold text-sm">About Our Platform</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-8 text-[#060C17]"
            >
              About Appsto
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
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
            className="relative bg-white rounded-3xl p-12 md:p-16 shadow-xl overflow-hidden border border-slate-200"
          >
            {/* Floating particles */}
            <motion.div 
              className="absolute top-10 right-10 w-48 h-48 bg-purple-100/60 rounded-full blur-3xl pointer-events-none"
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-10 left-10 w-56 h-56 bg-purple-50 rounded-full blur-3xl pointer-events-none"
              animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className="w-14 h-14 bg-[#723CFB] rounded-2xl flex items-center justify-center shadow-md shadow-purple-500/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Target className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-4xl font-bold text-[#060C17]">Our Mission</h2>
              </div>
              <p className="text-lg md:text-xl leading-relaxed text-slate-600 max-w-4xl">
                To revolutionize how people discover and purchase desktop productivity software. Starting with DeskSweep, our mission is to curate a marketplace of exceptional tools that solve real problems—offering transparent pricing, secure licensing, and instant delivery that puts the customer experience first. We&apos;re building trust, one quality product at a time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[#060C17] mb-12 text-center"
          >
            What We Do
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-xl"
          >
            <div className="space-y-6">
              {whatWeDo.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10, backgroundColor: 'rgba(114, 60, 251, 0.03)' }}
                  className="group rounded-2xl p-6 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-[#060C17] mb-3 flex items-center gap-3">
                    <motion.div 
                      className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <item.icon className="w-5 h-5 text-[#723CFB]" />
                    </motion.div>
                    <span>
                      {item.title}
                    </span>
                  </h3>
                  <p className="text-slate-600 leading-relaxed pl-12">
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
            className="text-4xl md:text-5xl font-bold text-[#060C17] mb-12 text-center"
          >
            Our Core Values
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
                  y: -6, 
                  boxShadow: '0 20px 30px -10px rgba(114, 60, 251, 0.08)'
                }}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm group hover:border-[#723CFB]/30 transition-all"
              >
                <div className="flex items-start gap-5">
                  <motion.div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#723CFB] shadow-md shadow-purple-500/20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <value.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#060C17] mb-4">
                      {value.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
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
            className="relative bg-white border-2 border-slate-200 rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-xl"
          >
            {/* Subtle purple accent glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-100 rounded-full blur-3xl pointer-events-none opacity-60" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-100 rounded-full blur-3xl pointer-events-none opacity-60" />
            
            <div className="relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold text-[#060C17] mb-6"
              >
                Ready to Explore?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-slate-600 mb-10 max-w-2xl mx-auto text-lg leading-relaxed"
              >
                Browse our curated collection of enterprise SaaS solutions. Find the perfect tools to scale your business, streamline operations, and drive innovation.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <motion.button 
                    className="group flex items-center justify-center gap-3 bg-[#723CFB] hover:bg-[#5F27E5] text-white font-semibold py-4 px-8 rounded-full shadow-lg shadow-purple-500/25 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Browse Products
                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button 
                    className="flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-[#060C17] font-semibold py-4 px-8 rounded-full transition-colors"
                    whileHover={{ scale: 1.05 }}
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
            className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-12 h-12 bg-[#723CFB] text-white rounded-xl flex items-center justify-center shadow-md shadow-purple-500/20"
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-[#060C17]">
                Looking Ahead
              </h2>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
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
                  className="flex items-start gap-3 text-slate-600"
                >
                  <motion.div 
                    className="w-2 h-2 bg-[#723CFB] rounded-full mt-2 flex-shrink-0"
                    whileHover={{ scale: 1.5 }}
                  />
                  <span>
                    <strong className="text-[#060C17]">{item.title}:</strong> {item.desc}
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
