import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const HOUR_MS = 60 * 60 * 1000
const HOURS_EACH_SIDE = 6
const TOTAL_HOURS = HOURS_EACH_SIDE * 2
const MINUTES_EACH_SIDE = HOURS_EACH_SIDE * 60
const TOTAL_MINUTES = TOTAL_HOURS * 60
const STEP_COLUMN_WIDTH = 140
const CARD_GAP = 8
const VIEWPORT_PADDING = 8

// Lane layout for overlapping bars in the same step row
const BAR_HEIGHT = 28
const LANE_HEIGHT = 32
const ROW_PADDING_Y = 10
const MIN_ROW_HEIGHT = 56
// Roughly how many minutes the 76px min bar width covers (used for overlap math)
const MIN_BAR_MINUTES = 65

type OrderStatus = 'queued' | 'in-progress' | 'blocked' | 'finished'

type StepName = 'Machining' | 'Assembly' | 'Quality Check' | 'Packaging'

type Material = {
  name: string
  quantity: number
  unit: string
}

type OrderOperation = {
  step: StepName
  /** minutes relative to NOW (negative = past, positive = future) */
  start: number
  /** minutes */
  duration: number
  status: OrderStatus
  /** machines, stations, tools */
  resources: string[]
  /** consumed materials with quantities */
  materials: Material[]
}

type ProductionOrder = {
  id: string
  /** ordered steps this order goes through */
  operations: OrderOperation[]
}

type FlatOperation = {
  key: string
  order: ProductionOrder
  operation: OrderOperation
  index: number
}

const statusStyles: Record<OrderStatus, string> = {
  queued: 'bg-slate-300 text-slate-800',
  'in-progress': 'bg-blue-500 text-white',
  blocked: 'bg-amber-500 text-white',
  finished: 'bg-emerald-600 text-white',
}

const statusLabels: Record<OrderStatus, string> = {
  queued: 'Queued',
  'in-progress': 'In Progress',
  blocked: 'Blocked',
  finished: 'Finished',
}

const steps: StepName[] = [
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
const orders: ProductionOrder[] = [
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

const getOrderStatus = (order: ProductionOrder): OrderStatus => {
  const statuses = order.operations.map((operation) => operation.status)

  if (statuses.includes('blocked')) return 'blocked'
  if (statuses.every((status) => status === 'finished')) return 'finished'
  if (statuses.includes('in-progress')) return 'in-progress'
  if (statuses.some((status) => status === 'finished')) return 'in-progress'
  return 'queued'
}

const allOperations: FlatOperation[] = orders.flatMap((order) =>
  order.operations.map((operation, index) => ({
    key: `${order.id}-${operation.step}`,
    order,
    operation,
    index,
  })),
)

/**
 * Greedy lane assignment so overlapping bars in the same step row
 * stack vertically instead of drawing on top of each other.
 */
const assignLanes = (items: FlatOperation[]) => {
  const sorted = [...items].sort(
    (a, b) => a.operation.start - b.operation.start,
  )
  const laneEnds: number[] = []
  const lanes = new Map<string, number>()

  sorted.forEach((item) => {
    const { start, duration } = item.operation
    const end = start + Math.max(duration, MIN_BAR_MINUTES)

    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start)
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(end)
    } else {
      laneEnds[lane] = end
    }

    lanes.set(item.key, lane)
  })

  return { lanes, laneCount: Math.max(laneEnds.length, 1) }
}

type HoverState = {
  item: FlatOperation
  rect: DOMRect
}

const formatQuantity = (quantity: number) =>
  Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1)

const formatSchedule = (start: number, duration: number) => {
  const end = start + duration
  const describe = (minutes: number) =>
    minutes === 0
      ? 'now'
      : minutes < 0
        ? `${Math.abs(minutes)} min ago`
        : `in ${minutes} min`

  return `${describe(start)} → ${describe(end)}`
}

/**
 * Hover card rendered in a portal with fixed positioning so it is never
 * clipped by the scrollable graph container.
 */
const OrderHoverCard = ({ item, rect }: HoverState) => {
  const { order, operation, index } = item
  const cardRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{
    top: number
    left: number
  } | null>(null)

  useLayoutEffect(() => {
    const card = cardRef.current
    if (!card) return

    const { width, height } = card.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Prefer below the bar; flip above if it would overflow the viewport.
    let top = rect.bottom + CARD_GAP
    if (top + height > vh - VIEWPORT_PADDING) {
      top = rect.top - height - CARD_GAP
    }
    top = Math.max(
      VIEWPORT_PADDING,
      Math.min(top, vh - height - VIEWPORT_PADDING),
    )

    const left = Math.max(
      VIEWPORT_PADDING,
      Math.min(rect.left, vw - width - VIEWPORT_PADDING),
    )

    setPosition({ top, left })
  }, [rect, item])

  const orderStatus = getOrderStatus(order)

  return createPortal(
    <div
      ref={cardRef}
      className="pointer-events-none fixed z-[100] w-72 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-xl"
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        visibility: position ? 'visible' : 'hidden',
      }}
    >
      {/* Order header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-900">{order.id}</p>
          <p className="mt-1 text-xs text-slate-500">
            Production order · {order.operations.length} steps
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${statusStyles[orderStatus]}`}
        >
          {statusLabels[orderStatus]}
        </span>
      </div>

      {/* Order route: all steps of this order */}
      <div className="mt-3 space-y-1">
        {order.operations.map((op, opIndex) => {
          const isCurrent = opIndex === index

          return (
            <div
              key={op.step}
              className={`flex items-center gap-2 rounded px-2 py-1 ${
                isCurrent ? 'bg-slate-100 font-semibold text-slate-900' : ''
              }`}
            >
              <span
                className={`size-2 shrink-0 rounded-full ${statusStyles[op.status].split(' ')[0]}`}
              />
              <span className="flex-1 truncate">
                {opIndex + 1}. {op.step}
              </span>
              <span className="text-[10px] font-normal text-slate-500">
                {statusLabels[op.status]}
              </span>
            </div>
          )
        })}
      </div>

      <div className="my-3 border-t border-slate-100" />

      {/* Hovered step details */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-slate-500">
              Step {index + 1} of {order.operations.length}
            </p>
            <p className="mt-1 font-medium text-slate-800">
              {operation.step}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${statusStyles[operation.status]}`}
          >
            {statusLabels[operation.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-slate-500">Duration</p>
            <p className="mt-1 font-medium text-slate-800">
              {operation.duration} minutes
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Schedule</p>
            <p className="mt-1 text-slate-700">
              {formatSchedule(operation.start, operation.duration)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500">Resources</p>

          <div className="mt-1 flex flex-wrap gap-1">
            {operation.resources.length > 0 ? (
              operation.resources.map((resource) => (
                <span
                  key={resource}
                  className="rounded bg-slate-100 px-2 py-1 text-xs"
                >
                  {resource}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">
                No resources assigned
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500">Materials</p>

          {operation.materials.length > 0 ? (
            <ul className="mt-1 space-y-1">
              {operation.materials.map((material) => (
                <li
                  key={material.name}
                  className="flex items-center justify-between rounded bg-slate-50 px-2 py-1"
                >
                  <span className="text-slate-700">{material.name}</span>
                  <span className="font-medium text-slate-900">
                    {formatQuantity(material.quantity)} {material.unit}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-xs text-slate-400">
              No materials required
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export const Timeline = () => {
  const now = Date.now()
  const startTime = now - HOURS_EACH_SIDE * HOUR_MS

  const ticks = Array.from(
    { length: TOTAL_HOURS + 1 },
    (_, index) => index,
  )

  const scrollRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<HoverState | null>(null)

  useEffect(() => {
    const element = scrollRef.current

    if (element) {
      element.scrollLeft =
        (element.scrollWidth - element.clientWidth) / 2
    }
  }, [])

  return (
    <div className="flex h-full max-h-full min-h-0 flex-col overflow-hidden rounded-lg bg-white text-xs text-slate-700">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-3 py-3">
        <div>
          <h2 className="font-semibold text-slate-900">
            Production Timeline
          </h2>
          <p className="mt-1 text-slate-500">
            Orders grouped by production step · 1 hour / division
          </p>
        </div>

        <span className="rounded-md bg-red-50 px-2 py-1 font-semibold text-red-600">
          Live timeline
        </span>
      </div>

      {/* Scrollable timeline */}
      <div
        ref={scrollRef}
        onScroll={() => setHovered(null)}
        className="relative min-h-0 flex-1 overflow-auto overscroll-none no-scrollbar"
      >
        <div className="relative min-w-250">
          {/* Time ruler */}
          <div
            className="sticky top-0 z-30 grid h-10 border-b bg-white"
            style={{
              gridTemplateColumns: `${STEP_COLUMN_WIDTH}px minmax(0, 1fr)`,
            }}
          >
            {/* Step column header */}
            <div className="sticky left-0 z-40 flex items-center border-r bg-white px-3 font-medium text-slate-500">
              Production step
            </div>

            {/* Time labels */}
            <div className="relative h-full">
              {ticks.map((tick) => {
                const time = new Date(startTime + tick * HOUR_MS)
                const isNow = tick === HOURS_EACH_SIDE

                return (
                  <div
                    key={tick}
                    className="absolute inset-y-0 flex -translate-x-1/2 items-center"
                    style={{
                      left: `${(tick / TOTAL_HOURS) * 100}%`,
                    }}
                  >
                    <span
                      className={
                        isNow
                          ? 'rounded bg-red-500 px-2 py-1 font-semibold text-white'
                          : 'text-slate-500'
                      }
                    >
                      {isNow
                        ? 'NOW'
                        : time.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Production step rows */}
          {steps.map((step) => {
            const stepItems = allOperations.filter(
              (item) => item.operation.step === step,
            )

            const activeCount = stepItems.filter(
              (item) => item.operation.status === 'in-progress',
            ).length

            const plannedCount = stepItems.filter(
              (item) => item.operation.status === 'queued',
            ).length

            const blockedCount = stepItems.filter(
              (item) => item.operation.status === 'blocked',
            ).length

            const { lanes, laneCount } = assignLanes(stepItems)

            const rowHeight = Math.max(
              MIN_ROW_HEIGHT,
              laneCount * LANE_HEIGHT + ROW_PADDING_Y * 2 - 4,
            )

            return (
              <div
                key={step}
                className="grid border-b border-slate-100"
                style={{
                  height: rowHeight,
                  gridTemplateColumns: `${STEP_COLUMN_WIDTH}px minmax(0, 1fr)`,
                }}
              >
                {/* Step label */}
                <div className="sticky left-0 z-20 flex flex-col justify-center border-r bg-white px-3">
                  <span className="font-semibold text-slate-800">
                    {step}
                  </span>

                  <span className="mt-0.5 whitespace-nowrap text-[10px] text-slate-500">
                    {activeCount} active · {plannedCount} planned
                    {blockedCount > 0 ? ` · ${blockedCount} blocked` : ''}
                  </span>
                </div>

                {/* Timeline track */}
                <div className="relative min-w-0">
                  {/* Hour grid lines */}
                  {ticks.map((tick) => (
                    <div
                      key={tick}
                      className="pointer-events-none absolute inset-y-0 border-l border-slate-100"
                      style={{
                        left: `${(tick / TOTAL_HOURS) * 100}%`,
                      }}
                    />
                  ))}

                  {/* Operations in this step */}
                  {stepItems.map((item) => {
                    const { order, operation, index } = item

                    const left =
                      ((operation.start + MINUTES_EACH_SIDE) /
                        TOTAL_MINUTES) *
                      100

                    const width =
                      (operation.duration / TOTAL_MINUTES) * 100

                    const lane = lanes.get(item.key) ?? 0
                    const isDimmed =
                      hovered !== null && hovered.item.order.id !== order.id

                    return (
                      <div
                        key={item.key}
                        onMouseEnter={(event) =>
                          setHovered({
                            item,
                            rect: event.currentTarget.getBoundingClientRect(),
                          })
                        }
                        onMouseLeave={() => setHovered(null)}
                        className={`absolute z-10 rounded-md shadow-sm transition-opacity ${
                          statusStyles[operation.status]
                        } ${isDimmed ? 'opacity-30' : 'hover:opacity-90'}`}
                        style={{
                          top: ROW_PADDING_Y + lane * LANE_HEIGHT - 2,
                          height: BAR_HEIGHT,
                          left: `${left}%`,
                          width: `${width}%`,
                          minWidth: '76px',
                        }}
                      >
                        {/* Order bar label */}
                        <div className="flex h-full items-center gap-1.5 overflow-hidden rounded-md px-2">
                          <span className="truncate font-semibold">
                            {order.id}
                          </span>
                          <span className="shrink-0 text-[10px] opacity-80">
                            {index + 1}/{order.operations.length}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Current time marker across the timeline tracks */}
          <div
            className="pointer-events-none absolute bottom-0 top-10 z-10 border-l-2 border-red-500"
            style={{
              left: `calc(${STEP_COLUMN_WIDTH}px + (100% - ${STEP_COLUMN_WIDTH}px) / 2)`,
            }}
          >
            <span className="absolute bottom-0 -left-1.25 size-2.5 rounded-full bg-red-500" />
          </div>
        </div>
      </div>

      {/* Footer / status legend */}
      <div className="flex shrink-0 flex-wrap items-center gap-4 border-t bg-white px-3 py-2">
        {(Object.keys(statusLabels) as OrderStatus[]).map((status) => (
          <span
            key={status}
            className="flex items-center gap-1.5 text-slate-500"
          >
            <span
              className={`size-2 rounded-sm ${statusStyles[status].split(' ')[0]}`}
            />
            {statusLabels[status]}
          </span>
        ))}

        <span className="ml-auto flex items-center gap-2 text-slate-500">
          <span className="size-2 rounded-full bg-red-500" />
          Current time
        </span>
      </div>

      {/* Hover card (portal, never clipped by the graph) */}
      {hovered && <OrderHoverCard {...hovered} />}
    </div>
  )
}