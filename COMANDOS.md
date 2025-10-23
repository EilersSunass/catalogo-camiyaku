# Comandos Útiles - Catálogo SUNASS

## 🚀 Inicio Rápido

### Setup Automático (Windows)
```powershell
.\setup.ps1
```

### Setup Manual
```bash
# 1. Crear .env (copiar de .env.example y configurar)
# 2. Instalar dependencias
npm install

# 3. Setup de base de datos
npm run db:generate
npm run db:push
npm run db:seed

# 4. Iniciar servidor
npm run dev
```

## 📦 Gestión de Dependencias

```bash
# Instalar todas las dependencias
npm install

# Agregar nueva dependencia
npm install <package-name>

# Agregar dependencia de desarrollo
npm install -D <package-name>

# Actualizar dependencias
npm update
```

## 🗄️ Base de Datos

```bash
# Generar Prisma Client (después de cambios en schema.prisma)
npm run db:generate

# Sincronizar esquema con BD (desarrollo)
npm run db:push

# Crear migración (producción)
npm run db:migrate

# Poblar BD con datos de prueba
npm run db:seed

# Abrir Prisma Studio (GUI para ver/editar datos)
npm run db:studio

# Reset completo de BD (¡CUIDADO! Borra todos los datos)
npx prisma migrate reset
```

## 🏃 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Iniciar en otro puerto
npm run dev -- -p 3001

# Build para producción
npm run build

# Iniciar servidor de producción
npm run start

# Linter
npm run lint

# Linter con auto-fix
npm run lint -- --fix
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm test -- --coverage

# Ejecutar un test específico
npm test -- permissions.test.ts
```

## 🔧 Prisma

```bash
# Ver esquema actual
npx prisma db pull

# Formatear schema.prisma
npx prisma format

# Validar schema.prisma
npx prisma validate

# Ver estado de migraciones
npx prisma migrate status

# Crear migración sin aplicar
npx prisma migrate dev --create-only

# Aplicar migraciones pendientes
npx prisma migrate deploy
```

## 🐛 Debugging

```bash
# Limpiar caché de Next.js
rm -rf .next

# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Ver logs de Prisma
$env:DEBUG="prisma:*"
npm run dev

# Verificar versiones
node --version
npm --version
npx prisma --version
```

## 📊 Datos de Prueba

### Usuarios
- **Admin**: admin@example.com / Password123!
- **User**: user@example.com / Password123!

### Recrear datos de prueba
```bash
# Borrar y recrear BD con datos de prueba
npx prisma migrate reset --force
npm run db:seed
```

## 🔄 Cambiar de SQLite a PostgreSQL

1. **Actualizar `prisma/schema.prisma`**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. **Actualizar `.env`**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/catalogo_sunass"
```

3. **Ejecutar migraciones**:
```bash
npm run db:migrate
npm run db:seed
```

## 🌐 Despliegue

### Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Variables de entorno en producción
Configurar en el panel de Vercel:
- `DATABASE_URL` (PostgreSQL)
- `NEXTAUTH_URL` (URL de producción)
- `NEXTAUTH_SECRET` (generar nuevo)
- `GOOGLE_CLIENT_ID` (opcional)
- `GOOGLE_CLIENT_SECRET` (opcional)

## 📝 Notas

- El archivo `.env` NO debe subirse a git (está en .gitignore)
- Usa `.env.example` como plantilla
- Genera un nuevo `NEXTAUTH_SECRET` para producción
- La BD SQLite se guarda en `prisma/dev.db`
- Los logs de auditoría se guardan automáticamente
