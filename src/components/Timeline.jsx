import { formatDate } from '../utils/format.js'
import { StatusBadge } from './Badge.jsx'

export function Timeline({ history = [] }) {
  return (
    <ol className="space-y-4">
      {history.map((event, index) => (
        <li key={`${event.at}-${index}`} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="mt-1 h-3 w-3 rounded-full border-2 border-white bg-navy-700 shadow" />
            {index < history.length - 1 ? <span className="w-px flex-1 bg-slate-200" /> : null}
          </div>
          <div className="pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={event.status} />
              <span className="text-xs text-slate-500">{formatDate(event.at)}</span>
            </div>
            <p className="mt-1 text-sm text-navy-950">
              {event.by} <span className="text-slate-500">({event.role})</span>
            </p>
            {event.note ? <p className="mt-1 text-sm text-slate-600">{event.note}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
