# 🔐 Solución: Login no funciona en Vercel

## 🔴 Problema
No puedes iniciar sesión con las credenciales de prueba en tu aplicación desplegada en Vercel.

## 🎯 Causa
La base de datos PostgreSQL de Vercel está vacía (no tiene usuarios creados).

## ✅ Solución: Crear usuarios en la base de datos de Vercel

### Opción 1: Desde tu computadora (Recomendado)

#### Paso 1: Obtener la DATABASE_URL de Vercel
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Copia el valor de `DATABASE_URL`

#### Paso 2: Configurar localmente
Crea o edita `.env.local` en tu proyecto:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"
```
**⚠️ IMPORTANTE**: Pega la URL de producción de Vercel aquí temporalmente.

#### Paso 3: Ejecutar el seed
```bash
npm run db:seed-vercel
```

Este script:
- ✅ Verifica la conexión a la base de datos
- ✅ Lista usuarios existentes (si los hay)
- ✅ Crea usuarios de prueba:
  - `admin@example.com` / `Password123!`
  - `user@example.com` / `Password123!`
- ✅ Crea tags básicos

#### Paso 4: Probar el login
1. Ve a tu aplicación en Vercel: `https://tu-proyecto.vercel.app/login`
2. Inicia sesión con: `admin@example.com` / `Password123!`
3. ✅ ¡Debería funcionar!

#### Paso 5: Limpiar (Importante)
Elimina o comenta la `DATABASE_URL` de producción en `.env.local`:
```env
# DATABASE_URL="postgresql://..." # Comentada
DATABASE_URL="file:./dev.db" # Para desarrollo local
```

---

### Opción 2: Usar Prisma Studio conectado a producción

```bash
# 1. Configurar DATABASE_URL de producción en .env.local (temporal)
DATABASE_URL="postgresql://..."

# 2. Abrir Prisma Studio
npm run db:studio

# 3. Crear usuario manualmente:
# - Tabla: User
# - Campos:
#   - id: genera uno automático
#   - email: admin@example.com
#   - name: Admin
#   - password: $2a$10$YourHashHere (ver abajo cómo generar)
#   - role: ADMIN
#   - createdAt: NOW
#   - updatedAt: NOW

# 4. Limpiar .env.local
```

**Generar hash de contraseña**:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Password123!', 10).then(hash => console.log(hash))"
```

---

### Opción 3: SQL directo en la base de datos

Si tienes acceso directo a PostgreSQL de Vercel:

```sql
-- 1. Generar hash de contraseña primero (ver comando arriba)

-- 2. Insertar usuario admin
INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'admin_' || gen_random_uuid()::text,
  'admin@example.com',
  'Admin User',
  '$2a$10$TU_HASH_AQUI', -- Reemplaza con el hash generado
  'ADMIN',
  NOW(),
  NOW()
);

-- 3. Insertar usuario regular
INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'user_' || gen_random_uuid()::text,
  'user@example.com',
  'Regular User',
  '$2a$10$TU_HASH_AQUI', -- Mismo hash si quieres la misma contraseña
  'USER',
  NOW(),
  NOW()
);
```

---

## 🔍 Verificar que funcionó

### Desde Prisma Studio
```bash
# Conectar a producción temporalmente
DATABASE_URL="postgresql://..." npm run db:studio

# Verificar que existan usuarios en la tabla "User"
```

### Desde la aplicación
1. Ve a `https://tu-proyecto.vercel.app/login`
2. Intenta iniciar sesión con `admin@example.com` / `Password123!`
3. Si funciona, verás el dashboard

---

## 🚀 Después de crear usuarios

### Crear más usuarios desde la interfaz web
1. Inicia sesión como admin
2. Ve a `/users`
3. Clic en "Crear Usuario"
4. Completa el formulario y crea usuarios adicionales

### Cambiar las credenciales de prueba
1. Ve a `/users`
2. Busca `admin@example.com`
3. Puedes cambiar el email o crear un nuevo admin
4. Elimina los usuarios de prueba si lo deseas

---

## ⚠️ Notas Importantes

### Seguridad
- ✅ Nunca subas `.env.local` con credenciales de producción a Git
- ✅ Cambia las contraseñas de prueba en producción
- ✅ Usa contraseñas fuertes para usuarios reales

### DATABASE_URL
- En **desarrollo local**: `file:./dev.db` (SQLite)
- En **producción (Vercel)**: `postgresql://...` (PostgreSQL)
- **NO mezcles**: usa cada URL en su entorno correspondiente

### Backup
Antes de hacer cambios importantes en producción:
```bash
# Exportar datos (opcional)
DATABASE_URL="postgresql://..." npx prisma db pull
```

---

## 🐛 Troubleshooting

### "Error: Can't reach database server"
- Verifica que la `DATABASE_URL` sea correcta
- Verifica que tu IP esté permitida en Vercel Postgres (si aplica)
- Intenta desde otra red o VPN

### "Error: Invalid credentials"
- Verifica que el usuario exista en la base de datos
- Verifica que el hash de la contraseña sea correcto
- Intenta crear el usuario de nuevo

### "Error: NEXTAUTH_SECRET not found"
- Configura `NEXTAUTH_SECRET` en Vercel
- Genera uno: `openssl rand -base64 32`
- O usa: https://generate-secret.vercel.app/32

### Los usuarios no aparecen después de crearlos
- Espera 1-2 minutos (propagación)
- Verifica en Prisma Studio que se crearon
- Revisa los logs de Vercel

---

## 📚 Comandos Útiles

```bash
# Seed para base de datos de Vercel
npm run db:seed-vercel

# Seed para desarrollo local
npm run db:seed

# Crear admin interactivo
npm run create-admin

# Ver base de datos
npm run db:studio

# Sincronizar schema
npm run db:push
```

---

## ✅ Checklist Final

- [ ] `DATABASE_URL` configurada en Vercel
- [ ] `NEXTAUTH_SECRET` configurada en Vercel
- [ ] `NEXTAUTH_URL` configurada en Vercel
- [ ] Usuarios creados en la base de datos
- [ ] Login funciona con `admin@example.com`
- [ ] Módulo `/users` accesible para admin
- [ ] `.env.local` limpio (sin credenciales de producción)

**¡Listo para usar!** 🎉
