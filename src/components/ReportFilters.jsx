import { Search } from 'lucide-react'
import { CATEGORIES, SEVERITIES, STATUSES } from '../utils/constants.js'

export function ReportFilters({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <div className="card grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
      <label className="relative block text-sm font-medium text-slate-600">
        Search
        <Search className="pointer-events-none absolute left-3 top-9 h-4 w-4 text-slate-400" />
        <input
          value={filters.query}
          onChange={(event) => set('query', event.target.value)}
          placeholder="Title, ID, or location"
          className="input mt-1 pl-9 text-sm"
        />
      </label>
      <label className="block text-sm font-medium text-slate-600">
        Category
        <select value={filters.category} onChange={(event) => set('category', event.target.value)} className="input mt-1 text-sm">
          <option value="">All categories</option>
          {CATEGORIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-slate-600">
        Severity
        <select value={filters.severity} onChange={(event) => set('severity', event.target.value)} className="input mt-1 text-sm">
          <option value="">All severity</option>
          {SEVERITIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-slate-600">
        Status
        <select value={filters.status} onChange={(event) => set('status', event.target.value)} className="input mt-1 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
