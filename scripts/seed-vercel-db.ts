/**
 * Script para crear usuarios de prueba en la base de datos de Vercel Postgres
 * 
 * Uso:
 * 1. Asegúrate de tener DATABASE_URL configurada en .env o .env.local
 * 2. Ejecuta: npm run seed-vercel
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Vercel Postgres database...\n')

  try {
    // Verificar conexión
    await prisma.$connect()
    console.log('✅ Conexión a base de datos exitosa\n')

    // Verificar si ya existen usuarios
    const existingUsers = await prisma.user.count()
    
    if (existingUsers > 0) {
      console.log(`⚠️  La base de datos ya tiene ${existingUsers} usuario(s).`)
      console.log('💡 Listando usuarios existentes:\n')
      
      const users = await prisma.user.findMany({
        select: {
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      })
      
      users.forEach((user) => {
        console.log(`   📧 ${user.email}`)
        console.log(`      Nombre: ${user.name || 'Sin nombre'}`)
        console.log(`      Rol: ${user.role}`)
        console.log(`      Creado: ${user.createdAt.toLocaleDateString()}\n`)
      })
      
      console.log('❓ ¿Deseas crear usuarios de prueba de todas formas? (Ctrl+C para cancelar)')
      console.log('   Esperando 5 segundos...\n')
      
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash('Password123!', 10)

    // Crear usuario admin
    console.log('📝 Creando usuario administrador...')
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
      },
    })
    console.log(`✅ Admin creado: ${adminUser.email}\n`)

    // Crear usuario regular
    console.log('📝 Creando usuario regular...')
    const regularUser = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: 'Regular User',
        password: hashedPassword,
        role: 'USER',
      },
    })
    console.log(`✅ Usuario creado: ${regularUser.email}\n`)

    // Crear tags básicos
    console.log('📝 Creando tags básicos...')
    const tagNames = [
      'Agua Potable',
      'Saneamiento',
      'Tarifas',
      'Calidad',
      'Inversiones',
      'Comercial',
      'Operacional',
      'Financiero',
    ]

    for (const tagName of tagNames) {
      await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      })
    }
    console.log(`✅ ${tagNames.length} tags creados/verificados\n`)

    console.log('🎉 Seed completado exitosamente!\n')
    console.log('📝 Credenciales de prueba:')
    console.log('   Admin: admin@example.com / Password123!')
    console.log('   User:  user@example.com / Password123!\n')
    console.log('💡 Ahora puedes iniciar sesión en tu aplicación de Vercel\n')

  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
