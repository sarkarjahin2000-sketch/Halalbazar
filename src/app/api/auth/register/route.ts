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

    let hint = 'Vercel Settings-এ DATABASE_URL চেক করুন।'
    const errText = error?.message || String(error)

    if (!process.env.DATABASE_URL || errText.includes('Environment variable not found')) {
      hint = 'Vercel-এ DATABASE_URL ভেরিয়েবল যোগ করা হয়নি অথবা Redeploy করা হয়নি।'
    } else if (errText.includes('does not exist') || errText.includes('relation')) {
      hint = 'Supabase-এ টেবিল তৈরি করা হয়নি (supabase_setup.sql রান করুন)।'
    } else if (errText.includes('Authentication failed') || errText.includes('password')) {
      hint = 'Supabase ডাটাবেজ পাসওয়ার্ড ভুল।'
    } else if (errText.includes('Can\'t reach') || errText.includes('P1001') || errText.includes('ENOTFOUND')) {
      hint = 'Supabase সার্ভার কানেক্ট করা যাচ্ছে না (ইউআরএল বা পাসওয়ার্ড চেক করুন)।'
    }

    return NextResponse.json(
      {
        message: `ডাটাবেজ সংযোগ ত্রুটি: ${hint}`,
        debug: errText.slice(0, 150),
      },
      { status: 500 }
    )
  }
}
