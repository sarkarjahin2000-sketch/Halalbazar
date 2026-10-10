import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      slug,
      sku,
      price,
      compareAtPrice,
      stockQuantity,
      categoryId,
      description,
      imageUrl,
      isFeatured,
      status,
    } = body

    if (!name || !slug || price === undefined) {
      return NextResponse.json({ error: 'Name, slug, and price are required' }, { status: 400 })
    }

    const created = await prisma.product.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        sku: sku || null,
        price: parseInt(price, 10),
        compareAtPrice: compareAtPrice ? parseInt(compareAtPrice, 10) : null,
        stockQuantity: parseInt(stockQuantity || '0', 10),
        categoryId: categoryId || null,
        description: description || null,
        isFeatured: Boolean(isFeatured),
        status: status || 'ACTIVE',
        images: imageUrl
          ? {
              create: {
                url: imageUrl,
                isPrimary: true,
                sortOrder: 0,
              },
            }
          : undefined,
      },
    })

    try {
      revalidatePath('/')
      revalidatePath('/products')
      revalidatePath('/categories/[slug]', 'page')
    } catch {}

    return NextResponse.json({ success: true, product: created })
  } catch (err: any) {
    console.error('Create product error:', err)
    return NextResponse.json({ error: 'Failed to create product. Check if slug is unique.' }, { status: 500 })
  }
}
