'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react'
import { useLanguageStore, translations } from '@/store/language'

export default function LoginPage() {
  const { language } = useLanguageStore()
  const t = translations[language]
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    await signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-950 flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to store */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-emerald-300/70 hover:text-emerald-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'bn' ? 'স্টোরে ফিরে যান' : 'Back to Store'}
        </Link>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20">
          {/* Logo & Title */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-emerald-600 shadow-lg bg-white mb-4">
              <Image
                src="/images/logo.png"
                alt="হালাল বাজার"
                fill
                priority
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              {language === 'bn' ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন' : 'Sign in to your account'}
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              {language === 'bn'
                ? 'অর্ডার ট্র্যাক করুন, ইচ্ছা তালিকা সেভ করুন'
                : 'Track orders, save wishlist & more'}
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 text-stone-800 font-bold text-sm shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            <span>
              {loading
                ? (language === 'bn' ? 'প্রবেশ করা হচ্ছে...' : 'Signing in...')
                : (language === 'bn' ? 'Google দিয়ে সাইন ইন করুন' : 'Sign in with Google')}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs text-stone-400 font-medium">
              {language === 'bn' ? 'অথবা' : 'OR'}
            </span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Guest checkout note */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-sm text-emerald-800 font-medium">
              {language === 'bn'
                ? '🛒 অ্যাকাউন্ট ছাড়াই অর্ডার করতে পারবেন!'
                : '🛒 You can also order without an account!'}
            </p>
            <Link
              href="/products"
              className="inline-block mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2"
            >
              {language === 'bn' ? 'শপিং শুরু করুন →' : 'Start Shopping →'}
            </Link>
          </div>

          {/* Admin link */}
          <div className="mt-6 pt-5 border-t border-stone-100 text-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 font-medium transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {language === 'bn' ? 'অ্যাডমিন লগইন' : 'Admin Login'}
            </Link>
          </div>
        </div>

        {/* Security note */}
        <p className="text-center text-xs text-emerald-300/50 mt-4">
          {language === 'bn'
            ? '🔒 আপনার তথ্য সম্পূর্ণ নিরাপদ ও এনক্রিপ্টেড'
            : '🔒 Your data is fully secure & encrypted'}
        </p>
      </div>
    </div>
  )
}
