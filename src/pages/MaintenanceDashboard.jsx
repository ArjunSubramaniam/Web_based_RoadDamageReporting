import { Clock3, Hammer, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState.jsx'
import { ReportCard } from '../components/ReportCard.jsx'
import { SkeletonGrid } from '../components/Skeleton.jsx'
import { StatCard } from '../components/StatCard.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useStoreTick } from '../hooks/useReports.js'
import { getDashboardStats } from '../services/reportService.js'
import { isOverdue } from '../utils/format.js'

export function MaintenanceDashboard() {
  const { user } = useAuth()
  const tick = useStoreTick()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getDashboardStats({ teamId: user.teamId }).then(setStats)
  }, [user.teamId, tick])

  if (!stats) return <SkeletonGrid />

  const assigned = stats.reports
  const groups = {
    new: assigned.filter((item) => item.status === 'Maintenance Assigned'),
    progress: assigned.filter((item) => item.status === 'In Progress'),
    overdue: assigned.filter(isOverdue),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Maintenance dashboard</h1>
        <p className="text-sm text-slate-600">{user.teamName} · showing tasks assigned to your crew.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Assigned tasks" value={assigned.length} icon={Hammer} />
        <StatCard label="New assignments" value={groups.new.length} icon={Clock3} tone="amber" />
        <StatCard label="In progress" value={groups.progress.length} icon={Hammer} />
        <StatCard label="Overdue" value={groups.overdue.length} icon={TriangleAlert} tone="red" />
      </div>
      <div className="flex gap-2">
        <Link to="/maintenance/tasks" className="btn-primary h-10 text-sm">
          Open assigned tasks
        </Link>
        <Link to="/maintenance/completed" className="btn-secondary h-10 text-sm">
          Completed work
        </Link>
      </div>
      {groups.new.length ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {groups.new.slice(0, 4).map((report) => (
            <ReportCard key={report.id} report={report} to={`/maintenance/tasks/${report.id}`} />
          ))}
        </div>
      ) : (
        <EmptyState title="No new assignments" message="New work appears here when an administrator assigns your team." />
      )}
    </div>
  )
}
