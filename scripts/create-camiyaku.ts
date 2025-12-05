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

async function createCamiYakuUser() {
    console.log('\n🌿 Crear Usuario Cami Yaku\n')

    const email = await question('Email: ')
    const name = await question('Nombre (opcional): ')
    const password = await question('Contraseña: ')

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
                name: name || `Cami Yaku ${email.split('@')[0]}`,
                password: hashedPassword,
                role: 'CAMI_YAKU',
            },
        })

        console.log('\n✅ Usuario Cami Yaku creado exitosamente!')
        console.log(`   Email: ${user.email}`)
        console.log(`   Nombre: ${user.name}`)
        console.log(`   Rol: ${user.role}`)
    } catch (error) {
        console.error('❌ Error al crear usuario:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
        rl.close()
    }
}

createCamiYakuUser()
