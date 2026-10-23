import type { ResourceStatus } from "#/components/Table"

export const resourceStatusStyles: Record<ResourceStatus, string> = {
  busy: 'bg-blue-50 text-blue-700',
  idle: 'bg-slate-100 text-slate-600',
  blocked: 'bg-amber-50 text-amber-700',
}

export const resourceStatusLabels: Record<ResourceStatus, string> = {
  busy: 'Busy',
  idle: 'Idle',
  blocked: 'Blocked',
}

export const resourceBarStyles: Record<ResourceStatus, string> = {
  busy: 'bg-blue-600',
  idle: 'bg-slate-400',
  blocked: 'bg-amber-500',
}
