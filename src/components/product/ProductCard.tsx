'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Star, Check } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import {
  useLanguageStore,
  translations,
  getLocalizedProductName,
  getLocalizedCategoryName,
} from '@/store/language'
import { toast } from 'sonner'
import { useState } from 'react'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice?: number | null
    stockQuantity: number
    category?: {
      name: string
      slug: string
    } | null
    images?: {
      url: string
      altText?: string | null
    }[]
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { language } = useLanguageStore()
  const t = translations[language]
  const [added, setAdded] = useState(false)

  const displayName = getLocalizedProductName(product.slug, product.name, language)
  const displayCategoryName = product.category
    ? getLocalizedCategoryName(product.category.slug, product.category.name, language)
    : t.natural

  const imageUrl =
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null

  const isOutOfStock = product.stockQuantity <= 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isOutOfStock) return

    addItem({
      id: product.id,
      productId: product.id,
      name: displayName,
      price: product.price,
      image: imageUrl,
      quantity: 1,
      maxStock: product.stockQuantity,
      slug: product.slug,
    })

    setAdded(true)
    const successMsg =
      language === 'bn'
        ? `কার্টে "${displayName}" যুক্ত হয়েছে!`
        : `Added "${displayName}" to cart!`
    toast.success(successMsg, {
      description: `৳${product.price.toLocaleString('en-BD')} • ${
        language === 'bn' ? 'কার্টে মোট পরিমাণ আপডেট করা হয়েছে' : 'Quantity updated in cart'
      }`,
    })

    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300">
      {/* Image container */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-stone-100">
        <Image
          src={imageUrl}
          alt={displayName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-sm">
              {t.save} {discountPercent}%
            </span>
          )}
          {isOutOfStock ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-800/90 text-stone-200 backdrop-blur-sm">
              {t.outOfStock}
            </span>
          ) : product.stockQuantity <= 5 ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-600 text-white shadow-sm">
              {language === 'bn' ? 'মাত্র' : 'Only'} {product.stockQuantity} {t.onlyLeft}
            </span>
          ) : null}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
          {product.category ? (
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-emerald-700 font-medium hover:underline hover:text-emerald-800 transition-colors"
            >
              {displayCategoryName}
            </Link>
          ) : (
            <span className="text-stone-400">{t.natural}</span>
          )}
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-semibold text-stone-700">4.9</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`} className="block group-hover:text-emerald-700 transition-colors mb-2">
          <h3 className="font-semibold text-stone-900 text-base leading-snug line-clamp-2">
            {displayName}
          </h3>
        </Link>

        {/* Spacer */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-stone-100">
          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-stone-900">
                ৳{product.price.toLocaleString('en-BD')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  ৳{product.compareAtPrice.toLocaleString('en-BD')}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm active:scale-95'
            }`}
            aria-label={`${t.add} ${displayName}`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.added}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.add}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
