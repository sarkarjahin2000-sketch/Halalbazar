'use client'

import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { useLanguageStore, translations } from '@/store/language'
import { Search, Sparkles } from 'lucide-react'

interface SearchPageContentProps {
  products: any[]
  query: string
}

export default function SearchPageContent({ products, query }: SearchPageContentProps) {
  const { language } = useLanguageStore()
  const t = translations[language]

  const popularKeywords =
    language === 'bn'
      ? ['মধু', 'কাঠবাদাম', 'কাজুবাদাম', 'হলুদ', 'খেজুর', 'কালোজিরা']
      : ['Honey', 'Almonds', 'Cashews', 'Turmeric', 'Dates', 'Kalonji']

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-700">
            {language === 'bn' ? 'হোম' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">
            {language === 'bn' ? 'অনুসন্ধান' : 'Search'}
          </span>
        </div>

        {/* Search Header */}
        <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-10 mb-10 shadow-sm">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-4">
            {t.searchTitle}
          </h1>

          {/* Search form */}
          <form action="/search" method="get" className="max-w-xl flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder={t.searchPlaceholder}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm shadow-sm"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md transition-colors"
            >
              {language === 'bn' ? 'খুঁজুন' : 'Search'}
            </button>
          </form>

          {/* Popular searches suggestions */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-stone-500">
            <span className="font-semibold text-stone-700">{t.searchPopularLabel}</span>
            {popularKeywords.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {query ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-stone-900">
                {t.searchResultsHeading} &ldquo;{query}&rdquo;
              </h2>
              <span className="text-xs font-semibold text-stone-500">
                {products.length} {t.showingItems}
              </span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600 mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">{t.searchNoMatchTitle}</h3>
                <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
                  {t.searchNoMatchDesc}
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition-colors"
                >
                  {t.allProducts}
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
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
            <Search className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-stone-900 mb-2">{t.searchTypePromptTitle}</h3>
            <p className="text-stone-500 text-sm">{t.searchTypePromptDesc}</p>
          </div>
        )}
      </div>
    </div>
  )
}
