import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Users, Phone, ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  const orders = await prisma.order.findMany({
    select: {
      customerName: true,
      customerPhone: true,
      customerEmail: true,
      district: true,
      grandTotal: true,
      createdAt: true,
      status: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Group by phone
  const customerMap = new Map<
    string,
    {
      name: string
      phone: string
      email?: string | null
      district: string
      orderCount: number
      totalSpent: number
      lastOrderDate: Date
    }
  >()

  for (const o of orders) {
    const existing = customerMap.get(o.customerPhone)
    if (existing) {
      existing.orderCount += 1
      if (o.status !== 'CANCELLED') existing.totalSpent += o.grandTotal
      if (o.createdAt > existing.lastOrderDate) existing.lastOrderDate = o.createdAt
    } else {
      customerMap.set(o.customerPhone, {
        name: o.customerName,
        phone: o.customerPhone,
        email: o.customerEmail,
        district: o.district,
        orderCount: 1,
        totalSpent: o.status !== 'CANCELLED' ? o.grandTotal : 0,
        lastOrderDate: o.createdAt,
      })
    }
  }

  const customers = Array.from(customerMap.values())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Customer Directory
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          {customers.length} unique customers acquired via guest checkout
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-stone-200 shadow-sm overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">
            No customer records yet. As customers check out, their purchase history will be collected here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Customer Name</th>
                  <th className="py-3 px-4 font-semibold">Phone Number</th>
                  <th className="py-3 px-4 font-semibold">District</th>
                  <th className="py-3 px-4 font-semibold">Orders Count</th>
                  <th className="py-3 px-4 font-semibold">Total Spent (BDT)</th>
                  <th className="py-3 px-4 font-semibold">Last Order</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customers.map((c) => (
                  <tr key={c.phone} className="hover:bg-stone-50/60">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{c.name}</div>
                      {c.email && <div className="text-stone-400 text-[11px]">{c.email}</div>}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-amber-800">
                      {c.phone}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">{c.district}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-800">
                      {c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">
                      ৳{c.totalSpent.toLocaleString('en-BD')}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                      {new Date(c.lastOrderDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders?q=${encodeURIComponent(c.phone)}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>View Orders</span>
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
