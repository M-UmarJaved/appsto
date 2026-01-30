'use client'

import { motion } from 'motion/react'
import { Home, Search, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1220] flex items-center justify-center px-4">
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
              className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#2563EB]"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              404
            </motion.div>
            <motion.div
              className="absolute -top-8 -right-8 w-20 h-20 bg-[#3B82F6]/20 rounded-full blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
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
          <div className="w-20 h-20 mx-auto rounded-full bg-[#3B82F6]/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-[#3B82F6]" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B1220] dark:text-[#E5E7EB] mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-[#9CA3AF] mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. The page might have been moved or doesn't exist.
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
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] text-[#0B1220] dark:text-[#E5E7EB] font-semibold rounded-xl hover:border-[#3B82F6] dark:hover:border-[#3B82F6] transition-all"
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
          className="mt-12 pt-8 border-t border-[#E5E7EB] dark:border-[#1F2937]"
        >
          <p className="text-sm text-[#9CA3AF] mb-4">
            Need help? Check out these resources:
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/support" className="text-sm text-[#3B82F6] hover:underline">
              Support Center
            </Link>
            <Link href="/contact" className="text-sm text-[#3B82F6] hover:underline">
              Contact Us
            </Link>
            <Link href="/docs" className="text-sm text-[#3B82F6] hover:underline">
              Documentation
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
