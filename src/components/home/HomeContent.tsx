'use client'

import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '@/components/product/ProductCard'
import {
  useLanguageStore,
  translations,
  getLocalizedCategoryName,
  getLocalizedCategoryDesc,
} from '@/store/language'
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  Award,
  Phone,
  MapPin,
  User,
} from 'lucide-react'

interface HomeContentProps {
  featuredProducts: any[]
  categories: any[]
  allProducts: any[]
}

export default function HomeContent({
  featuredProducts,
  categories,
  allProducts,
}: HomeContentProps) {
  const { language } = useLanguageStore()
  const t = translations[language]

  const categoryImages: Record<string, string> = {
    honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    'dry-fruits': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    spices: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80',
  }

  const getCategoryName = (slug: string, fallbackName: string) => {
    return getLocalizedCategoryName(slug, fallbackName, language)
  }

  const getCategoryDesc = (slug: string, fallbackDesc?: string | null) => {
    return getLocalizedCategoryDesc(slug, fallbackDesc, language)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Official Cover Banner Display Section */}
      <section className="bg-stone-100 py-4 sm:py-6 border-b border-stone-200">
        <div className="container">
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-stone-300/80 bg-white group">
            <Image
              src="/images/cover.png"
              alt="হালাল বাজার — খাঁটি খাবার সুস্থ জীবন (Halal Bazar)"
              width={1400}
              height={525}
              priority
              className="w-full h-auto object-contain transition-transform duration-700 ease-out"
            />
          </div>
        </div>
      </section>

      {/* Hero Section with Dynamic Bilingual Support */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-stone-50 to-white pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-stone-200/50">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold mb-5 shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>{t.heroBadge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.18] mb-5">
                {t.heroTitlePrefix}{' '}
                <span className="text-emerald-700">{t.heroTitleHighlight}</span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-700 mt-2 font-sans">
                  {t.heroSubtitle}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed mb-6">
                {t.heroDesc}
              </p>

              {/* Owner & Location Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-8 p-3.5 rounded-2xl bg-white border border-stone-200 shadow-sm text-xs text-stone-700">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>{t.proprietorLabel}</span>
                </div>
                <span className="text-stone-300">|</span>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <a href="tel:01618908086" className="font-mono font-bold hover:underline text-stone-900">
                    01618908086
                  </a>
                </div>
                <span className="text-stone-300">|</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>{t.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-8">
                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-700/25 transition-all duration-200 active:scale-95"
                >
                  <span>{t.heroShopBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/categories/honey"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-base border border-stone-300 shadow-sm transition-all duration-200"
                >
                  <span>{t.heroHoneyBtn}</span>
                </Link>
              </div>

              {/* Four Brand Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-200 w-full text-xs font-semibold text-stone-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.pillar1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.pillar2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.pillar3}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.pillar4}</span>
                </div>
              </div>
            </div>

            {/* Right Card with Official Circular Logo */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-emerald-600 bg-white p-2">
                <Image
                  src="/images/logo.png"
                  alt="Halal Bazar Official Logo"
                  fill
                  priority
                  className="object-cover rounded-full"
                />
              </div>

              {/* Location Badge below logo */}
              <div className="mt-6 text-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  Naturally Halal • {t.location}
                </span>
                <p className="text-xs text-stone-500 mt-2">
                  {t.deliveryPledge}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 block">
                {t.categoriesTag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                {t.categoriesHeading}
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>{t.categoriesAllBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const displayName = getCategoryName(cat.slug, cat.name)
              const displayDesc = getCategoryDesc(cat.slug, cat.description)

              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300 p-6 flex flex-col justify-between min-h-[220px]"
                >
                  <div className="relative z-10">
                    <span className="inline-block text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full mb-3 border border-emerald-200/50">
                      {cat._count.products} {t.categoryAvailable}
                    </span>
                    <h3 className="text-2xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors mb-2">
                      {displayName}
                    </h3>
                    <p className="text-sm text-stone-500 line-clamp-2 max-w-xs">
                      {displayDesc}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center gap-1 text-sm font-semibold text-stone-800 group-hover:text-emerald-700 transition-colors mt-6">
                    <span>{t.categoryExplore}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>

                  <div className="absolute right-0 bottom-0 w-36 h-36 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 rounded-tl-full overflow-hidden">
                    <Image
                      src={categoryImages[cat.slug] || categoryImages.honey}
                      alt={displayName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 block">
                {t.featuredTag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                {t.featuredHeading}
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>{t.featuredAllBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {(featuredProducts.length > 0 ? featuredProducts : allProducts).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Callout Banner */}
      <section className="py-14 bg-gradient-to-r from-emerald-800 via-emerald-900 to-stone-900 text-white">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 rounded-3xl bg-white/10 p-8 sm:p-12 border border-white/20 backdrop-blur-sm">
            <div className="max-w-xl text-center lg:text-left">
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full mb-3 border border-emerald-500/30">
                {t.promoTag}
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
                {t.promoHeading}
              </h3>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
                {t.promoDesc}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-amber-400 text-stone-900 font-bold hover:bg-amber-300 shadow-xl transition-all duration-200 active:scale-95"
              >
                <span>{t.promoBtn}</span>
                <ArrowRight className="w-4 h-4 text-stone-900" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Store Location & Proprietor Showcase Section */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="container">
          <div className="rounded-3xl bg-emerald-50/60 border border-emerald-200/80 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>{t.outletTag}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {t.outletHeading}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {t.outletDesc}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-stone-800 pt-2">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-700" /> 01618908086
                </span>
                <span className="text-stone-300">•</span>
                <span>sarkarjahin2000@gmail.com</span>
                <span className="text-stone-300">•</span>
                <a
                  href="https://tiktok.com/@halal.bazar6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:underline"
                >
                  TikTok: @halal.bazar6
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors"
              >
                <span>{t.outletBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantees */}
      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 block">
              {t.whyTag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-4">
              {t.whyHeading}
            </h2>
            <p className="text-stone-600 text-base leading-relaxed">
              {t.whySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{t.why1Title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {t.why1Desc}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-6">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{t.why2Title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {t.why2Desc}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{t.why3Title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {t.why3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
