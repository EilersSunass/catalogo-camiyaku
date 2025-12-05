export const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  CAMI_YAKU: 'CAMI_YAKU',
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
  INTERNAL: 'INTERNAL', // Deprecated, mapped to EXTERNAL
  EXTERNAL: 'EXTERNAL', // Visible to logged in users (formerly INTERNAL)
  CAMI_YAKU: 'CAMI_YAKU', // Only Cami Yaku and Admin
} as const

export type Visibility = typeof Visibility[keyof typeof Visibility]

export const AuditAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
} as const

export type AuditAction = typeof AuditAction[keyof typeof AuditAction]
