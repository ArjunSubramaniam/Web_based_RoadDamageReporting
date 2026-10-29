import { useEffect, useState } from 'react'
import { EmptyState } from '../components/EmptyState.jsx'
import { ReportCard } from '../components/ReportCard.jsx'
import { SkeletonList } from '../components/Skeleton.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useStoreTick } from '../hooks/useReports.js'
import { getReports } from '../services/reportService.js'

export function MaintenanceTasks({ completed = false }) {
  const { user } = useAuth()
  const tick = useStoreTick()
  const [reports, setReports] = useState(null)

  useEffect(() => {
    getReports({
      teamId: user.teamId,
      statuses: completed ? ['Resolved', 'Closed'] : ['Maintenance Assigned', 'In Progress'],
    }).then(setReports)
  }, [user.teamId, tick, completed])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-navy-950">{completed ? 'Completed tasks' : 'Assigned tasks'}</h1>
      {!reports ? (
        <SkeletonList />
      ) : reports.length ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} to={`/maintenance/tasks/${report.id}`} />
          ))}
        </div>
      ) : (
        <EmptyState title={completed ? 'No completed tasks' : 'No assigned tasks'} message="Task lists update when work is assigned or resolved." />
      )}
    </div>
  )
}
