'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Session } from 'next-auth'
import { ProductCard } from '@/components/products/product-card'
import { ProductFilters } from '@/components/products/product-filters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { canDeleteProduct, canEditProduct } from '@/lib/permissions'

interface ProductsClientProps {
  session: Session | null
  tags: Array<{ id: string; name: string }>
}

export function ProductsClient({ session, tags }: ProductsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [products, setProducts] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      const response = await fetch(`/api/products?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      const data = await response.json()
      setProducts(data.products || [])
      setPagination(data.pagination || null)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      setPagination(null)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los productos',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set('q', searchQuery)
    } else {
      params.delete('q')
    }
    params.set('page', '1')
    router.push(`/products?${params.toString()}`)
  }

  const handleDelete = async () => {
    if (!deleteProductId) return

    try {
      const response = await fetch(`/api/products/${deleteProductId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Producto eliminado',
          description: 'El producto se ha eliminado correctamente',
        })
        fetchProducts()
      } else {
        const data = await response.json()
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'No se pudo eliminar el producto',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error al eliminar el producto',
      })
    } finally {
      setDeleteProductId(null)
    }
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/products?${params.toString()}`)
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
            <p className="text-muted-foreground">
              Catálogo de dashboards, formularios, reportes y herramientas
            </p>
          </div>
          {session && (
            <Button asChild>
              <Link href="/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Link>
            </Button>
          )}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos por nombre, descripción o tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Buscar</Button>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <ProductFilters tags={tags} />
          </aside>

          <div className="lg:col-span-3 space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron productos</p>
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">
                  Mostrando {products.length} de {pagination?.total || 0} productos
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      canEdit={
                        session
                          ? canEditProduct(session.user.role, product.createdById, session.user.id)
                          : false
                      }
                      canDelete={
                        session
                          ? canDeleteProduct(session.user.role, product.createdById, session.user.id)
                          : false
                      }
                      onDelete={() => setDeleteProductId(product.id)}
                    />
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>

                    <div className="flex items-center gap-1">
                      {[...Array(pagination.totalPages)].map((_, i) => {
                        const page = i + 1
                        if (
                          page === 1 ||
                          page === pagination.totalPages ||
                          (page >= pagination.page - 1 && page <= pagination.page + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={page === pagination.page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => goToPage(page)}
                            >
                              {page}
                            </Button>
                          )
                        } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                          return <span key={page}>...</span>
                        }
                        return null
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
