import { useEffect, useState } from 'react'
import { CategoryChart, DonutChart, TrendChart } from '../components/Charts.jsx'
import { SkeletonGrid } from '../components/Skeleton.jsx'
import { StatCard } from '../components/StatCard.jsx'
import { useStoreTick } from '../hooks/useReports.js'
import { getDashboardStats } from '../services/reportService.js'

export function Analytics() {
  const tick = useStoreTick()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getDashboardStats().then(setStats)
  }, [tick])

  if (!stats) return <SkeletonGrid />

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-navy-950">Analytics</h1>
      <p className="text-sm text-slate-600">All figures are derived from the current report records.</p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Pending review" value={stats.pending} tone="amber" />
        <StatCard label="Verified" value={stats.verified} />
        <StatCard label="Active maintenance" value={stats.inProgress} />
        <StatCard label="Resolved" value={stats.resolved} tone="green" />
        <StatCard label="Critical" value={stats.critical} tone="red" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="card p-4">
          <h2 className="font-semibold text-navy-950">Trend</h2>
          <TrendChart data={stats.trend} />
        </article>
        <article className="card p-4">
          <h2 className="font-semibold text-navy-950">Severity</h2>
          <DonutChart data={stats.bySeverity} />
        </article>
        <article className="card p-4">
          <h2 className="font-semibold text-navy-950">Categories</h2>
          <CategoryChart data={stats.byCategory} />
        </article>
        <article className="card p-4">
          <h2 className="font-semibold text-navy-950">Status</h2>
          <CategoryChart data={stats.byStatus} />
        </article>
      </div>
    </div>
  )
}
