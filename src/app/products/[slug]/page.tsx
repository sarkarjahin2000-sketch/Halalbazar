import { prisma } from '@/lib/db'
import ProductDetailPageContent from '@/components/product/ProductDetailPageContent'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface ProductDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params

  let product: any = null
  let relatedProducts: any[] = []

  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: { select: { id: true, name: true, slug: true } },
        variants: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
      },
    })

    if (product) {
      relatedProducts = await prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          categoryId: product.categoryId,
          id: { not: product.id },
        },
        take: 4,
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          category: { select: { name: true, slug: true } },
        },
      })
    }
  } catch (error) {
    console.error(`Failed to load product "${slug}":`, error)
  }

  if (!product) {
    notFound()
  }

  return <ProductDetailPageContent product={product} relatedProducts={relatedProducts} />
}
