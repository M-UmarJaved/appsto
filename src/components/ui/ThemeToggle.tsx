'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-8 h-8" />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="group flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#3B82F6]/10 transition-all duration-300"
      aria-label="Toggle theme"
    >
      <motion.span
        className="flex items-center justify-center"
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-[#22D3EE]" />
        ) : (
          <Moon className="w-5 h-5 text-[#3B82F6]" />
        )}
      </motion.span>
    </button>
  )
}
