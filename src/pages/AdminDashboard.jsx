import { AlertTriangle, ClipboardCheck, HardHat, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CategoryChart, DonutChart, TrendChart } from '../components/Charts.jsx'
import { ReportCard } from '../components/ReportCard.jsx'
import { SkeletonGrid } from '../components/Skeleton.jsx'
import { StatCard } from '../components/StatCard.jsx'
import { useStoreTick } from '../hooks/useReports.js'
import { getDashboardStats } from '../services/reportService.js'

export function AdminDashboard() {
  const tick = useStoreTick()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getDashboardStats().then(setStats)
  }, [tick])

  if (!stats) return <SkeletonGrid cards={6} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy-950">Operations dashboard</h1>
          <p className="text-sm text-slate-600">Counts are calculated from stored reports.</p>
        </div>
        <Link to="/admin/reports" className="btn-primary">
          Manage reports
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        <StatCard label="Total reports" value={stats.total} icon={ClipboardCheck} />
        <StatCard label="Pending review" value={stats.pending} icon={Shield} tone="amber" />
        <StatCard label="Verified" value={stats.verified} icon={Shield} />
        <StatCard label="Active maintenance" value={stats.inProgress} icon={HardHat} />
        <StatCard label="Resolved" value={stats.resolved} icon={ClipboardCheck} tone="green" />
        <StatCard label="Critical open" value={stats.critical} icon={AlertTriangle} tone="red" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="card p-4 lg:col-span-2">
          <h2 className="font-semibold text-navy-950">Submission trend</h2>
          <TrendChart data={stats.trend} />
        </article>
        <article className="card p-4">
          <h2 className="font-semibold text-navy-950">Severity</h2>
          <DonutChart data={stats.bySeverity} />
        </article>
        <article className="card p-4 lg:col-span-2">
          <h2 className="font-semibold text-navy-950">Categories</h2>
          <CategoryChart data={stats.byCategory} />
        </article>
        <article className="card p-4">
          <h2 className="font-semibold text-navy-950">Status</h2>
          <CategoryChart data={stats.byStatus} />
        </article>
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold text-navy-900">Needs attention</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {stats.reports
            .filter((item) => ['Submitted', 'Under Review', 'Verified', 'Resolved'].includes(item.status) || item.severity === 'Critical')
            .slice(0, 4)
            .map((report) => (
              <ReportCard key={report.id} report={report} to={`/admin/reports/${report.id}`} />
            ))}
        </div>
      </section>
    </div>
  )
}
