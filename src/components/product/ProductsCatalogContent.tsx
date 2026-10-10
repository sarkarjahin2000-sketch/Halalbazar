'use client'

import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import {
  useLanguageStore,
  translations,
  getLocalizedCategoryName,
} from '@/store/language'
import { Sparkles } from 'lucide-react'

interface ProductsCatalogContentProps {
  products: any[]
  categories: any[]
  categorySlug?: string
  sort: string
  query?: string
}

export default function ProductsCatalogContent({
  products,
  categories,
  categorySlug,
  sort,
  query,
}: ProductsCatalogContentProps) {
  const { language } = useLanguageStore()
  const t = translations[language]

  const activeCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : null

  const activeCategoryTitle = activeCategory
    ? getLocalizedCategoryName(activeCategory.slug, activeCategory.name, language)
    : null

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="container">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
            <Link href="/" className="hover:text-stone-900 transition-colors">
              {language === 'bn' ? 'হোম' : 'Home'}
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-medium">
              {activeCategoryTitle || t.allProducts}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                {activeCategoryTitle
                  ? activeCategoryTitle
                  : query
                  ? `${language === 'bn' ? 'অনুসন্ধান:' : 'Search:'} "${query}"`
                  : t.catalogTitle}
              </h1>
              <p className="text-stone-600 text-sm mt-1">
                {products.length} {t.showingItems} • {t.topSlogan}
              </p>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                {t.sortByLabel}
              </span>
              <div className="flex gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-sm text-xs font-medium">
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(categorySlug ? { category: categorySlug } : {}),
                    ...(query ? { q: query } : {}),
                    sort: 'newest',
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    sort === 'newest'
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {t.sortNewest}
                </Link>
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(categorySlug ? { category: categorySlug } : {}),
                    ...(query ? { q: query } : {}),
                    sort: 'price-asc',
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    sort === 'price-asc'
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {t.sortPriceAsc}
                </Link>
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(categorySlug ? { category: categorySlug } : {}),
                    ...(query ? { q: query } : {}),
                    sort: 'price-desc',
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    sort === 'price-desc'
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {t.sortPriceDesc}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              !categorySlug
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-emerald-500'
            }`}
          >
            {t.filterAll}
          </Link>
          {categories.map((c) => {
            const catName = getLocalizedCategoryName(c.slug, c.name, language)
            return (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  categorySlug === c.slug
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-emerald-500'
                }`}
              >
                {catName} ({c._count.products})
              </Link>
            )
          })}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600 mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">{t.noProductsFound}</h3>
            <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
              {t.noProductsDesc}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition-colors"
            >
              {t.filterAll}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
