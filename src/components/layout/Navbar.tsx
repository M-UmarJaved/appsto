'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Menu, Package, X, User, LogOut, Settings, LayoutDashboard, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut, loading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY >= 80)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
    router.push('/')
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY >= 80)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About us' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out ${isSticky ? 'py-1' : 'py-3'}`}>
        <motion.nav 
          className={`flex items-center justify-between px-4 transition-all duration-500 ease-in-out ${
            isSticky ? 'py-2 rounded-full shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] bg-[#F9FAFB]/95 dark:bg-[#0B1220]/95 backdrop-blur-md' : 'py-3'
          }`}
          layout
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Logo Button */}
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Image
                src="/Logo.png"
                alt="Appsto"
                width={200}
                height={50}
                className={`w-auto object-contain transition-all duration-500 ease-in-out ${isSticky ? 'h-[38px]' : 'h-[50px]'}`}
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation - Pill Container */}
          <div className="hidden lg:flex items-center bg-[#0B1220]/5 dark:bg-[#E5E7EB]/5 rounded-3xl p-3">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="relative block"
                  >
                    <motion.span
                      className={`px-4 py-2 text-sm font-medium block rounded-3xl transition-colors duration-200 ${
                        isActive 
                          ? 'bg-[#3B82F6] text-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)]' 
                          : 'text-[#0B1220] dark:text-[#E5E7EB]'
                      }`}
                      whileHover={{ scale: 1.05, backgroundColor: isActive ? undefined : 'rgba(59, 130, 246, 0.1)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Right Side - Auth Buttons or User Menu */}
          <div className="hidden lg:flex items-center gap-2">
            {!loading && (user ? (
              <motion.div
                ref={userMenuRef}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#0B1220]/5 dark:bg-[#E5E7EB]/5 hover:bg-[#0B1220]/10 dark:hover:bg-[#E5E7EB]/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {user.user_metadata?.avatar_url ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt="Avatar"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-[#0B1220] dark:text-[#E5E7EB]">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111827] rounded-2xl shadow-xl border border-[#E5E7EB] dark:border-[#1F2937] overflow-hidden"
                    >
                      <div className="p-3 border-b border-[#E5E7EB] dark:border-[#1F2937]">
                        <p className="text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] truncate">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-[#9CA3AF] truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#9CA3AF]" />
                          <span className="text-sm font-medium text-[#0B1220] dark:text-[#E5E7EB]">Dashboard</span>
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#9CA3AF]" />
                          <span className="text-sm font-medium text-[#0B1220] dark:text-[#E5E7EB]">Account Settings</span>
                        </Link>
                      </div>
                      <div className="p-2 border-t border-[#E5E7EB] dark:border-[#1F2937]">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                          <span className="text-sm font-medium text-red-600 dark:text-red-400">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link href="/signin">
                    <motion.span 
                      className="px-4 py-2 text-sm font-medium border border-[#3B82F6] text-[#3B82F6] rounded-full block"
                      whileHover={{ scale: 1.05, backgroundColor: '#3B82F6', color: '#ffffff' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign In
                    </motion.span>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link href="/signup">
                    <motion.span 
                      className="px-4 py-2 text-sm font-medium bg-[#3B82F6] text-white rounded-full block"
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign Up
                    </motion.span>
                  </Link>
                </motion.div>
              </>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-[#0B1220]/5 dark:hover:bg-[#E5E7EB]/5 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#0B1220] dark:text-[#E5E7EB]" />
              ) : (
                <Menu className="w-6 h-6 text-[#0B1220] dark:text-[#E5E7EB]" />
              )}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="lg:hidden fixed top-0 right-0 h-full w-full max-w-xs bg-[#F9FAFB] dark:bg-[#0B1220] shadow-lg"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-10 h-10 bg-[#3B82F6] rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-semibold text-[#0B1220] dark:text-[#E5E7EB]">Appsto</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-[#0B1220]/5 dark:hover:bg-[#E5E7EB]/5"
                >
                  <X className="w-6 h-6 text-[#0B1220] dark:text-[#E5E7EB]" />
                </button>
              </div>

              <nav className="space-y-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-[#0B1220] dark:text-[#E5E7EB] font-medium rounded-xl hover:bg-[#0B1220]/5 dark:hover:bg-[#E5E7EB]/5 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-8 space-y-3">
                {!loading && (user ? (
                  <>
                    <div className="px-4 py-3 bg-[#0B1220]/5 dark:bg-[#E5E7EB]/5 rounded-xl mb-4">
                      <div className="flex items-center gap-4">
                        {user.user_metadata?.avatar_url ? (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={user.user_metadata.avatar_url}
                              alt="Avatar"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-white">
                              {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-[#0B1220] dark:text-[#E5E7EB] truncate">
                            {user.user_metadata?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-[#9CA3AF] truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[#0B1220] dark:text-[#E5E7EB] font-medium rounded-xl hover:bg-[#0B1220]/5 dark:hover:bg-[#E5E7EB]/5 transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[#0B1220] dark:text-[#E5E7EB] font-medium rounded-xl hover:bg-[#0B1220]/5 dark:hover:bg-[#E5E7EB]/5 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      Account Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 w-full text-red-600 dark:text-red-400 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 text-sm font-medium border border-[#3B82F6] text-[#3B82F6] rounded-full hover:bg-[#3B82F6] hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 text-sm font-medium bg-[#3B82F6] text-white rounded-full hover:bg-[#2563EB] transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
