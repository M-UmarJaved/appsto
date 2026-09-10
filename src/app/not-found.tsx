'use client'

import { motion } from 'motion/react'
import { Home, Search, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 pt-24 pb-12">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              className="text-[150px] md:text-[200px] font-black text-[#060C17] tracking-tighter"
            >
              404
            </motion.div>
            <div
              className="absolute -top-4 -right-4 w-20 h-20 bg-[#723CFB]/10 rounded-full blur-xl pointer-events-none"
            />
          </div>
        </motion.div>

        {/* Error Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#723CFB]/10 border border-[#723CFB]/20 flex items-center justify-center shadow-sm">
            <AlertCircle className="w-8 h-8 text-[#723CFB]" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#060C17] mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been moved or doesn&apos;t exist.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#723CFB] hover:bg-[#5F27E5] text-white font-semibold rounded-xl transition-all shadow-md shadow-purple-500/20"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-[#060C17] font-semibold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Search className="w-5 h-5" />
            Browse Products
          </Link>
        </motion.div>

        {/* Help Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-slate-200"
        >
          <p className="text-sm text-slate-500 mb-4">
            Need help? Check out these resources:
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/support" className="text-sm text-slate-700 hover:text-[#723CFB] font-medium transition-colors">
              Support Center
            </Link>
            <Link href="/contact" className="text-sm text-slate-700 hover:text-[#723CFB] font-medium transition-colors">
              Contact Us
            </Link>
            <Link href="/docs" className="text-sm text-slate-700 hover:text-[#723CFB] font-medium transition-colors">
              Documentation
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
