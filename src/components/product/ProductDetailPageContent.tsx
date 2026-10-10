'use client'

import Image from 'next/image'
import Link from 'next/link'
import ProductActions from '@/components/product/ProductActions'
import ProductCard from '@/components/product/ProductCard'
import {
  useLanguageStore,
  translations,
  getLocalizedProductName,
  getLocalizedProductDesc,
  getLocalizedCategoryName,
} from '@/store/language'
import { Star, Shield, Leaf, HeartHandshake, ArrowLeft } from 'lucide-react'

interface ProductDetailPageContentProps {
  product: any
  relatedProducts: any[]
}

export default function ProductDetailPageContent({
  product,
  relatedProducts,
}: ProductDetailPageContentProps) {
  const { language } = useLanguageStore()
  const t = translations[language]

  const displayName = getLocalizedProductName(product.slug, product.name, language)
  const displayDesc = getLocalizedProductDesc(product.slug, product.description, language)
  const displayCategory = product.category
    ? getLocalizedCategoryName(product.category.slug, product.category.name, language)
    : t.natural

  const primaryImage =
    product.images[0]?.url ||
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="container">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.backToCatalog}</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <Link href="/" className="hover:text-stone-700">
              {language === 'bn' ? 'হোম' : 'Home'}
            </Link>
            <span>/</span>
            {product.category && (
              <>
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="hover:text-stone-700"
                >
                  {displayCategory}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-stone-900 font-medium truncate max-w-xs">
              {displayName}
            </span>
          </div>
        </div>

        {/* Main Product Card Grid */}
        <div className="rounded-3xl bg-white border border-stone-200/80 p-6 sm:p-10 shadow-sm mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left: Product Images */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner">
                <Image
                  src={primaryImage}
                  alt={displayName}
                  fill
                  priority
                  className="object-cover"
                />
                {discountPercent && (
                  <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white shadow-md">
                    {t.save} {discountPercent}%
                  </span>
                )}
              </div>

              {/* Thumbnails if multiple */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img: any, idx: number) => (
                    <div
                      key={img.id || idx}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-600 cursor-pointer shrink-0"
                    >
                      <Image src={img.url} alt={displayName} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info & Actions */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Category & Badge */}
              <div className="flex items-center justify-between mb-3">
                {product.category && (
                  <Link
                    href={`/categories/${product.category.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200"
                  >
                    {displayCategory}
                  </Link>
                )}
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-stone-800">4.9</span>
                  <span className="text-stone-400 text-xs">
                    (38 {t.reviewsText})
                  </span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight mb-3">
                {displayName}
              </h1>

              {/* SKU & Stock Badge */}
              <div className="flex items-center gap-4 text-xs text-stone-500 mb-6">
                {product.sku && (
                  <span>
                    SKU: <strong className="text-stone-700">{product.sku}</strong>
                  </span>
                )}
                <span>•</span>
                {product.stockQuantity > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {t.inStockText} ({product.stockQuantity} {t.readyToShipText})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-rose-700 font-semibold bg-rose-50 px-2.5 py-0.5 rounded-full">
                    {t.outOfStock}
                  </span>
                )}
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-3xl sm:text-4xl font-extrabold text-stone-900">
                  ৳{product.price.toLocaleString('en-BD')}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <>
                    <span className="text-lg text-stone-400 line-through">
                      ৳{product.compareAtPrice.toLocaleString('en-BD')}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {t.youSaveText} ৳{(product.compareAtPrice - product.price).toLocaleString('en-BD')}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-stone text-stone-600 text-sm leading-relaxed mb-6">
                <p>{displayDesc}</p>
              </div>

              {/* Interactive Actions */}
              <ProductActions
                product={{
                  id: product.id,
                  name: displayName,
                  slug: product.slug,
                  price: product.price,
                  stockQuantity: product.stockQuantity,
                  imageUrl: primaryImage,
                }}
              />
            </div>
          </div>
        </div>

        {/* Product Details & Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm mb-1">{t.feature1Title}</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                {t.feature1Desc}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm mb-1">{t.feature2Title}</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                {t.feature2Desc}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm mb-1">{t.feature3Title}</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                {t.feature3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                {t.relatedHeading}
              </h2>
              <Link
                href="/products"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                {t.viewAllRelated}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
