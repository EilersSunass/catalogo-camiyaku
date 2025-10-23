import { z } from 'zod'

export const productTypeEnum = z.enum(['DASHBOARD', 'FORM', 'REPORT', 'TOOL', 'OTHER'])
export const productStatusEnum = z.enum(['DRAFT', 'ACTIVE', 'DEPRECATED'])
export const visibilityEnum = z.enum(['PUBLIC', 'INTERNAL'])

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  type: productTypeEnum,
  description: z.string().max(2000, 'Máximo 2000 caracteres').optional().nullable(),
  url: z
    .string()
    .url('Debe ser una URL válida')
    .regex(/^https?:\/\//, 'La URL debe comenzar con http:// o https://')
    .optional()
    .nullable()
    .or(z.literal('')),
  owner: z.string().max(100, 'Máximo 100 caracteres').optional().nullable(),
  status: productStatusEnum,
  visibility: visibilityEnum,
  eps: z.string().max(100, 'Máximo 100 caracteres').optional().nullable(),
  region: z.string().max(100, 'Máximo 100 caracteres').optional().nullable(),
  district: z.string().max(100, 'Máximo 100 caracteres').optional().nullable(),
  topic: z.string().max(100, 'Máximo 100 caracteres').optional().nullable(),
  period: z.string().max(50, 'Máximo 50 caracteres').optional().nullable(),
  source: z.string().max(200, 'Máximo 200 caracteres').optional().nullable(),
  tags: z.array(z.string()).optional(),
})

export const productFilterSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  type: productTypeEnum.optional(),
  status: productStatusEnum.optional(),
  visibility: visibilityEnum.optional(),
  eps: z.string().optional(),
  region: z.string().optional(),
  district: z.string().optional(),
  topic: z.string().optional(),
  period: z.string().optional(),
  owner: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  sortBy: z.enum(['updatedAt', 'name', 'status', 'createdAt']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type ProductFormData = z.infer<typeof productSchema>
export type ProductFilters = z.infer<typeof productFilterSchema>
