import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')?.trim().toUpperCase()
    const amountStr = searchParams.get('amount')
    const orderAmount = amountStr ? parseInt(amountStr, 10) : 0

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    })

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: 'Invalid or inactive coupon code' }, { status: 404 })
    }

    const now = new Date()
    if (coupon.startsAt && now < coupon.startsAt) {
      return NextResponse.json({ error: 'This coupon is not active yet' }, { status: 400 })
    }

    if (coupon.expiresAt && now > coupon.expiresAt) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 })
    }

    if (orderAmount < coupon.minimumOrderAmount) {
      return NextResponse.json(
        {
          error: `Minimum order amount of ৳${coupon.minimumOrderAmount} required for this coupon`,
        },
        { status: 400 }
      )
    }

    let discountAmount = 0
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = Math.round((orderAmount * coupon.discountValue) / 100)
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, orderAmount)
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount,
    })
  } catch (err: any) {
    console.error('Coupon validation error:', err)
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 })
  }
}
