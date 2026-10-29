import { ClipboardList } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState.jsx'
import { ReportCard } from '../components/ReportCard.jsx'
import { ReportFilters } from '../components/ReportFilters.jsx'
import { SkeletonList } from '../components/Skeleton.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useStoreTick } from '../hooks/useReports.js'
import { getReports } from '../services/reportService.js'
import { PAGE_SIZE } from '../utils/constants.js'

export function MyReports() {
  const { user } = useAuth()
  const tick = useStoreTick()
  const [filters, setFilters] = useState({ query: '', category: '', severity: '', status: '' })
  const [reports, setReports] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
    getReports({ ...filters, citizenId: user.id }).then(setReports)
  }, [filters, user.id, tick])

  const paged = useMemo(() => {
    if (!reports) return []
    const start = (page - 1) * PAGE_SIZE
    return reports.slice(start, start + PAGE_SIZE)
  }, [reports, page])

  const pages = reports ? Math.max(1, Math.ceil(reports.length / PAGE_SIZE)) : 1

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-navy-950">My reports</h1>
      <ReportFilters filters={filters} onChange={setFilters} />
      {!reports ? (
        <SkeletonList />
      ) : reports.length ? (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            {paged.map((report) => (
              <ReportCard key={report.id} report={report} to={`/citizen/reports/${report.id}`} />
            ))}
          </div>
          <Pager page={page} pages={pages} onChange={setPage} />
        </>
      ) : (
        <EmptyState icon={ClipboardList} title="No matching reports" message="Try clearing filters or submit a new report." />
      )}
    </div>
  )
}

export function Pager({ page, pages, onChange }) {
  if (pages <= 1) return null
  return (
    <div className="flex items-center justify-between text-sm">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)} className="btn-secondary h-10 disabled:opacity-40">
        Previous
      </button>
      <span className="text-slate-600">
        Page {page} of {pages}
      </span>
      <button type="button" disabled={page === pages} onClick={() => onChange(page + 1)} className="btn-secondary h-10 disabled:opacity-40">
        Next
      </button>
    </div>
  )
}
