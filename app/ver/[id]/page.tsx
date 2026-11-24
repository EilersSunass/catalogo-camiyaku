import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import { issueSignedToken, presignUrl } from '@vercel/blob'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkProductAccess } from '@/lib/product-access'
import { HtmlViewer } from '@/components/products/html-viewer'

export const dynamic = 'force-dynamic'

// Validez del enlace firmado: solo hace falta para la descarga inicial.
const LINK_TTL_MS = 10 * 60 * 1000

export default async function VerProductoPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { embed?: string }
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, visibility: true, htmlPath: true, htmlSize: true },
  })
  if (!product || !product.htmlPath) notFound()

  const session = await getServerSession(authOptions)
  const access = await checkProductAccess(session, product)
  if (access === 'login') redirect(`/login?callbackUrl=/ver/${product.id}`)
  if (access === 'forbidden') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 text-center">
        <p className="text-muted-foreground">No tienes permisos para ver este producto.</p>
      </main>
    )
  }

  const token = await issueSignedToken({
    pathname: product.htmlPath,
    operations: ['get'],
    validUntil: Date.now() + LINK_TTL_MS,
  })
  const { presignedUrl } = await presignUrl(token, {
    operation: 'get',
    pathname: product.htmlPath,
    access: 'private',
  })

  return (
    <HtmlViewer
      src={presignedUrl}
      title={product.name}
      productId={product.id}
      size={product.htmlSize ?? undefined}
      embed={searchParams.embed === '1'}
    />
  )
}
