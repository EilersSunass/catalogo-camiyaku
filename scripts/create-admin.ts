import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function createAdmin() {
  console.log('\n🔐 Crear Usuario Administrador\n')

  const email = await question('Email: ')
  const name = await question('Nombre (opcional): ')
  const password = await question('Contraseña: ')

  if (!email || !password) {
    console.error('❌ Email y contraseña son requeridos')
    process.exit(1)
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.error(`❌ El usuario con email ${email} ya existe`)
      process.exit(1)
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario admin
    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    console.log('\n✅ Usuario administrador creado exitosamente!')
    console.log(`   Email: ${user.email}`)
    console.log(`   Nombre: ${user.name}`)
    console.log(`   Rol: ${user.role}`)
    console.log('\n💡 Ahora puedes iniciar sesión con estas credenciales\n')
  } catch (error) {
    console.error('❌ Error al crear usuario:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

createAdmin()
