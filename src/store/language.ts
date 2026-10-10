import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Language = 'bn' | 'en'

interface LanguageStore {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'bn',
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () =>
        set({ language: get().language === 'bn' ? 'en' : 'bn' }),
    }),
    {
      name: 'halal-bazar-lang',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export const productTranslations: Record<
  string,
  { bn: { name: string; desc: string }; en: { name: string; desc: string } }
> = {
  'pure-sidr-honey': {
    bn: {
      name: 'খাঁটি সিদর মধু',
      desc: 'সুন্দরবনের অপ্রক্রিয়াজাত কাঁচা সিদর মধু। গাঢ় ও সুস্বাদু, কোনো চিনি বা রাসায়নিক মিশ্রণমুক্ত ১০০% ন্যাচারাল মধু।',
    },
    en: {
      name: 'Pure Sidr Honey',
      desc: 'Premium raw Sidr honey gathered by traditional beekeepers. Dark, rich, with deep caramel and herbal undertones. 100% unpasteurized.',
    },
  },
  'boshonto-spring-honey': {
    bn: {
      name: 'বসন্ত ফুলের প্রাকৃতিক মধু',
      desc: 'বসন্তকালের বিভিন্ন প্রাকৃতিক ফুলের পরাগ থেকে সংগৃহীত হালকা সোনালী বর্ণের সুস্বাদু মিষ্টি মধু।',
    },
    en: {
      name: 'Boshonto Spring Floral Honey',
      desc: 'Light golden floral honey collected during the spring bloom. Delicate floral sweetness, perfect for green tea and morning breakfast.',
    },
  },
  'black-seed-honey': {
    bn: {
      name: 'কালোজিরা মিশ্রিত খাঁটি মধু',
      desc: 'প্রাকৃতিক সুন্দরবনের মধুর সাথে প্রিমিয়াম ইথিওপিয়ান কালোজিরার অসাধারণ সংমিশ্রণ। রোগ প্রতিরোধ ক্ষমতা বৃদ্ধির জন্য আদর্শ।',
    },
    en: {
      name: 'Black Seed Infused Honey',
      desc: 'Pure Sundarban honey naturally blended with freshly cracked Ethiopian black seed (kalonji). Exceptional daily wellness booster.',
    },
  },
  'organic-cashews-w320': {
    bn: {
      name: 'অর্গানিক কাজুবাদাম W320',
      desc: 'জায়ান্ট সাইজের W320 গ্রেড কাজুবাদাম। পরিষ্কার, কোনো কৃত্রিম প্রিজারভেটিভ বা কেমিক্যাল ছাড়াই প্রাকৃতিক ক্রাঞ্চি স্বাদ।',
    },
    en: {
      name: 'Organic Cashews (W320)',
      desc: 'Premium jumbo W320 grade cashews. Clean, uniform, naturally buttery crunch without any added chemicals or preservatives.',
    },
  },
  'premium-almonds': {
    bn: {
      name: 'প্রিমিয়াম ক্যালিফোর্নিয়া কাঠবাদাম',
      desc: 'বাছাইকৃত আস্ত ক্যালিফোর্নিয়া কাঠবাদাম। ভিটামিন-ই, ম্যাগনেসিয়াম ও অ্যান্টিঅক্সিডেন্টে ভরপুর সুস্থ জীবনের সঙ্গী।',
    },
    en: {
      name: 'Premium California Almonds',
      desc: 'Selected premium whole California almonds. Naturally crunchy, sweet, rich in Vitamin E, magnesium, and dietary fiber.',
    },
  },
  'medjool-dates-premium': {
    bn: {
      name: 'রয়েল মেদজুল খেজুর',
      desc: 'বড় সাইজের প্রিমিয়াম রয়েল মেদজুল খেজুর। মুখে মিলিয়ে যাওয়া নরম টেক্সচার ও প্রাকৃতিক ক্যারামেল মিষ্টি স্বাদ।',
    },
    en: {
      name: 'Royal Medjool Dates',
      desc: 'Authentic large royal Medjool dates. Soft, melt-in-the-mouth texture with natural caramel sweetness. Hand-sorted.',
    },
  },
  'mixed-dry-fruits-pack': {
    bn: {
      name: 'সুপার মিক্স ড্রাই ফ্রুটস ও বাদাম',
      desc: 'কাঠবাদাম, কাজুবাদাম, খোরমা খেজুর, কিশমিশ, পেস্তা এবং আখরোটের পুষ্টিকর ও সুস্বাদু ব্যালেন্সড মিক্স প্যাক।',
    },
    en: {
      name: 'Super Mix Dry Fruits & Nuts',
      desc: 'Wholesome blend of California almonds, roasted cashews, golden Afghan raisins, California walnuts, and Turkish pistachios.',
    },
  },
  'black-seed-kalonji': {
    bn: {
      name: 'অর্গানিক কালোজিরা (Kalonji)',
      desc: '১০০% খাঁটি ও তিনবার পরিষ্কার করা প্রিমিয়াম কালোজিরা। প্রয়োজনীয় এসেনশিয়াল অয়েল ও পুষ্টিগুণে ভরপুর।',
    },
    en: {
      name: 'Organic Black Seed (Kalonji)',
      desc: '100% pure triple-cleaned Nigella sativa seeds. Rich in essential oils and antioxidants. Revered for holistic wellness.',
    },
  },
  'organic-turmeric-powder': {
    bn: {
      name: 'খাঁটি গুঁড়া হলুদ (হাই-কারকিউমিন)',
      desc: 'পাহাড়ি অঞ্চলের দেশি কাঁচা হলুদ শুকিয়ে শিল-পাটায় গুঁড়া করা। ৪.৫%+ প্রাকৃতিক কারকিউমিন ও কোনো কৃত্রিম রং ছাড়া।',
    },
    en: {
      name: 'High-Curcumin Turmeric Powder',
      desc: 'Indigenous turmeric sourced from hilly regions, containing 4.5%+ natural curcumin. Stone ground with zero artificial color.',
    },
  },
  'ceylon-cinnamon-sticks': {
    bn: {
      name: 'সিলন দারুচিনি স্টিক',
      desc: 'শ্রীলঙ্কার আসল সিলন দারুচিনি। পাতলা কাগজের মতো স্তরযুক্ত ছাল, হালকা মিষ্টি সুবাস ও ক্ষতিকর কৌমারিনমুক্ত।',
    },
    en: {
      name: 'True Ceylon Cinnamon Quills',
      desc: 'True Ceylon cinnamon rolls from Sri Lanka. Thin paper-like layered bark, sweet delicate scent, ultra-low coumarin.',
    },
  },
  'organic-ginger-powder': {
    bn: {
      name: 'খাঁটি রোদে শুকানো আদা গুঁড়া',
      desc: 'আঁশমুক্ত পরিচ্ছন্ন রোদে শুকানো দেশি আদা গুঁড়া। রান্নায় বা আদা চায়ের জন্য তীব্র ও খাঁটি ঝাঁজালো স্বাদ।',
    },
    en: {
      name: 'Sun-Dried Ginger Powder',
      desc: 'Sun-dried aromatic ginger finely ground without fibers. Intense warm zesty kick for cooking, spiced tea, and wellness recipes.',
    },
  },
}

export const categoryTranslations: Record<
  string,
  { bn: { name: string; desc: string }; en: { name: string; desc: string } }
> = {
  honey: {
    bn: {
      name: 'খাঁটি মধু',
      desc: 'সুন্দরবনের অপ্রক্রিয়াজাত কাঁচা মধু ও ঋতুভিত্তিক প্রাকৃতিক ফুলের মধু।',
    },
    en: {
      name: 'Pure Honey',
      desc: 'Raw, unprocessed honey gathered from traditional Sundarbans beekeepers.',
    },
  },
  'dry-fruits': {
    bn: {
      name: 'ড্রাই ফ্রুটস ও বাদাম',
      desc: 'প্রিমিয়াম কাজুবাদাম, কাঠবাদাম, খোরমা খেজুর, কিসমিস ও আখরোট।',
    },
    en: {
      name: 'Dry Fruits & Nuts',
      desc: 'Premium cashews, almonds, royal Medjool dates, raisins, and walnuts.',
    },
  },
  spices: {
    bn: {
      name: 'খাঁটি গুঁড়া মশলা',
      desc: 'শিল-পাটায় গুঁড়া হলুদ, খাঁটি কালোজিরা ও আসল সিলন দারুচিনি।',
    },
    en: {
      name: 'Spices & Herbs',
      desc: 'Aromatic turmeric, black seed kalonji, and authentic Ceylon cinnamon.',
    },
  },
}

export function getLocalizedProductName(
  slug: string,
  fallbackName: string,
  lang: Language
): string {
  const item = productTranslations[slug]
  if (item && item[lang]?.name) return item[lang].name
  return fallbackName
}

export function getLocalizedProductDesc(
  slug: string,
  fallbackDesc: string | null | undefined,
  lang: Language
): string {
  const item = productTranslations[slug]
  if (item && item[lang]?.desc) return item[lang].desc
  return fallbackDesc || (lang === 'bn' ? '১০০% প্রাকৃতিক ও বিশুদ্ধ খাদ্যপণ্য।' : '100% natural and wholesome food produce.')
}

export function getLocalizedCategoryName(
  slug: string | null | undefined,
  fallbackName: string,
  lang: Language
): string {
  if (!slug) return fallbackName
  const item = categoryTranslations[slug]
  if (item && item[lang]?.name) return item[lang].name
  return fallbackName
}

export function getLocalizedCategoryDesc(
  slug: string | null | undefined,
  fallbackDesc: string | null | undefined,
  lang: Language
): string {
  if (!slug) return fallbackDesc || ''
  const item = categoryTranslations[slug]
  if (item && item[lang]?.desc) return item[lang].desc
  return fallbackDesc || ''
}

export const translations = {
  bn: {
    // Header
    storeName: 'হালাল বাজার',
    storeSubtitle: 'অর্গানিক গ্রোসারি শপ',
    topSlogan: 'খাঁটি খাবার সুস্থ জীবন • ১০০% ন্যাচারাল ও অর্গানিক',
    location: 'শম্ভুপুরা, সোনারগাঁ, নারায়ণগঞ্জ',
    hotline: 'হটলাইন',
    allProducts: 'সকল পণ্য',
    honey: 'খাঁটি মধু',
    dryFruits: 'ড্রাই ফ্রুটস',
    spices: 'মশলা',
    about: 'আমাদের সম্পর্কে',
    contact: 'যোগাযোগ',
    trackOrder: 'অর্ডার ট্র্যাক করুন',
    searchPlaceholder: 'মধু, বাদাম, মশলা খুঁজুন...',
    cart: 'কার্ট',
    langLabel: 'বাংলা',
    langAlt: 'English',

    // Home Hero
    heroBadge: 'খাঁটি খাবার সুস্থ জীবন • 100% Natural & Organic',
    heroTitlePrefix: 'হালাল',
    heroTitleHighlight: 'বাজার',
    heroSubtitle: 'অর্গানিক গ্রোসারি শপ (Halal Bazar)',
    heroDesc: 'প্রাকৃতিক ড্রাই ফ্রুটস, সুন্দরবনের খাঁটি মধু, প্রিমিয়াম মশলা এবং নিরাপদ প্রাকৃতিক খাদ্যপণ্য সরাসরি আপনার ঠিকানায় পৌঁছে দিচ্ছি। কোনো একাউন্ট বা পাসওয়ার্ড ছাড়াই ক্যাশ অন ডেলিভারিতে অর্ডার করুন।',
    proprietorLabel: 'প্রোপাইটর: জোবাইদুর রহমান জাহিন',
    heroShopBtn: 'সকল পণ্য দেখুন (Shop Now)',
    heroHoneyBtn: 'খাঁটি মধু দেখুন',
    pillar1: 'প্রাকৃতিক পণ্য',
    pillar2: 'নিরাপদ ও বিশুদ্ধ',
    pillar3: 'সুস্থতার জন্য',
    pillar4: 'অর্গানিক জীবনযাপন',
    deliveryPledge: 'সারা বাংলাদেশে দ্রুততম হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি',

    // Home Categories
    categoriesTag: 'কালেকশন ক্যাটাগরি',
    categoriesHeading: 'পণ্য ক্যাটাগরি অনুযায়ী কিনুন',
    categoriesAllBtn: 'সব কালেকশন দেখুন',
    categoryExplore: 'পণ্য দেখুন',
    categoryAvailable: 'টি পণ্য রয়েছে',

    // Home Featured Products
    featuredTag: 'সেরা পছন্দের পণ্য',
    featuredHeading: 'জনপ্রিয় খাঁটি অর্গানিক পণ্যসমূহ',
    featuredAllBtn: 'সকল পণ্য দেখুন',

    // Home Promo
    promoTag: 'বিশেষ অফার (Special Promo)',
    promoHeading: 'প্রথম অর্ডারে ১০% ইনস্ট্যান্ট ছাড়',
    promoDesc: 'চেকআউট পেজে কুপন কোড WELCOME10 ব্যবহার করে ১০% ক্যাশ ছাড় উপভোগ করুন।',
    promoBtn: 'ছাড়সহ অর্ডার করুন',

    // Outlet section
    outletTag: 'সোনারগাঁ, নারায়ণগঞ্জ আউটলেট',
    outletHeading: 'হালাল বাজার — শম্ভুপুরা, সোনারগাঁ',
    outletDesc: 'প্রোপাইটর জোবাইদুর রহমান জাহিন এর সার্বিক তত্ত্বাবধানে প্রতিটি পণ্য সরাসরি বিশ্বস্ত উৎস থেকে সংগৃহীত। কোনো ভেজাল বা কেমিক্যাল প্রমাণে ১০০% মূল্য ফেরত।',
    outletBtn: 'সরাসরি যোগাযোগ করুন',

    // Why Choose Us
    whyTag: 'আমাদের অঙ্গীকার',
    whyHeading: 'কেন হালাল বাজার থেকে কিনবেন?',
    whySubtitle: 'খাদ্যের বিশুদ্ধতায় কোনো আপস নেই। স্বাস্থ্যকর ও নিরাপদ খাবারের নিশ্চয়তা।',
    why1Title: 'শতভাগ খাঁটি ও নিরাপদ',
    why1Desc: 'চিনির সিরাপমুক্ত খাঁটি মধু, আনপলিশড নাটস ও কেমিক্যালমুক্ত পিওর মশলা।',
    why2Title: 'দেখে মূল্য পরিশোধ (COD)',
    why2Desc: 'ডেলিভারি রাইডারের কাছ থেকে পণ্য হাতে পেয়ে দেখে তারপর ক্যাশ টাকা পরিশোধ করুন।',
    why3Title: 'সহজ গেস্ট চেকআউট',
    why3Desc: 'পাসওয়ার্ড বা অ্যাকাউন্ট খোলার ঝামেলা ছাড়াই মাত্র ১ মিনিটে অর্ডার সম্পন্ন করুন।',

    // Product Card
    save: 'ছাড়',
    outOfStock: 'স্টক শেষ',
    onlyLeft: 'টি বাকি',
    add: 'যুক্ত করুন',
    added: 'যুক্ত হয়েছে',
    addToCart: 'কার্টে যুক্ত করুন',
    addedToCart: 'কার্টে যুক্ত হয়েছে!',
    available: 'টি অবশিষ্ট আছে',
    natural: 'প্রাকৃতিক',

    // Cart Drawer & Page
    cartTitle: 'শপিং কার্ট',
    itemsCount: 'টি পণ্য',
    cartEmpty: 'আপনার কার্ট খালি',
    cartEmptyDesc: 'এখনো কার্টে কোনো পণ্য যুক্ত করেননি। আমাদের খাঁটি অর্গানিক কালেকশন ঘুরে দেখুন!',
    browseProducts: 'পণ্যগুলো দেখুন',
    subtotal: 'সাবটোটাল',
    shippingNote: 'ডেলিভারি চার্জ চেকআউট পেজে যুক্ত হবে',
    viewCart: 'সম্পূর্ণ কার্ট দেখুন',
    checkout: 'অর্ডার সম্পন্ন করুন (Guest Checkout)',
    clearCart: 'সব মুছুন',
    continueShopping: '← আরও পণ্য দেখুন',
    havePromoCoupon: 'প্রোমো কুপন কোড আছে?',
    apply: 'প্রয়োগ করুন',
    checking: 'যাচাই হচ্ছে...',
    discount: 'ছাড়',
    estimatedShipping: 'আনুমানিক ডেলিভারি চার্জ',
    calculatedAtCheckout: 'চেকআউটে নির্ধারিত হবে (৬০৳ থেকে)',
    estimatedTotal: 'সর্বমোট প্রদেয়',
    proceedGuestCheckout: 'গেস্ট চেকআউটে অর্ডার করুন',
    codAvailableNoAccount: 'ক্যাশ অন ডেলিভারি সুবিধা • একাউন্ট খোলার প্রয়োজন নেই',
    freeShippingRemainingText: 'ফ্রি ডেলিভারির জন্য আরও যোগ করুন:',
    freeShippingUnlocked: '🎉 অভিনন্দন! আপনি ঢাকায় ফ্রি ডেলিভারি আনলক করেছেন!',

    // Checkout Page
    checkoutTitle: 'ডেলিভারি ঠিকানা ও চেকআউট',
    checkoutSubtitle: 'আপনার পণ্য পৌঁছে দেওয়ার ঠিকানা দিন। হাতে পেয়ে ক্যাশ অন ডেলিভারিতে মূল্য পরিশোধ করুন।',
    guestNotice: 'গেস্ট চেকআউট — পাসওয়ার্ড বা একাউন্টের ঝামেলা ছাড়াই অর্ডার সম্পন্ন করুন',
    step1Title: 'যোগাযোগের তথ্য',
    fullNameLabel: 'আপনার পূর্ণ নাম',
    phoneLabel: 'মোবাইল নম্বর (বাংলাদেশ)',
    phoneHint: 'ডেলিভারির আগে আমাদের রাইডার আপনাকে কল করবে',
    emailLabel: 'ইমেইল ঠিকানা (ঐচ্ছিক)',
    emailHint: 'অর্ডার রশিদ ও ট্র্যাকিং লিংকের জন্য',
    step2Title: 'ডেলিভারি গন্তব্য',
    districtLabel: 'জেলা',
    areaLabel: 'থানা / এলাকা (ঐচ্ছিক)',
    addressLabel: 'সম্পূর্ণ রাস্তার ঠিকানা / বাসা / ফ্ল্যাট নম্বর',
    addressHint: 'যেমন: বাড়ি #১৪, রোড #৫, ব্লক সি, ধানমন্ডি, ঢাকা',
    notesLabel: 'রাইডারের জন্য বিশেষ নির্দেশনা (ঐচ্ছিক)',
    notesHint: 'যেমন: আসার আগে কল দিন, ২য় তলায় ডেলিভারি দিন',
    speedLabel: 'ডেলিভারি জোন ও সময়:',
    free: 'ফ্রি',
    step3Title: 'মূল্য পরিশোধ পদ্ধতি',
    codTitle: 'ক্যাশ অন ডেলিভারি (COD)',
    recommendedBadge: 'সবচেয়ে নিরাপদ',
    codExplanation: 'পণ্য হাতে পেয়ে দেখে ডেলিভারি কুরিয়ারের কাছে নগদ টাকা পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।',
    summaryTitle: 'অর্ডার সারাংশ',
    shipping: 'ডেলিভারি চার্জ',
    grandTotal: 'সর্বমোট প্রদেয়',
    placeOrderBtn: 'অর্ডার নিশ্চিত করুন (ক্যাশ অন ডেলিভারি)',
    placingOrderBtn: 'অর্ডার সাবমিট হচ্ছে...',
    termsAgreement: 'অর্ডার নিশ্চিত করার মাধ্যমে আপনি পণ্য গ্রহণের সম্মতি দিচ্ছেন।',
    dispatchCall: 'পণ্য পাঠানোর আগে ফোন করে কনফার্ম করা হবে',
    districtDelivery: 'বাংলাদেশের সকল ৬৪ জেলায় নির্ভরযোগ্য হোম ডেলিভারি',

    // Product Detail Page
    backToCatalog: 'সকল পণ্যে ফিরে যান',
    inStockText: 'স্টকে আছে',
    readyToShipText: 'ডেলিভারির জন্য প্রস্তুত',
    reviewsText: 'টি কাস্টমার রিভিউ',
    youSaveText: 'আপনার সাশ্রয়',
    quantityText: 'পরিমাণ:',
    buyNowBtn: 'এখনই কিনুন (গেস্ট চেকআউট)',
    deliverySpeedText: 'ডেলিভারি: ঢাকায় ৬০৳ (১-২ দিন) • ঢাকার বাইরে ১২০৳ (২-৪ দিন)',
    codPaymentText: 'মূল্য পরিশোধ: ক্যাশ অন ডেলিভারি — দেখে মূল্য দিন',
    guaranteeText: 'গ্যারান্টি: যেকোনো গুণগত সমস্যায় ৭ দিনের সহজ রিপ্লেসমেন্ট',
    feature1Title: '১০০% খাঁটি ও কেমিক্যালমুক্ত',
    feature1Desc: 'কোনো ধরনের প্রিজারভেটিভ বা রাসায়নিক রং ছাড়া নিজস্ব তত্ত্বাবধানে সংগৃহীত ও প্যাকেটজাত।',
    feature2Title: 'শতভাগ বিশুদ্ধতার গ্যারান্টি',
    feature2Desc: 'কোনো প্রকার ভেজাল বা ত্রুটি প্রমাণে সম্পূর্ণ মূল্য ফেরত দেওয়া হবে।',
    feature3Title: 'সরাসরি মৌয়াল ও চাষীদের থেকে',
    feature3Desc: 'সুন্দরবনের স্থানীয় মৌয়াল ও প্রান্তিক চাষীদের থেকে সরাসরি সংগৃহীত।',
    relatedHeading: 'সম্পর্কিত অন্যান্য পণ্য',
    viewAllRelated: 'সব পণ্য দেখুন →',

    // Catalog & Products Page
    catalogTitle: 'সকল খাঁটি অর্গানিক পণ্য',
    catalogSubtitle: '১০০% প্রাকৃতিক, ভেজালমুক্ত ও বিশ্বস্ত কালেকশন',
    showingItems: 'টি পণ্য প্রদর্শিত হচ্ছে',
    sortByLabel: 'সর্ট করুন:',
    sortNewest: 'নতুন পণ্য',
    sortPriceAsc: 'দাম: কম থেকে বেশি',
    sortPriceDesc: 'দাম: বেশি থেকে কম',
    filterAll: 'সকল পণ্য',
    noProductsFound: 'কোনো পণ্য পাওয়া যায়নি',
    noProductsDesc: 'আপনার পছন্দের ক্যাটাগরিতে পণ্য খুঁজে পাওয়া যায়নি। অন্য ক্যাটাগরি ঘুরে দেখুন।',

    // Track Order Page
    trackOrderTitle: 'আপনার অর্ডার ট্র্যাক করুন',
    trackOrderSubtitle: 'অর্ডারের রিয়েল-টাইম ডেলিভারি স্ট্যাটাস জানতে আপনার অর্ডার রেফারেন্স নম্বর ও মোবাইল নম্বর দিন।',
    orderRefLabel: 'অর্ডার রেফারেন্স নম্বর',
    customerPhoneLabel: 'গ্রাহকের মোবাইল নম্বর',
    trackBtn: 'স্ট্যাটাস দেখুন',
    locatingBtn: 'অর্ডার খোঁজা হচ্ছে...',
    orderPlacedOn: 'অর্ডারের তারিখ ও সময়',
    deliveryAddressLabel: 'ডেলিভারি ঠিকানা:',
    paymentMethodLabel: 'পেমেন্ট পদ্ধতি:',
    estimatedTransitLabel: 'আনুমানিক ডেলিভারি:',
    orderedItemsTitle: 'অর্ডারকৃত পণ্যসমূহ',
    stepPending: 'অর্ডার গৃহীত হয়েছে',
    stepPendingDesc: 'অর্ডার রিসিভ করা হয়েছে এবং যাচাইয়ের অপেক্ষায়',
    stepConfirmed: 'অর্ডার কনফার্মড',
    stepConfirmedDesc: 'যাচাই সম্পন্ন এবং প্যাকিং তালিকায় অন্তর্ভুক্ত',
    stepProcessing: 'প্যাকিং চলছে',
    stepProcessingDesc: 'ফ্রেশ পণ্য প্রস্তুত ও কোয়ালিটি চেক হচ্ছে',
    stepShipped: 'ডেলিভারির পথে',
    stepShippedDesc: 'কুরিয়ার রাইডারের কাছে হস্তান্তর করা হয়েছে',
    stepDelivered: 'সফলভাবে ডেলিভারড',
    stepDeliveredDesc: 'পণ্য নিরাপদে গ্রাহকের হাতে পৌঁছে দেওয়া হয়েছে',

    // Contact Page
    contactBadge: 'হেল্পলাইন ও কাস্টমার কেয়ার',
    contactHeading: 'হালাল বাজার — যোগাযোগ করুন',
    contactSubtitle: 'খাঁটি মধু, ড্রাই ফ্রুটস বা মশলা সম্পর্কে যেকোনো তথ্যের জন্য বা পাইকারি অর্ডারে আমাদের সাথে সরাসরি যোগাযোগ করুন।',
    contactStoreTitle: 'দোকানের বিবরণ ও হটলাইন',
    contactProprietor: 'প্রোপাইটর',
    contactPhoneHours: 'সকাল ৯টা হতে রাত ১০টা পর্যন্ত সক্রিয়',
    contactLocationLabel: 'ঠিকানা',
    contactLocationVal: 'শম্ভুপুরা, সোনারগাঁ, নারায়ণগঞ্জ, বাংলাদেশ',
    contactEmailLabel: 'ইমেইল',
    contactTikTokLabel: 'অফিসিয়াল টিকটক আইডি',
    contactFormTitle: 'বার্তা পাঠান',
    contactFormSubtitle: 'আপনার যেকোনো মতামত বা জিজ্ঞাসা লিখে পাঠান।',
    contactSuccessTitle: 'বার্তা সফলভাবে পাঠানো হয়েছে!',
    contactSuccessDesc: 'ধন্যবাদ। আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।',
    contactSendAnother: 'আরেকটি বার্তা পাঠান',
    contactName: 'আপনার নাম',
    contactPhone: 'মোবাইল নম্বর',
    contactEmail: 'ইমেইল ঠিকানা (ঐচ্ছিক)',
    contactSubject: 'বিষয়',
    contactMessage: 'বার্তা',
    contactSubmitBtn: 'বার্তা পাঠান (Send Message)',
    contactSubmitting: 'বার্তা পাঠানো হচ্ছে...',

    // About Page
    aboutBadge: 'Naturally Halal • খাঁটি খাবার সুস্থ জীবন',
    aboutHeading: 'হালাল বাজার — অর্গানিক গ্রোসারি শপ',
    aboutStory: 'আমরা বিশ্বাস করি পরিবারের সুস্থতার মূল ভিত্তি হলো বিশুদ্ধ ও ভেজালমুক্ত প্রাকৃতিক খাদ্য। প্রোপাইটর জোবাইদুর রহমান জাহিন এর উদ্যোগে সোনারগাঁ, নারায়ণগঞ্জ থেকে সারা বাংলাদেশে বিশুদ্ধ খাদ্য পৌঁছে দেওয়াই আমাদের লক্ষ্য।',
    aboutCard1Title: 'সুন্দরবনের খাঁটি মধু ও মশলা',
    aboutCard1Desc: 'সুন্দরবনের মৌয়ালদের সংগৃহীত কাঁচা মধু ও সরাসরি কৃষকদের কাছ থেকে সংগ্রহ করা আস্ত মশলা আমরা নিজস্ব তত্ত্বাবধানে প্রক্রিয়াজাত ও প্যাকেজিং করি। কোনো কৃত্রিম রং, রাসায়নিক বা প্রিজারভেটিভ ব্যবহার করা হয় না।',
    aboutCard1Item1: '১০০% প্রাকৃতিক কাঁচা মধু (Raw Honey)',
    aboutCard1Item2: 'সুগন্ধযুক্ত বিশুদ্ধ ঢেঁকি ও শিল-পাটায় গুঁড়া মশলা',
    aboutCard2Title: 'হাতে বাছাইকৃত প্রিমিয়াম ড্রাই ফ্রুটস',
    aboutCard2Desc: 'আমদানি করা প্রিমিয়াম সাইজের কাজুবাদাম, কাঠবাদাম, খোরমা খেজুর, কিসমিস এবং আখরোট—সবকিছুই পরিচ্ছন্ন ও ফ্রেশ অবস্থায় গ্রাহকদের হাতে তুলে দেওয়া হয়।',
    aboutCard2Item1: 'এয়ারটাইট প্রিমিয়াম হাইজিন প্যাকেজিং',
    aboutCard2Item2: 'দেখে পছন্দ করে ক্যাশ অন ডেলিভারিতে গ্রহণের সুবিধা',
    aboutCtaHeading: 'খাঁটি খাবারের স্বাদ উপভোগ করুন',
    aboutCtaSubtitle: 'কোনো অ্যাকাউন্ট খোলার ঝামেলা ছাড়াই মাত্র ১ মিনিটে অর্ডার করুন। রাইডারের কাছ থেকে পণ্য বুঝে পেয়ে ক্যাশ অন ডেলিভারিতে মূল্য পরিশোধ করুন।',
    aboutCtaBtn: 'পণ্যগুলো দেখুন (Shop Now)',

    // Search Page
    searchTitle: 'পণ্য অনুসন্ধান করুন',
    searchPopularLabel: 'জনপ্রিয় অনুসন্ধান:',
    searchResultsHeading: 'ফলাফল —',
    searchFoundLabel: 'পাওয়া গেছে',
    searchNoMatchTitle: 'কোনো পণ্য পাওয়া যায়নি',
    searchNoMatchDesc: 'আপনার সার্চকৃত শব্দের সাথে কোনো পণ্য মেলেনি। অন্য শব্দ লিখে খুঁজুন অথবা সব পণ্য দেখুন।',
    searchTypePromptTitle: 'পণ্য খুঁজতে উপরে সার্চ করুন',
    searchTypePromptDesc: 'পণ্যের নাম, পুষ্টি উপাদান বা ক্যাটাগরি দিয়ে সার্চ করুন।',

    // Order Success Page
    successTitle: 'অর্ডার সফলভাবে নিশ্চিত হয়েছে!',
    successGreeting: 'ধন্যবাদ,',
    successSubtitle: 'আপনার অর্ডারটি নিরাপদে গ্রহণ করা হয়েছে। আমাদের টিম খুব দ্রুত আপনার পার্সেল প্রস্তুত করছে।',
    successRefLabel: 'অর্ডার রেফারেন্স নম্বর:',
    successTrackBtn: 'অর্ডার ট্র্যাক করুন লাইভ',
    successContinueBtn: 'আরও পণ্য দেখুন',
    successNextTitle: 'এরপর কী ঘটবে?',
    successNextStep1Title: '১. কনফার্মেশন ফোন কল',
    successNextStep1Desc: 'আমাদের কাস্টমার কেয়ার প্রতিনিধি আপনার নম্বরে কল দিয়ে অর্ডার ও ঠিকানা কনফার্ম করবেন।',
    successNextStep2Title: '২. দ্রুত কুরিয়ার ডেলিভারি',
    successNextStep2Desc: 'পার্সেলটি রাইডারের মাধ্যমে দ্রুততম সময়ে আপনার ঠিকানায় পৌঁছে দেওয়া হবে।',
    successNextStep3Title: '৩. দেখে মূল্য পরিশোধ (COD)',
    successNextStep3Desc: 'পণ্য হাতে পেয়ে দেখে নগদ টাকায় ক্যাশ অন ডেলিভারি মূল্য পরিশোধ করুন।',

    // Footer
    footerDesc: 'খাঁটি খাবার সুস্থ জীবন। ড্রাই ফ্রুটস, সুন্দরবনের খাঁটি মধু, প্রিমিয়াম মশলা ও প্রাকৃতিক খাদ্যপণ্য সারা বাংলাদেশে পৌঁছে দিচ্ছি।',
    footerShopHeading: 'পণ্যসমূহ (Shop)',
    footerSupportHeading: 'গ্রাহক সেবা (Support)',
    footerContactHeading: 'যোগাযোগ (Contact)',
    footerCopyright: 'হালাল বাজার (Halal Bazar) • সর্বস্বত্ব সংরক্ষিত। প্রোপাইটর: জোবাইদুর রহমান জাহিন।',
    allProductsLink: 'সকল পণ্য',
    pureHoneyLink: 'সুন্দরবনের খাঁটি মধু',
    dryFruitsLink: 'ড্রাই ফ্রুটস ও বাদাম',
    spicesLink: 'খাঁটি গুঁড়া মশলা',
    cartLink: 'শপিং কার্ট',
    trackOrderLink: 'অর্ডার ট্র্যাক করুন',
    deliveryPolicyLink: 'ডেলিভারি পলিসি',
    returnPolicyLink: '৭ দিনের রিটার্ন পলিসি',
    privacyPolicyLink: 'প্রাইভেসি পলিসি',
    termsLink: 'শর্তাবলী',
    outletCity: 'সোনারগাঁ, নারায়ণগঞ্জ',
    adminPortal: 'অ্যাডমিন পোর্টাল',
    codFooterBadge: 'ক্যাশ অন ডেলিভারি সুবিধা',
  },

  en: {
    // Header
    storeName: 'Halal Bazar',
    storeSubtitle: 'Organic Grocery Shop',
    topSlogan: 'Pure Food, Healthy Life • 100% Natural & Organic',
    location: 'Shambhupura, Sonargaon, Narayanganj',
    hotline: 'Hotline',
    allProducts: 'All Products',
    honey: 'Pure Honey',
    dryFruits: 'Dry Fruits',
    spices: 'Spices',
    about: 'About Us',
    contact: 'Contact Us',
    trackOrder: 'Track Order',
    searchPlaceholder: 'Search honey, almonds, spices...',
    cart: 'Cart',
    langLabel: 'English',
    langAlt: 'বাংলা',

    // Home Hero
    heroBadge: 'Pure Food, Healthy Life • 100% Natural & Organic',
    heroTitlePrefix: 'Halal',
    heroTitleHighlight: 'Bazar',
    heroSubtitle: 'Organic Grocery Shop',
    heroDesc: 'Discover unpasteurized Sundarbans honey, hand-selected dry fruits & nuts, and authentic stone-ground spices delivered right to your home. Instant guest checkout — no password or account creation required.',
    proprietorLabel: 'Proprietor: Zobaidur Rahman Jahin',
    heroShopBtn: 'Shop All Products',
    heroHoneyBtn: 'Explore Pure Honey',
    pillar1: '100% Natural',
    pillar2: 'Safe & Pure',
    pillar3: 'For Good Health',
    pillar4: 'Organic Living',
    deliveryPledge: 'Fast nationwide delivery with Cash on Delivery across Bangladesh',

    // Home Categories
    categoriesTag: 'Browse Collections',
    categoriesHeading: 'Shop By Category',
    categoriesAllBtn: 'View All Collections',
    categoryExplore: 'Explore Collection',
    categoryAvailable: 'Products Available',

    // Home Featured Products
    featuredTag: 'Handpicked Favorites',
    featuredHeading: 'Featured Organic Products',
    featuredAllBtn: 'Explore Full Catalog',

    // Home Promo
    promoTag: 'Special Promo',
    promoHeading: 'Save 10% On Your First Order Today',
    promoDesc: 'Apply coupon code WELCOME10 during checkout for an instant 10% discount on pure natural produce.',
    promoBtn: 'Shop With Discount',

    // Outlet section
    outletTag: 'Sonargaon, Narayanganj Outlet',
    outletHeading: 'Halal Bazar — Shambhupura, Sonargaon',
    outletDesc: 'Operated under the direct care of Proprietor Zobaidur Rahman Jahin. Every item is verified from origin. 100% money back if any adulteration is found.',
    outletBtn: 'Contact Directly',

    // Why Choose Us
    whyTag: 'Our Promise',
    whyHeading: 'Why Choose Halal Bazar?',
    whySubtitle: 'Never compromising on food purity. Wholesome, safe nutrition for your family.',
    why1Title: 'Zero Adulteration Guarantee',
    why1Desc: 'Unpasteurized raw honey without corn syrup, unbleached nuts, and filler-free spices.',
    why2Title: 'Pay After Inspection (COD)',
    why2Desc: 'Inspect your parcel when the delivery courier arrives before handing over cash.',
    why3Title: 'Frictionless Guest Checkout',
    why3Desc: 'No passwords or account registration required. Complete your order in 60 seconds.',

    // Product Card
    save: 'Save',
    outOfStock: 'Out of Stock',
    onlyLeft: 'left',
    add: 'Add',
    added: 'Added',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart!',
    available: 'available',
    natural: 'Natural',

    // Cart Drawer & Page
    cartTitle: 'Shopping Cart',
    itemsCount: 'items',
    cartEmpty: 'Your Cart is Empty',
    cartEmptyDesc: 'You haven\'t added any items to your cart yet. Explore our pure organic collections!',
    browseProducts: 'Browse Products',
    subtotal: 'Subtotal',
    shippingNote: 'Shipping fee calculated at checkout',
    viewCart: 'View Full Cart',
    checkout: 'Proceed to Checkout (Guest)',
    clearCart: 'Clear all',
    continueShopping: '← Continue Shopping',
    havePromoCoupon: 'Have a Promo Coupon?',
    apply: 'Apply',
    checking: 'Checking...',
    discount: 'Discount',
    estimatedShipping: 'Estimated Shipping',
    calculatedAtCheckout: 'Calculated at checkout (from ৳60)',
    estimatedTotal: 'Estimated Total',
    proceedGuestCheckout: 'Proceed to Guest Checkout',
    codAvailableNoAccount: 'Cash on Delivery Available • No Account Required',
    freeShippingRemainingText: 'Add more for Free Delivery in Dhaka:',
    freeShippingUnlocked: '🎉 Congratulations! You unlocked Free Delivery in Dhaka!',

    // Checkout Page
    checkoutTitle: 'Delivery & Checkout',
    checkoutSubtitle: 'Enter where you want your natural products delivered. Pay safely with Cash on Delivery.',
    guestNotice: 'Fast Guest Checkout — No Account or Password Required',
    step1Title: 'Contact Information',
    fullNameLabel: 'Full Name',
    phoneLabel: 'Phone Number (Bangladesh)',
    phoneHint: 'Our rider will call before delivery',
    emailLabel: 'Email Address (Optional)',
    emailHint: 'For order invoice & tracking link',
    step2Title: 'Delivery Destination',
    districtLabel: 'District',
    areaLabel: 'Thana / Area (Optional)',
    addressLabel: 'Full Street Address / House / Flat',
    addressHint: 'e.g. House #14, Road #5, Block C, Dhanmondi, Dhaka',
    notesLabel: 'Delivery Instructions / Rider Notes (Optional)',
    notesHint: 'e.g. Call before coming, leave at 2nd floor',
    speedLabel: 'Delivery Zone & Speed:',
    free: 'FREE',
    step3Title: 'Payment Method',
    codTitle: 'Cash on Delivery (COD)',
    recommendedBadge: 'Recommended',
    codExplanation: 'Pay with cash when the delivery person arrives at your doorstep. You can inspect the items before handing over payment.',
    summaryTitle: 'Order Summary',
    shipping: 'Shipping Fee',
    grandTotal: 'Grand Total',
    placeOrderBtn: 'Place Order (Cash on Delivery)',
    placingOrderBtn: 'Placing Your Order...',
    termsAgreement: 'By placing your order you confirm delivery with Cash on Delivery payment.',
    dispatchCall: 'Free phone confirmation call before dispatch',
    districtDelivery: 'Fast delivery across all 64 districts in Bangladesh',

    // Product Detail Page
    backToCatalog: 'Back to All Products',
    inStockText: 'In Stock',
    readyToShipText: 'ready to ship',
    reviewsText: 'customer reviews',
    youSaveText: 'You save',
    quantityText: 'Quantity:',
    buyNowBtn: 'Buy Now (Guest Checkout)',
    deliverySpeedText: 'Delivery: ৳60 Inside Dhaka (1-2 days) • ৳120 Outside Dhaka (2-4 days)',
    codPaymentText: 'Payment: Cash on Delivery available — inspect before paying',
    guaranteeText: 'Guarantee: 7 days hassle-free replacement for any quality issue',
    feature1Title: '100% Pure & Chemical Free',
    feature1Desc: 'Directly harvested and packed without any artificial preservatives or colors.',
    feature2Title: 'Guaranteed Authenticity',
    feature2Desc: 'If you find any adulteration, we guarantee a 100% full money-back return.',
    feature3Title: 'Direct Farmer Sourcing',
    feature3Desc: 'Supporting native honey gatherers and certified sustainable growers in Bangladesh.',
    relatedHeading: 'You May Also Like',
    viewAllRelated: 'View all products →',

    // Catalog & Products Page
    catalogTitle: 'All Natural Products',
    catalogSubtitle: 'Showing pure, authentic & chemical-free grocery selections',
    showingItems: 'items found',
    sortByLabel: 'Sort by:',
    sortNewest: 'Newest',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    filterAll: 'All Products',
    noProductsFound: 'No products found',
    noProductsDesc: 'We couldn\'t find any products matching your selection. Try clearing filters or exploring our other collections.',

    // Track Order Page
    trackOrderTitle: 'Track Your Order',
    trackOrderSubtitle: 'Enter your order reference and the phone number used during checkout to view real-time delivery status.',
    orderRefLabel: 'Order Reference Number',
    customerPhoneLabel: 'Customer Phone Number',
    trackBtn: 'Track Status',
    locatingBtn: 'Locating Order...',
    orderPlacedOn: 'Placed on',
    deliveryAddressLabel: 'Delivery Address:',
    paymentMethodLabel: 'Payment Method:',
    estimatedTransitLabel: 'Estimated Transit:',
    orderedItemsTitle: 'Ordered Items',
    stepPending: 'Order Placed',
    stepPendingDesc: 'Received & awaiting phone verification',
    stepConfirmed: 'Confirmed',
    stepConfirmedDesc: 'Verified and queued for packaging',
    stepProcessing: 'Processing',
    stepProcessingDesc: 'Freshly packed & quality checked',
    stepShipped: 'Out for Delivery',
    stepShippedDesc: 'Handed over to courier rider',
    stepDelivered: 'Delivered',
    stepDeliveredDesc: 'Package safely handed over',

    // Contact Page
    contactBadge: 'Helpline & Customer Care',
    contactHeading: 'Contact Halal Bazar',
    contactSubtitle: 'For wholesale inquiries or questions regarding pure honey, dry fruits, and spices, reach out to us directly.',
    contactStoreTitle: 'Store Hotline & Details',
    contactProprietor: 'Proprietor',
    contactPhoneHours: 'Active 9:00 AM to 10:00 PM daily',
    contactLocationLabel: 'Address',
    contactLocationVal: 'Shambhupura, Sonargaon, Narayanganj, Bangladesh',
    contactEmailLabel: 'Email',
    contactTikTokLabel: 'Official TikTok ID',
    contactFormTitle: 'Send a Message',
    contactFormSubtitle: 'Have any questions or suggestions? Drop us a note below.',
    contactSuccessTitle: 'Message Sent Successfully!',
    contactSuccessDesc: 'Thank you for reaching out. Our representative will contact you shortly.',
    contactSendAnother: 'Send Another Message',
    contactName: 'Your Name',
    contactPhone: 'Mobile Phone',
    contactEmail: 'Email Address (Optional)',
    contactSubject: 'Subject',
    contactMessage: 'Message',
    contactSubmitBtn: 'Send Message',
    contactSubmitting: 'Sending message...',

    // About Page
    aboutBadge: 'Naturally Halal • Pure Food Healthy Life',
    aboutHeading: 'Halal Bazar — Organic Grocery Shop',
    aboutStory: 'We believe family wellness starts with unadulterated, wholesome natural nutrition. Founded by Zobaidur Rahman Jahin in Sonargaon, Narayanganj, our goal is to deliver safe, authentic foods nationwide across Bangladesh.',
    aboutCard1Title: 'Raw Sundarbans Honey & Spices',
    aboutCard1Desc: 'Raw honey gathered by traditional Sundarbans beekeepers and whole spices sourced directly from local farmers. Processed under strict personal care with zero preservatives or chemical colors.',
    aboutCard1Item1: '100% Natural Raw Honey',
    aboutCard1Item2: 'Aromatic Pure Stone-Ground Spices',
    aboutCard2Title: 'Handpicked Premium Dry Fruits',
    aboutCard2Desc: 'Imported jumbo cashews, California almonds, Royal Medjool dates, raisins, and walnuts—delivered fresh and clean in hygienic food-grade containers.',
    aboutCard2Item1: 'Airtight Premium Hygienic Packaging',
    aboutCard2Item2: 'Inspect and Pay with Cash on Delivery',
    aboutCtaHeading: 'Experience Pure & Wholesome Food',
    aboutCtaSubtitle: 'Order in under 60 seconds with no account or password required. Inspect upon arrival and pay cash on delivery.',
    aboutCtaBtn: 'Shop Products',

    // Search Page
    searchTitle: 'Search Our Products',
    searchPopularLabel: 'Popular Searches:',
    searchResultsHeading: 'Results for',
    searchFoundLabel: 'Found',
    searchNoMatchTitle: 'No matching products found',
    searchNoMatchDesc: 'We couldn\'t find anything matching your search query. Try another keyword or explore our full collection.',
    searchTypePromptTitle: 'Type a keyword above to find products',
    searchTypePromptDesc: 'Search by product name, natural ingredients, or category.',

    // Order Success Page
    successTitle: 'Order Confirmed!',
    successGreeting: 'Thank you,',
    successSubtitle: 'Your order has been safely placed. We are preparing your fresh natural produce for dispatch.',
    successRefLabel: 'Order Reference Number:',
    successTrackBtn: 'Track Order Live',
    successContinueBtn: 'Continue Shopping',
    successNextTitle: 'What happens next?',
    successNextStep1Title: '1. Confirmation Call',
    successNextStep1Desc: 'Our support executive will call your phone to verify dispatch and delivery details.',
    successNextStep2Title: '2. Fast Courier Delivery',
    successNextStep2Desc: 'Your parcel will be delivered by our courier rider straight to your doorstep.',
    successNextStep3Title: '3. Inspect & Pay COD',
    successNextStep3Desc: 'Pay with cash after inspecting your items when the delivery person arrives.',

    // Footer
    footerDesc: 'Pure Food, Healthy Life. Sourcing the finest raw honey, premium nuts, and spices delivered safely across Bangladesh.',
    footerShopHeading: 'Shop Collections',
    footerSupportHeading: 'Customer Support',
    footerContactHeading: 'Contact Info',
    footerCopyright: 'Halal Bazar • All rights reserved. Proprietor: Zobaidur Rahman Jahin.',
    allProductsLink: 'All Products',
    pureHoneyLink: 'Pure Honey',
    dryFruitsLink: 'Dry Fruits & Nuts',
    spicesLink: 'Spices & Herbs',
    cartLink: 'Shopping Cart',
    trackOrderLink: 'Track Order',
    deliveryPolicyLink: 'Shipping & Delivery Policy',
    returnPolicyLink: '7-Day Return Guarantee',
    privacyPolicyLink: 'Privacy Policy',
    termsLink: 'Terms & Conditions',
    outletCity: 'Sonargaon, Narayanganj',
    adminPortal: 'Admin Portal',
    codFooterBadge: 'Cash on Delivery Available',
  },
}
