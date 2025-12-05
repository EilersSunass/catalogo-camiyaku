import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function getProductTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    DASHBOARD: 'Dashboard',
    FORM: 'Formulario',
    REPORT: 'Reporte',
    TOOL: 'Herramienta',
    OTHER: 'Otro',
  }
  return labels[type] || type
}

export function getProductStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: 'Borrador',
    ACTIVE: 'Activo',
    DEPRECATED: 'Obsoleto',
  }
  return labels[status] || status
}

export function getVisibilityLabel(visibility: string): string {
  const labels: Record<string, string> = {
    PUBLIC: 'Público',
    INTERNAL: 'Externo (Legacy)', // Keeping for backward compat in UI if needed
    EXTERNAL: 'Externo',
    CAMI_YAKU: 'Cami Yaku',
  }
  return labels[visibility] || visibility
}

export function getAuditActionLabel(action: string): string {
  const labels: Record<string, string> = {
    CREATE: 'Creación',
    UPDATE: 'Actualización',
    DELETE: 'Eliminación',
    LOGIN: 'Inicio de sesión',
  }
  return labels[action] || action
}
