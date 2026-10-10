import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const inputEmail = email.trim().toLowerCase()
    const masterEmail = (process.env.ADMIN_EMAIL || 'sarkarjahin2000@gmail.com').toLowerCase().trim()
    const masterPassword = process.env.ADMIN_PASSWORD || 'Admin@1234!'

    // 1. Direct master credentials check (Guarantees admin can always log in even if DB is not connected yet)
    if (inputEmail === masterEmail && password === masterPassword) {
      // Try to sync with DB if reachable, otherwise continue smoothly
      try {
        await prisma.adminUser.upsert({
          where: { email: masterEmail },
          update: { lastLoginAt: new Date() },
          create: {
            email: masterEmail,
            passwordHash: await bcrypt.hash(masterPassword, 10),
            name: 'জোবাইদুর রহমান জাহিন (Zobaidur Rahman Jahin)',
            role: 'ADMIN',
          },
        })
      } catch (dbErr) {
        console.warn('Database not reachable yet, logged in via master credentials:', dbErr)
      }

      const response = NextResponse.json({
        success: true,
        user: {
          id: 'admin-master',
          email: masterEmail,
          name: 'জোবাইদুর রহমান জাহিন (Zobaidur Rahman Jahin)',
          role: 'ADMIN',
        },
      })

      response.cookies.set({
        name: 'shopbd_admin_session',
        value: `admin-master:${Date.now()}`,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    }

    // 2. Database credentials check (for other admin accounts if created in DB)
    let admin: any = null
    try {
      admin = await prisma.adminUser.findUnique({
        where: { email: inputEmail },
      })
    } catch (dbErr) {
      console.error('Database query failed during admin login:', dbErr)
      return NextResponse.json(
        { error: 'Database connection failed. Please ensure Supabase DATABASE_URL is set in Vercel settings.' },
        { status: 500 }
      )
    }

    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Update last login
    try {
      await prisma.adminUser.update({
        where: { id: admin.id },
        data: { lastLoginAt: new Date() },
      })
    } catch {}

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    })

    response.cookies.set({
      name: 'shopbd_admin_session',
      value: `${admin.id}:${Date.now()}`,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (err: any) {
    console.error('Admin login error:', err)
    return NextResponse.json(
      { error: err?.message || 'Server error during login' },
      { status: 500 }
    )
  }
}
