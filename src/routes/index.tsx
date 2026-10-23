import { Timeline } from '#/components/Timeline'
import { Button } from '#/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Cog,
  Plus,
} from 'lucide-react'
import { Table } from '#/components/Table'

export const Route = createFileRoute('/')({
  component: Home,
})

const statuses = [
  {
    label: 'Queued',
    value: 12,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    icon: Clock3,
  },
  {
    label: 'In Progress',
    value: 8,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    icon: Activity,
  },
  {
    label: 'Blocked',
    value: 2,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    icon: AlertTriangle,
  },
  {
    label: 'Finished',
    value: 24,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    icon: CheckCircle2,
  },
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
              <div className="flex flex-col items-center">
                <p className="text-3xl font-semibold tabular-nums">{value}</p>
                <p className="text-xs text-slate-400">Orders</p>
              </div>
            </div>
          ))}
        </section>

        <Timeline />
        <Table />
        <footer className="text-center text-xs text-slate-400">
          Meticuly Production Dashboard · Demo data
        </footer>
      </div>
    </main>
  )
}
