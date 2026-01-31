'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { Twitter, Linkedin, Facebook, Instagram, Mail, FileText, Shield, Book } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { 
      icon: Twitter, 
      href: 'https://twitter.com/appsto', 
      label: 'Twitter',
      color: '#1DA1F2'
    },
    { 
      icon: Linkedin, 
      href: 'https://linkedin.com/company/appsto', 
      label: 'LinkedIn',
      color: '#0A66C2'
    },
    { 
      icon: Facebook, 
      href: 'https://facebook.com/appsto', 
      label: 'Facebook',
      color: '#1877F2'
    },
    { 
      icon: Instagram, 
      href: 'https://instagram.com/appsto', 
      label: 'Instagram',
      color: '#E4405F'
    }
  ]

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
  ]

  return (
    <footer className="bg-[#0B1220] text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#22D3EE]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Logo + Description + Social */}
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
                  width={180}
                  height={45}
                  className="h-[45px] w-auto object-contain brightness-0 invert"
                />
              </motion.div>
            </Link>
            <p className="text-[#9CA3AF] text-sm mb-6 leading-relaxed">
              The premium SaaS marketplace trusted by thousands. Secure licensing, instant delivery, and exceptional support.
            </p>
            
            {/* Social Media Icons */}
              {/* Social Media Icons hidden - no links available */}
          </motion.div>

          {/* Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Products</h4>
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
                      className="text-[#9CA3AF] hover:text-[#3B82F6] transition-colors text-sm block"
                      whileHover={{ x: 5 }}
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
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Company</h4>
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
                      className="text-[#9CA3AF] hover:text-[#3B82F6] transition-colors text-sm block"
                      whileHover={{ x: 5 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Get in Touch</h4>
            <div className="space-y-4 mb-6">
              <motion.a 
                href="mailto:support@appsto.software" 
                className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#3B82F6] transition-colors text-sm"
                whileHover={{ x: 5 }}
              >
                <Mail className="w-4 h-4" />
                support@appsto.software
              </motion.a>
            </div>
            
            {/* Legal Links */}
            <div className="space-y-3">
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
                        className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#3B82F6] transition-colors text-sm"
                        whileHover={{ x: 5 }}
                      >
                        <Icon className="w-4 h-4" />
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
          className="border-t border-white/10 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.p 
              className="text-[#9CA3AF] text-sm"
              whileHover={{ color: '#E5E7EB' }}
            >
              © {currentYear} Appsto. All rights reserved.
            </motion.p>
            
            <div className="flex items-center gap-6 text-sm text-[#9CA3AF]">
              <Link href="/privacy">
                <motion.span 
                  className="hover:text-[#3B82F6] transition-colors"
                  whileHover={{ y: -2 }}
                >
                  Privacy
                </motion.span>
              </Link>
              <Link href="/terms">
                <motion.span 
                  className="hover:text-[#3B82F6] transition-colors"
                  whileHover={{ y: -2 }}
                >
                  Terms
                </motion.span>
              </Link>
                <motion.span
                  className="text-[#9CA3AF]"
                  whileHover={{ scale: 1.1, color: '#22D3EE' }}
                >
                  Crafted for professionals
                </motion.span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
