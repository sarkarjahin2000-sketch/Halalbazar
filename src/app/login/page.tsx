'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShieldCheck, ArrowLeft, Loader2, Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react'
import { useLanguageStore, translations } from '@/store/language'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const { language } = useLanguageStore()
  const t = translations[language]

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [googleLoading, setGoogleLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')

  const handleGoogleAuth = async () => {
    setGoogleLoading(true)
    setErrorMessage('')
    try {
      await signIn('google', { callbackUrl })
    } catch (err) {
      setErrorMessage(language === 'bn' ? 'Google দিয়ে প্রবেশ ব্যর্থ হয়েছে' : 'Google sign in failed')
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setFormLoading(true)

    if (mode === 'login') {
      // Login with Email & Password
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setErrorMessage(
          language === 'bn'
            ? 'ইমেইল বা পাসওয়ার্ড সঠিক নয়'
            : 'Invalid email or password'
        )
        setFormLoading(false)
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } else {
      // Register new user
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, phone }),
        })

        const data = await res.json()

        if (!res.ok) {
          setErrorMessage(data.message || (language === 'bn' ? 'নিবন্ধন ব্যর্থ হয়েছে' : 'Registration failed'))
          setFormLoading(false)
          return
        }

        setSuccessMessage(
          language === 'bn'
            ? 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! প্রবেশ করা হচ্ছে...'
            : 'Account created! Signing you in...'
        )

        // Automatically sign in
        const loginRes = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (!loginRes?.error) {
          router.push(callbackUrl)
          router.refresh()
        } else {
          setMode('login')
          setFormLoading(false)
        }
      } catch (err) {
        setErrorMessage(
          language === 'bn'
            ? 'সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পর চেষ্টা করুন'
            : 'Something went wrong. Please try again.'
        )
        setFormLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-950 flex items-center justify-center p-4 py-10">
      {/* Decorative background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to store */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-emerald-300/70 hover:text-emerald-200 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'bn' ? 'স্টোরে ফিরে যান' : 'Back to Store'}
        </Link>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-2xl border border-white/20">
          {/* Logo & Heading */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-600 shadow-md bg-white mb-3">
              <Image
                src="/images/logo.png"
                alt="হালাল বাজার"
                fill
                priority
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              {mode === 'login'
                ? (language === 'bn' ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন' : 'Welcome Back')
                : (language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create an Account')}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {mode === 'login'
                ? (language === 'bn' ? 'অর্ডার ট্র্যাক করুন ও কেনাকাটা সহজ করুন' : 'Sign in to manage orders & track purchases')
                : (language === 'bn' ? 'দ্রুত কেনাকাটার জন্য আপনার অ্যাকাউন্ট খুলুন' : 'Sign up to shop genuine halal organic goods')}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-stone-100 p-1 mb-6 border border-stone-200/80">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setErrorMessage('')
                setSuccessMessage('')
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {language === 'bn' ? 'লগইন' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setErrorMessage('')
                setSuccessMessage('')
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {language === 'bn' ? 'সাইন আপ' : 'Sign Up'}
            </button>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google One-Click Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading || formLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-stone-500" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            <span>
              {mode === 'login'
                ? (language === 'bn' ? 'Google দিয়ে লগইন করুন' : 'Continue with Google')
                : (language === 'bn' ? 'Google দিয়ে সাইন আপ করুন' : 'Sign up with Google')}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
              {language === 'bn' ? 'অথবা ইমেইল দিয়ে' : 'or with email'}
            </span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'bn' ? 'আপনার নাম' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'bn' ? 'মোঃ রহিম' : 'John Doe'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর (ঐচ্ছিক)' : 'Phone Number (Optional)'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-[11px] text-stone-400 mt-1">
                  {language === 'bn' ? 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন' : 'Must be at least 6 characters'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={formLoading || googleLoading}
              className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {mode === 'login'
                  ? (language === 'bn' ? 'লগইন করুন' : 'Sign In')
                  : (language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account')}
              </span>
            </button>
          </form>

          {/* Guest checkout tip */}
          <div className="mt-5 p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center">
            <p className="text-xs text-stone-600 font-medium">
              {language === 'bn'
                ? '🛒 অ্যাকাউন্ট ছাড়াও আপনি অর্ডার করতে পারবেন!'
                : '🛒 You can also place orders as a guest!'}
            </p>
            <Link
              href="/products"
              className="inline-block mt-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2"
            >
              {language === 'bn' ? 'শপিং করতে থাকুন →' : 'Continue Shopping →'}
            </Link>
          </div>

          {/* Discreet Admin Login Link */}
          <div className="mt-5 pt-4 border-t border-stone-100 text-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-emerald-700 font-medium transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}</span>
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <p className="text-center text-xs text-emerald-300/60 mt-4">
          {language === 'bn'
            ? '🔒 আপনার ব্যক্তিগত তথ্য সম্পূর্ণ নিরাপদ ও সুরক্ষিত'
            : '🔒 Your data is fully encrypted & safe'}
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
