// Tipos para reemplazar los enums de Prisma cuando se usa SQLite
export const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const

export type Role = typeof Role[keyof typeof Role]

export const ProductType = {
  DASHBOARD: 'DASHBOARD',
  FORM: 'FORM',
  REPORT: 'REPORT',
  TOOL: 'TOOL',
  OTHER: 'OTHER',
} as const

export type ProductType = typeof ProductType[keyof typeof ProductType]

export const ProductStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  DEPRECATED: 'DEPRECATED',
} as const

export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus]

export const Visibility = {
  PUBLIC: 'PUBLIC',
  INTERNAL: 'INTERNAL',
} as const

export type Visibility = typeof Visibility[keyof typeof Visibility]

export const AuditAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
} as const

export type AuditAction = typeof AuditAction[keyof typeof AuditAction]
