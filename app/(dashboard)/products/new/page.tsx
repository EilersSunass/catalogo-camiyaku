import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/products/product-form'

export default async function NewProductPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login?callbackUrl=/products/new')
  }

  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Producto</h1>
        <p className="text-muted-foreground">
          Crea un nuevo producto en el catálogo
        </p>
      </div>

      <ProductForm tags={tags} />
    </div>
  )
}
