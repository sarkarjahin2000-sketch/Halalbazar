import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Tag, Plus, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function createCouponAction(formData: FormData) {
  'use server'
  const code = (formData.get('code') as string)?.trim().toUpperCase()
  const discountType = formData.get('discountType') as string
  const discountValue = parseInt(formData.get('discountValue') as string, 10)
  const minimumOrderAmount = parseInt(formData.get('minimumOrderAmount') as string || '0', 10)
  const maximumDiscount = formData.get('maximumDiscount') ? parseInt(formData.get('maximumDiscount') as string, 10) : null
  const description = formData.get('description') as string

  if (!code || isNaN(discountValue)) return

  await prisma.coupon.create({
    data: {
      code,
      discountType: discountType || 'PERCENTAGE',
      discountValue,
      minimumOrderAmount,
      maximumDiscount,
      description: description || null,
      isActive: true,
    },
  })

  revalidatePath('/admin/coupons')
}

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Coupons &amp; Promotions
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Create promotional discount vouchers for first-time or returning customers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coupons List */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl bg-white border border-stone-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Coupon Code</th>
                  <th className="py-3 px-4 font-semibold">Discount</th>
                  <th className="py-3 px-4 font-semibold">Min Order</th>
                  <th className="py-3 px-4 font-semibold">Usage</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-700">
                      {c.code}
                      {c.description && (
                        <span className="block text-[11px] text-stone-400 font-sans font-normal">
                          {c.description}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `৳${c.discountValue}`}
                      {c.maximumDiscount && (
                        <span className="text-[10px] text-stone-400 font-normal block">
                          Up to ৳{c.maximumDiscount}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-stone-700">
                      ৳{c.minimumOrderAmount.toLocaleString('en-BD')}
                    </td>
                    <td className="py-3.5 px-4 text-stone-700 font-semibold">
                      {c.usageCount} {c.usageLimit ? `/ ${c.usageLimit}` : 'times'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Coupon Form */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600" />
              Create Coupon
            </h2>
            <form action={createCouponAction} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  name="code"
                  required
                  placeholder="e.g. EID20"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono uppercase focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Type</label>
                  <select
                    name="discountType"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-amber-600"
                  >
                    <option value="PERCENTAGE">Percent (%)</option>
                    <option value="FIXED">Flat (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Value *</label>
                  <input
                    type="number"
                    name="discountValue"
                    required
                    min={1}
                    placeholder="10"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Min Order (৳)</label>
                  <input
                    type="number"
                    name="minimumOrderAmount"
                    defaultValue="500"
                    min={0}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Max Discount (৳)</label>
                  <input
                    type="number"
                    name="maximumDiscount"
                    placeholder="300"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="e.g. 10% discount on Eid orders"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-sm"
              >
                Create Promo Coupon
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
