'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore, useCartItems, useCartSubtotal } from '@/store/cart'
import { useLanguageStore, translations } from '@/store/language'
import { Truck, CheckCircle2, AlertCircle, ArrowRight, ShoppingBag, Lock } from 'lucide-react'
import { toast } from 'sonner'

const BD_DISTRICTS = [
  'Dhaka',
  'Gazipur',
  'Narayanganj',
  'Chittagong',
  'Cox\'s Bazar',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh',
  'Comilla',
  'Bogra',
  'Jessore',
  'Dinajpur',
  'Feni',
  'Tangail',
  'Narsingdi',
  'Manikganj',
  'Munshiganj',
]

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartItems()
  const subtotal = useCartSubtotal()
  const { couponCode, couponDiscount, clearCart } = useCartStore()
  const { language } = useLanguageStore()
  const t = translations[language]

  const [shippingZoneId, setShippingZoneId] = useState('zone-dhaka-inside')
  const [zones, setZones] = useState([
    {
      id: 'zone-dhaka-inside',
      nameBn: 'ঢাকার ভেতরে',
      nameEn: 'Inside Dhaka',
      fee: 60,
      freeShippingThreshold: 2000,
      estimatedDaysBn: '১-২ কার্যদিবস',
      estimatedDaysEn: '1-2 business days',
    },
    {
      id: 'zone-dhaka-outside',
      nameBn: 'ঢাকার বাইরে',
      nameEn: 'Outside Dhaka',
      fee: 120,
      freeShippingThreshold: 3000,
      estimatedDaysBn: '২-৪ কার্যদিবস',
      estimatedDaysEn: '2-4 business days',
    },
  ])

  // Form states
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [district, setDistrict] = useState('Dhaka')
  const [area, setArea] = useState('')
  const [deliveryInstructions, setDeliveryInstructions] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [idempotencyKey, setIdempotencyKey] = useState('')

  // Generate idempotencyKey on client mount
  useEffect(() => {
    setIdempotencyKey(`guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)
  }, [])

  // Auto-switch zone based on selected district
  useEffect(() => {
    if (district === 'Dhaka') {
      setShippingZoneId('zone-dhaka-inside')
    } else {
      setShippingZoneId('zone-dhaka-outside')
    }
  }, [district])

  const selectedZone = zones.find((z) => z.id === shippingZoneId) || zones[0]

  // Calculate Shipping fee
  let shippingFee = selectedZone.fee
  if (selectedZone.freeShippingThreshold && subtotal >= selectedZone.freeShippingThreshold) {
    shippingFee = 0
  }

  const effectiveDiscount = couponDiscount || 0
  const grandTotal = Math.max(0, subtotal - effectiveDiscount + shippingFee)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!customerName.trim() || customerName.trim().length < 2) {
      errs.customerName =
        language === 'bn'
          ? 'অনুগ্রহ করে আপনার সঠিক নাম লিখুন (কমপক্ষে ২ অক্ষর)'
          : 'Please enter your full name (at least 2 characters)'
    }

    const cleanPhone = customerPhone.replace(/\D/g, '')
    const bdPhoneRegex = /^(\+8801|8801|01)[3-9]\d{8}$/
    if (!bdPhoneRegex.test(customerPhone.trim()) && cleanPhone.length !== 11) {
      errs.customerPhone =
        language === 'bn'
          ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)'
          : 'Please enter a valid 11-digit Bangladesh phone number (e.g. 01712345678)'
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 6) {
      errs.deliveryAddress =
        language === 'bn'
          ? 'অনুগ্রহ করে বিস্তারিত ঠিকানা লিখুন (রোড, বাসা বা ফ্ল্যাট নম্বর)'
          : 'Please enter your complete road/house delivery address'
    }

    if (!district) {
      errs.district =
        language === 'bn' ? 'অনুগ্রহ করে আপনার জেলা নির্বাচন করুন' : 'Please select your district'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error(language === 'bn' ? 'আপনার কার্ট খালি' : 'Your cart is empty')
      router.push('/products')
      return
    }

    if (!validate()) {
      toast.error(
        language === 'bn'
          ? 'অনুগ্রহ করে লাল দাগযুক্ত তথ্যগুলো সঠিকভাবে পূরণ করুন'
          : 'Please check the required fields in red'
      )
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        deliveryAddress: deliveryAddress.trim(),
        district,
        area: area.trim() || undefined,
        deliveryInstructions: deliveryInstructions.trim() || undefined,
        shippingZoneId,
        paymentMethod: 'CASH_ON_DELIVERY',
        couponCode: couponCode || undefined,
        idempotencyKey,
        cartItems: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || (language === 'bn' ? 'অর্ডার গ্রহণ ব্যর্থ হয়েছে' : 'Failed to place order'))
        setIsSubmitting(false)
        return
      }

      // Success! Clear cart and redirect to order confirmation
      clearCart()
      toast.success(language === 'bn' ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Order placed successfully!')
      router.push(`/order-success/${data.publicReference}`)
    } catch (err) {
      console.error('Order submission error:', err)
      toast.error(
        language === 'bn'
          ? 'ইন্টারনেট সমস্যা। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Network error. Please try again.'
      )
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-stone-50 min-h-screen py-16">
        <div className="container max-w-xl text-center bg-white p-10 rounded-3xl border border-stone-200">
          <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-900 mb-2">{t.cartEmpty}</h2>
          <p className="text-stone-500 text-sm mb-6">{t.cartEmptyDesc}</p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-700 text-white font-semibold text-sm"
          >
            {t.browseProducts}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-700">
            {language === 'bn' ? 'হোম' : 'Home'}
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-stone-700">
            {t.cartTitle}
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">
            {language === 'bn' ? 'গেস্ট চেকআউট' : 'Guest Checkout'}
          </span>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>{t.guestNotice}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {t.checkoutTitle}
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {t.checkoutSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Fields Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Customer Contact */}
              <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-stone-900 mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">1</span>
                  {t.step1Title}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      {t.fullNameLabel} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'bn' ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value)
                        if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: '' }))
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
                        errors.customerName
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-600'
                          : 'border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.customerName && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.customerName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        {t.phoneLabel} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="01712345678"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value)
                          if (errors.customerPhone) setErrors((prev) => ({ ...prev, customerPhone: '' }))
                        }}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
                          errors.customerPhone
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-600'
                            : 'border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                        }`}
                      />
                      <p className="text-[11px] text-stone-400 mt-1">{t.phoneHint}</p>
                      {errors.customerPhone && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.customerPhone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        {t.emailLabel}
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <p className="text-[11px] text-stone-400 mt-1">{t.emailHint}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-stone-900 mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">2</span>
                  {t.step2Title}
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        {t.districtLabel} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-emerald-600 bg-white"
                      >
                        {BD_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        {t.areaLabel}
                      </label>
                      <input
                        type="text"
                        placeholder={language === 'bn' ? 'যেমন: ধানমন্ডি, উত্তরা, সোনারগাঁ' : 'e.g. Dhanmondi, Uttara, Sonargaon'}
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      {t.addressLabel} <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder={t.addressHint}
                      value={deliveryAddress}
                      onChange={(e) => {
                        setDeliveryAddress(e.target.value)
                        if (errors.deliveryAddress) setErrors((prev) => ({ ...prev, deliveryAddress: '' }))
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none resize-none ${
                        errors.deliveryAddress
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-600'
                          : 'border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.deliveryAddress && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.deliveryAddress}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      {t.notesLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={t.notesHint}
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Delivery Zone Radio Options */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-stone-700 mb-2">
                      {t.speedLabel}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {zones.map((z) => {
                        const isFree = z.freeShippingThreshold && subtotal >= z.freeShippingThreshold
                        const feeDisplay = isFree ? t.free : `৳${z.fee}`
                        const isSelected = shippingZoneId === z.id
                        const zoneName = language === 'bn' ? z.nameBn : z.nameEn
                        const zoneDays = language === 'bn' ? z.estimatedDaysBn : z.estimatedDaysEn

                        return (
                          <div
                            key={z.id}
                            onClick={() => setShippingZoneId(z.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                                : 'border-stone-200 bg-white hover:border-stone-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm text-stone-900">{zoneName}</span>
                              <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                                isFree ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-800'
                              }`}>
                                {feeDisplay}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500">{zoneDays}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-stone-900 mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">3</span>
                  {t.step3Title}
                </h2>

                <div className="p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-50/40 flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full border-4 border-emerald-600 bg-white mt-0.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-stone-900 text-sm">
                        {t.codTitle}
                      </span>
                      <span className="text-[11px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                        {t.recommendedBadge}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {t.codExplanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Review Sidebar */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-extrabold text-stone-900 mb-4">
                  {t.summaryTitle} ({items.reduce((s, i) => s + i.quantity, 0)} {t.itemsCount})
                </h2>

                {/* Items preview */}
                <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1 mb-6 scrollbar-thin">
                  {items.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                          <Image
                            src={item.image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=200&q=80'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-stone-500">
                            {item.quantity} × ৳{item.price.toLocaleString('en-BD')}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-stone-900 shrink-0">
                        ৳{(item.price * item.quantity).toLocaleString('en-BD')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial breakdown */}
                <div className="space-y-3 text-sm text-stone-600 mb-6 pt-3 border-t border-stone-100">
                  <div className="flex justify-between">
                    <span>{t.subtotal}</span>
                    <span className="font-bold text-stone-900">৳{subtotal.toLocaleString('en-BD')}</span>
                  </div>

                  {effectiveDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>{t.discount} ({couponCode})</span>
                      <span className="font-bold">-৳{effectiveDiscount.toLocaleString('en-BD')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>{t.shipping} ({language === 'bn' ? selectedZone.nameBn : selectedZone.nameEn})</span>
                    <span className="font-bold text-stone-900">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-700 font-bold">{t.free}</span>
                      ) : (
                        `৳${shippingFee.toLocaleString('en-BD')}`
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                    <span className="font-bold text-stone-900 text-base">{t.grandTotal}</span>
                    <span className="text-2xl font-extrabold text-stone-900">
                      ৳{grandTotal.toLocaleString('en-BD')}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-700/30 transition-all duration-200 disabled:opacity-50 active:scale-98"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t.placingOrderBtn}</span>
                    </div>
                  ) : (
                    <>
                      <span>{t.placeOrderBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-stone-400 text-center mt-3">
                  {t.termsAgreement}
                </p>

                <div className="mt-6 pt-6 border-t border-stone-100 space-y-2 text-xs text-stone-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.dispatchCall}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{t.districtDelivery}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
