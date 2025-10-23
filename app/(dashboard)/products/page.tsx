import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProductsClient } from './products-client'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)

  // Obtener tags para filtros
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="container py-8">
      <ProductsClient session={session} tags={tags} />
    </div>
  )
}
