'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
          setIsSuccess(false);
        }, 5000);
      } else {
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const supportEmail = 'support@appsto.software';

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

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 px-4 py-2 rounded-full mb-6"
            >
              <Mail className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-[#3B82F6] font-semibold text-sm">Contact Us</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-[#0B1220] dark:text-[#E5E7EB]"
            >
              Get in{' '}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">
                Touch
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-[#9CA3AF] max-w-3xl mx-auto leading-relaxed"
            >
              Have questions about our products, licensing, or need technical support? Our dedicated team is here to assist you. Reach out through the form below or email us directly.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <div className="bg-white dark:bg-[#111827] rounded-3xl p-10 shadow-xl border border-[#E5E7EB] dark:border-[#1F2937]">
                <h2 className="text-3xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-8">
                  Send Us a Message
                </h2>

                {isSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-3xl flex items-center justify-center mb-6 shadow-lg"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent mb-3">
                      Message Sent!
                    </h3>
                    <p className="text-[#9CA3AF] text-center text-lg">
                      Thank you for contacting us. We&apos;ll get back to you as soon as possible.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label htmlFor="name" className="block text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border-2 border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#0B1220] text-[#0B1220] dark:text-[#E5E7EB] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all"
                        placeholder="John Doe"
                      />
                    </motion.div>

                    {/* Email */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 }}
                    >
                      <label htmlFor="email" className="block text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border-2 border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#0B1220] text-[#0B1220] dark:text-[#E5E7EB] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all"
                        placeholder="john@example.com"
                      />
                    </motion.div>

                    {/* Type */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label htmlFor="type" className="block text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                        Inquiry Type *
                      </label>
                      <select
                        id="type"
                        name="type"
                        required
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border-2 border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#0B1220] text-[#0B1220] dark:text-[#E5E7EB] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="refund">Refund Request</option>
                        <option value="business">Business/Partnership</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </motion.div>

                    {/* Subject */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.65 }}
                    >
                      <label htmlFor="subject" className="block text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border-2 border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#0B1220] text-[#0B1220] dark:text-[#E5E7EB] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all"
                        placeholder="How can we help you?"
                      />
                    </motion.div>

                    {/* Message */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <label htmlFor="message" className="block text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border-2 border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#0B1220] text-[#0B1220] dark:text-[#E5E7EB] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </motion.div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                      >
                        <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                          ⚠️ {error}
                        </p>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] text-white font-medium py-4 px-8 rounded-xl disabled:opacity-50"
                      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.75 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </motion.button>

                    <p className="text-sm text-[#9CA3AF] text-center">
                      Our team reviews all submissions and responds promptly.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Information Sidebar */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Direct Contact Card */}
              <div className="relative bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
                {/* Floating particles */}
                <motion.div 
                  className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"
                  animate={{ y: [0, -10, 0], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute bottom-10 left-10 w-32 h-32 bg-[#22D3EE]/20 rounded-full blur-2xl"
                  animate={{ y: [0, 10, 0], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Email Support</h3>
                  <p className="text-white/90 mb-6 text-sm leading-relaxed">
                    For all inquiries including sales, technical support, billing, and partnerships, reach out to our dedicated support team:
                  </p>
                  
                  <motion.a 
                    href={`mailto:${supportEmail}`}
                    className="block bg-white/20 backdrop-blur-sm rounded-xl p-5 hover:bg-white/30 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg mb-1">Support Team</p>
                        <p className="text-white/90 hover:text-white font-medium break-all">
                          {supportEmail}
                        </p>
                      </div>
                    </div>
                  </motion.a>
                  
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-xs text-white/70 leading-relaxed">
                      Whether you need help with product features, licensing, billing inquiries, or partnership opportunities, our team is ready to assist you.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-white dark:bg-[#111827] rounded-xl p-6 shadow-lg border border-[#E5E7EB] dark:border-[#1F2937]"
              >
                <h3 className="text-lg font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-3">
                  Looking for Help?
                </h3>
                <p className="text-[#9CA3AF] text-sm mb-4">
                  Check our Support page for frequently asked questions and troubleshooting guides.
                </p>
                <Link href="/support">
                  <motion.button 
                    className="w-full py-3 px-4 border-2 border-[#3B82F6] text-[#3B82F6] font-medium rounded-xl"
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Visit Support Center
                  </motion.button>
                </Link>
              </motion.div>


            </motion.div>
          </div>

          {/* Additional Help Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-white dark:bg-[#111827] rounded-3xl p-8 border border-[#E5E7EB] dark:border-[#1F2937] shadow-lg"
          >
            <h2 className="text-2xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-6 text-center">
              Need Immediate Assistance?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'License Issues', desc: "Can't activate your license or lost your token?", link: 'mailto:support@appsto.software', linkText: 'Contact Support →' },
                { title: 'Refund Requests', desc: 'Review our 14-day money-back guarantee', link: '/refund-policy', linkText: 'View Refund Policy →' },
                { title: 'Documentation', desc: 'Installation guides and troubleshooting', link: '/support', linkText: 'Browse Guides →' },
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="font-semibold text-[#0B1220] dark:text-[#E5E7EB] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#9CA3AF] mb-3">{item.desc}</p>
                  <Link href={item.link} className="text-[#3B82F6] hover:text-[#2563EB] text-sm font-medium">
                    {item.linkText}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
