# ⚙️ Configurar Variables de Entorno en Vercel

## 🔴 Problema Actual

Vercel no puede encontrar la variable `DATABASE_URL`:
```
error: Environment variable not found: DATABASE_URL
```

## ✅ Solución: Configurar Variables en Vercel

### 📋 Paso a Paso

1. **Ve al Dashboard de Vercel**
   - https://vercel.com/dashboard
   - Selecciona tu proyecto: **catalogo-camiyaku**

2. **Ve a Settings → Environment Variables**
   - Clic en **"Settings"** en el menú superior
   - Clic en **"Environment Variables"** en el menú lateral

3. **Agregar Variables de Entorno**

#### Variable 1: DATABASE_URL (REQUERIDA)
```
Name: DATABASE_URL
Value: postgresql://usuario:password@host:5432/database?schema=public
Environments: Production, Preview, Development
```

**⚠️ IMPORTANTE:** 
- Debes usar **PostgreSQL** en producción, no SQLite
- Si no tienes PostgreSQL, puedes usar **Vercel Postgres**:
  1. Ve a **Storage** → **Create Database**
  2. Selecciona **Postgres**
  3. Copia la `DATABASE_URL` que te proporciona

#### Variable 2: NEXTAUTH_SECRET (REQUERIDA)
```
Name: NEXTAUTH_SECRET
Value: [genera un secreto aleatorio]
Environments: Production, Preview, Development
```

Para generar un secreto seguro:
```bash
openssl rand -base64 32
```
O usa: https://generate-secret.vercel.app/32

#### Variable 3: NEXTAUTH_URL (REQUERIDA)
```
Name: NEXTAUTH_URL
Value: https://tu-proyecto.vercel.app
Environments: Production
```

#### Variable 4: ALLOWED_DOMAIN (OPCIONAL)
```
Name: ALLOWED_DOMAIN
Value: sunass.gob.pe
Environments: Production, Preview, Development
```

#### Variables 5 y 6: Google OAuth (OPCIONAL)
```
Name: GOOGLE_CLIENT_ID
Value: [tu client id de Google]
Environments: Production, Preview, Development

Name: GOOGLE_CLIENT_SECRET
Value: [tu client secret de Google]
Environments: Production, Preview, Development
```

### 🗄️ Configurar Base de Datos PostgreSQL

#### Opción A: Vercel Postgres (Recomendado)
1. En tu proyecto de Vercel, ve a **Storage**
2. Clic en **Create Database**
3. Selecciona **Postgres**
4. Sigue el wizard
5. La `DATABASE_URL` se agregará automáticamente

#### Opción B: PostgreSQL Externo
Puedes usar:
- **Supabase** (gratis): https://supabase.com
- **Railway** (gratis): https://railway.app
- **Neon** (gratis): https://neon.tech

### 🔄 Actualizar schema.prisma para PostgreSQL

Antes de hacer deploy, actualiza `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Cambiar de "sqlite" a "postgresql"
  url      = env("DATABASE_URL")
}
```

### 📝 Resumen de Variables Requeridas

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | ✅ SÍ | URL de PostgreSQL |
| `NEXTAUTH_SECRET` | ✅ SÍ | Secreto para NextAuth |
| `NEXTAUTH_URL` | ✅ SÍ | URL de tu app |
| `ALLOWED_DOMAIN` | ⚠️ Opcional | Dominio permitido |
| `GOOGLE_CLIENT_ID` | ⚠️ Opcional | OAuth Google |
| `GOOGLE_CLIENT_SECRET` | ⚠️ Opcional | OAuth Google |

### 🚀 Después de Configurar

1. **Redeploy** el proyecto en Vercel
2. Las variables estarán disponibles
3. El build debería completarse exitosamente

---

## 🔍 Verificar que Funcionó

Después del deploy:
1. Ve a los logs del deployment
2. No deberías ver el error `DATABASE_URL not found`
3. El build debería completarse con éxito

**¡Configura las variables de entorno y haz redeploy!** 🎉
