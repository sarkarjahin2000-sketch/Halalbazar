import { prisma } from '@/lib/db'
import OrderSuccessContent from '@/components/cart/OrderSuccessContent'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface OrderSuccessPageProps {
  params: Promise<{
    publicReference: string
  }>
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { publicReference } = await params

  const order = await prisma.order.findUnique({
    where: { publicReference },
    include: {
      items: true,
      shippingZone: true,
    },
  })

  if (!order) {
    notFound()
  }

  return <OrderSuccessContent order={order} />
}
