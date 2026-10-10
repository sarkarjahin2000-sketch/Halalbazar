import Link from 'next/link'
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Shipping & Delivery Policy',
  description: 'Shipping rates, delivery times, and coverage across Dhaka and all Bangladesh districts.',
}

export default function ShippingPage() {
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-700">Home</Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">Shipping &amp; Delivery</span>
        </div>

        <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-12 shadow-sm mb-10">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-4">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-stone-600 text-sm leading-relaxed">
            At ShopBD, we partner with premier nationwide couriers (Steadfast, RedX, Pathao) to ensure your natural honey, dry fruits, and spices reach your home quickly and in pristine condition.
          </p>
        </div>

        {/* Rates & Zones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                Inside Dhaka
              </span>
              <span className="text-xl font-extrabold text-stone-900">৳60</span>
            </div>
            <h3 className="font-bold text-stone-900 text-lg mb-2">Dhaka City Delivery</h3>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" /> Transit Time: <strong>1 to 2 business days</strong>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Free Shipping on orders over <strong>৳2,000</strong>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" /> Covers all areas within Dhaka Metropolitan
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md">
                Outside Dhaka
              </span>
              <span className="text-xl font-extrabold text-stone-900">৳120</span>
            </div>
            <h3 className="font-bold text-stone-900 text-lg mb-2">Nationwide All 64 Districts</h3>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" /> Transit Time: <strong>2 to 4 business days</strong>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Free Shipping on orders over <strong>৳3,000</strong>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" /> Direct home delivery to your doorstep
              </li>
            </ul>
          </div>
        </div>

        {/* Key Delivery Guidelines */}
        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-10 shadow-sm space-y-6 text-sm text-stone-700 leading-relaxed">
          <div>
            <h3 className="font-bold text-stone-900 text-base mb-2">1. Phone Verification Before Dispatch</h3>
            <p>
              To eliminate misrouted deliveries and incorrect addresses, our dispatch coordination team will call your provided mobile number. Once confirmed, the package is immediately released to our courier partners.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-900 text-base mb-2">2. Cash on Delivery (COD) Inspection</h3>
            <p>
              When the delivery rider arrives, you are entitled to inspect the outer seal and package before paying the invoice amount in cash. If there are signs of bottle leakage or breakage during transit, you may reject the package without any penalty.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-900 text-base mb-2">3. Packaging Security</h3>
            <p>
              All honey glass jars and spice containers are individually wrapped in thick shock-absorbing bubble cushioning and packed into rigid corrugated cardboard boxes to prevent damage during long-distance transit.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
