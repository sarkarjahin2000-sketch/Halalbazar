import { prisma } from '@/lib/db'
import Link from 'next/link'
import { ShoppingBag, TrendingUp, Package, Clock, ArrowRight, Eye, Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  let totalOrders = 0
  let pendingOrders = 0
  let totalProducts = 0
  let allOrders: any[] = []
  let recentOrders: any[] = []

  try {
    const [fetchedTotalOrders, fetchedPendingOrders, fetchedTotalProducts, fetchedAllOrders, fetchedRecentOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.product.count({ where: { status: 'ACTIVE' } }),
        prisma.order.findMany({ select: { grandTotal: true, status: true } }),
        prisma.order.findMany({
          take: 8,
          orderBy: { createdAt: 'desc' },
          include: { items: true },
        }),
      ])
    totalOrders = fetchedTotalOrders
    pendingOrders = fetchedPendingOrders
    totalProducts = fetchedTotalProducts
    allOrders = fetchedAllOrders
    recentOrders = fetchedRecentOrders
  } catch (dbErr) {
    console.error('Failed to query admin stats from database:', dbErr)
  }

  const totalRevenue = allOrders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.grandTotal, 0)

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    CONFIRMED: 'bg-sky-100 text-sky-800 border-sky-200',
    PROCESSING: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
    DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    CANCELLED: 'bg-rose-100 text-rose-800 border-rose-200',
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Store Overview
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time business performance and pending fulfillment tasks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-stone-900">
            ৳{totalRevenue.toLocaleString('en-BD')}
          </span>
          <span className="text-[11px] text-stone-400 mt-1">From completed &amp; pending orders</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-amber-600">
            {pendingOrders}
          </span>
          <span className="text-[11px] text-stone-400 mt-1">Requires phone confirmation</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-stone-900">
            {totalOrders}
          </span>
          <span className="text-[11px] text-stone-400 mt-1">Guest checkout volume</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Products</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-stone-900">
            {totalProducts}
          </span>
          <span className="text-[11px] text-stone-400 mt-1">Listed in public storefront</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Recent Customer Orders</h2>
            <p className="text-xs text-stone-500">Latest orders placed through guest checkout</p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
          >
            <span>View all orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-xs">
            No orders placed yet. Orders will appear here in real-time as customers check out.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">District</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Total (BDT)</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-800">
                      {ord.publicReference}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{ord.customerName}</div>
                      <div className="text-stone-400">{ord.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">{ord.district}</td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {ord.items?.reduce((s: number, i: any) => s + (i.quantity || 1), 0) || 0} items
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      ৳{ord.grandTotal.toLocaleString('en-BD')}
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
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] transition-colors"
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
