import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { publicReference, customerPhone } = await request.json()

    if (!publicReference || !customerPhone) {
      return NextResponse.json(
        { error: 'Order reference and phone number are required' },
        { status: 400 }
      )
    }

    // Clean phone numbers
    const cleanPhone = customerPhone.replace(/\D/g, '')

    const order = await prisma.order.findUnique({
      where: { publicReference: publicReference.trim().toUpperCase() },
      include: {
        items: true,
        statusEvents: {
          orderBy: { createdAt: 'desc' },
        },
        shippingZone: {
          select: { name: true, estimatedDays: true },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'No order found with the provided reference number' },
        { status: 404 }
      )
    }

    // Check phone match (last 10 digits or exact match)
    const orderPhoneClean = order.customerPhone.replace(/\D/g, '')
    const isPhoneMatch =
      orderPhoneClean === cleanPhone ||
      (orderPhoneClean.length >= 10 &&
        cleanPhone.length >= 10 &&
        orderPhoneClean.slice(-10) === cleanPhone.slice(-10))

    if (!isPhoneMatch) {
      return NextResponse.json(
        { error: 'The phone number provided does not match the order records' },
        { status: 403 }
      )
    }

    // Return safe sanitized order details
    return NextResponse.json({
      success: true,
      order: {
        publicReference: order.publicReference,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        customerName: order.customerName,
        deliveryAddress: order.deliveryAddress,
        district: order.district,
        area: order.area,
        deliveryInstructions: order.deliveryInstructions,
        shippingZoneName: order.shippingZone?.name,
        estimatedDays: order.shippingZone?.estimatedDays,
        subtotal: order.subtotal,
        discountTotal: order.discountTotal,
        shippingFee: order.shippingFee,
        grandTotal: order.grandTotal,
        createdAt: order.createdAt,
        items: order.items.map((i) => ({
          id: i.id,
          name: i.productNameSnapshot,
          quantity: i.quantity,
          unitPrice: i.unitPriceSnapshot,
          lineTotal: i.lineTotal,
        })),
        events: order.statusEvents.map((e) => ({
          id: e.id,
          action: e.action,
          status: e.newValue || e.action,
          note: e.note,
          createdAt: e.createdAt,
        })),
      },
    })
  } catch (err: any) {
    console.error('Order tracking error:', err)
    return NextResponse.json({ error: 'Failed to look up order' }, { status: 500 })
  }
}
