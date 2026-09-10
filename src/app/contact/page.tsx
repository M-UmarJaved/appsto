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
    <div className="min-h-screen bg-[#FAFAFA] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
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
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200/60 px-4 py-2 rounded-full mb-6"
            >
              <Mail className="w-4 h-4 text-[#723CFB]" />
              <span className="text-[#723CFB] font-semibold text-sm">Contact Us</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-[#060C17]"
            >
              Get in Touch
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
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
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200">
                <h2 className="text-3xl font-bold text-[#060C17] mb-8">
                  Send Us a Message
                </h2>

                {isSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <motion.div 
                      className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-[#060C17] mb-3">
                      Message Sent!
                    </h3>
                    <p className="text-slate-600 text-center text-lg">
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
                      <label htmlFor="name" className="block text-sm font-semibold text-[#060C17] mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white text-[#060C17] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#723CFB] focus:border-[#723CFB] transition-all"
                        placeholder="John Doe"
                      />
                    </motion.div>

                    {/* Email */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 }}
                    >
                      <label htmlFor="email" className="block text-sm font-semibold text-[#060C17] mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white text-[#060C17] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#723CFB] focus:border-[#723CFB] transition-all"
                        placeholder="john@example.com"
                      />
                    </motion.div>

                    {/* Type */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label htmlFor="type" className="block text-sm font-semibold text-[#060C17] mb-2">
                        Inquiry Type *
                      </label>
                      <select
                        id="type"
                        name="type"
                        required
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white text-[#060C17] focus:outline-none focus:ring-2 focus:ring-[#723CFB] focus:border-[#723CFB] transition-all"
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
                      <label htmlFor="subject" className="block text-sm font-semibold text-[#060C17] mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white text-[#060C17] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#723CFB] focus:border-[#723CFB] transition-all"
                        placeholder="How can we help you?"
                      />
                    </motion.div>

                    {/* Message */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <label htmlFor="message" className="block text-sm font-semibold text-[#060C17] mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white text-[#060C17] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#723CFB] focus:border-[#723CFB] transition-all resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </motion.div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 border border-red-200 rounded-xl"
                      >
                        <p className="text-red-600 text-sm font-medium">
                          ⚠️ {error}
                        </p>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-[#723CFB] hover:bg-[#5F27E5] text-white font-semibold py-4 px-8 rounded-xl disabled:opacity-50 transition-all shadow-md shadow-purple-500/20"
                      whileHover={{ scale: 1.02 }}
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

                    <p className="text-sm text-slate-500 text-center">
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
              <div className="relative bg-white rounded-3xl p-8 shadow-xl overflow-hidden border border-slate-200">
                {/* Floating ambient glow */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-purple-100/50 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-50 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[#723CFB] rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-purple-500/20">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#060C17] mb-3">Email Support</h3>
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                    For all inquiries including sales, technical support, billing, and partnerships, reach out to our dedicated support team:
                  </p>
                  
                  <motion.a 
                    href={`mailto:${supportEmail}`}
                    className="block bg-purple-50/60 border border-purple-100 hover:border-purple-300 rounded-xl p-5 hover:bg-purple-50 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#723CFB] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm shadow-purple-500/20">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg text-[#060C17] mb-1">Support Team</p>
                        <p className="text-[#723CFB] hover:text-[#5F27E5] font-semibold break-all">
                          {supportEmail}
                        </p>
                      </div>
                    </div>
                  </motion.a>
                  
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-500 leading-relaxed">
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
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
              >
                <h3 className="text-lg font-semibold text-[#060C17] mb-3">
                  Looking for Help?
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Check our Support page for frequently asked questions and troubleshooting guides.
                </p>
                <Link href="/support">
                  <motion.button 
                    className="w-full py-3 px-4 border border-slate-300 hover:border-[#723CFB] text-[#060C17] hover:bg-purple-50/50 hover:text-[#723CFB] font-semibold rounded-xl transition-all"
                    whileHover={{ scale: 1.02 }}
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
            className="mt-16 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-[#060C17] mb-6 text-center">
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
                  <h3 className="font-semibold text-[#060C17] mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{item.desc}</p>
                  <Link href={item.link} className="text-[#723CFB] hover:text-[#5F27E5] hover:underline text-sm font-semibold">
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
