import { prisma } from '@/lib/db'
import CategoryDetailContent from '@/components/product/CategoryDetailContent'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { status: 'ACTIVE' },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!category) {
    notFound()
  }

  return <CategoryDetailContent category={category} />
}
