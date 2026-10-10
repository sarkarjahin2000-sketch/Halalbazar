/**
 * Database seed script — Safe to run multiple times.
 * Run: npx tsx prisma/seed.ts
 */
try { process.loadEnvFile?.() } catch {}
if (!process.env.DATABASE_URL) process.env.DATABASE_URL = 'file:./dev.db'

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'sarkarjahin2000@gmail.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234!'
  const existing = await prisma.adminUser.findUnique({ where: { email: adminEmail } })
  if (!existing) {
    const hash = await bcrypt.hash(adminPassword, 12)
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash: hash,
        name: 'জোবাইদুর রহমান জাহিন (Zobaidur Rahman Jahin)',
        role: 'ADMIN',
      },
    })
    console.log(`✅ Admin: ${adminEmail}`)
  } else {
    console.log(`ℹ️  Admin exists: ${adminEmail}`)
  }

  // Shipping Zones
  await prisma.shippingZone.upsert({ where: { id: 'zone-dhaka-inside' }, update: {}, create: { id: 'zone-dhaka-inside', name: 'Inside Dhaka', districts: JSON.stringify(['Dhaka']), fee: 60, freeShippingThreshold: 2000, estimatedDays: '1-2 business days', isActive: true } })
  await prisma.shippingZone.upsert({ where: { id: 'zone-dhaka-outside' }, update: {}, create: { id: 'zone-dhaka-outside', name: 'Outside Dhaka', districts: JSON.stringify(['Chittagong','Sylhet','Rajshahi','Khulna','Barisal','Rangpur','Mymensingh','Comilla','Narayanganj','Gazipur']), fee: 120, freeShippingThreshold: 3000, estimatedDays: '2-4 business days', isActive: true } })
  console.log('✅ Shipping zones')

  // Categories
  const honey = await prisma.category.upsert({ where: { slug: 'honey' }, update: {}, create: { name: 'Pure Honey', slug: 'honey', description: 'Raw, unprocessed honey from trusted beekeepers.', sortOrder: 1, isActive: true } })
  const dryFruits = await prisma.category.upsert({ where: { slug: 'dry-fruits' }, update: {}, create: { name: 'Dry Fruits', slug: 'dry-fruits', description: 'Premium nuts, dried fruits, and seeds.', sortOrder: 2, isActive: true } })
  const spices = await prisma.category.upsert({ where: { slug: 'spices' }, update: {}, create: { name: 'Spices & Herbs', slug: 'spices', description: 'Aromatic spices and natural seasonings.', sortOrder: 3, isActive: true } })
  console.log('✅ Categories')

  // Products
  const products = [
    {
      name: 'Pure Sidr Honey',
      slug: 'pure-sidr-honey',
      sku: 'HNY-SIDR-500',
      description: 'Premium raw Sidr honey gathered by traditional beekeepers. Dark, rich, with deep caramel and herbal undertones. 100% unpasteurized and unprocessed.',
      price: 850,
      compareAtPrice: 1000,
      stockQuantity: 50,
      status: 'ACTIVE',
      isFeatured: true,
      categoryId: honey.id,
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Boshonto Spring Honey',
      slug: 'boshonto-spring-honey',
      sku: 'HNY-BOSH-1KG',
      description: 'Light golden floral honey collected during the spring bloom. Delicate floral sweetness, perfect for green tea, warm water, and morning breakfast.',
      price: 1200,
      compareAtPrice: 1400,
      stockQuantity: 35,
      status: 'ACTIVE',
      isFeatured: true,
      categoryId: honey.id,
      imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Black Seed Honey Infusion',
      slug: 'black-seed-honey',
      sku: 'HNY-BLKSED-500',
      description: 'Pure Sundarban honey naturally blended with freshly cracked Ethiopian black seed (kalonji). Exceptional daily wellness and immunity booster.',
      price: 950,
      compareAtPrice: 1100,
      stockQuantity: 28,
      status: 'ACTIVE',
      isFeatured: false,
      categoryId: honey.id,
      imageUrl: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Organic Cashews W320',
      slug: 'organic-cashews-w320',
      sku: 'DF-CASH-250',
      description: 'Premium jumbo W320 grade cashews. Clean, uniform, naturally buttery crunch without any added chemicals or preservatives.',
      price: 420,
      compareAtPrice: 500,
      stockQuantity: 60,
      status: 'ACTIVE',
      isFeatured: true,
      categoryId: dryFruits.id,
      imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Premium California Almonds',
      slug: 'premium-almonds',
      sku: 'DF-ALM-500',
      description: 'Selected premium whole California almonds. Naturally crunchy, sweet, rich in Vitamin E, magnesium, and dietary fiber.',
      price: 680,
      compareAtPrice: 750,
      stockQuantity: 45,
      status: 'ACTIVE',
      isFeatured: true,
      categoryId: dryFruits.id,
      imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Royal Medjool Dates',
      slug: 'medjool-dates-premium',
      sku: 'DF-DATE-500',
      description: 'Authentic large royal Medjool dates. Soft, melt-in-the-mouth texture with natural caramel sweetness. Hand-sorted for premium size.',
      price: 550,
      compareAtPrice: 650,
      stockQuantity: 40,
      status: 'ACTIVE',
      isFeatured: true,
      categoryId: dryFruits.id,
      imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Super Mix Dry Fruits & Nuts',
      slug: 'mixed-dry-fruits-pack',
      sku: 'DF-MIX-500',
      description: 'Wholesome blend of California almonds, roasted cashews, golden Afghan raisins, California walnuts, and Turkish pistachios.',
      price: 750,
      compareAtPrice: 900,
      stockQuantity: 30,
      status: 'ACTIVE',
      isFeatured: false,
      categoryId: dryFruits.id,
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Organic Black Seed (Kalonji)',
      slug: 'black-seed-kalonji',
      sku: 'SPC-KALNJ-200',
      description: '100% pure triple-cleaned Nigella sativa seeds. Rich in essential oils and antioxidants. Revered for centuries for holistic health.',
      price: 180,
      compareAtPrice: 220,
      stockQuantity: 80,
      status: 'ACTIVE',
      isFeatured: false,
      categoryId: spices.id,
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'High-Curcumin Turmeric Powder',
      slug: 'organic-turmeric-powder',
      sku: 'SPC-TURMRC-500',
      description: 'Indigenous turmeric sourced from hilly regions, containing 4.5%+ natural curcumin. Stone ground with zero artificial color.',
      price: 220,
      compareAtPrice: 260,
      stockQuantity: 70,
      status: 'ACTIVE',
      isFeatured: true,
      categoryId: spices.id,
      imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Ceylon Cinnamon Quills',
      slug: 'ceylon-cinnamon-sticks',
      sku: 'SPC-CINN-100',
      description: 'True Ceylon cinnamon rolls from Sri Lanka. Thin paper-like layered bark, sweet delicate scent, ultra-low coumarin.',
      price: 160,
      compareAtPrice: 200,
      stockQuantity: 55,
      status: 'ACTIVE',
      isFeatured: false,
      categoryId: spices.id,
      imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Sun-Dried Ginger Powder',
      slug: 'organic-ginger-powder',
      sku: 'SPC-GNGR-200',
      description: 'Sun-dried aromatic ginger finely ground without fibers. Intense warm zesty kick for cooking, spiced tea, and wellness recipes.',
      price: 195,
      compareAtPrice: 230,
      stockQuantity: 60,
      status: 'ACTIVE',
      isFeatured: false,
      categoryId: spices.id,
      imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80'
    },
  ]

  for (const { imageUrl, ...p } of products) {
    const created = await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    })
    // Ensure image exists
    await prisma.productImage.deleteMany({ where: { productId: created.id } })
    await prisma.productImage.create({
      data: {
        productId: created.id,
        url: imageUrl,
        altText: p.name,
        isPrimary: true,
        sortOrder: 0,
      },
    })
  }
  console.log(`✅ ${products.length} products with photos`)

  // Coupon
  await prisma.coupon.upsert({ where: { code: 'WELCOME10' }, update: {}, create: { code: 'WELCOME10', description: '10% off first order', discountType: 'PERCENTAGE', discountValue: 10, minimumOrderAmount: 500, maximumDiscount: 300, usageLimit: 100, isActive: true } })
  console.log('✅ Coupon: WELCOME10')

  // Store settings
  const settingsList = [
    { key: 'store_name', value: 'হালাল বাজার (Halal Bazar)' },
    { key: 'store_tagline', value: 'খাঁটি খাবার সুস্থ জীবন — Naturally Halal' },
    { key: 'proprietor_name', value: 'জোবাইদুর রহমান জাহিন (Zobaidur Rahman Jahin)' },
    { key: 'store_phone', value: '01618908086' },
    { key: 'store_email', value: 'sarkarjahin2000@gmail.com' },
    { key: 'store_location', value: 'শম্ভুপুরা, সোনারগাঁ, নারায়ণগঞ্জ' },
    { key: 'store_tiktok', value: 'https://tiktok.com/@halal.bazar6' },
    { key: 'currency', value: 'BDT' },
  ]
  for (const s of settingsList) {
    await prisma.storeSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s })
  }
  console.log('✅ Settings\n✨ Done! Admin: sarkarjahin2000@gmail.com')
}

main().catch(e => { console.error('❌', e); process.exit(1) }).finally(() => prisma.$disconnect())
