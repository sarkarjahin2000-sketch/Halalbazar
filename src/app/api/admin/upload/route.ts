import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// Max file size: 5MB
const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, GIF, and AVIF are allowed.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${nanoid(12)}.${ext}`

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Try Supabase Storage first, fallback to local storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (
      supabaseUrl &&
      supabaseKey &&
      !supabaseKey.startsWith('[') // Skip if placeholder
    ) {
      // ── Supabase Storage Upload ──
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)
      const BUCKET = 'product-images'
      const filePath = `products/${fileName}`

      // Ensure bucket exists
      await supabase.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: MAX_SIZE,
        allowedMimeTypes: ALLOWED_TYPES,
      })

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: true,
        })

      if (error) {
        console.error('Supabase upload error:', error)
        return NextResponse.json(
          { error: `Upload failed: ${error.message}` },
          { status: 500 }
        )
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(data.path)

      return NextResponse.json({
        success: true,
        url: urlData.publicUrl,
        storage: 'supabase',
      })
    } else {
      // ── Local Storage Fallback (development) ──
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products')

      // Create directory if it doesn't exist
      await mkdir(uploadsDir, { recursive: true })

      const filePath = path.join(uploadsDir, fileName)
      await writeFile(filePath, buffer)

      const publicUrl = `/uploads/products/${fileName}`

      return NextResponse.json({
        success: true,
        url: publicUrl,
        storage: 'local',
      })
    }
  } catch (err: any) {
    console.error('Upload API error:', err)
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}
