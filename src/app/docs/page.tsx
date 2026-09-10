'use client'

import { motion } from 'motion/react'
import { Book, FileText, Code, Zap, Shield, Search } from 'lucide-react'
import Link from 'next/link'

export default function DocsPage() {
  const sections = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics of using our platform',
      links: [
        { title: 'Introduction', href: '#introduction' },
        { title: 'Quick Start Guide', href: '#quick-start' },
        { title: 'Installation', href: '#installation' },
      ]
    },
    {
      icon: Code,
      title: 'API Reference',
      description: 'Complete API documentation and examples',
      links: [
        { title: 'Authentication', href: '#authentication' },
        { title: 'Endpoints', href: '#endpoints' },
        { title: 'Rate Limits', href: '#rate-limits' },
      ]
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Security best practices and guidelines',
      links: [
        { title: 'License Management', href: '#license-management' },
        { title: 'Data Protection', href: '#data-protection' },
        { title: 'Compliance', href: '#compliance' },
      ]
    },
    {
      icon: Zap,
      title: 'Integration Guides',
      description: 'Integrate our products with your workflow',
      links: [
        { title: 'DeskSweep Integration', href: '#desksweep' },
        { title: 'Enterprise Setup', href: '#enterprise' },
        { title: 'Custom Solutions', href: '#custom' },
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#060C17] mb-4">
            Documentation
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about using our platform, APIs, and integrations
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#723CFB] focus:border-transparent text-[#060C17] placeholder:text-slate-400 transition-all shadow-sm"
            />
          </div>
        </motion.div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#723CFB]/40 hover:shadow-md transition-all shadow-sm"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#723CFB]/10 border border-[#723CFB]/20 flex items-center justify-center text-[#723CFB] shadow-sm">
                  <section.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#060C17] mb-2">
                    {section.title}
                  </h2>
                  <p className="text-sm text-slate-600">{section.description}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#723CFB] transition-colors group"
                    >
                      <FileText className="w-4 h-4 text-[#723CFB] opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Need Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-[#060C17] mb-4">
            Need More Help?
          </h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#723CFB] hover:bg-[#5F27E5] text-white font-semibold rounded-xl transition-colors shadow-md shadow-purple-500/20"
            >
              Contact Support
            </Link>
            <Link
              href="/support"
              className="px-6 py-3 bg-white hover:bg-slate-50 text-[#060C17] font-semibold rounded-xl transition-colors border border-slate-200 shadow-sm"
            >
              Support Center
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
