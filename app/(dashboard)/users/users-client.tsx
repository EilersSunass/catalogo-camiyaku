'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { formatDate } from '@/lib/utils'
import { Shield, User, UserPlus, Trash2, Key, Package } from 'lucide-react'

export function UsersClient() {
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  })
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [passwordUserId, setPasswordUserId] = useState<string | null>(null)
  const [newPasswordValue, setNewPasswordValue] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Estado para asignación de productos
  const [assignDialogUserId, setAssignDialogUserId] = useState<string | null>(null)
  const [assignDialogUserName, setAssignDialogUserName] = useState('')
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set())
  const [productSearch, setProductSearch] = useState('')
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [isSavingAssignment, setIsSavingAssignment] = useState(false)
  // Cuántos productos tiene asignados cada usuario (id -> count)
  const [assignedCounts, setAssignedCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
      // Inicializar counts de productos asignados
      const counts: Record<string, number> = {}
      for (const u of data) {
        counts[u.id] = u._count?.productAccess ?? 0
      }
      setAssignedCounts(counts)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      if (response.ok) {
        toast({
          title: 'Rol actualizado',
          description: 'El rol del usuario se ha actualizado correctamente',
        })
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.error || 'No se pudo actualizar el rol',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error al actualizar el rol',
      })
    }
  }

  const createUser = async () => {
    if (!newUser.email || !newUser.password) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Email y contraseña son requeridos',
      })
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })

      if (response.ok) {
        toast({
          title: 'Usuario creado',
          description: 'El usuario se ha creado correctamente',
        })
        setIsCreateDialogOpen(false)
        setNewUser({ name: '', email: '', password: '', role: 'USER' })
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.error || 'No se pudo crear el usuario',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error al crear el usuario',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Usuario eliminado',
          description: 'El usuario se ha eliminado correctamente',
        })
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.error || 'No se pudo eliminar el usuario',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error al eliminar el usuario',
      })
    }
  }

  const updatePassword = async () => {
    if (!passwordUserId || !newPasswordValue || newPasswordValue.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'La contraseña debe tener al menos 8 caracteres',
      })
      return
    }

    setIsUpdatingPassword(true)
    try {
      const response = await fetch(`/api/users/${passwordUserId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPasswordValue }),
      })

      if (response.ok) {
        toast({
          title: 'Contraseña actualizada',
          description: 'La contraseña se ha actualizado correctamente',
        })
        setIsPasswordDialogOpen(false)
        setNewPasswordValue('')
        setPasswordUserId(null)
      } else {
        const error = await response.json()
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.error || 'No se pudo actualizar la contraseña',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error al actualizar la contraseña',
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const openAssignDialog = async (userId: string, userName: string) => {
    setAssignDialogUserId(userId)
    setAssignDialogUserName(userName)
    setProductSearch('')
    setIsLoadingProducts(true)

    try {
      // Traer todos los productos paginando (max 100 por página según el schema)
      const fetchAllProducts = async () => {
        const allFetched: any[] = []
        let page = 1
        let totalPages = 1
        do {
          const res = await fetch(`/api/products?pageSize=100&page=${page}`)
          if (!res.ok) throw new Error('Error al obtener productos')
          const data = await res.json()
          allFetched.push(...(data.products || []))
          totalPages = data.pagination?.totalPages ?? 1
          page++
        } while (page <= totalPages)
        return allFetched
      }

      const [products, assignedRes] = await Promise.all([
        fetchAllProducts(),
        fetch(`/api/users/${userId}/products`),
      ])

      if (!assignedRes.ok) throw new Error('Error al obtener asignaciones')
      const assignedIds: string[] = await assignedRes.json()

      setAllProducts(products)
      setSelectedProductIds(new Set(assignedIds))
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los productos' })
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }

  const saveAssignment = async () => {
    if (!assignDialogUserId) return
    setIsSavingAssignment(true)
    try {
      const res = await fetch(`/api/users/${assignDialogUserId}/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: Array.from(selectedProductIds) }),
      })

      if (res.ok) {
        const data = await res.json()
        setAssignedCounts((prev) => ({ ...prev, [assignDialogUserId]: data.count }))
        toast({ title: 'Asignación guardada', description: `${data.count} productos asignados correctamente` })
        setAssignDialogUserId(null)
      } else {
        const err = await res.json()
        toast({ variant: 'destructive', title: 'Error', description: err.error || 'No se pudo guardar la asignación' })
      }
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Ocurrió un error al guardar' })
    } finally {
      setIsSavingAssignment(false)
    }
  }

  const filteredProducts = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(productSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios y sus roles en el sistema
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Ingresa los datos del nuevo usuario. La contraseña debe tener al menos 8 caracteres.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Nombre del usuario"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuario</SelectItem>
                    <SelectItem value="EXTERNAL">SUNASS</SelectItem>
                    <SelectItem value="CAMI_YAKU">Cami Yaku</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isCreating}
              >
                Cancelar
              </Button>
              <Button onClick={createUser} disabled={isCreating}>
                {isCreating ? 'Creando...' : 'Crear Usuario'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cambiar Contraseña</DialogTitle>
              <DialogDescription>
                Ingresa la nueva contraseña. Mínimo 8 caracteres.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  placeholder="********"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
                disabled={isUpdatingPassword}
              >
                Cancelar
              </Button>
              <Button onClick={updatePassword} disabled={isUpdatingPassword || newPasswordValue.length < 8}>
                {isUpdatingPassword ? 'Guardando...' : 'Guardar Contraseña'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {
        isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No hay usuarios registrados
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{user.name || 'Sin nombre'}</CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rol:</span>
                      <Select
                        value={user.role}
                        onValueChange={(value) => updateUserRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">Usuario</SelectItem>
                          <SelectItem value="EXTERNAL">SUNASS</SelectItem>
                          <SelectItem value="CAMI_YAKU">Cami Yaku</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Productos:</span>
                      <Badge variant="outline">{user._count.products}</Badge>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Registrado: {formatDate(user.createdAt)}
                    </div>
                  </div>

                  {user.role === 'ADMIN' && (
                    <Badge variant="default" className="w-full justify-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Administrador
                    </Badge>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      setPasswordUserId(user.id)
                      setNewPasswordValue('')
                      setIsPasswordDialogOpen(true)
                    }}
                  >
                    <Key className="h-3 w-3 mr-1" />
                    Cambiar Contraseña
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => openAssignDialog(user.id, user.name || user.email)}
                  >
                    <Package className="h-3 w-3 mr-1" />
                    Asignar Productos
                    {(assignedCounts[user.id] ?? 0) > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {assignedCounts[user.id]}
                      </Badge>
                    )}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="w-full mt-2">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar Usuario
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente el usuario
                          <strong> {user.name || user.email}</strong> y todos sus datos asociados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteUser(user.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      }
      {/* Dialog de asignación de productos */}
      <Dialog open={!!assignDialogUserId} onOpenChange={(open) => { if (!open) setAssignDialogUserId(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Asignar Productos</DialogTitle>
            <DialogDescription>
              Selecciona los productos a los que <strong>{assignDialogUserName}</strong> tendrá acceso individual,
              independientemente de su rol o visibilidad.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Buscar productos..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />

            {isLoadingProducts ? (
              <div className="space-y-2 py-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <>
                <div className="text-xs text-muted-foreground">
                  {selectedProductIds.size} seleccionados · {filteredProducts.length} mostrados
                </div>
                <div className="h-72 overflow-y-auto border rounded-md p-2">
                  {filteredProducts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No se encontraron productos</p>
                  ) : (
                    <div className="space-y-1">
                      {filteredProducts.map((product) => (
                        <label
                          key={product.id}
                          className="flex items-center gap-3 px-2 py-2 rounded hover:bg-muted cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedProductIds.has(product.id)}
                            onCheckedChange={() => toggleProduct(product.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {product.type} · {product.visibility}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogUserId(null)} disabled={isSavingAssignment}>
              Cancelar
            </Button>
            <Button onClick={saveAssignment} disabled={isSavingAssignment || isLoadingProducts}>
              {isSavingAssignment ? 'Guardando...' : 'Guardar Asignación'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
