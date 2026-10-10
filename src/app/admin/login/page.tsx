'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('sarkarjahin2000@gmail.com')
  const [password, setPassword] = useState('Admin@1234!')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid credentials')
        setLoading(false)
        return
      }

      toast.success('Welcome back, Admin!')
      router.push('/admin')
      router.refresh()
    } catch {
      setError('An error occurred during login. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-stone-800">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-600 shadow-md mb-4 bg-white">
            <Image
              src="/images/logo.png"
              alt="হালাল বাজার লোগো"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            হালাল বাজার অ্যাডমিন পোর্টাল
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Halal Bazar Admin Portal • অর্গানিক গ্রোসারি শপ
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              অ্যাডমিন ইমেইল (Admin Email)
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarkarjahin2000@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              পাসওয়ার্ড (Password)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-500">
            <strong>অ্যাডমিন লগইন তথ্য:</strong><br />
            Email: <code className="text-stone-800 font-bold">sarkarjahin2000@gmail.com</code><br />
            Password: <code className="text-stone-800">Admin@1234!</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 active:scale-95 mt-2"
          >
            {loading ? (
              <span>প্রবেশ করা হচ্ছে...</span>
            ) : (
              <>
                <span>লগইন করুন (Sign In)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
