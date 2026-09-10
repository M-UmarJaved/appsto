'use client'

import Link from 'next/link';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-slate-900 hover:text-[#723CFB] mb-8 transition-all duration-200 bg-white shadow-sm px-4 py-2 rounded-xl border border-slate-200"
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
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-500/20">
              <RefreshCw className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#060C17]">
                Refund Policy
              </h1>
              <p className="text-slate-500 mt-1">
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
            className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm"
          >
            {/* Money-Back Guarantee */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#060C17] mb-6">
                Our Commitment to You
              </h2>
              
              <div className="prose prose-lg text-slate-600 max-w-none mb-8">
                <p className="text-lg leading-relaxed">
                  We offer a <strong className="text-emerald-600">full money-back guarantee</strong> for all purchases made on our website. 
                  If you are not satisfied with the product that you have purchased from us, you can get your money back no questions asked. 
                  You are eligible for a full reimbursement within <strong className="text-emerald-600">14 calendar days</strong> of your purchase.
                </p>
              </div>
            </div>

            {/* One-Time Purchase */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#060C17] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <h2 className="text-2xl font-bold text-[#060C17]">
                  One-Time Purchase Software
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#060C17]">Full Refund Eligible</p>
                    <p className="text-slate-600 text-sm">Request within 14 calendar days of purchase - no questions asked</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#060C17]">All Reasons Accepted</p>
                    <p className="text-slate-600 text-sm">Not satisfied with the product? Technical issues? Changed your mind? We honor all refund requests within the 14-day window</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#060C17]">After 14 Days</p>
                    <p className="text-slate-600 text-sm">Refund requests submitted after 14 calendar days from purchase date will be reviewed on a case-by-case basis</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#060C17] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <h2 className="text-2xl font-bold text-[#060C17]">
                  Subscription Software
                </h2>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#060C17] mb-2">In-App Management</p>
                    <p className="text-slate-600 text-sm">
                      Subscription refunds are handled through the application where billing occurs. 
                      You can cancel your subscription at any time from within the app settings. 
                      Refunds for subscriptions must be requested through Paddle or the application&apos;s billing system.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Request */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#060C17] mb-6">
                How to Request a Refund
              </h2>
              
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Email Us', desc: 'Send an email to support@appsto.software' },
                  { step: '2', title: 'Provide Details', desc: 'Include your purchase email, order ID, and reason for refund (optional)' },
                  { step: '3', title: 'Wait for Response', desc: 'We process all refund requests within 2-3 business days' },
                  { step: '4', title: 'Receive Refund', desc: 'Approved refunds are processed within 5-10 business days to your original payment method' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#723CFB] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-sm shadow-purple-500/20">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-[#060C17]">{item.title}</p>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Business Contact Information */}
            <div className="pt-8 border-t border-slate-200">
              <h3 className="text-lg font-bold text-[#060C17] mb-4">
                Business Contact Information
              </h3>
              <div className="text-slate-600 space-y-2">
                <p><strong className="text-[#060C17]">Business Name:</strong> Appsto.Software</p>
                <p><strong className="text-[#060C17]">Operated by:</strong> Muhammad Umar Javed</p>
                <p><strong className="text-[#060C17]">Address:</strong> GLOSIX, LC 67, Phase 2 Dream Gardens Defense Road Lahore Pakistan</p>
                <p><strong className="text-[#060C17]">Email:</strong> <a href="mailto:support@appsto.software" className="text-[#723CFB] hover:underline">support@appsto.software</a></p>
              </div>
            </div>          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-slate-500 mb-4">Have questions about our refund policy?</p>
            <Link href="/contact">
              <button
                className="inline-flex items-center gap-2 bg-[#723CFB] hover:bg-[#5F27E5] text-white font-semibold py-3 px-8 rounded-xl shadow-md shadow-purple-500/20 transition-all"
              >
                Contact Us
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
