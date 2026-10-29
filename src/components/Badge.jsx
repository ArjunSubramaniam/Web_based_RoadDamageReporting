import { SEVERITY_STYLES, STATUS_STYLES } from '../utils/constants.js'
import { cn } from '../utils/format.js'

export function Badge({ children, className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', className)}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  return <Badge className={STATUS_STYLES[status] || 'bg-slate-100 text-slate-700'}>{status}</Badge>
}

export function SeverityBadge({ severity }) {
  return <Badge className={SEVERITY_STYLES[severity] || 'bg-slate-100 text-slate-700'}>{severity}</Badge>
}
