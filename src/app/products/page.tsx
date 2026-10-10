import { prisma } from '@/lib/db'
import ProductsCatalogContent from '@/components/product/ProductsCatalogContent'

export const dynamic = 'force-dynamic'

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    sort?: string
    q?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const categorySlug = params.category
  const sort = params.sort || 'newest'
  const query = params.q

  // Build prisma where clause
  const where: any = { status: 'ACTIVE' }

  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
      { sku: { contains: query } },
    ]
  }

  // Build order clause
  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'price-asc') orderBy = { price: 'asc' }
  if (sort === 'price-desc') orderBy = { price: 'desc' }
  if (sort === 'name-asc') orderBy = { name: 'asc' }

  // Fetch data
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  return (
    <ProductsCatalogContent
      products={products}
      categories={categories}
      categorySlug={categorySlug}
      sort={sort}
      query={query}
    />
  )
}
