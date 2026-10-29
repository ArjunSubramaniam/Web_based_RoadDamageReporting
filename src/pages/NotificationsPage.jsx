import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState, LoadingState } from '../components/EmptyState.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useNotifications } from '../hooks/useReports.js'
import { useToast } from '../hooks/useToast.jsx'
import { markAllNotificationsRead, markNotificationRead } from '../services/reportService.js'
import { formatDate } from '../utils/format.js'

export function NotificationsPage() {
  const { user } = useAuth()
  const { items, unread } = useNotifications()
  const { push } = useToast()
  const detailBase = user.role === 'admin' ? '/admin/reports' : user.role === 'maintenance' ? '/maintenance/tasks' : '/citizen/reports'

  if (!items) return <LoadingState />

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">Notifications</h1>
          <p className="text-sm text-slate-600">{unread} unread</p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await markAllNotificationsRead(user.id)
            push('All notifications marked as read.')
          }}
          className="btn-secondary"
        >
          Mark all as read
        </button>
      </div>
      {items.length ? (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className={`card p-4 ${item.read ? '' : 'border-blue-200 bg-blue-50/50'}`}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-navy-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                  <p className="mt-2 text-xs text-slate-400">{formatDate(item.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  {!item.read ? (
                    <button type="button" onClick={() => markNotificationRead(item.id)} className="btn-secondary h-10 px-3 text-sm">
                      Mark read
                    </button>
                  ) : null}
                  {item.reportId ? (
                    <Link to={`${detailBase}/${item.reportId}`} className="btn-primary h-10 px-3 text-sm">
                      Open
                    </Link>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={Bell} title="No notifications" message="Actions such as submitting or verifying reports will appear here." />
      )}
    </div>
  )
}
