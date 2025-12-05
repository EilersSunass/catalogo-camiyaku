import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createCamiYakuUserAuto() {
    console.log('🌿 Creando Usuario Cami Yaku Automáticamente...')

    const email = 'cami@yaku.com'
    const password = 'Password123!'
    const name = 'Cami Yaku User'

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            console.log(`ℹ️ El usuario ${email} ya existe. Actualizando rol...`)
            await prisma.user.update({
                where: { email },
                data: { role: 'CAMI_YAKU' }
            })
            console.log('✅ Rol actualizado a CAMI_YAKU')
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'CAMI_YAKU',
            },
        })

        console.log('\n✅ Usuario Cami Yaku creado exitosamente!')
        console.log(`   Email: ${user.email}`)
        console.log(`   Rol: ${user.role}`)
    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

createCamiYakuUserAuto()
