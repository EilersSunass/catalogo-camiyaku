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

async function createUser() {
    console.log('\n👤 Crear Nuevo Usuario\n')

    const email = await question('Email: ')
    const name = await question('Nombre (opcional): ')
    const password = await question('Contraseña: ')

    console.log('\nRoles disponibles: USER, CAMI_YAKU, ADMIN')
    let roleInput = await question('Rol (default: USER): ')

    // Normalizar rol
    const roleMap: Record<string, string> = {
        'user': 'USER',
        'admin': 'ADMIN',
        'cami': 'CAMI_YAKU',
        'cami_yaku': 'CAMI_YAKU',
        'camiyaku': 'CAMI_YAKU'
    }

    let role = roleInput.trim() || 'USER'
    if (roleMap[role.toLowerCase()]) {
        role = roleMap[role.toLowerCase()]
    }

    // Validar rol final
    if (!['USER', 'ADMIN', 'CAMI_YAKU'].includes(role)) {
        console.log(`⚠️ Rol '${role}' no reconocido. Se usará 'USER'.`)
        role = 'USER'
    }

    if (!email || !password) {
        console.error('❌ Email y contraseña son requeridos')
        process.exit(1)
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            console.error(`❌ El usuario con email ${email} ya existe`)
            process.exit(1)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                name: name || email.split('@')[0],
                password: hashedPassword,
                role,
            },
        })

        console.log('\n✅ Usuario creado exitosamente!')
        console.log(`   Email: ${user.email}`)
        console.log(`   Nombre: ${user.name}`)
        console.log(`   Rol: ${user.role}`)
        console.log('\n💡 Listo para iniciar sesión.\n')
    } catch (error) {
        console.error('❌ Error al crear usuario:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
        rl.close()
    }
}

createUser()
