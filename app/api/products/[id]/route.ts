import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations/product'
import { canDeleteProduct, canEditProduct } from '@/lib/permissions'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    const product = await prisma.product.findUnique({
      where: { id: params.id },
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
            role: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Verificar visibilidad
    if (product.visibility === 'INTERNAL' && !session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Verificar permisos
    if (!canEditProduct(session.user.role, product.createdById, session.user.id)) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar este producto' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = productSchema.parse(body)

    // Guardar estado anterior para auditoría
    const oldData = { ...product }

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

    // Actualizar producto
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
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
        tags: {
          deleteMany: {},
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
        entityId: updatedProduct.id,
        action: 'UPDATE',
        userId: session.user.id,
        productId: updatedProduct.id,
        diff: JSON.stringify({
          before: oldData,
          after: updatedProduct,
        }),
      },
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Verificar permisos - solo admin puede borrar
    if (!canDeleteProduct(session.user.role, product.createdById, session.user.id)) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar productos. Solo los administradores pueden hacerlo.' },
        { status: 403 }
      )
    }

    // Guardar datos para auditoría antes de borrar
    const deletedData = { ...product }

    // Eliminar producto
    await prisma.product.delete({
      where: { id: params.id },
    })

    // Registrar en auditoría
    await prisma.auditLog.create({
      data: {
        entity: 'Product',
        entityId: params.id,
        action: 'DELETE',
        userId: session.user.id,
        diff: JSON.stringify({ deleted: deletedData }),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 })
  }
}
