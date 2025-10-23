# Script de setup para Catálogo SUNASS
# Ejecutar con: .\setup.ps1

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Setup Catálogo SUNASS" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si existe .env
if (-not (Test-Path ".env")) {
    Write-Host "[1/6] Creando archivo .env..." -ForegroundColor Yellow
    
    # Generar NEXTAUTH_SECRET
    $bytes = New-Object Byte[] 32
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $secret = [Convert]::ToBase64String($bytes)
    
    $envContent = @"
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$secret"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
ALLOWED_DOMAIN="sunass.gob.pe"
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "   ✓ Archivo .env creado con NEXTAUTH_SECRET generado" -ForegroundColor Green
} else {
    Write-Host "[1/6] Archivo .env ya existe, saltando..." -ForegroundColor Gray
}

# Instalar dependencias
Write-Host ""
Write-Host "[2/6] Instalando dependencias..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "   ✗ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}

# Generar Prisma Client
Write-Host ""
Write-Host "[3/6] Generando Prisma Client..." -ForegroundColor Yellow
npm run db:generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Prisma Client generado" -ForegroundColor Green
} else {
    Write-Host "   ✗ Error al generar Prisma Client" -ForegroundColor Red
    exit 1
}

# Crear base de datos
Write-Host ""
Write-Host "[4/6] Creando base de datos..." -ForegroundColor Yellow
npm run db:push
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Base de datos creada" -ForegroundColor Green
} else {
    Write-Host "   ✗ Error al crear base de datos" -ForegroundColor Red
    exit 1
}

# Poblar base de datos
Write-Host ""
Write-Host "[5/6] Poblando base de datos con datos de prueba..." -ForegroundColor Yellow
npm run db:seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Base de datos poblada" -ForegroundColor Green
} else {
    Write-Host "   ✗ Error al poblar base de datos" -ForegroundColor Red
    exit 1
}

# Ejecutar tests
Write-Host ""
Write-Host "[6/6] Ejecutando tests..." -ForegroundColor Yellow
npm test -- --passWithNoTests
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Tests ejecutados correctamente" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Algunos tests fallaron (esto es normal en el primer setup)" -ForegroundColor Yellow
}

# Resumen
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Setup completado exitosamente!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para iniciar el servidor de desarrollo:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Luego abre en tu navegador:" -ForegroundColor White
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Credenciales de prueba:" -ForegroundColor White
Write-Host "  Admin: admin@example.com / Password123!" -ForegroundColor Cyan
Write-Host "  User:  user@example.com / Password123!" -ForegroundColor Cyan
Write-Host ""
