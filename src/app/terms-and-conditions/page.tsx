import Link from 'next/link'
import { FileText } from 'lucide-react'

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Terms of service and purchasing rules for ShopBD.',
}

export default function TermsPage() {
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="container max-w-4xl">
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-700">Home</Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">Terms &amp; Conditions</span>
        </div>

        <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-12 shadow-sm mb-10">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-stone-600 text-sm leading-relaxed">
            Please read these terms before placing an order on ShopBD. By placing an order, you agree to the conditions stated below.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-10 shadow-sm space-y-6 text-sm text-stone-700 leading-relaxed">
          <div>
            <h3 className="font-bold text-stone-900 text-base mb-2">1. Orders &amp; Acceptance</h3>
            <p className="text-xs text-stone-600">
              Orders placed on ShopBD constitute an offer to buy. Our confirmation via telephone constitutes agreement to fulfill the order. We reserve the right to cancel any order if stock is unavailable or delivery cannot be securely coordinated.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-900 text-base mb-2">2. Pricing &amp; Currency</h3>
            <p className="text-xs text-stone-600">
              All prices are listed in Bangladeshi Taka (BDT ৳) and are inclusive of standard local taxes where applicable. Shipping costs are clearly presented during checkout before you finalize your order.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-900 text-base mb-2">3. Cash on Delivery Terms</h3>
            <p className="text-xs text-stone-600">
              For Cash on Delivery orders, payment in full must be made to the authorized delivery rider upon physical handover of the parcel. Repeated refusal of legitimate verified orders without valid reason may result in address restrictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
