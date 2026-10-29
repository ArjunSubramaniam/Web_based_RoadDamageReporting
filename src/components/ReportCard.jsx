import { ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/format.js'
import { SeverityBadge, StatusBadge } from './Badge.jsx'

export function ReportCard({ report, to }) {
  return (
    <Link to={to} className="card card-hover block p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{report.id}</p>
          <h3 className="mt-1 text-base font-semibold text-navy-950">{report.title}</h3>
        </div>
        <StatusBadge status={report.status} />
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{report.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <SeverityBadge severity={report.severity} />
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5">{report.category}</span>
        <span className="inline-flex min-w-0 items-center gap-1">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{report.address}</span>
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>Updated {formatDate(report.updatedAt)}</span>
        <span className="inline-flex items-center gap-1 font-medium text-blue-700">
          Open <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
