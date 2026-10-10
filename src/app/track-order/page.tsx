'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguageStore, translations } from '@/store/language'
import { Search, CheckCircle2, Truck, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const initialRef = searchParams.get('ref') || ''
  const initialPhone = searchParams.get('phone') || ''
  const { language } = useLanguageStore()
  const t = translations[language]

  const STATUS_STEPS = [
    { key: 'PENDING', label: t.stepPending, desc: t.stepPendingDesc },
    { key: 'CONFIRMED', label: t.stepConfirmed, desc: t.stepConfirmedDesc },
    { key: 'PROCESSING', label: t.stepProcessing, desc: t.stepProcessingDesc },
    { key: 'SHIPPED', label: t.stepShipped, desc: t.stepShippedDesc },
    { key: 'DELIVERED', label: t.stepDelivered, desc: t.stepDeliveredDesc },
  ]

  const [publicReference, setPublicReference] = useState(initialRef)
  const [customerPhone, setCustomerPhone] = useState(initialPhone)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = async (refVal?: string, phoneVal?: string) => {
    const r = (refVal || publicReference).trim()
    const p = (phoneVal || customerPhone).trim()

    if (!r || !p) {
      toast.error(
        language === 'bn'
          ? 'অনুগ্রহ করে অর্ডার রেফারেন্স এবং মোবাইল নম্বর দিন'
          : 'Please enter both Order Reference and Phone Number'
      )
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicReference: r, customerPhone: p }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || (language === 'bn' ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No matching order found'))
        setOrder(null)
      } else {
        setOrder(data.order)
      }
    } catch {
      setError(
        language === 'bn'
          ? 'ট্র্যাকিং সার্ভিসের সাথে সংযোগ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'
          : 'Failed to connect to tracking service. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Auto track if query params present
  useEffect(() => {
    if (initialRef && initialPhone) {
      handleTrack(initialRef, initialPhone)
    }
  }, [initialRef, initialPhone])

  const getStepIndex = (status: string) => {
    const idx = STATUS_STEPS.findIndex((s) => s.key === status)
    return idx === -1 ? 0 : idx
  }

  const currentStepIdx = order ? getStepIndex(order.status) : 0

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="container max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-700">
            {language === 'bn' ? 'হোম' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">{t.trackOrder}</span>
        </div>

        {/* Title Card & Form */}
        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-10 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t.trackOrderTitle}
            </h1>
          </div>
          <p className="text-stone-500 text-sm mb-6">
            {t.trackOrderSubtitle}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleTrack()
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t.orderRefLabel}
              </label>
              <input
                type="text"
                placeholder="e.g. SBD-1234-ABCD"
                value={publicReference}
                onChange={(e) => setPublicReference(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 font-mono text-sm uppercase focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t.customerPhoneLabel}
              </label>
              <input
                type="tel"
                placeholder="01712345678"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t.locatingBtn}</span>
                  </div>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{t.trackBtn}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Tracking Details View */}
        {order && (
          <div className="space-y-6">
            {/* Status Timeline Card */}
            <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-stone-100">
                <div>
                  <span className="text-xs text-stone-400">{t.orderRefLabel}</span>
                  <p className="font-mono font-bold text-lg text-emerald-800">{order.publicReference}</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs text-stone-400">{t.orderPlacedOn}</span>
                  <p className="text-xs font-semibold text-stone-700">
                    {new Date(order.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Step indicator */}
              <div className="py-8">
                <div className="relative">
                  {/* Connecting line */}
                  <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-stone-200 -z-0">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-500"
                      style={{
                        width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx
                      const isCurrent = idx === currentStepIdx

                      return (
                        <div key={step.key} className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 text-left sm:text-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm shrink-0 ${
                              isCurrent
                                ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                                : isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-100 text-stone-400 border border-stone-300'
                            }`}
                          >
                            {isCompleted && !isCurrent ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <div>
                            <p className={`text-xs font-bold leading-tight ${
                              isCurrent ? 'text-emerald-700' : isCompleted ? 'text-stone-900' : 'text-stone-400'
                            }`}>
                              {step.label}
                            </p>
                            <p className="text-[11px] text-stone-400 hidden sm:block mt-0.5">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Delivery and payment status pills */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-stone-400 block mb-0.5">{t.deliveryAddressLabel}</span>
                  <span className="font-semibold text-stone-800">
                    {order.deliveryAddress}, {order.district}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">{t.paymentMethodLabel}</span>
                  <span className="font-semibold text-stone-800">
                    {order.paymentMethod} (৳{order.grandTotal.toLocaleString('en-BD')})
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">{t.estimatedTransitLabel}</span>
                  <span className="font-semibold text-emerald-700">
                    {order.estimatedDays || (language === 'bn' ? '১-৩ দিন' : '1-3 days')}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Card */}
            <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-base font-bold text-stone-900 mb-4">{t.orderedItemsTitle}</h2>
              <div className="divide-y divide-stone-100">
                {order.items.map((i: any) => (
                  <div key={i.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-stone-900 text-sm">{i.name}</p>
                      <p className="text-stone-400">{i.quantity} × ৳{i.unitPrice.toLocaleString('en-BD')}</p>
                    </div>
                    <span className="font-extrabold text-stone-900 text-sm">
                      ৳{i.lineTotal.toLocaleString('en-BD')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-stone-200 flex justify-between items-baseline text-sm font-bold text-stone-900">
                <span>{language === 'bn' ? 'সর্বমোট প্রদেয় (ক্যাশ অন ডেলিভারি):' : 'Grand Total to Pay (COD):'}</span>
                <span className="text-lg text-emerald-700">৳{order.grandTotal.toLocaleString('en-BD')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  )
}
