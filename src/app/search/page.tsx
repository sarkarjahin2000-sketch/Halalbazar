import { prisma } from '@/lib/db'
import SearchPageContent from '@/components/product/SearchPageContent'

export const dynamic = 'force-dynamic'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  const products = query
    ? await prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { sku: { contains: query } },
          ],
        },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return <SearchPageContent products={products} query={query} />
}
