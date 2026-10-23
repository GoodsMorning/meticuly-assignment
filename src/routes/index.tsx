import { Timeline } from '#/components/Timeline'
import { Button } from '#/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Cog,
  Layers3,
  Plus,
} from 'lucide-react'
import { Table } from '#/components/Table'
import { ResourceUtilization } from '#/components/Chart/Resouce'

export const Route = createFileRoute('/')({
  component: Home,
})

const statuses = [
  { label: 'Queued', value: 12, color: 'text-slate-600', bg: 'bg-slate-100', icon: Clock3 },
  { label: 'In Progress', value: 8, color: 'text-blue-600', bg: 'bg-blue-50', icon: Activity },
  { label: 'Blocked', value: 2, color: 'text-amber-600', bg: 'bg-amber-50', icon: AlertTriangle },
  { label: 'Finished', value: 24, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
]


function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-8">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Production Management</p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Meticuly Assignment
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor production, orders, and resource consumption.
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Plus className="size-4" />
              Add Order
            </Button>
            <Button variant="secondary">
              <Cog className="size-4" />
              Step Config
            </Button>
          </div>
        </header>

        {/* Production Timeline */}
        <section>
          <Timeline />
        </section>

        {/* Status Overview */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {statuses.map(({ label, value, color, bg, icon: Icon }) => (
            <div
              key={label}
              className={`rounded-lg px-4 py-1 flex flex-row items-center justify-between ${bg}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className={`rounded-lg p-2`}>
                  <Icon className={`size-6 ${color}`} />
                  <p className="text-sm text-slate-500">{label}</p>
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <p className="text-3xl font-semibold tabular-nums">
                  {value}
                </p>
                <p className="text-xs text-slate-400">Orders</p>
              </div>
            </div>
          ))}
        </section>

        {/* Resources */}
        {/* <section className="rounded-xl border bg-white p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-lg bg-violet-50 p-2">
              <Layers3 className="size-5 text-violet-600" />
            </span>
            <div>
              <h2 className="font-semibold">Resource Utilization</h2>
              <p className="text-sm text-slate-500">
                Current material consumption
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { name: 'Material 1', used: 68, remaining: '32 units remaining' },
              { name: 'Material 2', used: 42, remaining: '58 units remaining' },
            ].map((material) => (
              <div key={material.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{material.name}</span>
                  <span className="text-sm font-semibold tabular-nums">
                    {material.used}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${material.used}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {material.remaining}
                </p>
              </div>
            ))}
          </div>
        </section> */}
        <ResourceUtilization />

        {/* Orders / Logs */}
        <Table />
        <footer className="text-center text-xs text-slate-400">
          Meticuly Production Dashboard · Demo data
        </footer>
      </div>
    </main>
  )
}

