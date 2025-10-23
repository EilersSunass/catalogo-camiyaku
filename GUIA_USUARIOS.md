# 📚 Guía de Gestión de Usuarios

## 🎯 Resumen

El sistema tiene un módulo completo de gestión de usuarios que permite:
- ✅ Crear usuarios (Admin y Usuario regular)
- ✅ Modificar roles de usuarios
- ✅ Eliminar usuarios
- ✅ Solo accesible para usuarios ADMIN

## 🔐 Problema 1: No puedes iniciar sesión

### Causa
Si cambiaste de SQLite a PostgreSQL, la base de datos está vacía y no tiene usuarios.

### Solución: Crear usuarios iniciales

#### Opción A: Ejecutar el seed (Recomendado)
```bash
npm run db:seed
```

Esto creará:
- **Admin**: `admin@example.com` / `Password123!`
- **Usuario**: `user@example.com` / `Password123!`

#### Opción B: Crear admin manualmente con script
```bash
npx tsx scripts/create-admin.ts
```

Te pedirá:
- Email
- Nombre (opcional)
- Contraseña

#### Opción C: Crear admin desde PostgreSQL directamente
```sql
-- Conectar a tu base de datos PostgreSQL
-- Reemplaza 'tu_email@example.com' y genera un hash de bcrypt

INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'admin_' || gen_random_uuid()::text,
  'admin@sunass.gob.pe',
  'Administrador',
  '$2a$10$YourBcryptHashHere', -- Genera con: bcrypt.hash('tuPassword', 10)
  'ADMIN',
  NOW(),
  NOW()
);
```

Para generar el hash de bcrypt en Node.js:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('TuPassword123!', 10).then(hash => console.log(hash))"
```

## 👥 Módulo de Gestión de Usuarios

### Acceso
- **URL**: `/users`
- **Requisito**: Debes ser usuario ADMIN
- **Si no eres admin**: Serás redirigido a `/products`

### Funcionalidades

#### 1. Ver todos los usuarios
- Lista de usuarios con:
  - Nombre y email
  - Rol actual (USER o ADMIN)
  - Número de productos creados
  - Fecha de registro

#### 2. Crear nuevo usuario
1. Clic en **"Crear Usuario"**
2. Completa el formulario:
   - **Nombre** (opcional)
   - **Email** (requerido, debe ser único)
   - **Contraseña** (requerido, mínimo 8 caracteres)
   - **Rol** (USER o ADMIN)
3. Clic en **"Crear Usuario"**

#### 3. Modificar rol de usuario
1. En la tarjeta del usuario, usa el selector de rol
2. Selecciona **"Usuario"** o **"Admin"**
3. El cambio se aplica inmediatamente

#### 4. Eliminar usuario
1. Clic en **"Eliminar Usuario"** (botón rojo)
2. Confirma la acción en el diálogo
3. **Nota**: No puedes eliminar tu propia cuenta

## 🔧 Scripts disponibles

### Crear usuario admin
```bash
npx tsx scripts/create-admin.ts
```

### Ejecutar seed (crear usuarios de prueba)
```bash
npm run db:seed
```

### Resetear base de datos (SQLite local)
```bash
npm run db:reset
```

### Ver base de datos con Prisma Studio
```bash
npm run db:studio
```

## 🚀 Configuración en Producción (Vercel)

### 1. Asegurar que la base de datos PostgreSQL está configurada
En Vercel → Settings → Environment Variables:
```
DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public
NEXTAUTH_SECRET=tu_secreto_generado
NEXTAUTH_URL=https://tu-proyecto.vercel.app
```

### 2. Hacer push del schema a la base de datos
El script `build` en `package.json` ya incluye `prisma db push`:
```json
{
  "scripts": {
    "build": "prisma db push && next build"
  }
}
```

### 3. Crear usuario admin en producción

#### Opción A: Desde Prisma Studio (local conectado a prod)
```bash
# En .env.local, temporalmente usa la DATABASE_URL de producción
DATABASE_URL="postgresql://..."

# Abre Prisma Studio
npm run db:studio

# Crea el usuario manualmente en la interfaz
```

#### Opción B: Script SQL directo en la base de datos
Conecta a tu PostgreSQL de producción y ejecuta:
```sql
INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'admin_' || gen_random_uuid()::text,
  'admin@sunass.gob.pe',
  'Administrador SUNASS',
  '$2a$10$hash_generado_con_bcrypt',
  'ADMIN',
  NOW(),
  NOW()
);
```

#### Opción C: Ejecutar seed en producción (si tienes acceso SSH o función serverless)
```bash
# Conectar a la base de datos de producción
DATABASE_URL="postgresql://..." npm run db:seed
```

## 📝 Notas Importantes

### Seguridad
- ✅ Las contraseñas se hashean con bcrypt (10 rounds)
- ✅ Solo usuarios ADMIN pueden acceder al módulo de usuarios
- ✅ No puedes eliminar tu propia cuenta
- ✅ Los emails son únicos en el sistema

### Roles
- **USER**: Puede ver y crear productos
- **ADMIN**: Puede gestionar usuarios + todo lo que hace USER

### Validaciones
- Email debe ser válido y único
- Contraseña mínimo 8 caracteres (recomendado)
- Rol debe ser 'USER' o 'ADMIN'

## 🐛 Troubleshooting

### "No puedo iniciar sesión"
1. Verifica que la base de datos tenga usuarios: `npm run db:studio`
2. Si está vacía, ejecuta: `npm run db:seed`
3. Usa las credenciales: `admin@example.com` / `Password123!`

### "No veo el módulo de usuarios"
- Solo usuarios con rol ADMIN pueden acceder
- Verifica tu rol en Prisma Studio o pide a otro admin que te lo cambie

### "Error: Email ya existe"
- El email ya está registrado
- Usa otro email o elimina el usuario existente primero

### "Error de base de datos en producción"
1. Verifica que `DATABASE_URL` esté configurada en Vercel
2. Verifica que sea PostgreSQL (no SQLite)
3. Ejecuta `prisma db push` para sincronizar el schema

## 🎓 Ejemplo de Flujo Completo

### Desarrollo Local
```bash
# 1. Configurar base de datos
npm run db:push

# 2. Crear usuarios de prueba
npm run db:seed

# 3. Iniciar servidor
npm run dev

# 4. Iniciar sesión como admin
# Email: admin@example.com
# Password: Password123!

# 5. Ir a /users y gestionar usuarios
```

### Producción
```bash
# 1. Configurar variables en Vercel
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://...

# 2. Deploy (automático con push a GitHub)
git push origin main

# 3. Crear admin manualmente en PostgreSQL
# O usar Prisma Studio conectado a producción

# 4. Iniciar sesión y gestionar usuarios desde /users
```

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Vercel
2. Verifica la configuración de variables de entorno
3. Asegúrate de que el schema de Prisma esté sincronizado
4. Verifica que la base de datos PostgreSQL esté accesible
