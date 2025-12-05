'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Filter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'

interface ProductFiltersProps {
  tags: Array<{ id: string; name: string }>
}

export function ProductFilters({ tags }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [epsFilter, setEpsFilter] = useState(searchParams.get('eps') || '')

  // Sincronizar el estado local con searchParams cuando cambian
  useEffect(() => {
    setEpsFilter(searchParams.get('eps') || '')
  }, [searchParams])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // Convertir ciertos filtros a mayúsculas para coincidir con los datos
    let processedValue = value
    if (key === 'eps') {
      processedValue = value.toUpperCase()
      setEpsFilter(value) // Mantener el valor original en el estado local
    }

    if (processedValue) {
      params.set(key, processedValue)
      params.set('page', '1') // Reset to first page
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  const handleEpsChange = (value: string) => {
    setEpsFilter(value)
    updateFilter('eps', value)
  }

  const toggleTag = (tagName: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentTags = params.getAll('tags')

    if (currentTags.includes(tagName)) {
      params.delete('tags')
      currentTags.filter(t => t !== tagName).forEach(t => params.append('tags', t))
    } else {
      params.append('tags', tagName)
    }
    params.set('page', '1')
    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    const q = searchParams.get('q')
    if (q) params.set('q', q)
    router.push(`/products?${params.toString()}`)
  }

  const hasFilters = Array.from(searchParams.keys()).some(
    key => key !== 'q' && key !== 'page' && key !== 'pageSize'
  )

  const selectedTags = searchParams.getAll('tags')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros {hasFilters && `(${Array.from(searchParams.keys()).filter(k => k !== 'q' && k !== 'page' && k !== 'pageSize').length})`}
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        )}
      </div>

      <Card className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={searchParams.get('type') || 'all'}
              onValueChange={(value) => updateFilter('type', value === 'all' ? '' : value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="DASHBOARD">Dashboard</SelectItem>
                <SelectItem value="FORM">Formulario</SelectItem>
                <SelectItem value="REPORT">Reporte</SelectItem>
                <SelectItem value="TOOL">Herramienta</SelectItem>
                <SelectItem value="OTHER">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={searchParams.get('status') || 'all'}
              onValueChange={(value) => updateFilter('status', value === 'all' ? '' : value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="ACTIVE">Activo</SelectItem>
                <SelectItem value="DRAFT">Borrador</SelectItem>
                <SelectItem value="DEPRECATED">Obsoleto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibilidad</Label>
            <Select
              value={searchParams.get('visibility') || 'all'}
              onValueChange={(value) => updateFilter('visibility', value === 'all' ? '' : value)}
            >
              <SelectTrigger id="visibility">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="PUBLIC">Público</SelectItem>
                <SelectItem value="EXTERNAL">Externo</SelectItem>
                <SelectItem value="CAMI_YAKU">Cami Yaku</SelectItem>
                <SelectItem value="INTERNAL">Interno (Legacy)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eps">EPS</Label>
            <Input
              id="eps"
              placeholder="Filtrar por EPS..."
              value={epsFilter}
              onChange={(e) => handleEpsChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Región</Label>
            <Input
              id="region"
              placeholder="Filtrar por región..."
              value={searchParams.get('region') || ''}
              onChange={(e) => updateFilter('region', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Tema</Label>
            <Input
              id="topic"
              placeholder="Filtrar por tema..."
              value={searchParams.get('topic') || ''}
              onChange={(e) => updateFilter('topic', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Periodo</Label>
            <Input
              id="period"
              placeholder="Ej: 2025-Q1"
              value={searchParams.get('period') || ''}
              onChange={(e) => updateFilter('period', e.target.value)}
            />
          </div>

          {tags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={selectedTags.includes(tag.name)}
                      onCheckedChange={() => toggleTag(tag.name)}
                    />
                    <label
                      htmlFor={`tag-${tag.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
