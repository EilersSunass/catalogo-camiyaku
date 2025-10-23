# ✅ Checklist de Verificación - Catálogo SUNASS

## 📋 Antes de Empezar

- [ ] Node.js 18+ instalado
- [ ] npm o yarn instalado
- [ ] Editor de código (VS Code recomendado)
- [ ] Terminal/PowerShell disponible

---

## 🚀 Setup Inicial

- [ ] Navegar a `e:\proyectos_windsurf\catalogo-sunass`
- [ ] Crear archivo `.env` desde `.env.example`
- [ ] Generar `NEXTAUTH_SECRET` seguro
- [ ] Ejecutar `npm install`
- [ ] Ejecutar `npm run db:generate`
- [ ] Ejecutar `npm run db:push`
- [ ] Ejecutar `npm run db:seed`
- [ ] Ejecutar `npm run dev`
- [ ] Abrir http://localhost:3000

---

## 🔍 Verificación de Funcionalidades

### Autenticación
- [ ] Página de login carga correctamente
- [ ] Login con admin@example.com funciona
- [ ] Login con user@example.com funciona
- [ ] Logout funciona
- [ ] Redirección después de login funciona
- [ ] Rutas protegidas redirigen a login

### Listado de Productos
- [ ] Se muestran 15 productos de ejemplo
- [ ] Tarjetas muestran información correcta
- [ ] Badges de estado tienen colores correctos
- [ ] Iconos de tipo se muestran
- [ ] Tags se muestran en chips
- [ ] Paginación funciona
- [ ] Contador de resultados es correcto

### Búsqueda y Filtros
- [ ] Búsqueda por texto funciona
- [ ] Filtro por tipo funciona
- [ ] Filtro por estado funciona
- [ ] Filtro por visibilidad funciona
- [ ] Filtro por EPS funciona
- [ ] Filtro por región funciona
- [ ] Filtro por tema funciona
- [ ] Filtro por periodo funciona
- [ ] Filtro por tags funciona
- [ ] Múltiples filtros se combinan correctamente
- [ ] Filtros persisten en URL
- [ ] Botón "Limpiar filtros" funciona
- [ ] Filtros son responsivos (colapsables en móvil)

### Crear Producto
- [ ] Botón "Nuevo Producto" visible para usuarios autenticados
- [ ] Formulario carga correctamente
- [ ] Validación de campos funciona
- [ ] Validación de URL funciona
- [ ] Selector de tipo funciona
- [ ] Selector de estado funciona
- [ ] Selector de visibilidad funciona
- [ ] Textarea de descripción funciona
- [ ] Campos de metadatos funcionan
- [ ] Agregar tags existentes funciona
- [ ] Crear nuevos tags funciona
- [ ] Botón "Crear" guarda el producto
- [ ] Toast de éxito se muestra
- [ ] Redirección a listado funciona

### Editar Producto
- [ ] Botón "Editar" visible para productos propios
- [ ] Botón "Editar" visible para admin en todos los productos
- [ ] Formulario carga con datos existentes
- [ ] Actualización de campos funciona
- [ ] Actualización de tags funciona
- [ ] Botón "Actualizar" guarda cambios
- [ ] Toast de éxito se muestra
- [ ] Cambios se reflejan en listado

### Ver Detalle
- [ ] Página de detalle carga correctamente
- [ ] Toda la información se muestra
- [ ] Badges de tipo, estado y visibilidad correctos
- [ ] Botón "Abrir" enlaza a URL correcta
- [ ] Botón "Copiar URL" funciona
- [ ] Toast de "URL copiada" se muestra
- [ ] Botón "Editar" visible si tiene permisos
- [ ] Botón "Volver" funciona
- [ ] Tags se muestran correctamente
- [ ] Metadatos SUNASS se muestran

### Eliminar Producto
- [ ] Botón "Eliminar" solo visible para admin
- [ ] Modal de confirmación se muestra
- [ ] Botón "Cancelar" cierra modal
- [ ] Botón "Eliminar" borra el producto (admin)
- [ ] Toast de éxito se muestra
- [ ] Producto desaparece del listado
- [ ] Intento de borrado por user devuelve error 403

### Auditoría (Solo Admin)
- [ ] Link "Auditoría" visible solo para admin
- [ ] Página de auditoría carga
- [ ] Se muestran logs de auditoría
- [ ] Filtro por acción funciona
- [ ] Filtro por entidad funciona
- [ ] Filtro por fecha funciona
- [ ] Paginación funciona
- [ ] Badges de acción tienen colores correctos
- [ ] Información de usuario se muestra
- [ ] Timestamp se muestra formateado
- [ ] User no puede acceder (redirige)

### Gestión de Usuarios (Solo Admin)
- [ ] Link "Usuarios" visible solo para admin
- [ ] Página de usuarios carga
- [ ] Se muestran todos los usuarios
- [ ] Contador de productos es correcto
- [ ] Selector de rol funciona
- [ ] Cambio de rol se guarda
- [ ] Toast de éxito se muestra
- [ ] Badge de admin se muestra
- [ ] User no puede acceder (redirige)

### Permisos RBAC
- [ ] User puede crear productos
- [ ] User puede editar sus productos
- [ ] User NO puede editar productos de otros
- [ ] User NO puede eliminar productos
- [ ] User NO puede ver auditoría
- [ ] User NO puede gestionar usuarios
- [ ] Admin puede editar cualquier producto
- [ ] Admin puede eliminar cualquier producto
- [ ] Admin puede ver auditoría
- [ ] Admin puede gestionar usuarios

### Visibilidad
- [ ] Productos PUBLIC visibles sin login
- [ ] Productos INTERNAL requieren login
- [ ] Filtro de visibilidad funciona
- [ ] Redirección a login para productos INTERNAL

### UI/UX
- [ ] Diseño es responsivo (móvil, tablet, desktop)
- [ ] Header sticky funciona
- [ ] Menú de usuario funciona
- [ ] Dropdown de usuario muestra información correcta
- [ ] Toasts se muestran y desaparecen
- [ ] Loading states se muestran
- [ ] Estados vacíos se muestran
- [ ] Skeleton loaders funcionan
- [ ] Colores y contraste son adecuados
- [ ] Navegación es intuitiva

---

## 🧪 Tests

- [ ] `npm test` ejecuta sin errores
- [ ] Tests de permisos pasan (3/3)
- [ ] Tests de validaciones pasan (5+/5+)
- [ ] Tests de utilidades pasan (4+/4+)
- [ ] Coverage es adecuado

---

## 📊 Base de Datos

- [ ] Archivo `prisma/dev.db` existe
- [ ] `npm run db:studio` abre Prisma Studio
- [ ] Tabla `users` tiene 2 registros
- [ ] Tabla `products` tiene 15 registros
- [ ] Tabla `tags` tiene 8 registros
- [ ] Tabla `audit_logs` tiene registros
- [ ] Relaciones funcionan correctamente

---

## 🔒 Seguridad

- [ ] Contraseñas están hasheadas en BD
- [ ] Archivo `.env` está en `.gitignore`
- [ ] `NEXTAUTH_SECRET` es seguro
- [ ] Validación funciona en frontend y backend
- [ ] API routes verifican autenticación
- [ ] API routes verifican permisos
- [ ] URLs se validan correctamente
- [ ] No hay secretos en el código

---

## 📚 Documentación

- [ ] `README.md` está completo
- [ ] `FEATURES.md` lista todas las características
- [ ] `COMANDOS.md` tiene comandos útiles
- [ ] `INICIO_RAPIDO.md` tiene instrucciones claras
- [ ] `.env.example` tiene todas las variables
- [ ] Comentarios en código complejo
- [ ] Scripts de package.json documentados

---

## 🚀 Preparación para Producción

- [ ] `npm run build` ejecuta sin errores
- [ ] `npm run start` inicia servidor de producción
- [ ] Variables de entorno de producción configuradas
- [ ] Base de datos PostgreSQL configurada (si aplica)
- [ ] `NEXTAUTH_SECRET` de producción generado
- [ ] URLs de producción configuradas
- [ ] Google OAuth configurado (si aplica)
- [ ] Migraciones ejecutadas en producción
- [ ] Seed ejecutado en producción (opcional)

---

## 📱 Compatibilidad

- [ ] Chrome/Edge funciona
- [ ] Firefox funciona
- [ ] Safari funciona (si disponible)
- [ ] Móvil funciona
- [ ] Tablet funciona
- [ ] Desktop funciona

---

## 🎯 Criterios de Aceptación Final

- [ ] User puede crear/editar solo sus productos
- [ ] Borrado por user devuelve 403
- [ ] Admin puede borrar cualquier producto
- [ ] Admin puede ver auditoría
- [ ] Filtros combinados funcionan
- [ ] Filtros persisten en URL
- [ ] Paginación es server-side
- [ ] Auditoría registra todas las acciones
- [ ] Visibility oculta productos internos
- [ ] Botón "Copiar URL" funciona
- [ ] Tests implementados y pasando
- [ ] PostgreSQL configurado
- [ ] Google OAuth funciona
- [ ] Dominio @sunass.gob.pe mapeado

---

## ✅ Estado Final

**Total de items**: 150+

**Completados**: _____ / 150+

**Porcentaje**: _____ %

---

## 📝 Notas

_Usa este espacio para anotar problemas encontrados o mejoras futuras:_

---

## 🎉 Proyecto Completo

Si todos los items están marcados, ¡el proyecto está listo para usar!

**Fecha de verificación**: __________

**Verificado por**: __________

**Estado**: [ ] Aprobado [ ] Requiere ajustes
