
import type { TOrderStatus } from '#/types/order'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react';

const statusStyles: Record<
  TOrderStatus,
  {
    label: string
    color: string
    bg: string
    icon: LucideIcon
  }
> = {
  queued: {
    label: 'Queued',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    icon: Clock3,
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    icon: Activity,
  },
  blocked: {
    label: 'Blocked',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    icon: AlertTriangle,
  },
  finished: {
    label: 'Finished',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    icon: CheckCircle2,
  },
}

type StatusCardProps = {
  status: TOrderStatus
  value: number
}

export const  StatusCard = ({ status, value }: StatusCardProps) => {
  const { label, color, bg, icon: Icon } = statusStyles[status]

  return (
    <div
      className={`flex flex-row items-center justify-between rounded-lg px-4 py-2 ${bg}`}
    >
      <div className="flex items-center gap-3">
        <div className={`rounded-lg ${color}`}>
          <Icon className="size-6" />
        </div>

        <p className="text-sm text-slate-500">{label}</p>
      </div>

      <div className="flex flex-col items-center">
        <p className="text-3xl font-semibold tabular-nums">
          {value}
        </p>
        <p className="text-xs text-slate-400">Orders</p>
      </div>
    </div>
  )
}
