# Catálogo SUNASS - Aplicación Full-Stack

Aplicación web full-stack para gestionar un catálogo interno de productos (dashboards, formularios, reportes y herramientas) con autenticación, control de acceso basado en roles (RBAC), filtros avanzados y auditoría.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 14 (App Router) + TypeScript
- **ORM**: Prisma
- **Base de datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Autenticación**: NextAuth.js (credenciales + Google OAuth)
- **UI**: Tailwind CSS + shadcn/ui
- **Validación**: Zod + React Hook Form
- **Testing**: Jest + Testing Library

## 📋 Características

### Autenticación y Autorización
- ✅ Login con credenciales (email + password)
- ✅ Login con Google OAuth
- ✅ Control de acceso basado en roles (RBAC)
  - **Admin**: acceso completo, puede eliminar productos y ver auditoría
  - **User**: puede crear y editar sus propios productos
- ✅ Auto-registro de usuarios con dominio @sunass.gob.pe

### Gestión de Productos
- ✅ CRUD completo de productos
- ✅ Tipos: Dashboard, Formulario, Reporte, Herramienta, Otro
- ✅ Estados: Borrador, Activo, Obsoleto
- ✅ Visibilidad: Público (accesible sin login), Interno (requiere login)
- ✅ Metadatos SUNASS: EPS, región, distrito, tema, periodo, fuente
- ✅ Sistema de tags (Many-to-Many)
- ✅ Validación de URLs (http/https)

### Búsqueda y Filtros
- ✅ Búsqueda por texto (nombre, descripción, tags)
- ✅ Filtros avanzados: tipo, estado, visibilidad, EPS, región, distrito, tema, periodo, owner, tags
- ✅ Filtros persistentes en URL
- ✅ Paginación server-side
- ✅ Ordenamiento por fecha, nombre, estado

### Auditoría
- ✅ Registro automático de acciones: CREATE, UPDATE, DELETE, LOGIN
- ✅ Almacenamiento de cambios (diff) en formato JSON
- ✅ Filtros por acción, usuario, entidad, fecha
- ✅ Solo accesible para administradores

### UX/UI
- ✅ Diseño moderno y responsivo
- ✅ Sidebar de filtros colapsable
- ✅ Vista de tarjetas con badges por estado
- ✅ Iconos por tipo de producto
- ✅ Botón "Copiar URL"
- ✅ Toasts de éxito/error
- ✅ Confirmación de eliminación con modal

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos

1. **Clonar o navegar al directorio del proyecto**
```bash
cd catalogo-sunass
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar .env y configurar:
# - DATABASE_URL (SQLite por defecto, PostgreSQL para producción)
# - NEXTAUTH_SECRET (generar con: openssl rand -base64 32)
# - GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET (opcional, para OAuth)
```

4. **Generar cliente de Prisma**
```bash
npm run db:generate
```

5. **Crear la base de datos y ejecutar migraciones**
```bash
npm run db:push
```

6. **Poblar la base de datos con usuarios de prueba**
```bash
npm run db:seed
```
> ⚠️ **Nota**: El seed solo crea usuarios y tags básicos. **NO crea productos ficticios** y **NO borra datos existentes**. Ver [INSTRUCCIONES_BD.md](./INSTRUCCIONES_BD.md) para más detalles.

7. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

8. **Abrir en el navegador**
```
http://localhost:3000
```

## 🔑 Credenciales de Prueba

Después de ejecutar el seed **por primera vez**, puedes usar estas credenciales:

- **Administrador**
  - Email: `admin@example.com`
  - Password: `Password123!`

- **Usuario Regular**
  - Email: `user@example.com`
  - Password: `Password123!`

> 💡 **Importante**: 
> - Estos usuarios solo se crean la primera vez que ejecutas el seed
> - Si vuelves a ejecutar `npm run db:seed`, NO se borrarán tus datos
> - Para resetear la base de datos, elimina el archivo `prisma/dev.db` y vuelve a ejecutar los comandos

## 📁 Estructura del Proyecto

```
catalogo-sunass/
├── app/                       # Next.js App Router (raíz del proyecto)
│   ├── (dashboard)/          # Rutas protegidas
│   ├── api/                  # API Routes
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout principal
│   └── ...
├── components/               # Componentes React
├── lib/                      # Utilidades y configuraciones
├── prisma/                   # Base de datos
├── types/                    # Tipos TypeScript
├── middleware.ts             # Middleware NextAuth
└── ...
```

## 🧪 Tests

Ejecutar tests:
```bash
npm test
```

Tests incluidos:
1. **Permisos**: Verifica que usuarios regulares no puedan eliminar productos
2. **Validaciones**: Valida esquemas Zod para productos y filtros
3. **Utilidades**: Prueba funciones de formateo y etiquetas

## 🔄 Migración a PostgreSQL (Producción)

1. **Actualizar `prisma/schema.prisma`**
```prisma
datasource db {
  provider = "postgresql"  // Cambiar de "sqlite" a "postgresql"
  url      = env("DATABASE_URL")
}
```

2. **Configurar DATABASE_URL en .env**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/catalogo_sunass?schema=public"
```

3. **Ejecutar migraciones**
```bash
npm run db:migrate
npm run db:seed
```

## 🌐 Configuración de Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un proyecto nuevo
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0
5. Agregar URLs autorizadas:
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copiar Client ID y Client Secret al archivo `.env`

## 📊 Modelo de Datos

### User
- id, name, email, password, role (ADMIN|USER), createdAt

### Product
- id, name, type, description, url, owner, status, visibility
- Metadatos: eps, region, district, topic, period, source
- createdById, createdAt, updatedAt

### Tag
- id, name (único)

### ProductTag (Many-to-Many)
- productId, tagId

### AuditLog
- id, entity, entityId, action, userId, productId, diff (JSON), timestamp

## 🎯 Criterios de Aceptación Cumplidos

✅ Usuario regular puede crear/editar solo sus productos  
✅ Intentos de borrado por no-admin devuelven 403  
✅ Admin puede borrar cualquier producto y ver auditoría  
✅ Filtros funcionan combinados y son persistentes en URL  
✅ Paginación server-side (sin cargar todo en memoria)  
✅ Auditoría registra CREATE/UPDATE/DELETE/LOGIN con timestamp y usuario  
✅ Campo visibility (PUBLIC|INTERNAL) oculta productos internos para no autenticados  
✅ Selector de columnas visibles y botón "Copiar URL"  
✅ Tests para permisos, filtros y auditoría  
✅ Configuración para PostgreSQL en producción  
✅ Login con Google y mapeo de dominios @sunass.gob.pe

## 📝 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run start` - Inicia servidor de producción
- `npm run lint` - Ejecuta ESLint
- `npm run db:generate` - Genera cliente Prisma
- `npm run db:push` - Sincroniza esquema con BD (desarrollo)
- `npm run db:migrate` - Ejecuta migraciones (producción)
- `npm run db:seed` - Puebla la BD con usuarios de prueba (solo primera vez)
- `npm run db:reset` - **Resetea completamente la BD** (elimina todos los datos)
- `npm run db:studio` - Abre Prisma Studio
- `npm test` - Ejecuta tests
- `npm run test:watch` - Ejecuta tests en modo watch

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Validación de entrada con Zod en frontend y backend
- Protección de rutas con NextAuth
- RBAC implementado en API y UI
- Sanitización de URLs
- CSRF protection incluido en NextAuth

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno en el dashboard de Vercel:
   - `DATABASE_URL` (PostgreSQL)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` (opcional)
   - `ALLOWED_DOMAIN`
3. El archivo `vercel.json` ya está configurado automáticamente
4. Deploy automático en cada push

### Manual
```bash
# Variables de entorno necesarias
DATABASE_URL="postgresql://user:password@localhost:5432/catalogo_sunass?schema=public"
NEXTAUTH_SECRET="your-secret-key"
ALLOWED_DOMAIN="sunass.gob.pe"
```

### Configuración de Base de Datos en Producción
Para producción, configura PostgreSQL en lugar de SQLite:
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 📄 Licencia

Este proyecto es de uso interno para SUNASS.

## 👥 Soporte

Para preguntas o problemas, contactar al equipo de desarrollo.
