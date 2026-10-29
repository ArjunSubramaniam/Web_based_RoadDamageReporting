import { CircleDot, ClipboardList, PlusCircle, TimerReset } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState.jsx'
import { ReportCard } from '../components/ReportCard.jsx'
import { SkeletonGrid, SkeletonList } from '../components/Skeleton.jsx'
import { StatCard } from '../components/StatCard.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useStoreTick } from '../hooks/useReports.js'
import { getDashboardStats } from '../services/reportService.js'

export function CitizenDashboard() {
  const { user } = useAuth()
  const tick = useStoreTick()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getDashboardStats({ citizenId: user.id }).then(setStats)
  }, [user.id, tick])

  if (!stats) {
    return (
      <div className="space-y-4">
        <SkeletonGrid />
        <SkeletonList />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy-950">Dashboard</h1>
          <p className="text-sm text-slate-600">Welcome back, {user.name}.</p>
        </div>
        <Link to="/citizen/report" className="btn-primary">
          <PlusCircle className="h-4 w-4" /> Report damage
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total reports" value={stats.total} icon={ClipboardList} />
        <StatCard label="Pending review" value={stats.pending} icon={TimerReset} tone="amber" />
        <StatCard label="Active maintenance" value={stats.inProgress} icon={CircleDot} />
        <StatCard label="Resolved" value={stats.resolved} icon={ClipboardList} tone="green" />
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy-900">Recent reports</h2>
          <Link to="/citizen/reports" className="text-sm font-medium text-navy-700">
            View all
          </Link>
        </div>
        {stats.reports.length ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {stats.reports.slice(0, 4).map((report) => (
              <ReportCard key={report.id} report={report} to={`/citizen/reports/${report.id}`} />
            ))}
          </div>
        ) : (
          <EmptyState title="No reports yet" message="Submit a road damage report to start tracking its status." />
        )}
      </section>
    </div>
  )
}
