'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Send, CheckCircle2, User } from 'lucide-react'
import { useLanguageStore, translations } from '@/store/language'
import { toast } from 'sonner'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { language } = useLanguageStore()
  const t = translations[language]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success(t.contactSuccessTitle, {
        description: t.contactSuccessDesc,
      })
    }, 600)
  }

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="container max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-700">
            {language === 'bn' ? 'হোম' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">{t.contact}</span>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            {t.contactBadge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-3 mb-3">
            {t.contactHeading}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {t.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-stone-900 mb-6">
                {t.contactStoreTitle}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      {t.contactProprietor}
                    </h3>
                    <p className="text-sm font-bold text-stone-900 mt-0.5">
                      {language === 'bn' ? 'জোবাইদুর রহমান জাহিন' : 'Zobaidur Rahman Jahin'}
                    </p>
                    <p className="text-xs text-stone-500">
                      {language === 'bn' ? 'Zobaidur Rahman Jahin' : 'জোবাইদুর রহমান জাহিন'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      {t.hotline}
                    </h3>
                    <a
                      href="tel:01618908086"
                      className="text-base font-bold text-stone-900 font-mono hover:underline block mt-0.5"
                    >
                      01618908086
                    </a>
                    <p className="text-xs text-stone-500">{t.contactPhoneHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      {t.contactLocationLabel}
                    </h3>
                    <p className="text-sm font-bold text-stone-900 mt-0.5">
                      {t.location}
                    </p>
                    <p className="text-xs text-stone-600">
                      {language === 'bn' ? 'বাংলাদেশ' : 'Bangladesh'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      {t.contactEmailLabel}
                    </h3>
                    <a
                      href="mailto:sarkarjahin2000@gmail.com"
                      className="text-sm font-bold text-stone-900 hover:underline block mt-0.5"
                    >
                      sarkarjahin2000@gmail.com
                    </a>
                  </div>
                </div>

                {/* TikTok Badge */}
                <div className="pt-2">
                  <a
                    href="https://tiktok.com/@halal.bazar6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-stone-900 text-white hover:bg-black transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center">
                      <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block leading-tight">
                        {t.contactTikTokLabel}
                      </span>
                      <strong className="text-xs">@halal.bazar6</strong>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                {t.contactFormTitle}
              </h2>
              <p className="text-stone-500 text-xs mb-6">
                {t.contactFormSubtitle}
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-emerald-900 mb-1">
                    {t.contactSuccessTitle}
                  </h3>
                  <p className="text-xs text-emerald-700 mb-4">
                    {t.contactSuccessDesc}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setName('')
                      setPhone('')
                      setEmail('')
                      setMessage('')
                    }}
                    className="text-xs font-bold text-emerald-800 underline"
                  >
                    {t.contactSendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        {t.contactName} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={language === 'bn' ? 'আপনার পূর্ণ নাম' : 'Your full name'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        {t.contactPhone} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      {t.contactEmail}
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      {t.contactSubject}
                    </label>
                    <input
                      type="text"
                      placeholder={language === 'bn' ? 'যেমন: মধুর খাঁটিত্ব সম্পর্কে / বাল্ক অর্ডার' : 'e.g. Query regarding honey purity / Bulk order'}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      {t.contactMessage} <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={language === 'bn' ? 'আপনার বার্তা বিস্তারিত লিখুন...' : 'Write your message details here...'}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-emerald-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>{t.contactSubmitting}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t.contactSubmitBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
