import { prisma } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Package } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true } },
      images: { orderBy: { sortOrder: 'asc' } },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage store inventory, prices, and stock levels ({products.length} products total)
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="rounded-3xl bg-white border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Price (BDT)</th>
                <th className="py-3 px-4 font-semibold">Stock</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Featured</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => {
                const img =
                  p.images[0]?.url ||
                  'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=200&q=80'

                return (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                          <Image src={img} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-xs line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            {p.sku || p.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {p.category?.name || 'Uncategorized'}
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">
                      ৳{p.price.toLocaleString('en-BD')}
                      {p.compareAtPrice && (
                        <span className="text-[10px] text-stone-400 line-through ml-1.5">
                          ৳{p.compareAtPrice.toLocaleString('en-BD')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          p.stockQuantity <= 0
                            ? 'bg-rose-100 text-rose-800'
                            : p.stockQuantity <= 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stockQuantity} in stock
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {p.isFeatured ? (
                        <span className="text-amber-600 font-bold text-[11px]">★ Yes</span>
                      ) : (
                        <span className="text-stone-300 text-[11px]">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
