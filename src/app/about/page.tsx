'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Award, HeartHandshake, CheckCircle2, ArrowRight, User, MapPin, Phone } from 'lucide-react'
import { useLanguageStore, translations } from '@/store/language'

export default function AboutPage() {
  const { language } = useLanguageStore()
  const t = translations[language]

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-700">
            {language === 'bn' ? 'হোম' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">{t.about}</span>
        </div>

        {/* Hero Card */}
        <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-14 shadow-sm mb-10 text-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-600 shadow-md mx-auto mb-6 bg-white">
            <Image src="/images/logo.png" alt={t.storeName} fill className="object-cover" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-200">
            {t.aboutBadge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mt-4 mb-4">
            {t.aboutHeading}
          </h1>
          <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.aboutStory}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-stone-700">
            <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-full">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              {language === 'bn' ? 'জোবাইদুর রহমান জাহিন' : 'Zobaidur Rahman Jahin'}
            </span>
            <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-rose-600" /> {t.location}
            </span>
            <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-full">
              <Phone className="w-3.5 h-3.5 text-amber-600" /> 01618908086
            </span>
          </div>
        </div>

        {/* Sourcing & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="rounded-3xl bg-white border border-stone-200 p-8 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">{t.aboutCard1Title}</h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-4">
              {t.aboutCard1Desc}
            </p>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t.aboutCard1Item1}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t.aboutCard1Item2}
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-stone-200 p-8 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">{t.aboutCard2Title}</h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-4">
              {t.aboutCard2Desc}
            </p>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t.aboutCard2Item1}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t.aboutCard2Item2}
              </li>
            </ul>
          </div>
        </div>

        {/* Cover Banner Display in About */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-200 mb-10 bg-white">
          <Image
            src="/images/cover.png"
            alt="Halal Bazar Cover"
            width={1200}
            height={450}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* CTA Card */}
        <div className="rounded-3xl bg-stone-900 text-white p-8 sm:p-12 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold mb-2">{t.aboutCtaHeading}</h2>
            <p className="text-stone-400 text-sm leading-relaxed">
              {t.aboutCtaSubtitle}
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-sm shrink-0 transition-colors"
          >
            <span>{t.aboutCtaBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
