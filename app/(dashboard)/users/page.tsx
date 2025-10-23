import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { canManageUsers } from '@/lib/permissions'
import { UsersClient } from './users-client'

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login?callbackUrl=/users')
  }

  if (!canManageUsers(session.user.role)) {
    redirect('/products')
  }

  return (
    <div className="container py-8">
      <UsersClient />
    </div>
  )
}
