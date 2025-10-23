# Guía Rápida de Setup

## Pasos para iniciar el proyecto

### 1. Crear archivo .env
Copia el contenido de `.env.example` a un nuevo archivo `.env`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui-cambiar-en-produccion"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
ALLOWED_DOMAIN="sunass.gob.pe"
```

**Importante**: Genera un NEXTAUTH_SECRET seguro ejecutando:
```bash
openssl rand -base64 32
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar base de datos
```bash
# Generar cliente Prisma
npm run db:generate

# Crear base de datos y tablas
npm run db:push

# Poblar con datos de prueba
npm run db:seed
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```

### 5. Abrir en navegador
Visita: http://localhost:3000

### 6. Login con credenciales de prueba
- **Admin**: admin@example.com / Password123!
- **User**: user@example.com / Password123!

## Verificación

Después del setup, deberías poder:
- ✅ Ver el listado de 15 productos de ejemplo
- ✅ Iniciar sesión con las credenciales de prueba
- ✅ Crear, editar y ver productos
- ✅ Usar filtros y búsqueda
- ✅ Ver auditoría (solo admin)
- ✅ Gestionar usuarios (solo admin)

## Troubleshooting

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
Cambia el puerto en el comando:
```bash
npm run dev -- -p 3001
```
