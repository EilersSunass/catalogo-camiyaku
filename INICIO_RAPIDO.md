# 🚀 Inicio Rápido - Catálogo SUNASS

## Opción 1: Setup Automático (Recomendado para Windows)

```powershell
cd e:\proyectos_windsurf\catalogo-sunass
.\setup.ps1
npm run dev
```

Luego abre: **http://localhost:3000**

---

## Opción 2: Setup Manual

### 1️⃣ Navegar al proyecto
```bash
cd e:\proyectos_windsurf\catalogo-sunass
```

### 2️⃣ Crear archivo .env
Crea un archivo `.env` en la raíz con este contenido:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="cambia-esto-por-un-secret-seguro"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
ALLOWED_DOMAIN="sunass.gob.pe"
```

**Importante**: Genera un `NEXTAUTH_SECRET` seguro:
```bash
openssl rand -base64 32
```

### 3️⃣ Instalar y configurar
```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

### 4️⃣ Iniciar servidor
```bash
npm run dev
```

### 5️⃣ Abrir en navegador
```
http://localhost:3000
```

---

## 🔑 Credenciales de Prueba

Después del seed, usa estas credenciales:

### Administrador
- **Email**: `admin@example.com`
- **Password**: `Password123!`
- **Permisos**: Acceso completo, puede eliminar productos y ver auditoría

### Usuario Regular
- **Email**: `user@example.com`
- **Password**: `Password123!`
- **Permisos**: Puede crear y editar sus propios productos

---

## ✅ Verificación

Después del setup, deberías poder:

1. ✅ Ver 15 productos de ejemplo en el catálogo
2. ✅ Iniciar sesión con las credenciales de prueba
3. ✅ Buscar y filtrar productos
4. ✅ Crear un nuevo producto
5. ✅ Editar tus productos
6. ✅ Ver auditoría (solo admin)
7. ✅ Gestionar usuarios (solo admin)

---

## 📁 Estructura de Archivos Creados

```
catalogo-sunass/
├── 📄 README.md              ← Documentación completa
├── 📄 FEATURES.md            ← Lista de características
├── 📄 COMANDOS.md            ← Comandos útiles
├── 📄 setup.md               ← Guía de setup detallada
├── 📄 setup.ps1              ← Script de setup automático
├── 📄 package.json           ← Dependencias
├── 📄 .env.example           ← Plantilla de variables de entorno
├── 📁 prisma/
│   ├── schema.prisma         ← Modelos de base de datos
│   └── seed.ts               ← Datos de prueba
├── 📁 src/
│   ├── 📁 app/               ← Páginas y API routes
│   ├── 📁 components/        ← Componentes React
│   ├── 📁 lib/               ← Utilidades y configuración
│   └── 📁 __tests__/         ← Tests
└── ...
```

---

## 🎯 Próximos Pasos

1. **Explorar la aplicación**
   - Navega por el catálogo
   - Prueba los filtros
   - Crea un producto nuevo

2. **Revisar el código**
   - Abre `src/app/(dashboard)/products/page.tsx`
   - Revisa `src/lib/validations/product.ts`
   - Explora `prisma/schema.prisma`

3. **Ejecutar tests**
   ```bash
   npm test
   ```

4. **Ver la base de datos**
   ```bash
   npm run db:studio
   ```

5. **Leer documentación**
   - `README.md` - Documentación completa
   - `FEATURES.md` - Características implementadas
   - `COMANDOS.md` - Comandos útiles

---

## 🐛 Problemas Comunes

### Error: "Prisma Client not generated"
```bash
npm run db:generate
```

### Error: "Database not found"
```bash
npm run db:push
```

### Base de datos vacía
```bash
npm run db:seed
```

### Puerto 3000 ocupado
```bash
npm run dev -- -p 3001
```

### Limpiar y reinstalar
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run db:generate
```

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa `COMANDOS.md` para comandos de troubleshooting
2. Verifica que Node.js 18+ esté instalado
3. Asegúrate de que el archivo `.env` esté configurado
4. Revisa los logs en la consola

---

## 🎉 ¡Listo!

Tu aplicación de Catálogo SUNASS está lista para usar.

**URL**: http://localhost:3000  
**Admin**: admin@example.com / Password123!  
**User**: user@example.com / Password123!

¡Disfruta explorando la aplicación! 🚀
