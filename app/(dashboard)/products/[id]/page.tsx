import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getProductTypeLabel, getProductStatusLabel, getVisibilityLabel, formatDate } from '@/lib/utils'
import { ExternalLink, Pencil, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { canEditProduct } from '@/lib/permissions'
import { CopyUrlButton } from '@/components/products/copy-url-button'

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
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
        },
      },
    },
  })

  if (!product) {
    notFound()
  }

  // Verificar visibilidad
  if (product.visibility === 'INTERNAL' && !session) {
    redirect('/login?callbackUrl=/products/' + params.id)
  }

  const canEdit = session
    ? canEditProduct(session.user.role, product.createdById, session.user.id)
    : false

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'DRAFT':
        return 'warning'
      case 'DEPRECATED':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Link>
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
            <div className="flex items-center gap-2">
              <Badge>{getProductTypeLabel(product.type)}</Badge>
              <Badge variant={getStatusVariant(product.status)}>
                {getProductStatusLabel(product.status)}
              </Badge>
              <Badge variant="outline">{getVisibilityLabel(product.visibility)}</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            {product.url && (
              <Button asChild>
                <a href={product.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir
                </a>
              </Button>
            )}
            {canEdit && (
              <Button variant="outline" asChild>
                <Link href={`/products/${product.id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {product.description && (
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {product.url && (
              <div className="flex items-center justify-between">
                <span className="font-semibold">URL:</span>
                <div className="flex items-center gap-2">
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    {product.url}
                  </a>
                  <CopyUrlButton url={product.url} />
                </div>
              </div>
            )}
            {product.owner && (
              <div className="flex justify-between">
                <span className="font-semibold">Responsable:</span>
                <span className="text-muted-foreground">{product.owner}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-semibold">Creado por:</span>
              <span className="text-muted-foreground">
                {product.createdBy.name || product.createdBy.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Creado:</span>
              <span className="text-muted-foreground">{formatDate(product.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Última actualización:</span>
              <span className="text-muted-foreground">{formatDate(product.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadatos SUNASS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {product.eps && (
              <div className="flex justify-between">
                <span className="font-semibold">EPS:</span>
                <span className="text-muted-foreground">{product.eps}</span>
              </div>
            )}
            {product.region && (
              <div className="flex justify-between">
                <span className="font-semibold">Región:</span>
                <span className="text-muted-foreground">{product.region}</span>
              </div>
            )}
            {product.district && (
              <div className="flex justify-between">
                <span className="font-semibold">Distrito:</span>
                <span className="text-muted-foreground">{product.district}</span>
              </div>
            )}
            {product.topic && (
              <div className="flex justify-between">
                <span className="font-semibold">Tema:</span>
                <span className="text-muted-foreground">{product.topic}</span>
              </div>
            )}
            {product.period && (
              <div className="flex justify-between">
                <span className="font-semibold">Periodo:</span>
                <span className="text-muted-foreground">{product.period}</span>
              </div>
            )}
            {product.source && (
              <div className="flex justify-between">
                <span className="font-semibold">Fuente:</span>
                <span className="text-muted-foreground">{product.source}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {product.tags && product.tags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((pt: any) => (
                  <Badge key={pt.tag.id} variant="secondary">
                    {pt.tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
