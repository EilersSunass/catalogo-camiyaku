import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { Role } from '@/types/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error('Credenciales inválidas')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Credenciales inválidas')
        }

        // Registrar login en auditoría
        await prisma.auditLog.create({
          data: {
            entity: 'User',
            entityId: user.id,
            action: 'LOGIN',
            userId: user.id,
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const email = user.email
        if (!email) return false

        // Verificar si el usuario ya existe
        let dbUser = await prisma.user.findUnique({
          where: { email },
        })

        // Si no existe, crear usuario
        if (!dbUser) {
          const allowedDomain = process.env.ALLOWED_DOMAIN || 'sunass.gob.pe'
          const emailDomain = email.split('@')[1]
          
          // Asignar rol USER por defecto si es del dominio permitido
          const role = emailDomain === allowedDomain ? 'USER' : 'USER'

          dbUser = await prisma.user.create({
            data: {
              email,
              name: user.name || email.split('@')[0],
              role,
              emailVerified: new Date(),
            },
          })
        }

        // Registrar login
        await prisma.auditLog.create({
          data: {
            entity: 'User',
            entityId: dbUser.id,
            action: 'LOGIN',
            userId: dbUser.id,
          },
        })
      }

      return true
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      } else if (token.email) {
        // Actualizar el rol desde la base de datos en cada request
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
        }
      }
      return token
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
