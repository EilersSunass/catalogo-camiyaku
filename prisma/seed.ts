import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Verificar si ya existen usuarios
  const existingUsers = await prisma.user.count()
  
  if (existingUsers > 0) {
    console.log('⚠️  La base de datos ya tiene usuarios. No se crearán datos de ejemplo.')
    console.log('💡 Si deseas resetear la base de datos, elimina el archivo dev.db y vuelve a ejecutar el seed.')
    return
  }

  // Crear usuarios solo si no existen
  const hashedPassword = await bcrypt.hash('Password123!', 10)

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Regular User',
      password: hashedPassword,
      role: 'USER',
    },
  })

  console.log('✅ Created users:', { admin: adminUser.email, user: regularUser.email })

  // Crear tags básicos
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Agua Potable' } }),
    prisma.tag.create({ data: { name: 'Saneamiento' } }),
    prisma.tag.create({ data: { name: 'Tarifas' } }),
    prisma.tag.create({ data: { name: 'Calidad' } }),
    prisma.tag.create({ data: { name: 'Inversiones' } }),
    prisma.tag.create({ data: { name: 'Comercial' } }),
    prisma.tag.create({ data: { name: 'Operacional' } }),
    prisma.tag.create({ data: { name: 'Financiero' } }),
  ])

  console.log(`✅ Created ${tags.length} tags`)

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📝 Test credentials:')
  console.log('   Admin: admin@example.com / Password123!')
  console.log('   User:  user@example.com / Password123!')
  console.log('\n💡 No se crearon productos de ejemplo. Puedes crear tus propios productos desde la aplicación.')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
