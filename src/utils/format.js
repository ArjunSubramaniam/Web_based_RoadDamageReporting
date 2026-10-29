export function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDay(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function daysFromNow(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function isOverdue(report) {
  if (!['Maintenance Assigned', 'In Progress'].includes(report.status)) return false
  const assigned = report.assignedAt || report.updatedAt
  return daysFromNow(assigned) >= 5
}

export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}
