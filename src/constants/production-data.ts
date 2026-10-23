import type { TOrderStatus } from "#/types/order"

export type StepName = 'Machining' | 'Assembly' | 'Quality Check' | 'Packaging'

export type Material = {
  name: string
  quantity: number
  unit: string
}

export type OrderOperation = {
  step: StepName
  /** minutes relative to NOW (negative = past, positive = future) */
  start: number
  /** minutes */
  duration: number
  status: TOrderStatus
  /** machines, stations, tools */
  resources: string[]
  /** consumed materials with quantities */
  materials: Material[]
}

export type ProductionOrder = {
  id: string
  /** ordered steps this order goes through */
  operations: OrderOperation[]
}

export const statusStyles: Record<TOrderStatus, string> = {
  queued: 'bg-slate-300 text-slate-800',
  'in-progress': 'bg-blue-500 text-white',
  blocked: 'bg-amber-500 text-white',
  finished: 'bg-emerald-600 text-white',
}

export const statusLabels: Record<TOrderStatus, string> = {
  queued: 'Queued',
  'in-progress': 'In Progress',
  blocked: 'Blocked',
  finished: 'Finished',
}

export const steps: StepName[] = [
  'Machining',
  'Assembly',
  'Quality Check',
  'Packaging',
]

const m = (name: string, quantity: number, unit: string): Material => ({
  name,
  quantity,
  unit,
})

// Each order has multiple steps. Times are minutes relative to NOW.
export const orders: ProductionOrder[] = [
  {
    id: 'ORD-001',
    operations: [
      {
        step: 'Machining',
        start: -270,
        duration: 90,
        status: 'finished',
        resources: ['Machine 01'],
        materials: [m('Material A', 12, 'kg')],
      },
      {
        step: 'Assembly',
        start: -180,
        duration: 90,
        status: 'finished',
        resources: ['Assembly Station 01'],
        materials: [m('Material B', 8, 'pcs'), m('Fasteners', 40, 'pcs')],
      },
      {
        step: 'Quality Check',
        start: -90,
        duration: 60,
        status: 'finished',
        resources: ['QC Station 01', 'Inspection Kit'],
        materials: [m('Calibration Fluid', 0.5, 'L')],
      },
      {
        step: 'Packaging',
        start: -30,
        duration: 60,
        status: 'in-progress',
        resources: ['Packaging Station 01'],
        materials: [m('Material C', 4, 'boxes'), m('Label Roll', 1, 'roll')],
      },
    ],
  },
  {
    id: 'ORD-002',
    operations: [
      {
        step: 'Machining',
        start: -150,
        duration: 90,
        status: 'finished',
        resources: ['Machine 01'],
        materials: [m('Material A', 10, 'kg')],
      },
      {
        step: 'Assembly',
        start: -60,
        duration: 120,
        status: 'in-progress',
        resources: ['Assembly Station 01'],
        materials: [m('Material B', 6, 'pcs'), m('Fasteners', 32, 'pcs')],
      },
      {
        step: 'Quality Check',
        start: 60,
        duration: 60,
        status: 'queued',
        resources: ['QC Station 01', 'Inspection Kit'],
        materials: [m('Calibration Fluid', 0.5, 'L')],
      },
      {
        step: 'Packaging',
        start: 120,
        duration: 60,
        status: 'queued',
        resources: ['Packaging Station 01'],
        materials: [m('Material C', 3, 'boxes'), m('Label Roll', 1, 'roll')],
      },
    ],
  },
  {
    id: 'ORD-003',
    operations: [
      {
        step: 'Machining',
        start: -120,
        duration: 90,
        status: 'finished',
        resources: ['Machine 02'],
        materials: [m('Material A', 15, 'kg')],
      },
      {
        step: 'Assembly',
        start: -30,
        duration: 75,
        status: 'blocked',
        resources: ['Assembly Station 02'],
        materials: [m('Material B', 10, 'pcs'), m('Fasteners', 50, 'pcs')],
      },
      {
        step: 'Quality Check',
        start: 45,
        duration: 60,
        status: 'queued',
        resources: ['QC Station 01', 'Inspection Kit'],
        materials: [m('Calibration Fluid', 0.5, 'L')],
      },
      {
        step: 'Packaging',
        start: 105,
        duration: 60,
        status: 'queued',
        resources: ['Packaging Station 02'],
        materials: [m('Material C', 5, 'boxes')],
      },
    ],
  },
  {
    id: 'ORD-004',
    operations: [
      {
        step: 'Machining',
        start: 10,
        duration: 150,
        status: 'queued',
        resources: ['Machine 01'],
        materials: [m('Material B', 20, 'kg')],
      },
      {
        step: 'Assembly',
        start: 160,
        duration: 90,
        status: 'queued',
        resources: ['Assembly Station 01'],
        materials: [m('Material B', 12, 'pcs'), m('Fasteners', 60, 'pcs')],
      },
      {
        step: 'Quality Check',
        start: 250,
        duration: 45,
        status: 'queued',
        resources: ['QC Station 01', 'Inspection Kit'],
        materials: [m('Calibration Fluid', 0.5, 'L')],
      },
      {
        step: 'Packaging',
        start: 295,
        duration: 60,
        status: 'queued',
        resources: ['Packaging Station 01'],
        materials: [m('Material C', 6, 'boxes'), m('Label Roll', 1, 'roll')],
      },
    ],
  },
  {
    id: 'ORD-005',
    operations: [
      {
        step: 'Machining',
        start: 90,
        duration: 90,
        status: 'queued',
        resources: ['Machine 02'],
        materials: [m('Material A', 14, 'kg')],
      },
      {
        step: 'Assembly',
        start: 180,
        duration: 90,
        status: 'queued',
        resources: ['Assembly Station 02'],
        materials: [m('Material B', 9, 'pcs'), m('Fasteners', 45, 'pcs')],
      },
      {
        step: 'Quality Check',
        start: 270,
        duration: 45,
        status: 'queued',
        resources: ['QC Station 01', 'Inspection Kit'],
        materials: [m('Calibration Fluid', 0.5, 'L')],
      },
      {
        step: 'Packaging',
        start: 315,
        duration: 45,
        status: 'queued',
        resources: ['Packaging Station 02'],
        materials: [m('Material C', 4, 'boxes')],
      },
    ],
  },
]

/** Overall order status derived from its steps. */
export const getOrderStatus = (order: ProductionOrder): TOrderStatus => {
  const statuses = order.operations.map((operation) => operation.status)

  if (statuses.includes('blocked')) return 'blocked'
  if (statuses.every((status) => status === 'finished')) return 'finished'
  if (statuses.includes('in-progress')) return 'in-progress'
  if (statuses.some((status) => status === 'finished')) return 'in-progress'
  return 'queued'
}

/** First step that isn't finished (or the last step if everything is done). */
export const getCurrentOperation = (order: ProductionOrder): OrderOperation =>
  order.operations.find((operation) => operation.status !== 'finished') ??
  order.operations[order.operations.length - 1]