# 📊 Instrucciones de Base de Datos

## 🔄 Comportamiento del Seed

El archivo `prisma/seed.ts` está configurado para **NO borrar datos existentes**.

### ✅ Primera Ejecución
Cuando ejecutas `npm run db:seed` por primera vez:
- ✅ Crea 2 usuarios de prueba (admin y user)
- ✅ Crea 8 tags básicos
- ✅ **NO crea productos ficticios**

### 🔒 Ejecuciones Posteriores
Si vuelves a ejecutar `npm run db:seed`:
- ⚠️ **NO borrará tus datos**
- ⚠️ **NO creará usuarios duplicados**
- ℹ️ Mostrará un mensaje indicando que ya existen datos

## 🗑️ Resetear la Base de Datos

Si necesitas empezar de cero:

### Opción 1: Comando automático (Recomendado)
```bash
npm run db:reset
```
Este comando:
- ✅ Elimina la base de datos actual
- ✅ Recrea la estructura
- ✅ Ejecuta el seed automáticamente

### Opción 2: Manual
```bash
# Eliminar la base de datos SQLite
rm prisma/dev.db

# Recrear la base de datos
npm run db:push

# Volver a ejecutar el seed
npm run db:seed
```

### Opción 3: Usar Prisma Studio
```bash
# Abrir Prisma Studio
npx prisma studio

# Eliminar manualmente los registros que desees
```

## 👥 Usuarios de Prueba

**Admin:**
- Email: `admin@example.com`
- Password: `Password123!`
- Rol: ADMIN (puede gestionar usuarios y productos)

**Usuario Regular:**
- Email: `user@example.com`
- Password: `Password123!`
- Rol: USER (puede crear y editar sus propios productos)

## 📝 Crear Productos

Los productos deben crearse desde la aplicación:

1. Inicia sesión con cualquiera de los usuarios de prueba
2. Ve a la sección "Productos"
3. Haz clic en "Nuevo Producto"
4. Completa el formulario con tus datos reales

## 🏷️ Tags Disponibles

El seed crea estos tags básicos:
- Agua Potable
- Saneamiento
- Tarifas
- Calidad
- Inversiones
- Comercial
- Operacional
- Financiero

Puedes crear más tags desde la aplicación al crear productos.

## ⚙️ Comandos Útiles

```bash
# Ver la base de datos en el navegador
npx prisma studio

# Regenerar el cliente de Prisma
npm run db:generate

# Aplicar cambios del schema a la BD
npm run db:push

# Ejecutar seed (solo si la BD está vacía)
npm run db:seed

# Iniciar el servidor de desarrollo
npm run dev
```

## 🔐 Seguridad

⚠️ **IMPORTANTE:** Los usuarios de prueba son solo para desarrollo. En producción:
- Cambia las contraseñas
- Usa variables de entorno para credenciales
- Configura autenticación con Google OAuth
