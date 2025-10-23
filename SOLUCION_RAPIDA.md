# ⚡ Solución Rápida - Login y Usuarios

## 🔴 Problema 1: No puedo iniciar sesión

### Causa
La base de datos PostgreSQL está vacía (no tiene usuarios).

### Solución Inmediata
```bash
# Opción 1: Crear usuarios de prueba (Recomendado)
npm run db:seed

# Credenciales creadas:
# Admin: admin@example.com / Password123!
# User:  user@example.com / Password123!
```

```bash
# Opción 2: Crear tu propio admin
npm run create-admin

# Te pedirá:
# - Email
# - Nombre
# - Contraseña
```

## ✅ Problema 2: Módulo de Gestión de Usuarios

### Ya está implementado y funcionando

**Ubicación**: `/users` (solo para ADMIN)

**Funcionalidades**:
- ✅ Crear nuevos usuarios (ADMIN o USER)
- ✅ Modificar roles de usuarios
- ✅ Eliminar usuarios
- ✅ Ver lista de todos los usuarios

### Cómo usar:
1. Inicia sesión como ADMIN
2. Ve a `http://localhost:3000/users`
3. Clic en **"Crear Usuario"** para agregar nuevos usuarios
4. Usa el selector de rol para cambiar USER ↔ ADMIN
5. Clic en **"Eliminar Usuario"** para borrar (con confirmación)

## 📋 Comandos Útiles

```bash
# Crear usuarios de prueba
npm run db:seed

# Crear admin interactivo
npm run create-admin

# Ver base de datos
npm run db:studio

# Sincronizar schema con BD
npm run db:push

# Iniciar servidor
npm run dev
```

## 🚀 Setup Completo (Primera Vez)

```bash
# 1. Instalar dependencias
npm install

# 2. Sincronizar base de datos
npm run db:push

# 3. Crear usuarios de prueba
npm run db:seed

# 4. Iniciar servidor
npm run dev

# 5. Abrir navegador
# http://localhost:3000/login

# 6. Iniciar sesión
# Email: admin@example.com
# Password: Password123!

# 7. Ir a gestión de usuarios
# http://localhost:3000/users
```

## 🔧 Producción (Vercel)

### Variables de Entorno Requeridas
```
DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public
NEXTAUTH_SECRET=tu_secreto_generado_32_caracteres
NEXTAUTH_URL=https://tu-proyecto.vercel.app
```

### Crear Admin en Producción
Ver guía completa en `GUIA_USUARIOS.md` sección "Configuración en Producción"

## 📚 Más Información

- **Guía completa**: `GUIA_USUARIOS.md`
- **Configuración Vercel**: `CONFIGURAR_VERCEL.md`
- **Resumen de cambios**: `RESUMEN_CAMBIOS.md`

## ⚠️ Notas Importantes

- El módulo `/users` solo es accesible para usuarios con rol ADMIN
- No puedes eliminar tu propia cuenta
- Las contraseñas se hashean con bcrypt (seguras)
- Los emails deben ser únicos en el sistema
