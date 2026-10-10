'use client'

import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import {
  useLanguageStore,
  translations,
  getLocalizedCategoryName,
  getLocalizedCategoryDesc,
} from '@/store/language'
import { ArrowLeft } from 'lucide-react'

interface CategoryDetailContentProps {
  category: {
    id: string
    slug: string
    name: string
    description?: string | null
    products: any[]
  }
}

export default function CategoryDetailContent({ category }: CategoryDetailContentProps) {
  const { language } = useLanguageStore()
  const t = translations[language]

  const categoryName = getLocalizedCategoryName(category.slug, category.name, language)
  const categoryDesc = getLocalizedCategoryDesc(category.slug, category.description, language)

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
            <Link href="/products" className="hover:text-stone-700">
              {t.allProducts}
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-medium">{categoryName}</span>
          </div>
        </div>

        {/* Hero banner for Category */}
        <div className="rounded-3xl bg-white border border-stone-200/80 p-8 sm:p-12 mb-10 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 block">
            {t.categoriesTag}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mb-3">
            {categoryName}
          </h1>
          <p className="text-stone-600 text-base max-w-2xl leading-relaxed">
            {categoryDesc}
          </p>
          <div className="mt-4 text-xs font-medium text-stone-500">
            {category.products.length} {t.categoryAvailable}
          </div>
        </div>

        {/* Products Grid */}
        {category.products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
            <h3 className="text-lg font-bold text-stone-900 mb-2">{t.noProductsFound}</h3>
            <p className="text-stone-500 text-sm mb-6">{t.noProductsDesc}</p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition-colors"
            >
              {t.allProducts}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
