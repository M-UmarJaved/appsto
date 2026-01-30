'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Mail, Clock, MessageCircle, HelpCircle, ArrowUpRight } from 'lucide-react'

export default function SupportPage() {
  const faqItems = [
    {
      question: 'How do I activate my purchased software license?',
      answer: "After completing your purchase, you'll receive an instant email containing your unique license token (format: APPSTO-XXXX-XXXX-XXXX). Launch your software, navigate to the activation screen, and enter your token. The activation requires a one-time internet connection, after which your software operates offline permanently."
    },
    {
      question: 'Can I transfer my license to a different device?',
      answer: "Each perpetual license is device-locked for security. To transfer your license to a new device (e.g., when upgrading computers), contact our support team at support@appsto.software with your license token. We'll remotely deactivate the old device and provide instructions for activating on your new system—typically completed within 2-4 hours."
    },
    {
      question: 'What if I lost my license token or confirmation email?',
      answer: "No problem! Email support@appsto.software with the email address used during purchase. We'll verify your identity and resend your complete license details, including your token and download link, within 30 minutes during business hours."
    },
    {
      question: 'What is your refund policy for software purchases?',
      answer: "We stand behind our products with a 14-day money-back guarantee for one-time purchases and 7-day guarantee for subscription trials. If you're unsatisfied for any reason, email refunds@appsto.software with your license token. Refunds are processed within 3-5 business days to your original payment method. Note: No refunds after 14 days or if the software has been heavily used beyond evaluation purposes."
    },
    {
      question: 'How do I download my purchased software?',
      answer: 'Your purchase confirmation email includes a secure, permanent download link. This link never expires and can be used anytime to re-download the software for updates or reinstallation. If you cannot locate the email, check your spam folder or contact support@appsto.software—we can verify your purchase and resend the download link immediately.'
    },
    {
      question: 'Do I receive software updates after purchase?',
      answer: 'Yes! All one-time purchases include free minor updates (e.g., v1.x) forever. Major version upgrades (e.g., v2.0) may require an upgrade fee at a discounted rate. Subscription users automatically receive all updates at no additional cost as part of their active subscription.'
    }
  ]

  const supportCards = [
    {
      icon: Mail,
      title: 'Priority Email Support',
      description: "Enterprise-grade support with guaranteed response times. Our expert team handles licensing, technical issues, and billing inquiries",
      link: 'mailto:support@appsto.software',
      linkText: 'support@appsto.software',
      color: '#3B82F6'
    },
    {
      icon: Clock,
      title: 'Rapid Response Times',
      description: 'License activation issues: 2-4 hours | Technical problems: 6-12 hours | General inquiries: 12-24 hours | Enterprise customers: Priority handling',
      color: '#10B981'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
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

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 px-4 py-2 rounded-full mb-6"
            >
              <MessageCircle className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-[#3B82F6] font-semibold text-sm">Support Center</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-[#0B1220] dark:text-[#E5E7EB]"
            >
              How Can We{' '}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">
                Help?
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed"
            >
              Enterprise-grade support for your SaaS marketplace experience. From licensing to technical troubleshooting, our expert team ensures your success.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Support Cards */}
      <section className="relative pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {supportCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5, boxShadow: `0 20px 40px ${card.color}20` }}
                className="bg-white dark:bg-[#111827] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#1F2937] shadow-lg"
              >
                <motion.div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  style={{ backgroundColor: card.color }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <card.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-3">{card.title}</h3>
                <p className="text-[#9CA3AF] mb-4">{card.description}</p>
                {card.link && (
                  <a
                    href={card.link}
                    className="text-[#3B82F6] hover:text-[#2563EB] font-semibold transition-colors"
                  >
                    {card.linkText}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-[#111827] rounded-3xl p-8 md:p-12 border border-[#E5E7EB] dark:border-[#1F2937] shadow-xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <motion.div 
                className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <HelpCircle className="w-6 h-6 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-[#0B1220] dark:text-[#E5E7EB]">Common Questions</h2>
            </div>
            
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="border-b border-[#E5E7EB] dark:border-[#1F2937] pb-6 last:border-0"
                >
                  <h3 className="font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-2 text-lg">{item.question}</h3>
                  <p className="text-[#9CA3AF] leading-relaxed">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#3B82F6]/5 to-[#22D3EE]/5 dark:from-[#3B82F6]/10 dark:to-[#22D3EE]/10 rounded-3xl p-10 border border-[#3B82F6]/20 dark:border-[#3B82F6]/30 text-center relative overflow-hidden"
          >
            {/* Background effects */}
            <motion.div
              className="absolute top-5 left-5 w-32 h-32 bg-[#3B82F6]/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-5 right-5 w-40 h-40 bg-[#22D3EE]/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            />
            
            <div className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 bg-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-3xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-4">Still Need Help?</h3>
              <p className="text-[#9CA3AF] mb-8 text-lg max-w-xl mx-auto">
                Our support team is ready to assist you with any questions or issues
              </p>
              <a href="mailto:support@appsto.software">
                <motion.button
                  className="inline-flex items-center gap-2 bg-[#3B82F6] text-white font-semibold py-4 px-8 rounded-full"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail className="w-5 h-5" />
                  Contact Support
                  <ArrowUpRight className="w-5 h-5" />
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
