'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore, useCartItems, useCartSubtotal } from '@/store/cart'
import { useLanguageStore, translations } from '@/store/language'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Sparkles, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

export default function CartPage() {
  const items = useCartItems()
  const subtotal = useCartSubtotal()
  const { removeItem, updateQuantity, clearCart, couponCode, couponDiscount, setCoupon, removeCoupon } = useCartStore()
  const { language } = useLanguageStore()
  const t = translations[language]

  const [inputCoupon, setInputCoupon] = useState('')
  const [applying, setApplying] = useState(false)

  // Free shipping threshold for Dhaka (৳2000)
  const freeShippingThreshold = 2000
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal)
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCoupon.trim()) return

    setApplying(true)
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(inputCoupon.trim())}&amount=${subtotal}`)
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || (language === 'bn' ? 'কুপন কোডটি সঠিক নয়' : 'Invalid coupon code'))
      } else {
        setCoupon(data.coupon.code, data.discountAmount)
        toast.success(
          language === 'bn'
            ? `কুপন "${data.coupon.code}" সফলভাবে যুক্ত হয়েছে! ছাড় ৳${data.discountAmount}`
            : `Coupon "${data.coupon.code}" applied! Saved ৳${data.discountAmount}`
        )
        setInputCoupon('')
      }
    } catch {
      toast.error(language === 'bn' ? 'কুপন যাচাই করা সম্ভব হয়নি' : 'Failed to validate coupon')
    } finally {
      setApplying(false)
    }
  }

  const effectiveDiscount = couponDiscount || 0
  const estimatedTotal = Math.max(0, subtotal - effectiveDiscount)

  if (items.length === 0) {
    return (
      <div className="bg-stone-50 min-h-screen py-16">
        <div className="container max-w-2xl text-center">
          <div className="bg-white rounded-3xl border border-stone-200 p-10 sm:p-14 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600 mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-3">
              {t.cartEmpty}
            </h1>
            <p className="text-stone-500 text-sm max-w-md mx-auto mb-8">
              {t.cartEmptyDesc}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <span>{t.browseProducts}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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
          <span className="text-stone-900 font-medium">{t.cartTitle}</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {t.cartTitle}
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              {language === 'bn' ? (
                <>কার্টে মোট <strong>{items.reduce((s, i) => s + i.quantity, 0)}টি</strong> পণ্য রয়েছে</>
              ) : (
                <>You have <strong>{items.reduce((s, i) => s + i.quantity, 0)} items</strong> in your cart</>
              )}
            </p>
          </div>
          <button
            onClick={() => {
              const confirmMsg =
                language === 'bn'
                  ? 'আপনি কি নিশ্চিত যে সম্পূর্ণ কার্ট খালি করতে চান?'
                  : 'Are you sure you want to clear your cart?'
              if (confirm(confirmMsg)) {
                clearCart()
                toast.info(language === 'bn' ? 'কার্ট খালি করা হয়েছে' : 'Cart cleared')
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            {t.clearCart}
          </button>
        </div>

        {/* Free shipping progress bar */}
        <div className="mb-8 rounded-2xl bg-white border border-stone-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5 text-stone-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              {freeShippingRemaining > 0 ? (
                language === 'bn' ? (
                  <>ঢাকায় ফ্রি ডেলিভারির জন্য আরও <strong className="text-emerald-700">৳{freeShippingRemaining.toLocaleString('en-BD')}</strong> টাকার পণ্য যোগ করুন!</>
                ) : (
                  <>Add <strong className="text-emerald-700">৳{freeShippingRemaining.toLocaleString('en-BD')}</strong> more for Free Delivery in Dhaka!</>
                )
              ) : (
                <span className="text-emerald-700 font-bold">{t.freeShippingUnlocked}</span>
              )}
            </span>
            <span className="text-stone-500">{freeShippingProgress}%</span>
          </div>
          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="rounded-3xl bg-white border border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100">
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <Image
                        src={item.image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-bold text-stone-900 hover:text-emerald-700 transition-colors text-sm sm:text-base leading-snug line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs font-semibold text-stone-500 mt-1">
                        ৳{item.price.toLocaleString('en-BD')} {language === 'bn' ? 'প্রতি পিস' : 'each'}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="p-2 text-stone-600 hover:bg-stone-200/50 rounded-l-xl transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="p-2 text-stone-600 hover:bg-stone-200/50 rounded-r-xl transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="text-right min-w-[80px]">
                      <span className="font-extrabold text-stone-900 text-base">
                        ৳{(item.price * item.quantity).toLocaleString('en-BD')}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/products"
                className="text-xs font-bold text-stone-600 hover:text-emerald-700 transition-colors"
              >
                {t.continueShopping}
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-stone-900 mb-5">
                {t.summaryTitle}
              </h2>

              {/* Coupon Form */}
              <div className="mb-6 pb-6 border-b border-stone-100">
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  {t.havePromoCoupon}
                </label>
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span className="font-mono text-xs font-bold text-emerald-800">
                        {couponCode} (-৳{couponDiscount})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        removeCoupon()
                        toast.info(language === 'bn' ? 'কুপন বাতিল করা হয়েছে' : 'Coupon removed')
                      }}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      {language === 'bn' ? 'মুছুন' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                      className="flex-1 uppercase font-mono px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      type="submit"
                      disabled={applying || !inputCoupon}
                      className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold disabled:opacity-40 transition-colors"
                    >
                      {applying ? t.checking : t.apply}
                    </button>
                  </form>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-sm text-stone-600 mb-6">
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
                  <span>{t.estimatedShipping}</span>
                  <span className="text-xs text-stone-500 font-medium">
                    {t.calculatedAtCheckout}
                  </span>
                </div>
                <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
                  <span className="font-bold text-stone-900 text-base">{t.estimatedTotal}</span>
                  <span className="text-2xl font-extrabold text-stone-900">
                    ৳{estimatedTotal.toLocaleString('en-BD')}
                  </span>
                </div>
              </div>

              {/* Proceed to checkout button */}
              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 transition-all duration-200 active:scale-95"
              >
                <span>{t.proceedGuestCheckout}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.codAvailableNoAccount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
