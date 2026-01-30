'use client'

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: '1. Introduction',
      content: 'Welcome to appsto.software ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.'
    },
    {
      title: '2. Information We Collect',
      content: 'We collect information that you provide directly to us when you purchase a product or service, create an account, contact our support team, subscribe to our newsletter, or activate a software license.',
      subsections: [
        { title: 'Personal Information', content: 'This may include your name, email address, payment information (processed securely through Paddle), and any other information you choose to provide.' },
        { title: 'Device Information', content: 'When you activate a software license, we may collect device information such as operating system version, hardware identifiers, and device type to ensure single-device licensing compliance.' },
        { title: 'Usage Data', content: 'We automatically collect certain information about your device when you use our website, including IP address, browser type, pages visited, and time spent on pages.' }
      ]
    },
    {
      title: '3. How We Use Your Information',
      content: 'We use collected information to process transactions and send related notices, deliver and manage software licenses, provide customer support, send promotional communications (with your consent), improve our services, and comply with legal obligations.'
    },
    {
      title: '4. Payment Processing',
      content: 'All payments are processed through Paddle, our trusted payment provider. We do not store credit card details. Paddle handles all payment data in compliance with PCI-DSS standards.'
    },
    {
      title: '5. Data Security',
      content: 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. We strive to use commercially acceptable means to protect your data but cannot guarantee absolute security.'
    },
    {
      title: '6. Your Rights',
      content: 'Depending on your location, you may have the right to access your personal data, correct inaccurate data, delete your data, object to processing of your data, and data portability. Contact us at privacy@appsto.software to exercise these rights.'
    },
    {
      title: '7. Contact Us',
      content: 'For questions about this Privacy Policy or our practices, contact us at privacy@appsto.software.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F8FAFC] to-[#EFF6FF] dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#0B1220]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08)_0%,_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15)_0%,_transparent_50%)]" />
        
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 rounded-full blur-[100px]"
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] mb-8 transition-all duration-200 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-14 h-14 bg-[#3B82F6] rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0B1220] dark:text-[#E5E7EB]">
                Privacy Policy
              </h1>
              <p className="text-[#9CA3AF] mt-1">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="relative pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-[#111827] rounded-3xl p-8 md:p-12 border border-[#E5E7EB] dark:border-[#1F2937] shadow-xl"
          >
            <div className="space-y-10">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <h2 className="text-2xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-4">
                    {section.title}
                  </h2>
                  <p className="text-[#9CA3AF] leading-relaxed mb-4">
                    {section.content}
                  </p>
                  {section.subsections && (
                    <div className="space-y-4 pl-4 border-l-2 border-[#3B82F6]/30">
                      {section.subsections.map((sub, subIndex) => (
                        <div key={subIndex}>
                          <h3 className="text-lg font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                            {sub.title}
                          </h3>
                          <p className="text-[#9CA3AF] leading-relaxed">
                            {sub.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
