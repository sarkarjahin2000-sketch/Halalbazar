import Link from 'next/link'
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'Returns & Refunds Policy',
  description: '7-day replacement guarantee and refund policy for ShopBD customers.',
}

export default function ReturnsPage() {
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-700">Home</Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">Returns &amp; Refunds</span>
        </div>

        <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-12 shadow-sm mb-10">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-4">
            7-Day Hassle-Free Return Policy
          </h1>
          <p className="text-stone-600 text-sm leading-relaxed">
            Your trust is our most valuable asset. If you receive an item that is damaged, defective, or does not meet our purity promise, we will replace it or issue a prompt refund.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-10 shadow-sm space-y-8 text-sm text-stone-700 leading-relaxed">
          <div>
            <h3 className="font-bold text-stone-900 text-base mb-2">Eligible Conditions for Return</h3>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>The product arrived damaged, broken, or leaking during courier handling.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>The item delivered does not match what you ordered (e.g. wrong variant or weight).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Quality dispute: Any proven adulteration or defective seal upon opening.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-stone-900 text-base mb-2">How to Request a Replacement</h3>
            <p className="text-xs text-stone-600 mb-3">
              1. Contact our hotline at <strong>+880 1712-345678</strong> or email <strong>support@shopbd.com</strong> within 7 days of receiving the parcel.
            </p>
            <p className="text-xs text-stone-600 mb-3">
              2. Share your order reference number (e.g. <span className="font-mono bg-stone-100 px-1 py-0.5 rounded">SBD-XXXX-XXXX</span>) and a quick photo/video of the affected item.
            </p>
            <p className="text-xs text-stone-600">
              3. We will dispatch a fresh replacement jar or process your refund via bKash, Nagad, or bank transfer within 24 to 48 hours.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-900 text-base mb-2">Refund Processing Times</h3>
            <p className="text-xs text-stone-600">
              Mobile Financial Services (bKash/Nagad): <strong>24 business hours</strong><br />
              Bank transfers: <strong>2 to 3 business days</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
