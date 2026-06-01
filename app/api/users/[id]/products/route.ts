import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canManageUsers } from '@/lib/permissions'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    if (!canManageUsers(session.user.role)) {
      return NextResponse.json({ error: 'No tienes permisos para gestionar usuarios' }, { status: 403 })
    }

    const access = await prisma.userProductAccess.findMany({
      where: { userId: params.id },
      select: { productId: true },
    })

    return NextResponse.json(access.map((a) => a.productId))
  } catch (error) {
    console.error('Error fetching user product access:', error)
    return NextResponse.json({ error: 'Error al obtener productos asignados' }, { status: 500 })
  }
}

// Reemplaza todos los productos asignados al usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    if (!canManageUsers(session.user.role)) {
      return NextResponse.json({ error: 'No tienes permisos para gestionar usuarios' }, { status: 403 })
    }

    const body = await request.json()
    const { productIds } = body

    if (!Array.isArray(productIds)) {
      return NextResponse.json({ error: 'productIds debe ser un array' }, { status: 400 })
    }

    // Reemplazar asignaciones en una transacción
    await prisma.$transaction([
      prisma.userProductAccess.deleteMany({ where: { userId: params.id } }),
      ...(productIds.length > 0
        ? [
            prisma.userProductAccess.createMany({
              data: productIds.map((productId: string) => ({
                userId: params.id,
                productId,
              })),
              skipDuplicates: true,
            }),
          ]
        : []),
    ])

    return NextResponse.json({ success: true, count: productIds.length })
  } catch (error) {
    console.error('Error updating user product access:', error)
    return NextResponse.json({ error: 'Error al actualizar productos asignados' }, { status: 500 })
  }
}
