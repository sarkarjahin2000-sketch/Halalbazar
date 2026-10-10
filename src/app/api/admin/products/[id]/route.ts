import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const updateData: any = {}
    if (name) updateData.name = name
    if (slug) updateData.slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    if (sku !== undefined) updateData.sku = sku || null
    if (price !== undefined) updateData.price = parseInt(price, 10)
    if (compareAtPrice !== undefined)
      updateData.compareAtPrice = compareAtPrice ? parseInt(compareAtPrice, 10) : null
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity, 10)
    if (categoryId !== undefined) updateData.categoryId = categoryId || null
    if (description !== undefined) updateData.description = description
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured)
    if (status !== undefined) updateData.status = status

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    })

    if (imageUrl) {
      // Upsert primary image
      await prisma.productImage.deleteMany({ where: { productId: id } })
      await prisma.productImage.create({
        data: {
          productId: id,
          url: imageUrl,
          isPrimary: true,
          sortOrder: 0,
        },
      })
    }

    return NextResponse.json({ success: true, product: updated })
  } catch (err: any) {
    console.error('Update product error:', err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Delete product error:', err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
