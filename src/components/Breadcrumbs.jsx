import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-500">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
          {index > 0 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
          {item.to ? (
            <Link to={item.to} className="hover:text-navy-800">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-navy-950">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
