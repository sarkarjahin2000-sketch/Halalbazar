import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How ShopBD protects and handles customer data with guest-first privacy.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="container max-w-4xl">
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-700">Home</Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">Privacy Policy</span>
        </div>

        <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-12 shadow-sm mb-10">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-stone-600 text-sm leading-relaxed">
            Your privacy is foundational to our philosophy. Because ShopBD operates as a guest-first storefront, we collect only the minimal data necessary to deliver your package to your door.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-10 shadow-sm space-y-6 text-sm text-stone-700 leading-relaxed">
          <div>
            <h3 className="font-bold text-stone-900 text-base mb-2">1. Information We Collect</h3>
            <p className="text-xs text-stone-600">
              When you place an order, we collect your name, Bangladesh contact number, and street delivery address. If provided, we also record your email address to send digital invoices and delivery updates. We do not require passwords or social network access.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-900 text-base mb-2">2. How Your Information is Used</h3>
            <p className="text-xs text-stone-600">
              Your details are used strictly to coordinate courier dispatch, communicate transit milestones, and provide customer support. We never sell, rent, or trade your phone number or personal details to third-party telemarketers or advertisers.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-900 text-base mb-2">3. Data Security</h3>
            <p className="text-xs text-stone-600">
              All communications between your browser and our server are encrypted via industry-standard TLS/SSL. Access to order data is strictly restricted to authenticated administrators who manage order packing and customer inquiries.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
