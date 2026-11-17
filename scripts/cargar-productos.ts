// Carga masiva de productos al catálogo desde un JSON.
// Uso:
//   npx tsx --env-file=.env scripts/cargar-productos.ts <archivo.json>           (simulación, no escribe)
//   npx tsx --env-file=.env scripts/cargar-productos.ts <archivo.json> --apply   (inserta)
// Omite productos cuya URL o nombre ya exista. Reutiliza etiquetas existentes y registra auditoría.
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'

type Entrada = {
  name: string
  type: string
  url: string
  visibility: string
  status?: string
  description?: string
  owner?: string
  topic?: string
  eps?: string
  region?: string
  district?: string
  period?: string
  source?: string
  showPreview?: boolean
  tags?: string[]
}

const TIPOS = ['DASHBOARD', 'MAP', 'FORM', 'REPORT', 'TOOL', 'OTHER']
const VISIBILIDADES = ['PUBLIC', 'EXTERNAL', 'INTERNAL', 'CAMI_YAKU']
const CREADOR = 'Gerald' // usuario ADMIN que figura como creador

const prisma = new PrismaClient()
const norm = (u: string) => u.trim().replace(/\/+$/, '').toLowerCase()

async function main() {
  const [archivo, flag] = process.argv.slice(2)
  if (!archivo) throw new Error('Falta el archivo JSON')
  const aplicar = flag === '--apply'
  const entradas: Entrada[] = JSON.parse(readFileSync(archivo, 'utf8'))

  const creador = await prisma.user.findFirst({ where: { name: CREADOR, role: 'ADMIN' } })
  if (!creador) throw new Error(`No existe el ADMIN ${CREADOR}`)

  const existentes = await prisma.product.findMany({ select: { name: true, url: true } })
  const urls = new Set(existentes.map(p => norm(p.url || '')))
  const nombres = new Set(existentes.map(p => p.name.trim().toLowerCase()))
  const tagsExistentes = new Set((await prisma.tag.findMany()).map(t => t.name))

  console.log(aplicar ? '== MODO APLICAR ==' : '== SIMULACIÓN (sin cambios) ==')
  let creados = 0
  for (const e of entradas) {
    if (!TIPOS.includes(e.type)) throw new Error(`Tipo inválido en "${e.name}": ${e.type}`)
    if (!VISIBILIDADES.includes(e.visibility)) throw new Error(`Visibilidad inválida en "${e.name}": ${e.visibility}`)
    if (urls.has(norm(e.url)) || nombres.has(e.name.trim().toLowerCase())) {
      console.log(`OMITIDO (ya existe): ${e.name}`)
      continue
    }
    const nuevasTags = (e.tags || []).filter(t => !tagsExistentes.has(t))
    console.log(`CREAR: ${e.name} | ${e.type} | ${e.visibility} | ${e.url} | tags: ${(e.tags || []).join(', ')}${nuevasTags.length ? ` (nuevas: ${nuevasTags.join(', ')})` : ''}`)
    if (!aplicar) continue

    const tags = await Promise.all(
      (e.tags || []).map(name => prisma.tag.upsert({ where: { name }, create: { name }, update: {} }))
    )
    const producto = await prisma.product.create({
      data: {
        name: e.name,
        type: e.type,
        url: e.url,
        description: e.description ?? '',
        owner: e.owner ?? '',
        status: e.status ?? 'ACTIVE',
        visibility: e.visibility,
        topic: e.topic ?? '',
        eps: e.eps, region: e.region, district: e.district, period: e.period, source: e.source,
        showPreview: e.showPreview ?? true,
        createdById: creador.id,
        tags: { create: tags.map(t => ({ tag: { connect: { id: t.id } } })) },
      },
    })
    await prisma.auditLog.create({
      data: {
        entity: 'Product', entityId: producto.id, action: 'CREATE',
        userId: creador.id, productId: producto.id,
        diff: JSON.stringify({ created: true, origen: 'carga-masiva' }),
      },
    })
    creados++
  }
  console.log(aplicar ? `Creados: ${creados}` : 'Simulación terminada. Usa --apply para insertar.')
}

main().catch(e => { console.error(e.message); process.exit(1) }).finally(() => prisma.$disconnect())
