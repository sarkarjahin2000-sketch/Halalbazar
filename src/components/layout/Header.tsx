'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Search, Menu, X, Phone, MapPin, Sparkles, Globe, User, LogOut, LogIn, ShieldCheck } from 'lucide-react'
import { useCartCount, useCartStore } from '@/store/cart'
import { useLanguageStore, translations } from '@/store/language'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const pathname = usePathname()
  const cartCount = useCartCount()
  const { openCart } = useCartStore()
  const { language, setLanguage, toggleLanguage } = useLanguageStore()
  const t = translations[language]

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const navLinks = language === 'bn'
    ? [
        { href: '/products', label: 'সকল পণ্য' },
        { href: '/categories/honey', label: 'খাঁটি মধু' },
        { href: '/categories/dry-fruits', label: 'ড্রাই ফ্রুটস' },
        { href: '/categories/spices', label: 'মশলা' },
        { href: '/about', label: 'আমাদের সম্পর্কে' },
        { href: '/contact', label: 'যোগাযোগ' },
      ]
    : [
        { href: '/products', label: 'All Products' },
        { href: '/categories/honey', label: 'Pure Honey' },
        { href: '/categories/dry-fruits', label: 'Dry Fruits' },
        { href: '/categories/spices', label: 'Spices' },
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact Us' },
      ]

  const isAdmin = pathname.startsWith('/admin')
  if (isAdmin) return null

  return (
    <>
      {/* Top Announcement Bar with Phone, Location & Language Switcher */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4 border-b border-emerald-900/60 hidden sm:block">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.topSlogan}</span>
            </span>
            <span className="hidden md:inline text-emerald-600">|</span>
            <span className="hidden md:flex items-center gap-1 text-emerald-300">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>{t.location}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:01618908086"
              className="flex items-center gap-1 font-bold text-amber-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>{t.hotline}: 01618908086</span>
            </a>
            <a
              href="https://tiktok.com/@halal.bazar6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-emerald-300 hover:text-white transition-colors"
            >
              TikTok: @halal.bazar6
            </a>

            {/* Quick Language Toggle in Top Bar */}
            <div className="flex items-center gap-1 border-l border-emerald-800 pl-3">
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  language === 'bn'
                    ? 'bg-emerald-800 text-amber-300'
                    : 'text-emerald-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <span className="text-emerald-700">/</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  language === 'en'
                    ? 'bg-emerald-800 text-amber-300'
                    : 'text-emerald-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Login / Sign Up Link */}
            <Link
              href="/login"
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-white transition-colors border-l border-emerald-800 pl-3"
              title={language === 'bn' ? 'লগইন / সাইন আপ' : 'Login / Sign Up'}
            >
              <LogIn className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'bn' ? 'লগইন / সাইন আপ' : 'Login / Sign Up'}</span>
            </Link>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200'
            : 'bg-white border-b border-stone-100'
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0 group"
              aria-label="Halal Bazar Home"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-600 shadow-sm bg-white shrink-0 group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo.png"
                  alt="হালাল বাজার — Halal Bazar"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                    {language === 'bn' ? (
                      <>হালাল <span className="text-emerald-700">বাজার</span></>
                    ) : (
                      <>Halal <span className="text-emerald-700">Bazar</span></>
                    )}
                  </span>
                  {language === 'bn' && (
                    <span className="text-xs font-semibold text-stone-400 font-sans hidden sm:inline">
                      (Halal Bazar)
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-medium text-emerald-800 -mt-0.5">
                  {t.storeSubtitle} • Naturally Halal
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions: Language Selector, Search, Cart, Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Language Selector Button in Navbar */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 text-xs font-bold text-stone-700 hover:text-emerald-800 transition-all shadow-sm"
                title={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
                aria-label="Toggle language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'বাংলা' : 'English'}</span>
              </button>

              {/* User Account */}
              <div className="relative" ref={userMenuRef}>
                {session?.user ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-stone-50 transition-colors"
                      aria-label="Account menu"
                    >
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          width={32}
                          height={32}
                          className="rounded-full border-2 border-emerald-500"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-500">
                          <User className="w-4 h-4 text-emerald-700" />
                        </div>
                      )}
                    </button>

                    {/* User dropdown */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50"
                        >
                          <div className="p-4 bg-emerald-50 border-b border-emerald-100">
                            <div className="flex items-center gap-3">
                              {session.user.image ? (
                                <Image
                                  src={session.user.image}
                                  alt={session.user.name || ''}
                                  width={40}
                                  height={40}
                                  className="rounded-full border-2 border-emerald-500"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center">
                                  <User className="w-5 h-5 text-emerald-700" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-stone-900 truncate">
                                  {session.user.name}
                                </p>
                                <p className="text-xs text-stone-500 truncate">
                                  {session.user.email}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            {(session.user as any)?.role === 'ADMIN' && (
                              <Link
                                href="/admin"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors mb-1"
                              >
                                🛡️ {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}
                              </Link>
                            )}
                            <Link
                              href="/track-order"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                            >
                              📦 {language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Orders'}
                            </Link>
                            <button
                              onClick={() => signOut({ callbackUrl: '/' })}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              {language === 'bn' ? 'সাইন আউট' : 'Sign Out'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 transition-all shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{language === 'bn' ? 'লগইন' : 'Login'}</span>
                  </Link>
                )}
              </div>

              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="btn btn-ghost p-2.5"
                aria-label="Search products"
                aria-expanded={searchOpen}
              >
                {searchOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="btn btn-ghost p-2.5 relative"
                aria-label={`Shopping cart, ${cartCount} items`}
                id="cart-button"
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="cart-count"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="btn btn-ghost p-2.5 lg:hidden"
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleSearch} className="pb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="input pl-9"
                      autoFocus
                      aria-label="Search products"
                    />
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile nav menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-stone-100 bg-white overflow-hidden shadow-lg"
            >
              <nav className="container py-3 flex flex-col gap-1" aria-label="Mobile navigation">
                {/* Language Switcher in Mobile Drawer */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 mb-2">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-600" /> ভাষা / Language:
                  </span>
                  <div className="flex rounded-lg overflow-hidden border border-stone-300 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setLanguage('bn')}
                      className={`px-3 py-1 transition-colors ${
                        language === 'bn'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      বাংলা
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-1 transition-colors ${
                        language === 'en'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="border-stone-100 my-1" />
                <Link
                  href="/track-order"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  {t.trackOrder}
                </Link>

                {(session?.user as any)?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 flex items-center gap-2 transition-colors"
                  >
                    <span>🛡️ {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}</span>
                  </Link>
                )}

                {session ? (
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{language === 'bn' ? 'সাইন আউট' : 'Sign Out'}</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100 flex items-center gap-2 transition-colors mt-1"
                  >
                    <LogIn className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'bn' ? 'লগইন / সাইন আপ' : 'Login / Sign Up'}</span>
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
