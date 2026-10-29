import { MapPinned } from 'lucide-react'
import { Link } from 'react-router-dom'

export function BrandMark({ to = '/', compact = false, inverted = false }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 ${inverted ? 'text-white' : 'text-navy-950'}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-sm">
        <MapPinned className="h-4 w-4" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold tracking-tight">RoadWatch</span>
        {compact ? null : (
          <span className={`block text-[11px] font-normal ${inverted ? 'text-navy-200' : 'text-slate-500'}`}>
            Road operations
          </span>
        )}
      </span>
    </Link>
  )
}
