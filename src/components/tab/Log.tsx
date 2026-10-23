import { getLogs } from '#/services/log'
import type { TLogLevel } from '#/types/log'

const logDotStyles: Record<TLogLevel, string> = {
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-600',
}

export const LogTab = () => {
  const logs = getLogs()
  return (
    <>
      <div className="divide-y divide-slate-100">
        {logs.map((entry) => (
          <div
            key={`${entry.time}-${entry.orderId}`}
            className="flex flex-wrap items-center gap-3 px-5 py-4 text-sm"
          >
            <span
              className={`size-2 shrink-0 rounded-full ${logDotStyles[entry.level]}`}
            />
            <span className="font-mono text-xs text-slate-400">
              {entry.time}
            </span>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium">
              {entry.orderId}
            </span>
            <span className="text-slate-600">{entry.message}</span>
          </div>
        ))}
      </div>
    </>
  )
}
