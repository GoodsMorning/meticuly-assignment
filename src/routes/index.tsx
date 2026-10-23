import { Timeline } from '#/components/Timeline'
import { Button } from '#/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import {
  Plus,
} from 'lucide-react'
import { Table } from '#/components/Table'
import { StatusCard } from '#/components/StatusCard'

export const Route = createFileRoute('/')({
  component: Home,
})

const statuses = [
  { status: 'queued', value: 12 },
  { status: 'in-progress', value: 8 },
  { status: 'blocked', value: 2 },
  { status: 'finished', value: 24 },
] as const

function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-8">

        <div className="flex flex-wrap items-center justify-between gap-4">
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
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {statuses.map(({ status, value }) => (
            <StatusCard key={status} status={status} value={value} />
          ))}
        </div>

        <Timeline />

        <Table />
      </div>
      <footer className="py-4 text-center text-xs text-slate-400">
        Meticuly Production Dashboard · Demo data
      </footer>
    </main>
  )
}
