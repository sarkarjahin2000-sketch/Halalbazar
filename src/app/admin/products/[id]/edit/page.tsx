import { prisma } from '@/lib/db'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  if (!product) {
    notFound()
  }

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    stockQuantity: product.stockQuantity,
    categoryId: product.categoryId,
    description: product.description,
    imageUrl: product.images[0]?.url,
    isFeatured: product.isFeatured,
    status: product.status,
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Edit Product: {product.name}
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Update prices, stock, image, or status.
        </p>
      </div>

      <ProductForm categories={categories} initialData={initialData} />
    </div>
  )
}
