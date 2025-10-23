import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/products/product-form'
import { canEditProduct } from '@/lib/permissions'

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login?callbackUrl=/products/' + params.id + '/edit')
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  if (!product) {
    notFound()
  }

  // Verificar permisos
  if (!canEditProduct(session.user.role, product.createdById, session.user.id)) {
    redirect('/products/' + params.id)
  }

  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Editar Producto</h1>
        <p className="text-muted-foreground">
          Actualiza la información del producto
        </p>
      </div>

      <ProductForm product={product} tags={tags} />
    </div>
  )
}
