import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Plus, Layers } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function createCategoryAction(formData: FormData) {
  'use server'
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string

  if (!name || !slug) return

  await prisma.category.create({
    data: {
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      description: description || null,
      isActive: true,
    },
  })

  revalidatePath('/admin/categories')
}

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { products: true } },
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Category Collections
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Organize your natural honey, dry fruits, and spices into storefront collections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Categories List */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl bg-white border border-stone-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Slug</th>
                  <th className="py-3 px-4 font-semibold">Products</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/60">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{c.name}</div>
                      <div className="text-stone-400 text-[11px] line-clamp-1">{c.description}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-600">/categories/{c.slug}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-800">
                      {c._count.products} products
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

        {/* Add Category Form */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" />
              Add Category
            </h2>
            <form action={createCategoryAction} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Organic Seeds"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  required
                  placeholder="organic-seeds"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Short description for category header..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-sm"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
