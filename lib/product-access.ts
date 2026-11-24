import type { Session } from 'next-auth'
import { prisma } from '@/lib/prisma'

export type AccessResult = 'ok' | 'login' | 'forbidden'

/**
 * Misma regla que el listado de productos:
 * - Sin sesión: solo PUBLIC.
 * - ADMIN y CAMI_YAKU: todo.
 * - EXTERNAL (SUNASS): PUBLIC, EXTERNAL, INTERNAL y los asignados.
 * - USER: PUBLIC y los asignados.
 */
export async function checkProductAccess(
  session: Session | null,
  product: { id: string; visibility: string }
): Promise<AccessResult> {
  if (product.visibility === 'PUBLIC') return 'ok'
  if (!session?.user) return 'login'

  const role = session.user.role
  if (role === 'ADMIN' || role === 'CAMI_YAKU') return 'ok'
  if (role === 'EXTERNAL' && product.visibility !== 'CAMI_YAKU') return 'ok'

  const direct = await prisma.userProductAccess.findUnique({
    where: { userId_productId: { userId: session.user.id, productId: product.id } },
  })
  return direct ? 'ok' : 'forbidden'
}

/** Ruta de almacenamiento permitida para el HTML de un producto. */
export const htmlPrefix = (productId: string) => `productos/${productId}/`

/** Acepta solo `productos/<id>/<archivo>.html` sin subcarpetas ni segmentos ambiguos. */
export function isOwnHtmlPath(productId: string, pathname: string): boolean {
  const prefix = htmlPrefix(productId)
  if (!pathname.startsWith(prefix)) return false
  const file = pathname.slice(prefix.length)
  return /^[\w.\-]+\.html?$/i.test(file) && !file.includes('..')
}

export const MAX_HTML_BYTES = 200 * 1024 * 1024
