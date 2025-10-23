import { z } from 'zod'

export const auditActionEnum = z.enum(['CREATE', 'UPDATE', 'DELETE', 'LOGIN'])

export const auditFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  action: auditActionEnum.optional(),
  userId: z.string().optional(),
  entity: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type AuditFilters = z.infer<typeof auditFilterSchema>
