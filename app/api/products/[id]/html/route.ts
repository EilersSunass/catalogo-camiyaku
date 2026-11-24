import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { del, head, list } from '@vercel/blob'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canEditProduct } from '@/lib/permissions'
import { htmlPrefix, isOwnHtmlPath } from '@/lib/product-access'

const confirmSchema = z.object({
  pathname: z.string().min(1),
  name: z.string().min(1).max(255),
})

async function loadEditable(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: NextResponse.json({ error: 'No autenticado' }, { status: 401 }) }
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return { error: NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 }) }
  if (!canEditProduct(session.user.role, product.createdById, session.user.id)) {
    return { error: NextResponse.json({ error: 'No tienes permisos para editar este producto' }, { status: 403 }) }
  }
  return { session, product }
}

async function deleteQuietly(pathname: string | null) {
  if (!pathname) return
  try {
    await del(pathname)
  } catch (error) {
    console.error('No se pudo borrar el HTML anterior:', error)
  }
}

// Borra todos los blobs del producto salvo el vigente (anterior y subidas no confirmadas).
async function cleanupProductBlobs(productId: string, keep: string) {
  try {
    let cursor: string | undefined
    do {
      const page = await list({ prefix: htmlPrefix(productId), cursor })
      const stale = page.blobs.map((b) => b.pathname).filter((p) => p !== keep)
      if (stale.length) await del(stale)
      cursor = page.hasMore ? page.cursor : undefined
    } while (cursor)
  } catch (error) {
    console.error('No se pudieron limpiar archivos HTML anteriores:', error)
  }
}

// Confirma una subida: verifica que el archivo existe en Blob y lo asocia al producto.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const loaded = await loadEditable(params.id)
  if ('error' in loaded) return loaded.error
  const { session, product } = loaded

  try {
    const { pathname, name } = confirmSchema.parse(await request.json())
    if (!isOwnHtmlPath(product.id, pathname)) {
      return NextResponse.json({ error: 'Ruta de archivo no permitida' }, { status: 400 })
    }
    // Un archivo ya asociado (o retirado) no se puede volver a confirmar.
    if (pathname === product.htmlPath) {
      return NextResponse.json({ error: 'Ese archivo ya está asociado' }, { status: 409 })
    }

    const blob = await head(pathname)
    if (!isOwnHtmlPath(product.id, blob.pathname) || !blob.contentType.startsWith('text/html')) {
      await deleteQuietly(pathname)
      return NextResponse.json({ error: 'El archivo no es HTML' }, { status: 400 })
    }

    // Update condicional: si otro cambio de HTML ocurrió entre medio, no se pisa.
    const previous = product.htmlPath
    const { count } = await prisma.product.updateMany({
      where: { id: product.id, htmlPath: previous },
      data: {
        htmlPath: blob.pathname,
        htmlName: name,
        htmlSize: blob.size,
        htmlUploadedAt: new Date(),
      },
    })
    if (count === 0) {
      await deleteQuietly(blob.pathname)
      return NextResponse.json(
        { error: 'El archivo HTML cambió mientras se subía. Recarga e inténtalo de nuevo.' },
        { status: 409 }
      )
    }

    // Borra el anterior y cualquier subida abandonada de este producto.
    await cleanupProductBlobs(product.id, blob.pathname)

    await prisma.auditLog.create({
      data: {
        entity: 'Product',
        entityId: product.id,
        action: 'UPDATE',
        userId: session.user.id,
        productId: product.id,
        diff: JSON.stringify({ html: { before: product.htmlName, after: name, size: blob.size } }),
      },
    })

    return NextResponse.json({ htmlName: name, htmlSize: blob.size })
  } catch (error) {
    console.error('Error al confirmar HTML:', error)
    return NextResponse.json({ error: 'No se pudo registrar el archivo HTML' }, { status: 400 })
  }
}

// Quita el HTML del producto y lo borra del almacenamiento.
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const loaded = await loadEditable(params.id)
  if ('error' in loaded) return loaded.error
  const { session, product } = loaded

  if (!product.htmlPath) return NextResponse.json({ success: true })

  const { count } = await prisma.product.updateMany({
    where: { id: product.id, htmlPath: product.htmlPath },
    data: { htmlPath: null, htmlName: null, htmlSize: null, htmlUploadedAt: null },
  })
  if (count === 0) {
    return NextResponse.json(
      { error: 'El archivo HTML cambió mientras se quitaba. Recarga e inténtalo de nuevo.' },
      { status: 409 }
    )
  }
  await deleteQuietly(product.htmlPath)

  await prisma.auditLog.create({
    data: {
      entity: 'Product',
      entityId: product.id,
      action: 'UPDATE',
      userId: session.user.id,
      productId: product.id,
      diff: JSON.stringify({ html: { before: product.htmlName, after: null } }),
    },
  })

  return NextResponse.json({ success: true })
}
