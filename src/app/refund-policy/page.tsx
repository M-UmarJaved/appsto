'use client'

import Link from 'next/link';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F8FAFC] to-[#EFF6FF] dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#0B1220]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08)_0%,_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15)_0%,_transparent_50%)]" />
        
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-[#10B981]/10 dark:bg-[#10B981]/20 rounded-full blur-[100px]"
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
            <div className="w-14 h-14 bg-[#10B981] rounded-2xl flex items-center justify-center shadow-lg">
              <RefreshCw className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0B1220] dark:text-[#E5E7EB]">
                Refund Policy
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
          {/* Guarantee Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-8 mb-8 text-white text-center shadow-xl"
          >
            <motion.div
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CheckCircle className="w-8 h-8" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">14-Day Money-Back Guarantee</h2>
            <p className="text-white/90">
              We stand behind the quality of our products. If you&apos;re not satisfied, get a full refund.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-[#111827] rounded-3xl p-8 md:p-12 border border-[#E5E7EB] dark:border-[#1F2937] shadow-xl"
          >
            {/* One-Time Purchase */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#3B82F6] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <h2 className="text-2xl font-bold text-[#0B1220] dark:text-[#E5E7EB]">
                  One-Time Purchase Software
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-[#10B981]/10 dark:bg-[#10B981]/20 rounded-xl border border-[#10B981]/30">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0B1220] dark:text-[#E5E7EB]">Eligible for Refund</p>
                    <p className="text-[#9CA3AF] text-sm">Request within 14 days of purchase with valid reason</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-[#10B981]/10 dark:bg-[#10B981]/20 rounded-xl border border-[#10B981]/30">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0B1220] dark:text-[#E5E7EB]">Technical Issues</p>
                    <p className="text-[#9CA3AF] text-sm">Software doesn&apos;t work as described on your system</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-[#EF4444]/10 dark:bg-[#EF4444]/20 rounded-xl border border-[#EF4444]/30">
                  <XCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0B1220] dark:text-[#E5E7EB]">Not Eligible</p>
                    <p className="text-[#9CA3AF] text-sm">After 14 days, license already activated and used extensively, or no valid reason provided</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#8B5CF6] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <h2 className="text-2xl font-bold text-[#0B1220] dark:text-[#E5E7EB]">
                  Subscription Software
                </h2>
              </div>
              
              <div className="bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 rounded-xl p-6 border border-[#8B5CF6]/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">In-App Management</p>
                    <p className="text-[#9CA3AF] text-sm">
                      Subscription refunds are handled through the application where billing occurs. 
                      You can cancel your subscription at any time from within the app settings. 
                      Refunds for subscriptions must be requested through Paddle or the application&apos;s billing system.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Request */}
            <div>
              <h2 className="text-2xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-6">
                How to Request a Refund
              </h2>
              
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Email Us', desc: 'Send an email to refunds@appsto.software' },
                  { step: '2', title: 'Provide Details', desc: 'Include your purchase email, order ID, and reason for refund' },
                  { step: '3', title: 'Wait for Response', desc: 'We review all requests within 2-3 business days' },
                  { step: '4', title: 'Receive Refund', desc: 'Approved refunds are processed within 5-10 business days' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#3B82F6]/5 transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0B1220] dark:text-[#E5E7EB]">{item.title}</p>
                      <p className="text-[#9CA3AF] text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-[#9CA3AF] mb-4">Have questions about our refund policy?</p>
            <Link href="/contact">
              <motion.button
                className="inline-flex items-center gap-2 bg-[#3B82F6] text-white font-semibold py-3 px-6 rounded-full"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Us
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
