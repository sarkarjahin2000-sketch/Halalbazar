'use client'

import Link from 'next/link'
import { useLanguageStore, translations } from '@/store/language'
import { CheckCircle2, PackageCheck, PhoneCall, Truck, ShoppingBag } from 'lucide-react'

interface OrderSuccessContentProps {
  order: any
}

export default function OrderSuccessContent({ order }: OrderSuccessContentProps) {
  const { language } = useLanguageStore()
  const t = translations[language]

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="container max-w-3xl">
        {/* Success Card */}
        <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-12 shadow-sm mb-8 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {t.successTitle}
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-3 mb-2">
            {t.successGreeting} {order.customerName}!
          </h1>

          <p className="text-stone-600 text-base max-w-lg mx-auto mb-6">
            {t.successSubtitle}
          </p>

          <div className="inline-flex items-center gap-2 p-3 px-5 rounded-2xl bg-amber-50 border border-amber-200 text-stone-900 font-mono text-sm mb-6">
            <span className="text-stone-500 font-sans font-medium text-xs">
              {t.successRefLabel}
            </span>
            <strong className="text-amber-800 text-base">{order.publicReference}</strong>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/track-order?ref=${encodeURIComponent(order.publicReference)}&phone=${encodeURIComponent(order.customerPhone)}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Truck className="w-4 h-4" />
              <span>{t.successTrackBtn}</span>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.successContinueBtn}</span>
            </Link>
          </div>
        </div>

        {/* What Happens Next Card */}
        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-lg font-extrabold text-stone-900 mb-4 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-700" />
            {t.successNextTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <PhoneCall className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1">
                {t.successNextStep1Title}
              </h3>
              <p className="text-xs text-stone-500">
                {t.successNextStep1Desc} (<strong className="text-stone-700">{order.customerPhone}</strong>)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1">
                {t.successNextStep2Title}
              </h3>
              <p className="text-xs text-stone-500">
                {t.successNextStep2Desc} ({order.district})
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1">
                {t.successNextStep3Title}
              </h3>
              <p className="text-xs text-stone-500">
                {t.successNextStep3Desc} (৳{order.grandTotal.toLocaleString('en-BD')})
              </p>
            </div>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-extrabold text-stone-900 mb-4">
            {t.summaryTitle}
          </h2>

          {/* Delivery details */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
            <div>
              <span className="text-stone-400 block mb-0.5">{t.deliveryAddressLabel}</span>
              <p className="font-semibold text-stone-800">{order.deliveryAddress}, {order.district}</p>
              {order.deliveryInstructions && (
                <p className="text-stone-500 italic mt-1">Note: {order.deliveryInstructions}</p>
              )}
            </div>
            <div>
              <span className="text-stone-400 block mb-0.5">{t.paymentMethodLabel}</span>
              <p className="font-semibold text-stone-800">
                {t.codTitle} (৳{order.grandTotal.toLocaleString('en-BD')})
              </p>
              <p className="text-stone-500 mt-1">Status: <span className="text-emerald-700 font-bold uppercase">{order.status}</span></p>
            </div>
          </div>

          {/* Items */}
          <div className="divide-y divide-stone-100 mb-6">
            {order.items.map((item: any) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-stone-900">{item.productNameSnapshot}</p>
                  <p className="text-xs text-stone-500">{item.quantity} × ৳{item.unitPriceSnapshot.toLocaleString('en-BD')}</p>
                </div>
                <span className="text-sm font-extrabold text-stone-900">
                  ৳{item.lineTotal.toLocaleString('en-BD')}
                </span>
              </div>
            ))}
          </div>

          {/* Financials */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-sm text-stone-600">
            <div className="flex justify-between">
              <span>{t.subtotal}:</span>
              <span className="font-bold text-stone-900">৳{order.subtotal.toLocaleString('en-BD')}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>{t.discount}:</span>
                <span className="font-bold">-৳{order.discountTotal.toLocaleString('en-BD')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{t.shipping}:</span>
              <span className="font-bold text-stone-900">
                {order.shippingFee === 0 ? t.free : `৳${order.shippingFee.toLocaleString('en-BD')}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-100">
              <span>{t.grandTotal}:</span>
              <span className="text-xl text-emerald-700">৳{order.grandTotal.toLocaleString('en-BD')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
