'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { formatDate, getAuditActionLabel } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function AuditClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [logs, setLogs] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [searchParams])

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      const response = await fetch(`/api/audit?${params.toString()}`)
      const data = await response.json()
      setLogs(data.logs)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los logs de auditoría',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    router.push(`/audit?${params.toString()}`)
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/audit?${params.toString()}`)
  }

  const getActionVariant = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'success'
      case 'UPDATE':
        return 'default'
      case 'DELETE':
        return 'destructive'
      case 'LOGIN':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Auditoría</h1>
        <p className="text-muted-foreground">
          Registro de acciones en el sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="action">Acción</Label>
            <Select
              value={searchParams.get('action') || 'all'}
              onValueChange={(value) => updateFilter('action', value === 'all' ? '' : value)}
            >
              <SelectTrigger id="action">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="CREATE">Creación</SelectItem>
                <SelectItem value="UPDATE">Actualización</SelectItem>
                <SelectItem value="DELETE">Eliminación</SelectItem>
                <SelectItem value="LOGIN">Inicio de sesión</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entity">Entidad</Label>
            <Select
              value={searchParams.get('entity') || 'all'}
              onValueChange={(value) => updateFilter('entity', value === 'all' ? '' : value)}
            >
              <SelectTrigger id="entity">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Product">Producto</SelectItem>
                <SelectItem value="User">Usuario</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Fecha inicio</Label>
            <Input
              id="startDate"
              type="date"
              value={searchParams.get('startDate') || ''}
              onChange={(e) => updateFilter('startDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Fecha fin</Label>
            <Input
              id="endDate"
              type="date"
              value={searchParams.get('endDate') || ''}
              onChange={(e) => updateFilter('endDate', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No se encontraron registros
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            Mostrando {logs.length} de {pagination?.total || 0} registros
          </div>

          <div className="space-y-2">
            {logs.map((log) => (
              <Card key={log.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getActionVariant(log.action)}>
                          {getAuditActionLabel(log.action)}
                        </Badge>
                        <span className="font-semibold">{log.entity}</span>
                        {log.product && (
                          <span className="text-sm text-muted-foreground">
                            → {log.product.name}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {log.user ? (
                          <>
                            Por: {log.user.name || log.user.email}
                          </>
                        ) : (
                          'Usuario desconocido'
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(log.timestamp)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                <span className="text-sm">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
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
  )
}
