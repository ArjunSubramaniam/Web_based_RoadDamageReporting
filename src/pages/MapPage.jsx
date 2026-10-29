import { useEffect, useState } from 'react'
import { LoadingState } from '../components/EmptyState.jsx'
import { MapView } from '../components/MapView.jsx'
import { ReportFilters } from '../components/ReportFilters.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useStoreTick } from '../hooks/useReports.js'
import { getReports } from '../services/reportService.js'

export function MapPage() {
  const { user } = useAuth()
  const tick = useStoreTick()
  const [filters, setFilters] = useState({ query: '', category: '', severity: '', status: '' })
  const [reports, setReports] = useState(null)
  const detailBase = user.role === 'admin' ? '/admin/reports' : user.role === 'maintenance' ? '/maintenance/tasks' : '/citizen/reports'

  useEffect(() => {
    getReports(filters).then(setReports)
  }, [filters, tick, user])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-navy-950">Damage map</h1>
      <p className="text-sm text-slate-600">
        Markers appear only for reports that include coordinates. Positions are as supplied with each report and have not been independently verified.
      </p>
      <ReportFilters filters={filters} onChange={setFilters} />
      {!reports ? <LoadingState /> : <MapView reports={reports} detailBase={detailBase} />}
    </div>
  )
}
