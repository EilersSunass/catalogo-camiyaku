import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canEditProduct } from '@/lib/permissions'
import { isOwnHtmlPath, MAX_HTML_BYTES } from '@/lib/product-access'

// Emite el token para que el navegador suba el HTML directo a Blob
// (así el archivo no pasa por la función y no hay límite de 4,5 MB).
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const session = await getServerSession(authOptions)
        if (!session?.user) throw new Error('No autenticado')

        const product = await prisma.product.findUnique({ where: { id: params.id } })
        if (!product) throw new Error('Producto no encontrado')
        if (!canEditProduct(session.user.role, product.createdById, session.user.id)) {
          throw new Error('No tienes permisos para editar este producto')
        }
        if (!isOwnHtmlPath(product.id, pathname)) {
          throw new Error('Ruta de archivo no permitida')
        }

        return {
          allowedContentTypes: ['text/html'],
          maximumSizeInBytes: MAX_HTML_BYTES,
          addRandomSuffix: true,
        }
      },
    })
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al preparar la subida'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
