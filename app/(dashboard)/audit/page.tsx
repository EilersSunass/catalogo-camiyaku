import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { canViewAudit } from '@/lib/permissions'
import { AuditClient } from './audit-client'

export default async function AuditPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login?callbackUrl=/audit')
  }

  if (!canViewAudit(session.user.role)) {
    redirect('/products')
  }

  return (
    <div className="container py-8">
      <AuditClient />
    </div>
  )
}
