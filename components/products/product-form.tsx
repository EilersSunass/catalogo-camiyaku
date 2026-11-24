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
import { Loader2, ExternalLink, FileCode, X } from 'lucide-react'
import { upload } from '@vercel/blob/client'
import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'

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
  const [htmlFile, setHtmlFile] = useState<File | null>(null)
  const [removeHtml, setRemoveHtml] = useState(false)
  const [uploadPct, setUploadPct] = useState<number | null>(null)
  const currentHtml: string | null = removeHtml ? null : product?.htmlName ?? null

  const onHtmlSelected = (file: File | undefined) => {
    if (!file) return
    if (!/\.html?$/i.test(file.name)) {
      toast({ variant: 'destructive', title: 'Archivo no válido', description: 'Solo se aceptan archivos .html' })
      return
    }
    setHtmlFile(file)
    setRemoveHtml(false)
  }

  // Sube el HTML directo a Blob y luego lo asocia al producto.
  const syncHtml = async (productId: string) => {
    if (htmlFile) {
      setUploadPct(0)
      const safeName = htmlFile.name.replace(/[^\w.\-]+/g, '_').replace(/\.{2,}/g, '.')
      const blob = await upload(`productos/${productId}/${safeName}`, htmlFile, {
        access: 'private',
        handleUploadUrl: `/api/products/${productId}/html/upload`,
        contentType: 'text/html',
        multipart: htmlFile.size > 8 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setUploadPct(Math.round(percentage)),
      })
      const res = await fetch(`/api/products/${productId}/html`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathname: blob.pathname, name: htmlFile.name }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'No se pudo registrar el archivo HTML')
    } else if (removeHtml && product?.htmlPath) {
      const res = await fetch(`/api/products/${productId}/html`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo quitar el archivo HTML')
    }
  }

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
        showPreview: product.showPreview,
      }
      : {
        type: 'DASHBOARD',
        status: 'DRAFT',
        visibility: 'INTERNAL',
        tags: [],
        showPreview: true,
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

      // Producto existente: primero se cambia el HTML y después los datos (incluida la
      // visibilidad). Así, si se pasa a PUBLIC con un HTML nuevo, el anterior nunca queda
      // expuesto, y si la subida falla no se aplica ningún cambio.
      if (product) {
        try {
          await syncHtml(product.id)
        } catch (e) {
          toast({
            variant: 'destructive',
            title: 'No se guardaron los cambios',
            description: e instanceof Error ? e.message : 'Error al subir el archivo HTML',
          })
          return
        }
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
        const saved = await response.json()
        try {
          // Producto nuevo: necesita su id antes de subir el HTML.
          if (!product) await syncHtml(saved.id)
        } catch (e) {
          toast({
            variant: 'destructive',
            title: 'El producto se guardó, pero el archivo HTML no',
            description: e instanceof Error ? e.message : 'Error al subir el archivo',
          })
          router.push(`/products/${saved.id}/edit`)
          router.refresh()
          return
        }
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
      setUploadPct(null)
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
                  <SelectItem value="MAP">Mapa</SelectItem>
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
                <SelectItem value="PUBLIC">Público</SelectItem>
                <SelectItem value="EXTERNAL">SUNASS</SelectItem>
                <SelectItem value="CAMI_YAKU">Cami Yaku</SelectItem>
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

          <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-lg border border-dashed">
            <Checkbox
              id="showPreview"
              checked={watch('showPreview')}
              onCheckedChange={(checked) => setValue('showPreview', !!checked)}
              disabled={isLoading}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="showPreview"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Activar vista previa del sitio web
              </Label>
              <p className="text-xs text-muted-foreground">
                Si esta URL es un dashboard o reporte, se mostrará una captura de pantalla automática.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="htmlFile">Archivo HTML</Label>
            <p className="text-xs text-muted-foreground">
              Para productos que son un archivo .html (mapas, reportes, dashboards autocontenidos).
              Se abre en el navegador sin descargarlo y respeta la visibilidad del producto.
            </p>
            {(htmlFile || currentHtml) && (
              <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                <FileCode className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate flex-1">
                  {htmlFile
                    ? `${htmlFile.name} (${(htmlFile.size / 1048576).toFixed(1)} MB, se subirá al guardar)`
                    : currentHtml}
                </span>
                {!htmlFile && product?.id && (
                  <a href={`/ver/${product.id}`} target="_blank" rel="noopener" className="text-primary hover:underline text-xs">
                    Ver
                  </a>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isLoading}
                  title="Quitar archivo"
                  onClick={() => (htmlFile ? setHtmlFile(null) : setRemoveHtml(true))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {removeHtml && !htmlFile && (
              <p className="text-xs text-destructive">El archivo HTML se quitará al guardar.</p>
            )}
            <Input
              id="htmlFile"
              type="file"
              accept=".html,.htm,text/html"
              disabled={isLoading}
              onChange={(e) => {
                onHtmlSelected(e.target.files?.[0])
                e.target.value = ''
              }}
            />
            {uploadPct !== null && (
              <p className="text-xs text-muted-foreground">Subiendo archivo HTML… {uploadPct}%</p>
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
              <Label htmlFor="period">Periodicidad</Label>
              <Select
                value={watch('period') || ''}
                onValueChange={(value) => setValue('period', value)}
                disabled={isLoading}
              >
                <SelectTrigger id="period">
                  <SelectValue placeholder="Seleccionar periodicidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tiempo Real">Tiempo Real</SelectItem>
                  <SelectItem value="Diaria">Diaria</SelectItem>
                  <SelectItem value="Semanal">Semanal</SelectItem>
                  <SelectItem value="Mensual">Mensual</SelectItem>
                  <SelectItem value="Trimestral">Trimestral</SelectItem>
                  <SelectItem value="Semestral">Semestral</SelectItem>
                  <SelectItem value="Anual">Anual</SelectItem>
                  <SelectItem value="Otros">Otros</SelectItem>
                </SelectContent>
              </Select>
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
