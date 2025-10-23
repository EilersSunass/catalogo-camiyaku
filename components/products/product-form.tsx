'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, type ProductFormData } from '@/lib/validations/product'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface ProductFormProps {
  product?: any
  tags: Array<{ id: string; name: string }>
}

export function ProductForm({ product, tags }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(
    product?.tags?.map((pt: any) => pt.tag.name) || []
  )
  const [newTag, setNewTag] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          type: product.type,
          description: product.description || '',
          url: product.url || '',
          owner: product.owner || '',
          status: product.status,
          visibility: product.visibility,
          eps: product.eps || '',
          region: product.region || '',
          district: product.district || '',
          topic: product.topic || '',
          period: product.period || '',
          source: product.source || '',
          tags: product.tags?.map((pt: any) => pt.tag.name) || [],
        }
      : {
          type: 'DASHBOARD',
          status: 'DRAFT',
          visibility: 'INTERNAL',
          tags: [],
        },
  })

  const url = watch('url')

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)

    try {
      const payload = {
        ...data,
        tags: selectedTags,
      }

      const response = await fetch(
        product ? `/api/products/${product.id}` : '/api/products',
        {
          method: product ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      if (response.ok) {
        toast({
          title: product ? 'Producto actualizado' : 'Producto creado',
          description: `El producto se ha ${product ? 'actualizado' : 'creado'} correctamente`,
        })
        router.push('/products')
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.error || 'Ocurrió un error',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error al guardar el producto',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag])
      setValue('tags', [...selectedTags, newTag])
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    const updated = selectedTags.filter((t) => t !== tag)
    setSelectedTags(updated)
    setValue('tags', updated)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
          <CardDescription>Datos principales del producto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" {...register('name')} disabled={isLoading} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={watch('type')}
                onValueChange={(value: any) => setValue('type', value)}
                disabled={isLoading}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DASHBOARD">Dashboard</SelectItem>
                  <SelectItem value="FORM">Formulario</SelectItem>
                  <SelectItem value="REPORT">Reporte</SelectItem>
                  <SelectItem value="TOOL">Herramienta</SelectItem>
                  <SelectItem value="OTHER">Otro</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
              <Select
                value={watch('status')}
                onValueChange={(value: any) => setValue('status', value)}
                disabled={isLoading}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Borrador</SelectItem>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="DEPRECATED">Obsoleto</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibilidad *</Label>
            <Select
              value={watch('visibility')}
              onValueChange={(value: any) => setValue('visibility', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INTERNAL">Interno</SelectItem>
                <SelectItem value="PUBLIC">Público</SelectItem>
              </SelectContent>
            </Select>
            {errors.visibility && <p className="text-sm text-destructive">{errors.visibility.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...register('description')}
              disabled={isLoading}
              rows={4}
              placeholder="Describe el producto..."
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              {...register('url')}
              disabled={isLoading}
              placeholder="https://..."
            />
            {errors.url && <p className="text-sm text-destructive">{errors.url.message}</p>}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Vista previa
              </a>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Responsable</Label>
            <Input
              id="owner"
              {...register('owner')}
              disabled={isLoading}
              placeholder="Nombre o email del responsable"
            />
            {errors.owner && <p className="text-sm text-destructive">{errors.owner.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadatos SUNASS</CardTitle>
          <CardDescription>Información específica para clasificación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eps">EPS</Label>
              <Input id="eps" {...register('eps')} disabled={isLoading} placeholder="Ej: SEDAPAL" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Región</Label>
              <Input id="region" {...register('region')} disabled={isLoading} placeholder="Ej: Lima" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">Distrito</Label>
              <Input id="district" {...register('district')} disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Tema</Label>
              <Input
                id="topic"
                {...register('topic')}
                disabled={isLoading}
                placeholder="Ej: Calidad del Agua"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Periodo</Label>
              <Input
                id="period"
                {...register('period')}
                disabled={isLoading}
                placeholder="Ej: 2025-Q1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Fuente</Label>
              <Input
                id="source"
                {...register('source')}
                disabled={isLoading}
                placeholder="Ej: Sistema SIAS"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Etiquetas para clasificar el producto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nuevo tag..."
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag()
                }
              }}
            />
            <Button type="button" onClick={addTag} disabled={isLoading || !newTag}>
              Agregar
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags existentes (click para agregar)</Label>
              <div className="flex flex-wrap gap-2">
                {tags
                  .filter((t) => !selectedTags.includes(t.name))
                  .map((tag) => (
                    <Button
                      key={tag.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTags([...selectedTags, tag.name])
                        setValue('tags', [...selectedTags, tag.name])
                      }}
                      disabled={isLoading}
                    >
                      {tag.name}
                    </Button>
                  ))}
              </div>
            </div>
          )}

          {selectedTags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags seleccionados</Label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? 'Actualizar' : 'Crear'} Producto
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
