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
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-4">
            Documentation
          </h1>
          <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-[#0B1220] dark:text-[#E5E7EB]"
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
              className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#1F2937] hover:border-[#3B82F6] dark:hover:border-[#3B82F6] transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-2">
                    {section.title}
                  </h2>
                  <p className="text-sm text-[#9CA3AF]">{section.description}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#3B82F6] transition-colors group"
                    >
                      <FileText className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
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
          className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Need More Help?
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-[#3B82F6] font-semibold rounded-xl hover:bg-[#F9FAFB] transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/support"
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              Support Center
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
