'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore, useCartItems, useCartIsOpen, useCartSubtotal } from '@/store/cart'
import { useLanguageStore, translations } from '@/store/language'

function formatPrice(amount: number) {
  return `৳${amount.toLocaleString('en-BD')}`
}

export default function CartDrawer() {
  const items = useCartItems()
  const isOpen = useCartIsOpen()
  const subtotal = useCartSubtotal()
  const { closeCart, removeItem, updateQuantity } = useCartStore()
  const { language } = useLanguageStore()
  const t = translations[language]

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <h2 className="font-bold text-stone-900 text-lg">
                  {t.cartTitle}
                  {items.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-stone-500">
                      ({items.reduce((s, i) => s + i.quantity, 0)} {t.itemsCount})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="btn btn-ghost p-2"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900 mb-1">{t.cartEmpty}</p>
                    <p className="text-sm text-stone-500 max-w-xs">
                      {t.cartEmptyDesc}
                    </p>
                  </div>
                  <Link
                    href="/products"
                    className="btn btn-primary btn-sm bg-emerald-700 hover:bg-emerald-800 text-white"
                    onClick={closeCart}
                  >
                    {t.browseProducts}
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4" aria-label="Cart items">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={`${item.productId}-${item.variantId ?? ''}`}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 p-3 rounded-xl border border-stone-100 bg-stone-50"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-emerald-400" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-medium text-stone-900 text-sm leading-tight hover:text-emerald-700 transition-colors line-clamp-2"
                            onClick={closeCart}
                          >
                            {item.name}
                          </Link>
                          {item.variantName && (
                            <p className="text-xs text-stone-500 mt-0.5">{item.variantName}</p>
                          )}
                          <p className="text-emerald-700 font-bold text-sm mt-1">
                            {formatPrice(item.price)}
                          </p>

                          {/* Quantity + Remove */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.variantId, item.quantity - 1)
                                }
                                className="w-7 h-7 rounded-md border border-stone-200 bg-white flex items-center justify-center hover:bg-stone-100 transition-colors"
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.variantId, item.quantity + 1)
                                }
                                disabled={item.quantity >= item.maxStock}
                                className="w-7 h-7 rounded-md border border-stone-200 bg-white flex items-center justify-center hover:bg-stone-100 transition-colors disabled:opacity-40"
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.productId, item.variantId)}
                              className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Line total */}
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-stone-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-stone-100 bg-white">
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-stone-600 text-sm">{t.subtotal}</span>
                  <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-stone-400 mb-4">
                  {t.shippingNote}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Link
                    href="/checkout"
                    className="btn btn-primary w-full bg-emerald-700 hover:bg-emerald-800 text-white"
                    onClick={closeCart}
                    id="cart-checkout-btn"
                  >
                    <span>{t.checkout}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/cart"
                    className="btn btn-secondary w-full btn-sm"
                    onClick={closeCart}
                  >
                    {t.viewCart}
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
