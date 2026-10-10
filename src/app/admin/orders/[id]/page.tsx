import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater'
import { ArrowLeft, Clock, Phone, MapPin, Package, ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface AdminOrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      shippingZone: true,
      statusEvents: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Order {order.publicReference}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()} via Guest Checkout
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200 uppercase">
              {order.status}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-stone-100 text-stone-800 border border-stone-200">
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Status Updater */}
      <OrderStatusUpdater
        orderId={order.id}
        currentStatus={order.status}
        currentPaymentStatus={order.paymentStatus}
      />

      {/* Order Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Customer & Delivery Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
              Customer Contact
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-400 block mb-0.5">Name:</span>
                <span className="font-bold text-stone-900 text-sm">{order.customerName}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">Phone (Call for verification):</span>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="font-mono font-bold text-amber-700 text-sm hover:underline"
                >
                  {order.customerPhone}
                </a>
              </div>
              {order.customerEmail && (
                <div>
                  <span className="text-stone-400 block mb-0.5">Email:</span>
                  <span className="text-stone-700">{order.customerEmail}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
              Delivery Address &amp; Zone
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-400 block mb-0.5">Destination District:</span>
                <span className="font-bold text-stone-800">{order.district}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">Full Street Address:</span>
                <p className="font-semibold text-stone-900 leading-relaxed">{order.deliveryAddress}</p>
              </div>
              {order.area && (
                <div>
                  <span className="text-stone-400 block mb-0.5">Area / Thana:</span>
                  <span className="text-stone-800">{order.area}</span>
                </div>
              )}
              {order.deliveryInstructions && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-amber-800 font-bold block mb-0.5">Rider Delivery Note:</span>
                  <p className="text-amber-900 italic">{order.deliveryInstructions}</p>
                </div>
              )}
              <div>
                <span className="text-stone-400 block mb-0.5">Shipping Zone:</span>
                <span className="text-stone-700">
                  {order.shippingZone?.name} ({order.shippingZone?.estimatedDays})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Items and Audit History */}
        <div className="lg:col-span-7 space-y-6">
          {/* Items breakdown */}
          <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
              Purchased Line Items ({order.items.length})
            </h3>
            <div className="divide-y divide-stone-100 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-stone-900 text-sm">{item.productNameSnapshot}</p>
                    <p className="text-stone-400">
                      {item.skuSnapshot ? `SKU: ${item.skuSnapshot} • ` : ''}
                      {item.quantity} × ৳{item.unitPriceSnapshot.toLocaleString('en-BD')}
                    </p>
                  </div>
                  <span className="font-extrabold text-stone-900 text-sm">
                    ৳{item.lineTotal.toLocaleString('en-BD')}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-stone-900">৳{order.subtotal.toLocaleString('en-BD')}</span>
              </div>
              {order.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({order.couponCode || 'PROMO'}):</span>
                  <span className="font-bold">-৳{order.discountTotal.toLocaleString('en-BD')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="font-bold text-stone-900">
                  {order.shippingFee === 0 ? 'FREE' : `৳${order.shippingFee.toLocaleString('en-BD')}`}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between text-sm font-extrabold text-stone-900">
                <span>Grand Total to Collect (Cash on Delivery):</span>
                <span className="text-base text-amber-700">৳{order.grandTotal.toLocaleString('en-BD')}</span>
              </div>
            </div>
          </div>

          {/* Timeline Events Log */}
          <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
              Audit &amp; Status Timeline
            </h3>
            <div className="space-y-4">
              {order.statusEvents.map((evt) => (
                <div key={evt.id} className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3 h-3 text-stone-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{evt.action}</span>
                      {evt.newValue && (
                        <span className="font-mono text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">
                          {evt.newValue}
                        </span>
                      )}
                      <span className="text-[10px] text-stone-400">
                        {new Date(evt.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {evt.note && <p className="text-stone-600 mt-0.5">{evt.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
