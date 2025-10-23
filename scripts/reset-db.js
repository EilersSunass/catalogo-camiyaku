#!/usr/bin/env node

/**
 * Script para resetear la base de datos
 * Elimina el archivo dev.db y vuelve a crear la estructura
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db')
const dbJournalPath = path.join(__dirname, '..', 'prisma', 'dev.db-journal')

console.log('🗑️  Reseteando base de datos...\n')

// Eliminar archivos de base de datos si existen
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath)
  console.log('✅ Eliminado: dev.db')
}

if (fs.existsSync(dbJournalPath)) {
  fs.unlinkSync(dbJournalPath)
  console.log('✅ Eliminado: dev.db-journal')
}

console.log('\n📊 Recreando base de datos...\n')

try {
  // Ejecutar db:push para crear la estructura
  execSync('npm run db:push', { stdio: 'inherit' })
  
  console.log('\n🌱 Ejecutando seed...\n')
  
  // Ejecutar seed para crear usuarios y tags
  execSync('npm run db:seed', { stdio: 'inherit' })
  
  console.log('\n✨ ¡Base de datos reseteada exitosamente!')
  console.log('\n📝 Puedes iniciar sesión con:')
  console.log('   Admin: admin@example.com / Password123!')
  console.log('   User:  user@example.com / Password123!')
  
} catch (error) {
  console.error('\n❌ Error al resetear la base de datos:', error.message)
  process.exit(1)
}
