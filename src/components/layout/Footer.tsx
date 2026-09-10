'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { Twitter, Linkedin, Facebook, Instagram, Mail, FileText, Shield, Book } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const productLinks = [
    { href: '/products', label: 'Browse Products' },
    { href: '/products/desksweep', label: 'DeskSweep' },
    { href: '/docs', label: 'Documentation' },
    { href: '/about', label: 'About Us' },
  ]

  const companyLinks = [
    { href: '/contact', label: 'Contact Us' },
    { href: '/about', label: 'Our Story' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/account', label: 'My Account' },
  ]

  const legalLinks = [
    { href: '/privacy', label: 'Privacy Policy', icon: Shield },
    { href: '/terms', label: 'Terms of Service', icon: FileText },
    { href: '/refund-policy', label: 'Refund Policy', icon: Book },
  ]

  return (
    <footer className="bg-[#F8FAFC] text-slate-600 border-t border-slate-200 relative overflow-hidden">
      {/* Background subtle tint */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-slate-200 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Logo + Description */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-block mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Image
                  src="/Logo.png"
                  alt="Appsto"
                  width={160}
                  height={63}
                  className="h-[38px] w-auto object-contain"
                />
              </motion.div>
            </Link>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              The modern software and SaaS marketplace. Authoritative licensing, instant checkout, and seamless creator integrations.
            </p>
          </motion.div>

          {/* Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-slate-900 font-semibold mb-5 text-sm uppercase tracking-wider">Products</h4>
            <ul className="space-y-3">
              {productLinks.map((link, i) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link href={link.href}>
                    <motion.span 
                      className="text-slate-600 hover:text-slate-900 transition-colors text-sm block"
                      whileHover={{ x: 4 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-slate-900 font-semibold mb-5 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link, i) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <Link href={link.href}>
                    <motion.span 
                      className="text-slate-600 hover:text-slate-900 transition-colors text-sm block"
                      whileHover={{ x: 4 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-slate-900 font-semibold mb-5 text-sm uppercase tracking-wider">Support</h4>
            <div className="space-y-2.5 mb-6">
              <motion.a 
                href="mailto:support@appsto.software" 
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm"
                whileHover={{ x: 4 }}
              >
                <Mail className="w-4 h-4 text-slate-400" />
                support@appsto.software
              </motion.a>
              <motion.a 
                href="mailto:skillnavoteams@gmail.com" 
                className="flex items-center gap-2 text-slate-600 hover:text-[#723CFB] transition-colors text-sm"
                whileHover={{ x: 4 }}
              >
                <Mail className="w-4 h-4 text-[#723CFB]" />
                skillnavoteams@gmail.com
              </motion.a>
            </div>
            
            {/* Legal Links */}
            <div className="space-y-2.5">
              {legalLinks.map((link, i) => {
                const Icon = link.icon
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <Link href={link.href}>
                      <motion.span 
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm"
                        whileHover={{ x: 4 }}
                      >
                        <Icon className="w-4 h-4 text-slate-400" />
                        {link.label}
                      </motion.span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-slate-200 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} Appsto. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="/privacy">
                <span className="hover:text-slate-900 transition-colors">
                  Privacy
                </span>
              </Link>
              <Link href="/terms">
                <span className="hover:text-slate-900 transition-colors">
                  Terms
                </span>
              </Link>
              <Link href="/refund-policy">
                <span className="hover:text-slate-900 transition-colors">
                  Refund Policy
                </span>
              </Link>
              <span className="text-slate-400">
                Crafted for creators & software builders
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
