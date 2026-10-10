import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  // NOTE: PrismaAdapter removed intentionally.
  // With JWT strategy + Credentials provider, the adapter causes "Server error"
  // because it tries to create Account/Session DB records for credential logins
  // which don't have OAuth tokens. JWT sessions are stored in cookies instead.

  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        const email = String(credentials.email).toLowerCase().trim()
        const password = String(credentials.password)

        const masterEmail = (process.env.ADMIN_EMAIL || 'sarkarjahin2000@gmail.com').toLowerCase().trim()
        const masterPassword = process.env.ADMIN_PASSWORD || 'Admin@1234!'

        // 1. Direct Master Admin check (env variables)
        if (email === masterEmail && password === masterPassword) {
          try {
            await prisma.user.upsert({
              where: { email: masterEmail },
              update: { role: 'ADMIN', name: 'জোবাইদুর রহমান জাহিন (Admin)' },
              create: {
                email: masterEmail,
                name: 'জোবাইদুর রহমান জাহিন (Admin)',
                role: 'ADMIN',
              },
            })
            await prisma.adminUser.upsert({
              where: { email: masterEmail },
              update: { lastLoginAt: new Date() },
              create: {
                email: masterEmail,
                passwordHash: await bcrypt.hash(masterPassword, 10),
                name: 'জোবাইদুর রহমান জাহিন (Admin)',
                role: 'ADMIN',
              },
            })
          } catch (syncErr) {
            console.warn('Admin user sync warning (non-fatal):', syncErr)
          }

          return {
            id: 'admin-master',
            name: 'জোবাইদুর রহমান জাহিন (Admin)',
            email: masterEmail,
            role: 'ADMIN',
          }
        }

        // 2. Database AdminUser check
        try {
          const admin = await prisma.adminUser.findUnique({
            where: { email },
          })
          if (admin && admin.isActive) {
            const isValid = await bcrypt.compare(password, admin.passwordHash)
            if (isValid) {
              try {
                await prisma.adminUser.update({
                  where: { id: admin.id },
                  data: { lastLoginAt: new Date() },
                })
                await prisma.user.upsert({
                  where: { email: admin.email },
                  update: { role: 'ADMIN', name: admin.name },
                  create: {
                    email: admin.email,
                    name: admin.name,
                    role: 'ADMIN',
                  },
                })
              } catch {}

              return {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: 'ADMIN',
              }
            }
          }
        } catch (adminErr) {
          console.warn('AdminUser lookup warning:', adminErr)
        }

        // 3. Regular User database check
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.password) {
            return null
          }

          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role || 'USER',
          }
        } catch (error) {
          console.error('Authorize error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      // For Google OAuth: create or link the user in our DB
      if (account?.provider === 'google' && user.email) {
        const normalizedEmail = user.email.toLowerCase().trim()
        const masterEmail = (process.env.ADMIN_EMAIL || 'sarkarjahin2000@gmail.com').toLowerCase().trim()
        const isMaster = normalizedEmail === masterEmail

        try {
          const adminRecord = await prisma.adminUser.findUnique({
            where: { email: normalizedEmail },
          }).catch(() => null)

          const isAdmin = isMaster || Boolean(adminRecord && adminRecord.isActive)
          const targetRole = isAdmin ? 'ADMIN' : 'USER'

          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (!existingUser) {
            // Create a new user for Google sign-in
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || null,
                image: user.image || null,
                role: targetRole,
              },
            })
            user.id = newUser.id
            ;(user as any).role = newUser.role
          } else {
            // If admin, update role to ADMIN
            if (isAdmin && existingUser.role !== 'ADMIN') {
              await prisma.user.update({
                where: { email: user.email },
                data: { role: 'ADMIN' },
              })
              existingUser.role = 'ADMIN'
            }
            // Use existing user data
            user.id = existingUser.id
            ;(user as any).role = existingUser.role
          }
        } catch (error) {
          console.error('Google sign-in DB error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'USER'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        ;(session.user as any).role = (token.role as string) || 'USER'
      }
      return session
    },
  },
  trustHost: true,
})
