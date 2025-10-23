import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { canManageUsers } from '@/lib/permissions'
import { UsersClient } from './users-client'

interface UsersPageProps {
  searchParams: { setup?: string }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  // Modo de configuración inicial: permite acceso sin autenticación
  const isSetupMode = searchParams.setup === 'true'
  
  if (!isSetupMode) {
    const session = await getServerSession(authOptions)

    if (!session) {
      redirect('/login?callbackUrl=/users')
    }

    if (!canManageUsers(session.user.role)) {
      redirect('/products')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container py-8">
        {isSetupMode && (
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              ⚠️ Modo de Configuración Inicial
            </h2>
            <p className="text-sm text-yellow-700 mb-2">
              Esta es una ruta de emergencia para crear el primer usuario administrador.
            </p>
            <p className="text-sm text-yellow-700 font-semibold">
              ⚠️ IMPORTANTE: Una vez que hayas creado tu usuario admin, elimina el parámetro ?setup=true de la URL por seguridad.
            </p>
          </div>
        )}
        <UsersClient />
      </div>
    </div>
  )
}
