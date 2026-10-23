'use client'

import Link from 'next/link';
import { Target, Users, Zap, Shield, Code, TrendingUp, ArrowUpRight, Sparkles, Layout, Key, Lock, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Every transaction is protected by industry-standard encryption. Our partnership with Paddle as our authorized Merchant of Record ensures PCI-DSS compliance, secure tokenization, and strict fraud prevention. Your payment data remains completely private and secure.',
    },
    {
      icon: Zap,
      title: 'Instant Delivery',
      description: 'Purchase today, activate in seconds. Our automated license generation system sends license keys immediately upon payment confirmation. No delays, no manual processing—just instant access to your software.',
    },
    {
      icon: Code,
      title: 'In-House Engineering Excellence',
      description: 'Every application published by Appsto is designed, built, and maintained directly by our software engineering team. We prioritize native performance, modern architecture (.NET 8 for desktop), low memory footprints, and intuitive UI.',
    },
    {
      icon: Users,
      title: 'Direct Customer Support',
      description: 'We stand behind the software we build. Our team provides fast email assistance, comprehensive documentation, and proactive guidance. Backed by our 14-day money-back guarantee, we ensure complete satisfaction with every purchase.',
    }
  ];

  const whatWeDo = [
    {
      title: 'Proprietary Desktop Software',
      description: 'Appsto is an independent software studio dedicated to engineering high-performance desktop productivity tools. Our flagship application, DeskSweep, is an intelligent file organizer and desktop management solution built in-house to help users keep their workspaces clean and focused.',
      icon: Layout
    },
    {
      title: 'Simple, Honest Licensing',
      description: 'We believe software licensing should be straightforward. Choose One-Time Lifetime Licenses with instant delivery—pay once, own forever. No hidden fees, no recurring subscriptions. Your license includes all core features, free updates, and priority customer support.',
      icon: Key
    },
    {
      title: 'Authorized Merchant of Record',
      description: 'All payments are handled securely through Paddle, our authorized Merchant of Record. This ensures localized multi-currency pricing, sales tax and VAT compliance, and secure checkout with credit cards and PayPal.',
      icon: Lock
    },
    {
      title: 'Instant License Activation',
      description: 'Purchase DeskSweep and receive your license key instantly via email and on-screen. Our streamlined activation gets you up and running on Windows 10/11 in seconds, with easy device management whenever you upgrade your computer.',
      icon: Settings
    },
  ];

  const roadmap = [
    { title: 'DeskSweep Continuous Evolution', desc: 'Active development on intelligent file-sorting rules, smart pattern matching, automated background scheduling, and performance optimizations' },
    { title: 'User License Management', desc: 'Centralized license management system with easy access to your purchase history, direct download links, and one-click re-activation' },
    { title: 'Global Multi-Currency Pricing', desc: 'Supporting localized multi-currency checkout worldwide via Paddle with automatic geo-location detection' },
    { title: 'Comprehensive Knowledge Base', desc: 'Step-by-step guides, video tutorials, and best-practice workflows to help you get the most out of your desktop utilities' },
    { title: 'Team & Volume Licensing', desc: 'Volume license options for creative studios, developers, and distributed teams with streamlined multi-seat activation' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] overflow-hidden">
      {/* Hero Section with subtle glow background */}
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
              <span className="text-[#723CFB] font-semibold text-sm">Independent Software Studio</span>
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
              Appsto is an independent desktop software studio and direct publisher. We design and build focused productivity tools like DeskSweep, our flagship file organization software, built to keep your workspace clutter-free and your workflow efficient.
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
                To engineer clean, distraction-free desktop software that solves tangible everyday problems. Starting with DeskSweep, our mission is to build software with transparent one-time pricing, instant license delivery, and respect for user privacy—putting customer experience and product quality first.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#060C17] mb-4">
              What We Do
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Delivering high-performance software with simplicity, security, and direct support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {whatWeDo.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 border border-purple-100">
                    <Icon className="w-7 h-7 text-[#723CFB]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#060C17] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-base">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#060C17] mb-4">
              Our Core Principles
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Built on transparency, engineering rigor, and customer trust.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-100">
                      <Icon className="w-6 h-6 text-[#723CFB]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#060C17] mb-2">
                        {value.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
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
              Starting with our flagship utility, DeskSweep, our engineering roadmap is focused on expanding our in-house suite of native productivity tools, continuous performance updates, and dedicated customer support:
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

            <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                Have questions or need technical support? We&apos;re here to help.
              </p>
              <Link href="/contact">
                <motion.button 
                  className="flex items-center gap-2 bg-[#060C17] hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Support
                  <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
