import { useState } from 'react'
import { Boxes, Cog, Layers3 } from 'lucide-react'

type MaterialStock = {
  name: string
  unit: string
  stock: number
  /** used by finished / in-progress steps */
  consumed: number
  /** allocated to queued steps */
  reserved: number
}

type ResourceStatus = 'busy' | 'idle' | 'blocked'

type ResourceItem = {
  name: string
  group: 'Machine' | 'Assembly' | 'QC' | 'Packaging'
  status: ResourceStatus
  /** utilization across the visible timeline window */
  utilization: number
  /** current order if busy/blocked, next order if idle */
  order: string
  note: string
}

const LOW_STOCK_RATIO = 0.2

const materials: MaterialStock[] = [
  { name: 'Material A', unit: 'kg', stock: 100, consumed: 37, reserved: 14 },
  { name: 'Material B', unit: 'pcs', stock: 60, consumed: 24, reserved: 21 },
  { name: 'Fasteners', unit: 'pcs', stock: 300, consumed: 122, reserved: 105 },
  { name: 'Material C', unit: 'boxes', stock: 40, consumed: 4, reserved: 18 },
  { name: 'Calibration Fluid', unit: 'L', stock: 5, consumed: 1.5, reserved: 1 },
  { name: 'Label Roll', unit: 'rolls', stock: 6, consumed: 1, reserved: 2 },
]

const resources: ResourceItem[] = [
  {
    name: 'Machine 01',
    group: 'Machine',
    status: 'idle',
    utilization: 72,
    order: 'ORD-004',
    note: 'Next in 10 min',
  },
  {
    name: 'Machine 02',
    group: 'Machine',
    status: 'idle',
    utilization: 55,
    order: 'ORD-005',
    note: 'Next in 90 min',
  },
  {
    name: 'Assembly Station 01',
    group: 'Assembly',
    status: 'busy',
    utilization: 85,
    order: 'ORD-002',
    note: 'Ends in 60 min',
  },
  {
    name: 'Assembly Station 02',
    group: 'Assembly',
    status: 'blocked',
    utilization: 40,
    order: 'ORD-003',
    note: 'Blocked 30 min ago',
  },
  {
    name: 'QC Station 01',
    group: 'QC',
    status: 'idle',
    utilization: 45,
    order: 'ORD-002',
    note: 'Next in 60 min',
  },
  {
    name: 'Packaging Station 01',
    group: 'Packaging',
    status: 'busy',
    utilization: 60,
    order: 'ORD-001',
    note: 'Ends in 30 min',
  },
  {
    name: 'Packaging Station 02',
    group: 'Packaging',
    status: 'idle',
    utilization: 30,
    order: 'ORD-003',
    note: 'Next in 105 min',
  },
]

const resourceStatusStyles: Record<ResourceStatus, string> = {
  busy: 'bg-blue-50 text-blue-700',
  idle: 'bg-slate-100 text-slate-600',
  blocked: 'bg-amber-50 text-amber-700',
}

const resourceStatusLabels: Record<ResourceStatus, string> = {
  busy: 'Busy',
  idle: 'Idle',
  blocked: 'Blocked',
}

const resourceBarStyles: Record<ResourceStatus, string> = {
  busy: 'bg-blue-600',
  idle: 'bg-slate-400',
  blocked: 'bg-amber-500',
}

const formatQuantity = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1)

const pct = (value: number, total: number) =>
  Math.min(100, Math.max(0, (value / total) * 100))

const MaterialRow = ({ material }: { material: MaterialStock }) => {
  const { name, unit, stock, consumed, reserved } = material
  const remaining = Math.max(stock - consumed - reserved, 0)
  const usedPercent = Math.round(pct(consumed, stock))
  const isLow = remaining / stock < LOW_STOCK_RATIO

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium">{name}</span>
          {isLow && (
            <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
              Low stock
            </span>
          )}
        </div>
        <span className="text-sm font-semibold tabular-nums">
          {usedPercent}%
        </span>
      </div>

      {/* Stacked bar: consumed / reserved / remaining */}
      <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-blue-600"
          style={{ width: `${pct(consumed, stock)}%` }}
        />
        <div
          className="h-full bg-blue-200"
          style={{ width: `${pct(reserved, stock)}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>
          {formatQuantity(consumed)} used · {formatQuantity(reserved)} reserved
        </span>
        <span className={isLow ? 'font-medium text-amber-700' : ''}>
          {formatQuantity(remaining)} {unit} remaining
        </span>
      </div>
    </div>
  )
}

const ResourceRow = ({ resource }: { resource: ResourceItem }) => (
  <div>
    <div className="mb-2 flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-sm font-medium">{resource.name}</span>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${resourceStatusStyles[resource.status]}`}
        >
          {resourceStatusLabels[resource.status]}
        </span>
      </div>
      <span className="text-sm font-semibold tabular-nums">
        {resource.utilization}%
      </span>
    </div>

    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${resourceBarStyles[resource.status]}`}
        style={{ width: `${resource.utilization}%` }}
      />
    </div>

    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
      <span>{resource.order}</span>
      <span>{resource.note}</span>
    </div>
  </div>
)

export const ResourceUtilization = () => {
  const [view, setView] = useState<'materials' | 'resources'>('materials')

  return (
    <section className="rounded-xl border bg-white p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-violet-50 p-2">
            <Layers3 className="size-5 text-violet-600" />
          </span>
          <div>
            <h2 className="font-semibold">Resource Utilization</h2>
            <p className="text-sm text-slate-500">
              {view === 'materials'
                ? 'Material consumption across production orders'
                : 'Machine and station load across the timeline'}
            </p>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg bg-slate-100 p-1 text-sm">
          {(
            [
              { id: 'materials', label: 'Materials', icon: Boxes },
              { id: 'resources', label: 'Resources', icon: Cog },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors ${
                view === id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {view === 'materials'
          ? materials.map((material) => (
              <MaterialRow key={material.name} material={material} />
            ))
          : resources.map((resource) => (
              <ResourceRow key={resource.name} resource={resource} />
            ))}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
        {view === 'materials' ? (
          <>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-blue-600" />
              Used
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-blue-200" />
              Reserved for queued steps
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-slate-100 ring-1 ring-slate-200" />
              Remaining
            </span>
          </>
        ) : (
          (Object.keys(resourceStatusLabels) as ResourceStatus[]).map(
            (status) => (
              <span key={status} className="flex items-center gap-1.5">
                <span
                  className={`size-2 rounded-sm ${resourceBarStyles[status]}`}
                />
                {resourceStatusLabels[status]}
              </span>
            ),
          )
        )}
      </div>
    </section>
  )
}