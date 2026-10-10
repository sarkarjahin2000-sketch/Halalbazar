import { prisma } from '@/lib/db'
import CategoryDetailContent from '@/components/product/CategoryDetailContent'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateStaticParams() {
  return [
    { slug: 'honey' },
    { slug: 'dry-fruits' },
    { slug: 'spices' },
  ]
}

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  let category: any = null

  try {
    category = await prisma.category.findUnique({
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
  } catch (error) {
    console.error(`Failed to load category "${slug}":`, error)
  }

  if (!category) {
    // Graceful fallback for categories in header (honey, dry-fruits, spices, etc.)
    const nameMap: Record<string, string> = {
      honey: 'Pure Honey',
      'dry-fruits': 'Dry Fruits',
      spices: 'Spices',
    }
    const fallbackName = nameMap[slug] || slug.replace(/-/g, ' ')
    return (
      <CategoryDetailContent
        category={{
          id: slug,
          name: fallbackName,
          slug,
          description: '',
          products: [],
        }}
      />
    )
  }

  return <CategoryDetailContent category={category} />
}
