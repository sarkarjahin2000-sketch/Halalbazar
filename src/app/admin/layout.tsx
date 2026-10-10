'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Tag,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Leaf,
  Menu,
  X,
  Loader2,
  ShieldAlert,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { toast } from 'sonner'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Store Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      toast.error('অ্যাডমিন অ্যাক্সেস প্রয়োজন (Admin access required)')
      router.replace('/')
    }
  }, [status, session, pathname, router])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
    } catch {}
    toast.info('সাইন আউট সম্পন্ন হয়েছে')
    await signOut({ callbackUrl: '/login' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
        <p className="text-stone-300 text-sm font-medium">অ্যাডমিন প্রবেশাধিকার যাচাই করা হচ্ছে...</p>
      </div>
    )
  }

  if (status === 'unauthenticated' || (session?.user as any)?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-stone-900">প্রবেশাধিকার সংরক্ষিত</h2>
          <p className="text-xs text-stone-500 mt-1 mb-4">
            লগইন পেজে রিডাইরেক্ট করা হচ্ছে...
          </p>
          <Loader2 className="w-5 h-5 animate-spin text-stone-400 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden bg-stone-900 text-white p-4 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-emerald-500 bg-white">
            <Image src="/images/logo.png" alt="Halal Bazar" fill className="object-cover" />
          </div>
          <span className="font-bold text-sm">হালাল বাজার অ্যাডমিন</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-stone-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-stone-900 text-stone-300 flex-shrink-0 flex flex-col justify-between p-4 sm:p-6 border-r border-stone-800 min-h-screen`}
      >
        <div>
          {/* Brand */}
          <div className="hidden md:flex items-center gap-3 mb-8 px-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md bg-white shrink-0">
              <Image src="/images/logo.png" alt="Halal Bazar" fill className="object-cover" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight">হালাল বাজার</span>
              <span className="block text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-stone-800 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-stone-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  )
}
