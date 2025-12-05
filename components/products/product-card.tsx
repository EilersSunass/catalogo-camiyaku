'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getProductTypeLabel, getProductStatusLabel, formatDateShort } from '@/lib/utils'
import { ExternalLink, Eye, Pencil, Trash2, Copy } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ProductCardProps {
  product: any
  canEdit: boolean
  canDelete: boolean
  onDelete?: () => void
}

export function ProductCard({ product, canEdit, canDelete, onDelete }: ProductCardProps) {
  const { toast } = useToast()

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

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      DASHBOARD: '📊',
      FORM: '📝',
      REPORT: '📄',
      TOOL: '🔧',
      OTHER: '📦',
    }
    return icons[type] || '📦'
  }

  const copyUrl = () => {
    if (product.url) {
      navigator.clipboard.writeText(product.url)
      toast({
        title: 'URL copiada',
        description: 'La URL se ha copiado al portapapeles',
      })
    }
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTypeIcon(product.type)}</span>
            <div className="flex-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CardTitle className="text-lg line-clamp-1 cursor-default">{product.name}</CardTitle>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{product.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <CardDescription className="text-xs mt-1">
                {getProductTypeLabel(product.type)}
              </CardDescription>
            </div>
          </div>
          <Badge variant={getStatusVariant(product.status)}>
            {getProductStatusLabel(product.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {product.description}
          </p>
        )}

        <div className="space-y-2 text-xs">
          {product.eps && (
            <div>
              <span className="font-semibold">EPS:</span> {product.eps}
            </div>
          )}
          {product.region && (
            <div>
              <span className="font-semibold">Región:</span> {product.region}
            </div>
          )}
          {product.topic && (
            <div>
              <span className="font-semibold">Tema:</span> {product.topic}
            </div>
          )}
          {product.period && (
            <div>
              <span className="font-semibold">Periodo:</span> {product.period}
            </div>
          )}
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {product.tags.slice(0, 3).map((pt: any) => (
              <Badge key={pt.tag.id} variant="outline" className="text-xs">
                {pt.tag.name}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{product.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-3">
          Actualizado: {formatDateShort(product.updatedAt)}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <div className="flex gap-2 flex-1">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link href={`/products/${product.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Link>
          </Button>

          {product.url && (
            <>
              <Button
                variant="outline"
                size="sm"
                asChild
                title="Ir al sitio web"
              >
                <a href={product.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Ir
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyUrl}
                title="Copiar URL"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {canEdit && (
          <Button asChild variant="outline" size="sm" title="Editar producto">
            <Link href={`/products/${product.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
        )}

        {canDelete && onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            title="Eliminar producto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
