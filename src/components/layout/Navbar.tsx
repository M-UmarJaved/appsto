'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Menu, Package, X, User, LogOut, Settings, ChevronDown } from 'lucide-react'
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
            isSticky 
              ? 'py-2 rounded-full shadow-md bg-white/95 backdrop-blur-md border border-slate-200/90' 
              : 'py-3'
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
                width={160}
                height={63}
                className={`w-auto object-contain transition-all duration-500 ease-in-out ${isSticky ? 'h-[36px]' : 'h-[46px]'}`}
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation - Pill Container */}
          <div className="hidden lg:flex items-center bg-slate-100/90 rounded-full p-1.5 border border-slate-200/80 shadow-xs">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href
              return (
                <motion.div
                  key={`${link.href}-${pathname}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="relative block"
                  >
                    <motion.span
                      animate={{ 
                        backgroundColor: isActive ? '#060C17' : 'transparent', 
                        color: isActive ? '#FFFFFF' : '#475569' 
                      }}
                      className={`px-4 py-1.5 text-sm font-medium block rounded-full transition-colors duration-200 ${
                        isActive 
                          ? 'bg-[#060C17] text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      whileHover={{ scale: 1.02 }}
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
                  className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 transition-colors"
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
                    <div className="w-8 h-8 rounded-full bg-[#723CFB] flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-900">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-700"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium">Account Settings</span>
                        </Link>
                      </div>
                      <div className="p-2 border-t border-slate-100">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">Sign Out</span>
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
                      className="px-4 py-1.5 text-sm font-medium border border-slate-300 text-slate-700 rounded-full block transition-colors hover:bg-slate-50"
                      whileHover={{ scale: 1.02 }}
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
                      className="px-4 py-1.5 text-sm font-medium bg-[#723CFB] hover:bg-[#5F27E5] text-white rounded-full block shadow-sm transition-all duration-200 shadow-purple-500/20"
                      whileHover={{ scale: 1.02 }}
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
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-900" />
              ) : (
                <Menu className="w-6 h-6 text-slate-900" />
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
            className="lg:hidden fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-2xl border-l border-slate-200 z-50"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <Image
                    src="/Logo.png"
                    alt="Appsto"
                    width={140}
                    height={55}
                    className="h-[36px] w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-6 h-6 text-slate-900" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href
                  return (
                    <motion.div
                      key={`mobile-${link.href}-${pathname}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-2.5 font-medium rounded-xl transition-colors ${
                          isActive
                            ? 'bg-[#723CFB] text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              <div className="mt-8 space-y-3">
                {!loading && (user ? (
                  <>
                    <div className="px-4 py-3 bg-slate-50 rounded-xl mb-4 border border-slate-200/80">
                      <div className="flex items-center gap-4">
                        {user.user_metadata?.avatar_url ? (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={user.user_metadata.avatar_url}
                              alt="Avatar"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#723CFB] text-white flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold">
                              {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {user.user_metadata?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-slate-500" />
                      Account Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors"
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
                      className="block w-full text-center px-4 py-2.5 text-sm font-medium border border-slate-300 text-slate-800 rounded-full hover:bg-slate-50 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-2.5 text-sm font-medium bg-[#723CFB] text-white rounded-full hover:bg-[#5F27E5] transition-colors shadow-sm shadow-purple-500/20"
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
