import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Eye, Search, Filter } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface AdminOrdersPageProps {
  searchParams: Promise<{
    status?: string
    q?: string
  }>
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status, q } = await searchParams

  const where: any = {}
  if (status && status !== 'ALL') {
    where.status = status
  }
  if (q) {
    where.OR = [
      { publicReference: { contains: q } },
      { customerPhone: { contains: q } },
      { customerName: { contains: q } },
    ]
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
      shippingZone: true,
    },
  })

  const statusOptions = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    CONFIRMED: 'bg-sky-100 text-sky-800 border-sky-200',
    PROCESSING: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
    DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    CANCELLED: 'bg-rose-100 text-rose-800 border-rose-200',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Order Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Total {orders.length} orders matching current filter
          </p>
        </div>

        {/* Search */}
        <form method="get" className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search reference, phone, name..."
              className="pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-600 bg-white"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-black transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {statusOptions.map((opt) => {
          const isSelected = (!status && opt === 'ALL') || status === opt

          return (
            <Link
              key={opt}
              href={`/admin/orders?${new URLSearchParams({
                ...(opt !== 'ALL' ? { status: opt } : {}),
                ...(q ? { q } : {}),
              }).toString()}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              {opt}
            </Link>
          )
        })}
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-white border border-stone-200 shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 px-4 font-semibold">Customer Details</th>
                  <th className="py-3 px-4 font-semibold">Delivery Address</th>
                  <th className="py-3 px-4 font-semibold">Total Amount</th>
                  <th className="py-3 px-4 font-semibold">Payment</th>
                  <th className="py-3 px-4 font-semibold">Order Status</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-800">
                      {ord.publicReference}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{ord.customerName}</div>
                      <div className="text-stone-500 font-mono text-[11px]">{ord.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="text-stone-700 line-clamp-1">{ord.deliveryAddress}</span>
                      <span className="text-stone-400 text-[11px]">{ord.district}</span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">
                      ৳{ord.grandTotal.toLocaleString('en-BD')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          statusColors[ord.status] || 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white font-semibold text-[11px] transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
