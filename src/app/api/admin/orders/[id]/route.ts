import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, paymentStatus, note } = body

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
    })

    // Create event log
    if (status && status !== existingOrder.status) {
      await prisma.orderStatusEvent.create({
        data: {
          orderId: id,
          action: 'STATUS_CHANGED',
          previousValue: existingOrder.status,
          newValue: status,
          note: note || `Admin updated status from ${existingOrder.status} to ${status}`,
        },
      })
    }

    return NextResponse.json({ success: true, order: updated })
  } catch (err: any) {
    console.error('Update order error:', err)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
