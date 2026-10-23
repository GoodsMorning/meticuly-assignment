import { useState } from 'react'
import { Boxes, Cog, Layers3, ScrollText } from 'lucide-react'
import {
  getCurrentOperation,
  getOrderStatus,
  orders,
  statusLabels
} from '#/constants/production-data'
import type {OrderStatus} from '#/constants/production-data';

/* ----------------------------- Mock data ----------------------------- */

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
  status: ResourceStatus
  utilization: number
  /** current order if busy/blocked, next order if idle */
  order: string
  note: string
}

type LogLevel = 'info' | 'warning' | 'success'

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
  { name: 'Machine 01', status: 'idle', utilization: 72, order: 'ORD-004', note: 'Next in 10 min' },
  { name: 'Machine 02', status: 'idle', utilization: 55, order: 'ORD-005', note: 'Next in 90 min' },
  { name: 'Assembly Station 01', status: 'busy', utilization: 85, order: 'ORD-002', note: 'Ends in 60 min' },
  { name: 'Assembly Station 02', status: 'blocked', utilization: 40, order: 'ORD-003', note: 'Blocked 30 min ago' },
  { name: 'QC Station 01', status: 'idle', utilization: 45, order: 'ORD-002', note: 'Next in 60 min' },
  { name: 'Packaging Station 01', status: 'busy', utilization: 60, order: 'ORD-001', note: 'Ends in 30 min' },
  { name: 'Packaging Station 02', status: 'idle', utilization: 30, order: 'ORD-003', note: 'Next in 105 min' },
]

const logs: {
  time: string
  orderId: string
  message: string
  level: LogLevel
}[] = [
  { time: '14:32:08', orderId: 'ORD-001', message: 'Packaging started', level: 'info' },
  { time: '14:28:41', orderId: 'ORD-003', message: 'Assembly blocked: awaiting Material B', level: 'warning' },
  { time: '14:15:20', orderId: 'ORD-002', message: 'Machining finished', level: 'success' },
  { time: '13:58:02', orderId: 'ORD-001', message: 'Quality Check finished', level: 'success' },
  { time: '13:40:15', orderId: 'ORD-003', message: 'Machining finished', level: 'success' },
]

/* ------------------------------ Styles ------------------------------- */

const badgeStyles: Record<OrderStatus, string> = {
  queued: 'bg-slate-100 text-slate-700',
  'in-progress': 'bg-blue-50 text-blue-700',
  blocked: 'bg-amber-50 text-amber-700',
  finished: 'bg-emerald-50 text-emerald-700',
}

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

const logDotStyles: Record<LogLevel, string> = {
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-600',
}

/* ------------------------------ Helpers ------------------------------ */

const formatQuantity = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1)

const pct = (value: number, total: number) =>
  Math.min(100, Math.max(0, (value / total) * 100))

/* ---------------------------- Orders tab ----------------------------- */

type Filter = 'all' | OrderStatus

const filters: Filter[] = ['all', 'in-progress', 'queued', 'blocked', 'finished']

const OrdersTab = () => {
  const [filter, setFilter] = useState<Filter>('all')

  const rows = orders
    .map((order) => ({
      order,
      status: getOrderStatus(order),
      current: getCurrentOperation(order),
      finishedCount: order.operations.filter(
        (operation) => operation.status === 'finished',
      ).length,
    }))
    .filter((row) => filter === 'all' || row.status === filter)

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 border-b px-5 py-3">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === item
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {item === 'all' ? 'All' : statusLabels[item]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Order ID</th>
              <th className="px-5 py-3 font-medium">Current Step</th>
              <th className="px-5 py-3 font-medium">Progress</th>
              <th className="px-5 py-3 font-medium">Materials</th>
              <th className="px-5 py-3 font-medium">Resources</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map(({ order, status, current, finishedCount }) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-5 py-4 font-medium">
                  {order.id}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {current.step}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                          width: `${(finishedCount / order.operations.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs tabular-nums text-slate-500">
                      {finishedCount}/{order.operations.length}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {current.materials.map((material) => (
                      <span
                        key={material.name}
                        className="whitespace-nowrap rounded bg-slate-100 px-2 py-1 text-xs text-slate-600"
                      >
                        {material.name} · {formatQuantity(material.quantity)}{' '}
                        {material.unit}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {current.resources.map((resource) => (
                      <span
                        key={resource}
                        className="whitespace-nowrap rounded bg-slate-100 px-2 py-1 text-xs text-slate-600"
                      >
                        {resource}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeStyles[status]}`}
                  >
                    {statusLabels[status]}
                  </span>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-slate-400"
                >
                  No orders with this status
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* -------------------------- Resources tab ---------------------------- */

const MaterialRow = ({ material }: { material: MaterialStock }) => {
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
          {Math.round(pct(consumed, stock))}%
        </span>
      </div>

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

const ResourcesTab = () => {
  const [view, setView] = useState<'materials' | 'resources'>('materials')

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
    </div>
  )
}

/* -------------------------- Activity Log tab ------------------------- */

const LogsTab = () => (
  <div className="divide-y divide-slate-100">
    {logs.map((entry) => (
      <div
        key={`${entry.time}-${entry.orderId}`}
        className="flex flex-wrap items-center gap-3 px-5 py-4 text-sm"
      >
        <span
          className={`size-2 shrink-0 rounded-full ${logDotStyles[entry.level]}`}
        />
        <span className="font-mono text-xs text-slate-400">{entry.time}</span>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium">
          {entry.orderId}
        </span>
        <span className="text-slate-600">{entry.message}</span>
      </div>
    ))}
  </div>
)

/* ------------------------------- Table ------------------------------- */

type TabId = 'orders' | 'resources' | 'logs'

const blockedCount = orders.filter(
  (order) => getOrderStatus(order) === 'blocked',
).length

const tabs: {
  id: TabId
  label: string
  icon: typeof Layers3
  badge?: { value: number; tone: 'neutral' | 'warning' }
}[] = [
  {
    id: 'orders',
    label: 'Orders',
    icon: Layers3,
    badge:
      blockedCount > 0
        ? { value: blockedCount, tone: 'warning' }
        : { value: orders.length, tone: 'neutral' },
  },
  { id: 'resources', label: 'Resource Utilization', icon: Boxes },
  {
    id: 'logs',
    label: 'Activity Log',
    icon: ScrollText,
    badge: { value: logs.length, tone: 'neutral' },
  },
]

export const Table = () => {
  const [activeTab, setActiveTab] = useState<TabId>('orders')

  return (
    <div className="overflow-hidden rounded-xl  bg-white">
      <div className="flex gap-6 overflow-x-auto border-b px-5">
        {tabs.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex shrink-0 items-center gap-2 border-b-2 py-4 text-sm font-medium ${
              activeTab === id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon className="size-4" />
            {label}

            {badge && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                  badge.tone === 'warning'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {badge.value}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'orders' && <OrdersTab />}
      {activeTab === 'resources' && <ResourcesTab />}
      {activeTab === 'logs' && <LogsTab />}
    </div>
  )
}