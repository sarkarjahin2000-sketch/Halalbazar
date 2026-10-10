'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { useLanguageStore, translations } from '@/store/language'
import { toast } from 'sonner'
import { ShoppingBag, Zap, Plus, Minus, Check, Truck, ShieldCheck, RefreshCw } from 'lucide-react'

interface ProductActionsProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    stockQuantity: number
    imageUrl: string
  }
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const router = useRouter()
  const { addItem } = useCartStore()
  const { language } = useLanguageStore()
  const t = translations[language]

  const isOutOfStock = product.stockQuantity <= 0

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta
      if (next < 1) return 1
      if (next > product.stockQuantity) return product.stockQuantity
      return next
    })
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity,
      maxStock: product.stockQuantity,
      slug: product.slug,
    })

    setAdded(true)
    toast.success(
      language === 'bn'
        ? `কার্টে ${quantity} টি "${product.name}" যোগ করা হয়েছে!`
        : `Added ${quantity} × ${product.name} to cart!`
    )
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    if (isOutOfStock) return

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity,
      maxStock: product.stockQuantity,
      slug: product.slug,
    })

    router.push('/checkout')
  }

  return (
    <div className="flex flex-col gap-5 pt-4 border-t border-stone-200">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-stone-700">{t.quantityText}</span>
        <div className="flex items-center border border-stone-300 rounded-xl bg-white shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => handleQuantityChange(-1)}
            disabled={isOutOfStock || quantity <= 1}
            className="p-2.5 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center text-sm font-bold text-stone-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange(1)}
            disabled={isOutOfStock || quantity >= product.stockQuantity}
            className="p-2.5 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs text-stone-500">
          {product.stockQuantity > 0
            ? `${product.stockQuantity} ${t.available}`
            : t.outOfStock}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md ${
            isOutOfStock
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : added
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20 active:scale-98'
          }`}
        >
          {added ? (
            <>
              <Check className="w-5 h-5" />
              <span>{t.addedToCart}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>{t.addToCart}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-black text-white text-sm font-bold shadow-md transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap className="w-5 h-5 text-amber-400" />
          <span>{t.buyNowBtn}</span>
        </button>
      </div>

      {/* Trust & Delivery Highlights */}
      <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/60 p-4 space-y-3 mt-2">
        <div className="flex items-center gap-3 text-xs text-stone-700">
          <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{t.deliverySpeedText}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-stone-700">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{t.codPaymentText}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-stone-700">
          <RefreshCw className="w-4 h-4 text-sky-700 shrink-0" />
          <span>{t.guaranteeText}</span>
        </div>
      </div>
    </div>
  )
}
