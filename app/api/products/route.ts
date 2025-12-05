import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { productSchema, productFilterSchema } from '@/lib/validations/product'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const searchParams = request.nextUrl.searchParams

    // Convertir searchParams a objeto
    const params: any = {}
    searchParams.forEach((value, key) => {
      if (key === 'tags') {
        // Manejar tags como array
        if (!params.tags) params.tags = []
        params.tags.push(value)
      } else {
        params[key] = value
      }
    })

    const filters = productFilterSchema.parse(params)

    // Construir where clause
    const where: Prisma.ProductWhereInput = {}

    // Filtro de visibilidad
    if (!session) {
      // Usuario anónimo: solo PUBLIC
      where.visibility = 'PUBLIC'
    } else {
      const role = session.user.role
      if (role === 'ADMIN' || role === 'CAMI_YAKU') {
        // Admin/CamiYaku: ven todo (no filtro de visibilidad por defecto)
      } else {
        // Usuario registrado normal: PUBLIC + EXTERNAL (e INTERNAL legacy)
        where.visibility = {
          in: ['PUBLIC', 'EXTERNAL', 'INTERNAL'],
        }
      }
    }

    // Búsqueda por texto
    if (filters.q) {
      where.OR = [
        { name: { contains: filters.q } },
        { description: { contains: filters.q } },
        { tags: { some: { tag: { name: { contains: filters.q } } } } },
      ]
    }

    // Filtros específicos
    if (filters.type) where.type = filters.type
    if (filters.status) where.status = filters.status
    if (filters.visibility && session) where.visibility = filters.visibility
    if (filters.eps) where.eps = { contains: filters.eps }
    if (filters.region) where.region = { contains: filters.region }
    if (filters.district) where.district = { contains: filters.district }
    if (filters.topic) where.topic = { contains: filters.topic }
    if (filters.period) where.period = { contains: filters.period }
    if (filters.owner) where.owner = { contains: filters.owner }

    // Filtro por tags
    if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            name: {
              in: filters.tags,
            },
          },
        },
      }
    }

    // Paginación
    const skip = (filters.page - 1) * filters.pageSize
    const take = filters.pageSize

    // Ordenamiento
    const orderBy: Prisma.ProductOrderByWithRelationInput = {}
    orderBy[filters.sortBy] = filters.sortOrder

    // Ejecutar query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        total,
        totalPages: Math.ceil(total / filters.pageSize),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const data = productSchema.parse(body)

    // Procesar tags
    const tagNames = data.tags || []
    const tags = await Promise.all(
      tagNames.map(async (name) => {
        const tag = await prisma.tag.upsert({
          where: { name },
          create: { name },
          update: {},
        })
        return tag
      })
    )

    // Crear producto
    const product = await prisma.product.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        url: data.url || null,
        owner: data.owner,
        status: data.status,
        visibility: data.visibility,
        eps: data.eps,
        region: data.region,
        district: data.district,
        topic: data.topic,
        period: data.period,
        source: data.source,
        createdById: session.user.id,
        tags: {
          create: tags.map((tag) => ({
            tag: { connect: { id: tag.id } },
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Registrar en auditoría
    await prisma.auditLog.create({
      data: {
        entity: 'Product',
        entityId: product.id,
        action: 'CREATE',
        userId: session.user.id,
        productId: product.id,
        diff: JSON.stringify({ created: true }),
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}
