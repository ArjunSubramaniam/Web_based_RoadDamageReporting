import { TEAMS } from '../data/seed.js'
import { ALLOWED_TRANSITIONS } from '../utils/constants.js'
import { isOverdue } from '../utils/format.js'
import { composeAddress } from '../utils/validation.js'
import { getState, resetState, setState, subscribe } from './store.js'

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function nowIso() {
  return new Date().toISOString()
}

function assertRole(actor, roles) {
  if (!actor || !roles.includes(actor.role)) {
    throw new Error('You do not have permission to perform this action.')
  }
}

function pushHistory(report, status, actor, note = '') {
  report.history = [
    ...(report.history || []),
    {
      status,
      at: nowIso(),
      by: actor?.name || 'System',
      role: actor?.role || 'system',
      note,
    },
  ]
}

function addNotification(userId, title, message, reportId) {
  if (!userId) return
  setState((state) => ({
    ...state,
    nextNote: state.nextNote + 1,
    notifications: [
      {
        id: `NTF-${state.nextNote}`,
        userId,
        title,
        message,
        reportId,
        read: false,
        createdAt: nowIso(),
      },
      ...state.notifications,
    ],
  }))
}

function notifyRoles(report, title, message, extraUserIds = []) {
  const admin = getState().users.find((user) => user.role === 'admin')
  const ids = new Set([report.citizenId, admin?.id, ...extraUserIds].filter(Boolean))
  ids.forEach((id) => addNotification(id, title, message, report.id))
}

function findReport(id) {
  return getState().reports.find((item) => item.id === id)
}

function saveReport(updated) {
  setState((state) => ({
    ...state,
    reports: state.reports.map((item) => (item.id === updated.id ? updated : item)),
  }))
  return clone(updated)
}

function assertTransition(from, to) {
  const allowed = ALLOWED_TRANSITIONS[from] || []
  if (!allowed.includes(to)) {
    throw new Error(`Status cannot move from “${from}” to “${to}”.`)
  }
}

export function subscribeReports(listener) {
  return subscribe(listener)
}

export async function getReports(filters = {}) {
  await delay()
  let reports = clone(getState().reports)
  if (filters.citizenId) reports = reports.filter((item) => item.citizenId === filters.citizenId)
  if (filters.teamId) reports = reports.filter((item) => item.assignedTeamId === filters.teamId)
  if (filters.status) reports = reports.filter((item) => item.status === filters.status)
  if (filters.statuses) reports = reports.filter((item) => filters.statuses.includes(item.status))
  if (filters.category) reports = reports.filter((item) => item.category === filters.category)
  if (filters.severity) reports = reports.filter((item) => item.severity === filters.severity)
  if (filters.query) {
    const q = filters.query.toLowerCase()
    reports = reports.filter((item) =>
      [item.title, item.address, item.id, item.citizenName, item.category, item.assignedTeamName, item.city, item.roadName]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }
  const sortKey = filters.sortKey || 'updatedAt'
  const dir = filters.sortDir === 'asc' ? 1 : -1
  reports.sort((a, b) => {
    const left = a[sortKey] ?? ''
    const right = b[sortKey] ?? ''
    if (sortKey === 'updatedAt' || sortKey === 'createdAt') return (new Date(left) - new Date(right)) * dir
    return String(left).localeCompare(String(right)) * dir
  })
  return reports
}

export async function getReportById(id, actor) {
  await delay(160)
  const report = findReport(id)
  if (!report) throw new Error('Report not found.')
  if (actor?.role === 'citizen' && report.citizenId !== actor.id) {
    throw new Error('You can only open reports that you submitted.')
  }
  return clone(report)
}

export async function createReport(data, actor) {
  await delay(360)
  assertRole(actor, ['citizen'])
  const title = data.title.trim()
  const roadName = data.roadName.trim()
  const fingerprint = `${actor.id}|${title}|${roadName}|${data.city}`.toLowerCase()
  const duplicate = getState().reports.find(
    (item) => item.fingerprint === fingerprint && Date.now() - new Date(item.createdAt).getTime() < 5 * 60 * 1000,
  )
  if (duplicate) {
    throw new Error(`A similar report (${duplicate.id}) was just submitted. Open that report instead of sending it twice.`)
  }
  const lat = data.lat === '' || data.lat == null ? null : Number(data.lat)
  const lng = data.lng === '' || data.lng == null ? null : Number(data.lng)
  const reportBase = {
    title,
    description: data.description.trim(),
    category: data.category,
    severity: data.severity,
    roadName,
    locality: data.locality.trim(),
    city: data.city.trim(),
    postalCode: data.postalCode.trim(),
    address: composeAddress(data),
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    imageUrl: data.imageUrl || '',
    completionImageUrl: '',
    citizenId: actor.id,
    citizenName: actor.name,
    status: 'Submitted',
    assignedTeamId: '',
    assignedTeamName: '',
    assignedAt: null,
    adminRemarks: '',
    maintenanceRemarks: '',
    rejectReason: '',
    fingerprint,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    history: [
      {
        status: 'Submitted',
        at: nowIso(),
        by: actor.name,
        role: 'citizen',
        note: 'Report submitted.',
      },
    ],
  }
  let created
  setState((state) => {
    created = { ...reportBase, id: `RPT-${state.nextReport}` }
    return { ...state, nextReport: state.nextReport + 1, reports: [created, ...state.reports] }
  })
  const admin = getState().users.find((user) => user.role === 'admin')
  addNotification(admin?.id, 'New report submitted', `${actor.name} submitted “${created.title}”.`, created.id)
  addNotification(actor.id, 'Report received', `${created.id} has been submitted for review.`, created.id)
  return clone(created)
}

export async function startReview(id, actor) {
  await delay(220)
  assertRole(actor, ['admin'])
  const current = findReport(id)
  if (!current) throw new Error('Report not found.')
  assertTransition(current.status, 'Under Review')
  const updated = { ...current, status: 'Under Review', updatedAt: nowIso() }
  pushHistory(updated, 'Under Review', actor, 'Opened for review.')
  notifyRoles(updated, 'Report under review', `${updated.id} is now under review.`)
  return saveReport(updated)
}

export async function verifyReport(id, actor, remarks = '') {
  await delay(280)
  assertRole(actor, ['admin'])
  const current = findReport(id)
  if (!current) throw new Error('Report not found.')
  let working = { ...current }
  if (working.status === 'Submitted') {
    pushHistory(working, 'Under Review', actor, 'Opened for verification.')
    working.status = 'Under Review'
  }
  assertTransition(working.status, 'Verified')
  working.status = 'Verified'
  working.adminRemarks = remarks || working.adminRemarks
  working.updatedAt = nowIso()
  pushHistory(working, 'Verified', actor, remarks || 'Report verified.')
  notifyRoles(working, 'Report verified', `${working.id} has been verified.`)
  return saveReport(working)
}

export async function rejectReport(id, reason, actor) {
  await delay(280)
  assertRole(actor, ['admin'])
  if (!reason?.trim()) throw new Error('Please provide a rejection reason.')
  const current = findReport(id)
  if (!current) throw new Error('Report not found.')
  let working = { ...current }
  if (working.status === 'Submitted') {
    pushHistory(working, 'Under Review', actor, 'Opened for review.')
    working.status = 'Under Review'
  }
  assertTransition(working.status, 'Rejected')
  working.status = 'Rejected'
  working.rejectReason = reason.trim()
  working.updatedAt = nowIso()
  pushHistory(working, 'Rejected', actor, reason.trim())
  notifyRoles(working, 'Report rejected', `${working.id} was rejected: ${reason.trim()}`)
  return saveReport(working)
}

export async function assignMaintenance(id, teamId, actor) {
  await delay(280)
  assertRole(actor, ['admin'])
  const current = findReport(id)
  if (!current) throw new Error('Report not found.')
  assertTransition(current.status, 'Maintenance Assigned')
  const team = TEAMS.find((item) => item.id === teamId)
  if (!team) throw new Error('Please choose a maintenance team.')
  const updated = {
    ...current,
    status: 'Maintenance Assigned',
    assignedTeamId: team.id,
    assignedTeamName: team.name,
    assignedAt: nowIso(),
    updatedAt: nowIso(),
  }
  pushHistory(updated, 'Maintenance Assigned', actor, `Assigned ${team.name}.`)
  const maintUsers = getState().users.filter((user) => user.teamId === team.id).map((user) => user.id)
  notifyRoles(updated, 'Maintenance assigned', `${updated.id} assigned to ${team.name}.`, maintUsers)
  return saveReport(updated)
}

export async function updateReportStatus(id, status, actor, note = '') {
  await delay(240)
  assertRole(actor, ['admin'])
  const current = findReport(id)
  if (!current) throw new Error('Report not found.')
  assertTransition(current.status, status)
  const updated = { ...current, status, updatedAt: nowIso() }
  pushHistory(updated, status, actor, note)
  notifyRoles(updated, 'Status updated', `${updated.id} is now “${status}”.`)
  return saveReport(updated)
}

export async function addAdminRemarks(id, remarks, actor) {
  await delay(200)
  assertRole(actor, ['admin'])
  const current = findReport(id)
  if (!current) throw new Error('Report not found.')
  const updated = { ...current, adminRemarks: remarks, updatedAt: nowIso() }
  pushHistory(updated, current.status, actor, `Administrator remark: ${remarks}`)
  notifyRoles(updated, 'New remark', `A remark was added to ${updated.id}.`)
  return saveReport(updated)
}

export async function addMaintenanceProgress(id, payload, actor) {
  await delay(280)
  assertRole(actor, ['maintenance'])
  const current = findReport(id)
  if (!current) throw new Error('Report not found.')
  if (current.assignedTeamId !== actor.teamId) {
    throw new Error('This task is not assigned to your team.')
  }
  let working = { ...current, maintenanceRemarks: payload.remarks ?? current.maintenanceRemarks }
  if (payload.completionImageUrl) working.completionImageUrl = payload.completionImageUrl
  if (payload.startWork && current.status === 'Maintenance Assigned') {
    assertTransition(current.status, 'In Progress')
    working.status = 'In Progress'
    pushHistory(working, 'In Progress', actor, payload.remarks || 'Work started.')
    notifyRoles(working, 'Work in progress', `${working.id} is now in progress.`)
  } else if (payload.complete) {
    if (current.status === 'Maintenance Assigned') {
      assertTransition(current.status, 'In Progress')
      working.status = 'In Progress'
      pushHistory(working, 'In Progress', actor, 'Work started before completion.')
    }
    if (working.status !== 'In Progress' && current.status !== 'In Progress') {
      throw new Error('Start the task before marking it completed.')
    }
    assertTransition('In Progress', 'Resolved')
    working.status = 'Resolved'
    pushHistory(working, 'Resolved', actor, payload.remarks || 'Marked resolved for administrator review.')
    notifyRoles(working, 'Repair resolved', `${working.id} was marked resolved.`)
  } else {
    pushHistory(working, working.status, actor, payload.remarks || 'Progress note added.')
    notifyRoles(working, 'Progress update', `A repair note was added to ${working.id}.`)
  }
  working.updatedAt = nowIso()
  return saveReport(working)
}

export async function closeReport(id, actor) {
  await delay(240)
  return updateReportStatus(id, 'Closed', actor, 'Closed after administrator review.')
}

export async function getDashboardStats(scope = {}) {
  await delay(160)
  const reports = await getReports(scope)
  const count = (status) => reports.filter((item) => item.status === status).length
  const byDay = {}
  reports.forEach((item) => {
    const day = new Date(item.createdAt).toISOString().slice(0, 10)
    byDay[day] = (byDay[day] || 0) + 1
  })
  const trend = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([name, value]) => ({ name: name.slice(5), value }))
  return {
    total: reports.length,
    pending: reports.filter((item) => ['Submitted', 'Under Review'].includes(item.status)).length,
    inProgress: reports.filter((item) => ['Maintenance Assigned', 'In Progress'].includes(item.status)).length,
    resolved: reports.filter((item) => ['Resolved', 'Closed'].includes(item.status)).length,
    submitted: count('Submitted'),
    underReview: count('Under Review'),
    verified: count('Verified'),
    assigned: count('Maintenance Assigned'),
    working: count('In Progress'),
    resolvedOnly: count('Resolved'),
    closed: count('Closed'),
    rejected: count('Rejected'),
    critical: reports.filter((item) => item.severity === 'Critical' && !['Closed', 'Rejected'].includes(item.status)).length,
    overdue: reports.filter(isOverdue).length,
    byCategory: groupCount(reports, 'category'),
    bySeverity: groupCount(reports, 'severity'),
    byStatus: groupCount(reports, 'status'),
    trend,
    reports,
  }
}

function groupCount(items, key) {
  const map = {}
  items.forEach((item) => {
    map[item[key]] = (map[item[key]] || 0) + 1
  })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
}

export async function getNotifications(userId) {
  await delay(120)
  return clone(getState().notifications.filter((item) => item.userId === userId))
}

export async function markNotificationRead(id) {
  await delay(60)
  setState((state) => ({
    ...state,
    notifications: state.notifications.map((item) => (item.id === id ? { ...item, read: true } : item)),
  }))
}

export async function markAllNotificationsRead(userId) {
  await delay(80)
  setState((state) => ({
    ...state,
    notifications: state.notifications.map((item) => (item.userId === userId ? { ...item, read: true } : item)),
  }))
}

export async function resetDevelopmentData() {
  await delay(160)
  resetState()
}

export function getTeams() {
  return clone(TEAMS)
}

export function getAllowedNextStatuses(status) {
  return ALLOWED_TRANSITIONS[status] || []
}
