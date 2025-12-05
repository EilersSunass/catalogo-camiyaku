import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyData() {
    console.log('🔍 Verificando datos...')

    // 1. Verificar Usuario Cami Yaku
    const camiUser = await prisma.user.findUnique({
        where: { email: 'cami@yaku.com' },
        select: { email: true, role: true }
    })

    if (camiUser && camiUser.role === 'CAMI_YAKU') {
        console.log('✅ Usuario Cami Yaku existe y tiene el rol correcto.')
    } else {
        console.error('❌ Error con usuario Cami Yaku:', camiUser)
    }

    // 2. Verificar Admin
    const adminUser = await prisma.user.findUnique({
        where: { email: 'admin@example.com' },
        select: { email: true, role: true }
    })

    if (adminUser && adminUser.role === 'ADMIN') {
        console.log('✅ Usuario Admin existe y tiene el rol correcto.')
    }

    console.log('🏁 Verificación completada.')
}

verifyData()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
