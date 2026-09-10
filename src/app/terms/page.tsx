'use client'

import Link from 'next/link';
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function TermsOfServicePage() {
  const sections = [
    {
      title: 'Business Information',
      content: 'This website is operated by Muhammad Umar Javed, trading as Appsto.Software, with business address at GLOSIX, LC 67, Phase 2 Dream Gardens Defense Road Lahore Pakistan. For support inquiries, contact us at support@appsto.software.',
      highlight: true
    },
    {
      title: '1. Agreement to Terms',
      content: 'By accessing or using appsto.software (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not access the Service.'
    },
    {
      title: '2. Software License Types',
      content: 'appsto.software offers two distinct types of software products:',
      subsections: [
        { 
          title: '2.1 One-Time Purchase Software (Lifetime License)',
          items: [
            'Payment Required: You must complete payment before downloading the software',
            'License Delivery: Upon successful payment, you will receive a unique license token via email',
            'Single Device Activation: Each license is valid for activation on ONE device only',
            'Lifetime Access: Once activated, you have perpetual offline access to the software',
            'No Recurring Fees: One-time purchase with no subscription required'
          ]
        },
        { 
          title: '2.2 Subscription-Based Software',
          items: [
            'Free Download: Software can be downloaded for free from our website',
            'In-App Billing: All subscription management and payments are handled within the application',
            'Recurring Billing: Subscriptions automatically renew according to your selected plan',
            'Cancellation: You may cancel your subscription at any time through the application'
          ]
        }
      ]
    },
    {
      title: '3. Intellectual Property',
      content: 'All software, content, and materials available through the Service are protected by intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to use the software for personal or business purposes according to the license type purchased.'
    },
    {
      title: '4. Prohibited Uses',
      content: 'You may not redistribute, resell, or share license tokens. You may not reverse engineer, decompile, or disassemble any software. You may not use the software for illegal purposes. Circumventing license protection mechanisms is strictly prohibited.'
    },
    {
      title: '5. Disclaimer of Warranties',
      content: 'The Service and software are provided "as is" without warranties of any kind. We do not guarantee that the software will be error-free or uninterrupted.'
    },
    {
      title: '6. Limitation of Liability',
      content: 'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.'
    },
    {
      title: '7. Changes to Terms',
      content: 'We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.'
    },
    {
      title: '8. Governing Law and Jurisdiction',
      content: 'These Terms shall be governed by and construed in accordance with the laws of Pakistan. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of Pakistan.'
    },
    {
      title: '9. Contact Information',
      content: 'For questions about these Terms, contact us at support@appsto.software or write to us at: Muhammad Umar Javed (Appsto.Software), GLOSIX, LC 67, Phase 2 Dream Gardens Defense Road Lahore Pakistan.'
    }
  ];

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
            <div className="w-14 h-14 bg-[#723CFB] rounded-2xl flex items-center justify-center shadow-md shadow-purple-500/20">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#060C17]">
                Terms of Service
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
          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 flex items-start gap-4 shadow-sm"
          >
            <AlertCircle className="w-6 h-6 text-[#723CFB] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#060C17] mb-1">Important</p>
              <p className="text-slate-600 text-sm">
                The website only processes payments for one-time purchase software. Subscription billing is handled entirely within the respective applications via Paddle&apos;s subscription system.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm"
          >
            <div className="space-y-10">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={section.highlight ? 'bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8' : ''}
                >
                  <h2 className="text-2xl font-bold mb-4 text-[#060C17]">
                    {section.title}
                  </h2>
                  <p className={`leading-relaxed mb-4 ${section.highlight ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                    {section.content}
                  </p>
                  {section.subsections && (
                    <div className="space-y-6 mt-6">
                      {section.subsections.map((sub, subIndex) => (
                        <div key={subIndex} className="pl-4 border-l-2 border-[#723CFB]/30">
                          <h3 className="text-lg font-semibold text-[#060C17] mb-3">
                            {sub.title}
                          </h3>
                          <ul className="space-y-2">
                            {sub.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-2 text-slate-600">
                                <span className="text-[#723CFB] mt-1 font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
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
