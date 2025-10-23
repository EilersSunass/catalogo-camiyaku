import { Role } from '@/types/prisma'
import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: Role
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string
    name?: string | null
    role: Role | string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: Role | string
  }
}
