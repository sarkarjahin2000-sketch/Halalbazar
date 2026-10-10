'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, User } from 'lucide-react'
import { useLanguageStore, translations } from '@/store/language'

export default function Footer() {
  const year = new Date().getFullYear()
  const { language } = useLanguageStore()
  const t = translations[language]

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      {/* Main footer */}
      <div className="container py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 shadow-sm bg-white shrink-0 group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo.png"
                  alt={t.storeName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  {language === 'bn' ? (
                    <>হালাল <span className="text-emerald-400">বাজার</span></>
                  ) : (
                    <>Halal <span className="text-emerald-400">Bazar</span></>
                  )}
                </span>
                <p className="text-[11px] text-emerald-400 font-semibold -mt-0.5">
                  {t.storeSubtitle} • Naturally Halal
                </p>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-stone-400 mb-4">
              {t.footerDesc}
            </p>

            <div className="text-xs text-stone-400 space-y-1 mb-5">
              <div className="flex items-center gap-1.5 text-stone-300 font-medium">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.proprietorLabel}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.location}</span>
              </div>
            </div>

            {/* Social Links including TikTok */}
            <div className="flex items-center gap-3">
              <a
                href="https://tiktok.com/@halal.bazar6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:bg-emerald-700 hover:text-white transition-colors text-xs font-semibold text-stone-300"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                <span>@halal.bazar6</span>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-emerald-700 transition-colors text-white"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
              {t.footerShopHeading}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products" className="hover:text-emerald-400 transition-colors">
                  {t.allProductsLink}
                </Link>
              </li>
              <li>
                <Link href="/categories/honey" className="hover:text-emerald-400 transition-colors">
                  {t.pureHoneyLink}
                </Link>
              </li>
              <li>
                <Link href="/categories/dry-fruits" className="hover:text-emerald-400 transition-colors">
                  {t.dryFruitsLink}
                </Link>
              </li>
              <li>
                <Link href="/categories/spices" className="hover:text-emerald-400 transition-colors">
                  {t.spicesLink}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-emerald-400 transition-colors">
                  {t.cartLink}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
              {t.footerSupportHeading}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/track-order" className="hover:text-emerald-400 transition-colors">
                  {t.trackOrderLink}
                </Link>
              </li>
              <li>
                <Link href="/shipping-and-delivery" className="hover:text-emerald-400 transition-colors">
                  {t.deliveryPolicyLink}
                </Link>
              </li>
              <li>
                <Link href="/returns-and-refunds" className="hover:text-emerald-400 transition-colors">
                  {t.returnPolicyLink}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">
                  {t.privacyPolicyLink}
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-emerald-400 transition-colors">
                  {t.termsLink}
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
              {t.footerContactHeading}
            </h3>
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.location}, {language === 'bn' ? 'বাংলাদেশ' : 'Bangladesh'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:01618908086" className="text-white font-mono font-bold hover:underline">
                  01618908086
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:sarkarjahin2000@gmail.com" className="hover:underline text-stone-300">
                  sarkarjahin2000@gmail.com
                </a>
              </div>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold">
                  {t.codFooterBadge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Strip */}
      <div className="border-t border-stone-800/80 bg-black/40 py-5">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 text-center sm:text-left">
          <p>© {year} {t.footerCopyright}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{t.outletCity}</span>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-stone-300 transition-colors">
              {t.adminPortal}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
