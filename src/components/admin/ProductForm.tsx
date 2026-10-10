'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check, Trash2, ArrowLeft, Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

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
  const fileInputRef = useRef<HTMLInputElement>(null)

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
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '')
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false)
  const [status, setStatus] = useState(initialData?.status || 'ACTIVE')
  const [saving, setSaving] = useState(false)

  // Image upload states
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null)

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

  // ── Image Upload Handler ──
  const uploadFile = useCallback(async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, WebP, GIF, AVIF images are allowed')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB')
      return
    }

    // Show local preview instantly
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Upload failed')
        setPreviewUrl(imageUrl || null)
        return
      }

      setImageUrl(data.url)
      setPreviewUrl(data.url)
      toast.success('Image uploaded successfully!')
    } catch {
      toast.error('Upload failed. Please try again.')
      setPreviewUrl(imageUrl || null)
    } finally {
      setUploading(false)
    }
  }, [imageUrl])

  // ── Drag & Drop Handlers ──
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      uploadFile(e.dataTransfer.files[0])
    }
  }, [uploadFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      uploadFile(e.target.files[0])
    }
  }, [uploadFile])

  const removeImage = useCallback(() => {
    setImageUrl('')
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

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

        {/* ── Product Image Upload ── */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Product Photo
          </label>

          {previewUrl ? (
            /* ── Preview Card ── */
            <div className="relative group rounded-2xl border-2 border-stone-200 overflow-hidden bg-stone-50 w-full max-w-xs">
              <div className="relative w-full aspect-square">
                <Image
                  src={previewUrl}
                  alt="Product preview"
                  fill
                  className="object-cover"
                  sizes="320px"
                  unoptimized
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-white" />
                      <span className="text-white text-xs font-bold">Uploading...</span>
                    </div>
                  </div>
                )}
              </div>
              {!uploading && (
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-stone-700 shadow-md transition-all"
                    title="Change image"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-1.5 rounded-lg bg-white/90 hover:bg-rose-50 text-rose-600 shadow-md transition-all"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <div className="px-3 py-2 bg-white border-t border-stone-100">
                <p className="text-[10px] text-stone-400 truncate">{imageUrl || 'Uploading...'}</p>
              </div>
            </div>
          ) : (
            /* ── Drag & Drop Zone ── */
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative cursor-pointer rounded-2xl border-2 border-dashed p-8
                flex flex-col items-center justify-center gap-3
                transition-all duration-200
                ${dragActive
                  ? 'border-amber-500 bg-amber-50/60 scale-[1.01]'
                  : 'border-stone-300 bg-stone-50/50 hover:border-amber-400 hover:bg-amber-50/30'
                }
              `}
            >
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
                ${dragActive ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-400'}
              `}>
                <ImageIcon className="w-7 h-7" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-stone-700">
                  {dragActive ? 'Drop image here' : 'Click to upload or drag & drop'}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  JPEG, PNG, WebP, GIF • Max 5MB
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold shadow-sm hover:bg-amber-700 transition-colors">
                  <Upload className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                  Browse Files
                </div>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onChange={handleFileSelect}
            className="hidden"
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
          disabled={saving || uploading}
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
