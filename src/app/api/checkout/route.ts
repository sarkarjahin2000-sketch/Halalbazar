import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkoutSchema } from '@/lib/validation'

function generatePublicRef(): string {
  const timestamp = Date.now().toString().slice(-4)
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SBD-${timestamp}-${randomChars}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 1. Zod Validation
    const validationResult = checkoutSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      district,
      area,
      deliveryInstructions,
      shippingZoneId,
      paymentMethod,
      couponCode,
      idempotencyKey,
    } = validationResult.data

    const cartItems: Array<{
      productId: string
      variantId?: string
      quantity: number
    }> = body.cartItems

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // 2. Idempotency Check
    const existingOrder = await prisma.order.findUnique({
      where: { idempotencyKey },
    })

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        publicReference: existingOrder.publicReference,
        isDuplicate: true,
      })
    }

    // 3. Fetch Shipping Zone
    const shippingZone = await prisma.shippingZone.findUnique({
      where: { id: shippingZoneId },
    })

    if (!shippingZone || !shippingZone.isActive) {
      return NextResponse.json({ error: 'Selected shipping zone is invalid' }, { status: 400 })
    }

    // 4. Validate Products & Calculate Subtotal on Server
    const productIds = cartItems.map((i) => i.productId)
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    const productMap = new Map(dbProducts.map((p) => [p.id, p]))

    let calculatedSubtotal = 0
    const orderItemsToCreate: Array<{
      productId: string
      productNameSnapshot: string
      skuSnapshot?: string | null
      unitPriceSnapshot: number
      quantity: number
      lineTotal: number
    }> = []

    for (const item of cartItems) {
      const product = productMap.get(item.productId)

      if (!product || product.status !== 'ACTIVE') {
        return NextResponse.json(
          { error: `Product "${product?.name || item.productId}" is unavailable.` },
          { status: 400 }
        )
      }

      if (product.stockQuantity < item.quantity && !product.allowBackorder) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${product.name}". Only ${product.stockQuantity} left in stock.`,
          },
          { status: 400 }
        )
      }

      const unitPrice = product.price
      const lineTotal = unitPrice * item.quantity
      calculatedSubtotal += lineTotal

      orderItemsToCreate.push({
        productId: product.id,
        productNameSnapshot: product.name,
        skuSnapshot: product.sku,
        unitPriceSnapshot: unitPrice,
        quantity: item.quantity,
        lineTotal,
      })
    }

    // 5. Calculate Shipping Fee
    let finalShippingFee = shippingZone.fee
    if (
      shippingZone.freeShippingThreshold &&
      calculatedSubtotal >= shippingZone.freeShippingThreshold
    ) {
      finalShippingFee = 0
    }

    // 6. Calculate Coupon Discount if applied
    let discountTotal = 0
    let validatedCouponId: string | undefined

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      })

      if (coupon && coupon.isActive) {
        const now = new Date()
        const isNotExpired = !coupon.expiresAt || now <= coupon.expiresAt
        const isLimitOk = !coupon.usageLimit || coupon.usageCount < coupon.usageLimit
        const isMinAmountOk = calculatedSubtotal >= coupon.minimumOrderAmount

        if (isNotExpired && isLimitOk && isMinAmountOk) {
          validatedCouponId = coupon.id
          if (coupon.discountType === 'PERCENTAGE') {
            discountTotal = Math.round((calculatedSubtotal * coupon.discountValue) / 100)
            if (coupon.maximumDiscount && discountTotal > coupon.maximumDiscount) {
              discountTotal = coupon.maximumDiscount
            }
          } else {
            discountTotal = Math.min(coupon.discountValue, calculatedSubtotal)
          }
        }
      }
    }

    const grandTotal = Math.max(0, calculatedSubtotal - discountTotal + finalShippingFee)
    const publicRef = generatePublicRef()

    // 7. Atomic Transaction: Create Order, Decrement Stock, Record Event
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock for each item
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        })
      }

      // Increment coupon usage if used
      if (validatedCouponId) {
        await tx.coupon.update({
          where: { id: validatedCouponId },
          data: { usageCount: { increment: 1 } },
        })
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          publicReference: publicRef,
          idempotencyKey,
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          deliveryAddress,
          district,
          area: area || null,
          deliveryInstructions: deliveryInstructions || null,
          shippingZoneId,
          paymentMethod,
          paymentStatus: 'UNPAID',
          status: 'PENDING',
          subtotal: calculatedSubtotal,
          discountTotal,
          shippingFee: finalShippingFee,
          grandTotal,
          couponCode: couponCode ? couponCode.trim().toUpperCase() : null,
          couponId: validatedCouponId || null,
          items: {
            create: orderItemsToCreate,
          },
          statusEvents: {
            create: {
              action: 'ORDER_PLACED',
              newValue: 'PENDING',
              note: `Guest order placed via Cash on Delivery for ৳${grandTotal.toLocaleString('en-BD')}`,
            },
          },
        },
      })

      return newOrder
    })

    return NextResponse.json({
      success: true,
      publicReference: order.publicReference,
      grandTotal: order.grandTotal,
    })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: 'An error occurred while processing your order. Please try again.' },
      { status: 500 }
    )
  }
}
