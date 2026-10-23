import { Layers3, ScrollText } from "lucide-react"
import { useState } from "react"


const orders = [
  { id: 'ORD-001', name: 'Component A', step: 'Machining', status: 'In Progress', material: 'Material 1' },
  { id: 'ORD-002', name: 'Component B', step: 'Assembly', status: 'Queued', material: 'Material 2' },
  { id: 'ORD-003', name: 'Component C', step: 'Quality Check', status: 'Blocked', material: 'Material 1' },
  { id: 'ORD-004', name: 'Component D', step: 'Packaging', status: 'Finished', material: 'Material 2' },
]

const badgeStyles: Record<string, string> = {
  'Queued': 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  'Blocked': 'bg-amber-50 text-amber-700',
  'Finished': 'bg-emerald-50 text-emerald-700',
}

export const Table = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'logs'>('orders')
  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="flex gap-6 border-b px-5">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers3 className="size-4" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ScrollText className="size-4" />
            Activity Log
          </button>
        </div>

        {activeTab === 'orders' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Order ID</th>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Current Step</th>
                  <th className="px-5 py-3 font-medium">Material</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {order.id}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {order.name}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {order.step}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {order.material}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeStyles[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {[
              ['14:32:08', 'ORD-001', 'Production step started'],
              ['14:28:41', 'ORD-003', 'Order blocked: awaiting material'],
              ['14:15:20', 'ORD-004', 'Order completed successfully'],
            ].map(([time, id, message]) => (
              <div
                key={`${time}-${id}`}
                className="flex flex-wrap items-center gap-3 px-5 py-4 text-sm"
              >
                <span className="font-mono text-xs text-slate-400">{time}</span>
                <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium">
                  {id}
                </span>
                <span className="text-slate-600">{message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
