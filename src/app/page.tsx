import { prisma } from '@/lib/db'
import HomeContent from '@/components/home/HomeContent'

export const revalidate = 60

export default async function HomePage() {
  let featuredProducts: any[] = []
  let categories: any[] = []
  let allProducts: any[] = []

  try {
    featuredProducts = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        isFeatured: true,
      },
      take: 8,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    })

    allProducts = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      take: 8,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (err) {
    console.error('Error fetching home data:', err)
  }

  return (
    <HomeContent
      featuredProducts={featuredProducts}
      categories={categories}
      allProducts={allProducts}
    />
  )
}
