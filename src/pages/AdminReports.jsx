import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SeverityBadge, StatusBadge } from '../components/Badge.jsx'
import { EmptyState } from '../components/EmptyState.jsx'
import { ReportCard } from '../components/ReportCard.jsx'
import { ReportFilters } from '../components/ReportFilters.jsx'
import { SkeletonList } from '../components/Skeleton.jsx'
import { useStoreTick } from '../hooks/useReports.js'
import { getReports } from '../services/reportService.js'
import { PAGE_SIZE } from '../utils/constants.js'
import { formatDay } from '../utils/format.js'
import { Pager } from './MyReports.jsx'

export function AdminReports({ title = 'All reports', statuses }) {
  const tick = useStoreTick()
  const [filters, setFilters] = useState({ query: '', category: '', severity: '', status: '' })
  const [sortKey, setSortKey] = useState('updatedAt')
  const [sortDir, setSortDir] = useState('desc')
  const [reports, setReports] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
    getReports({ ...filters, statuses, sortKey, sortDir }).then(setReports)
  }, [filters, tick, statuses, sortKey, sortDir])

  const paged = useMemo(() => {
    if (!reports) return []
    return reports.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  }, [reports, page])
  const pages = reports ? Math.max(1, Math.ceil(reports.length / PAGE_SIZE)) : 1

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((value) => (value === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-navy-950">{title}</h1>
      <ReportFilters filters={filters} onChange={setFilters} />
      {!reports ? (
        <SkeletonList />
      ) : reports.length ? (
        <>
          <div className="grid gap-3 md:hidden">
            {paged.map((report) => (
              <ReportCard key={report.id} report={report} to={`/admin/reports/${report.id}`} />
            ))}
          </div>
          <div className="card hidden overflow-x-auto md:block">
            <table className="min-w-[920px] w-full text-left text-sm">
              <thead className="bg-slate-50/90 text-slate-500">
                <tr>
                  {[
                    ['id', 'ID'],
                    ['title', 'Title'],
                    ['address', 'Location'],
                    ['category', 'Category'],
                    ['severity', 'Severity'],
                    ['status', 'Status'],
                    ['updatedAt', 'Date'],
                    ['assignedTeamName', 'Team'],
                  ].map(([key, label]) => (
                    <th key={key} className="px-4 py-3 font-medium">
                      <button type="button" onClick={() => toggleSort(key)} className="hover:text-navy-800">
                        {label}
                        {sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                      </button>
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((report) => (
                  <tr key={report.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium">{report.id}</td>
                    <td className="px-4 py-3">{report.title}</td>
                    <td className="max-w-[220px] truncate px-4 py-3">{report.address}</td>
                    <td className="px-4 py-3">{report.category}</td>
                    <td className="px-4 py-3"><SeverityBadge severity={report.severity} /></td>
                    <td className="px-4 py-3"><StatusBadge status={report.status} /></td>
                    <td className="px-4 py-3 text-slate-500">{formatDay(report.updatedAt)}</td>
                    <td className="px-4 py-3">{report.assignedTeamName || '—'}</td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/reports/${report.id}`} className="font-medium text-blue-700">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager page={page} pages={pages} onChange={setPage} />
        </>
      ) : (
        <EmptyState title="No reports match" message="Adjust filters to see stored reports." />
      )}
    </div>
  )
}

export function VerificationQueue() {
  return <AdminReports title="Verification queue" statuses={['Submitted', 'Under Review']} />
}
