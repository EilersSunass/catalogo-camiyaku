import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { auditFilterSchema } from '@/lib/validations/audit'
import { canViewAudit } from '@/lib/permissions'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    if (!canViewAudit(session.user.role)) {
      return NextResponse.json(
        { error: 'No tienes permisos para ver la auditoría' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const params: any = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })

    const filters = auditFilterSchema.parse(params)

    // Construir where clause
    const where: Prisma.AuditLogWhereInput = {}

    if (filters.action) where.action = filters.action
    if (filters.userId) where.userId = filters.userId
    if (filters.entity) where.entity = filters.entity

    if (filters.startDate || filters.endDate) {
      where.timestamp = {}
      if (filters.startDate) {
        where.timestamp.gte = new Date(filters.startDate)
      }
      if (filters.endDate) {
        where.timestamp.lte = new Date(filters.endDate)
      }
    }

    // Paginación
    const skip = (filters.page - 1) * filters.pageSize
    const take = filters.pageSize

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        skip,
        take,
      }),
      prisma.auditLog.count({ where }),
    ])

    return NextResponse.json({
      logs,
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        total,
        totalPages: Math.ceil(total / filters.pageSize),
      },
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json({ error: 'Error al obtener logs de auditoría' }, { status: 500 })
  }
}
