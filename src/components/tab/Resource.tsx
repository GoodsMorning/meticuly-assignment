import {
  resourceBarStyles,
  resourceStatusLabels,
  resourceStatusStyles,
} from '#/constants/resource'
import { formatQuantity, percentage } from '#/helpers/quantity'
import { getMaterialStocks } from '#/services/material'
import { getResources } from '#/services/resource'
import type { TMaterialStock } from '#/types/material'
import type { TResourceItem, TResourceStatus } from '#/types/resource'
import { Boxes, Cog } from 'lucide-react'
import { useState } from 'react'

const LOW_STOCK_RATIO = 0.2

export const ResourcesTab = () => {
  const [view, setView] = useState<'materials' | 'resources'>('materials')

  const materials = getMaterialStocks()
  const resources = getResources()

  return (
    <div className="p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {view === 'materials'
            ? 'Material consumption across production orders'
            : 'Machine and station load across the timeline'}
        </p>

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
          (Object.keys(resourceStatusLabels) as TResourceStatus[]).map(
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
    </div>
  )
}

const MaterialRow = ({ material }: { material: TMaterialStock }) => {
  const { name, unit, stock, consumed, reserved } = material
  const remaining = Math.max(stock - consumed - reserved, 0)
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
          {Math.round(percentage(consumed, stock))}%
        </span>
      </div>

      <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-blue-600"
          style={{ width: `${percentage(consumed, stock)}%` }}
        />
        <div
          className="h-full bg-blue-200"
          style={{ width: `${percentage(reserved, stock)}%` }}
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

const ResourceRow = ({ resource }: { resource: TResourceItem }) => (
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
