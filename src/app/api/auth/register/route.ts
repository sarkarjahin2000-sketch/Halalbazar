import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, phone } = body

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existing) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: name?.trim() || null,
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone?.trim() || null,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: newUser,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    const isDbError =
      error?.message?.includes('database') ||
      error?.message?.includes('connect') ||
      error?.message?.includes('Prisma') ||
      error?.message?.includes('ENOTFOUND') ||
      error?.code === 'P1001'

    return NextResponse.json(
      {
        message: isDbError
          ? 'ডাটাবেজ সংযোগ পাওয়া যায়নি। দয়া করে Vercel Settings-এ Supabase DATABASE_URL যুক্ত করুন।'
          : error?.message || 'Failed to create account. Please try again.',
      },
      { status: 500 }
    )
  }
}
