import { Role } from '@/types/prisma'

export function canDeleteProduct(userRole: Role, productOwnerId: string, userId: string): boolean {
  return userRole === 'ADMIN' || userRole === 'CAMI_YAKU'
}

export function canEditProduct(userRole: Role, productOwnerId: string, userId: string): boolean {
  return userRole === 'ADMIN' || userRole === 'CAMI_YAKU'
}

export function canViewAudit(userRole: Role): boolean {
  return userRole === 'ADMIN'
}

export function canManageUsers(userRole: Role): boolean {
  return userRole === 'ADMIN'
}

export function canChangeProductStatus(userRole: Role): boolean {
  return userRole === 'ADMIN'
}
