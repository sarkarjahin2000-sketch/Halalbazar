'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check, Trash2, ArrowLeft } from 'lucide-react'

interface ProductFormProps {
  categories: Array<{ id: string; name: string }>
  initialData?: {
    id: string
    name: string
    slug: string
    sku?: string | null
    price: number
    compareAtPrice?: number | null
    stockQuantity: number
    categoryId?: string | null
    description?: string | null
    imageUrl?: string
    isFeatured: boolean
    status: string
  }
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter()
  const isEditing = Boolean(initialData)

  const [name, setName] = useState(initialData?.name || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [sku, setSku] = useState(initialData?.sku || '')
  const [price, setPrice] = useState(initialData?.price?.toString() || '')
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialData?.compareAtPrice ? initialData.compareAtPrice.toString() : ''
  )
  const [stockQuantity, setStockQuantity] = useState(
    initialData?.stockQuantity !== undefined ? initialData.stockQuantity.toString() : '50'
  )
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl ||
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
  )
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false)
  const [status, setStatus] = useState(initialData?.status || 'ACTIVE')
  const [saving, setSaving] = useState(false)

  const handleNameChange = (val: string) => {
    setName(val)
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        name,
        slug,
        sku: sku || undefined,
        price: parseInt(price, 10),
        compareAtPrice: compareAtPrice ? parseInt(compareAtPrice, 10) : null,
        stockQuantity: parseInt(stockQuantity, 10),
        categoryId: categoryId || null,
        description,
        imageUrl,
        isFeatured,
        status,
      }

      const url = isEditing
        ? `/api/admin/products/${initialData?.id}`
        : '/api/admin/products'

      const method = isEditing ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to save product')
      } else {
        toast.success(isEditing ? 'Product updated successfully!' : 'Product created!')
        router.push('/admin/products')
        router.refresh()
      }
    } catch {
      toast.error('Network error while saving product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return
    if (!confirm('Are you sure you want to permanently delete this product?')) return

    try {
      const res = await fetch(`/api/admin/products/${initialData.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        toast.error('Failed to delete product')
      } else {
        toast.success('Product deleted')
        router.push('/admin/products')
        router.refresh()
      }
    } catch {
      toast.error('Error deleting product')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Product Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Pure Sidr Honey"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              URL Slug <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="pure-sidr-honey"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-mono text-xs focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              SKU Code
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="HNY-SIDR-500"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-mono text-xs focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Selling Price (BDT ৳) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="850"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-600 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Compare-At Price (৳)
            </label>
            <input
              type="number"
              min={1}
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="1000"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Stock Quantity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min={0}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              placeholder="50"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:border-amber-600"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Visibility Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:border-amber-600"
            >
              <option value="ACTIVE">ACTIVE (Visible in shop)</option>
              <option value="DRAFT">DRAFT (Hidden)</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Product Photo URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description, tasting notes, sourcing..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-600 resize-none"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Showcase as Featured Product on Homepage</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
        >
          {saving ? (
            <span>Saving...</span>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Product Changes' : 'Create Product'}</span>
            </>
          )}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Product</span>
          </button>
        )}
      </div>
    </form>
  )
}
