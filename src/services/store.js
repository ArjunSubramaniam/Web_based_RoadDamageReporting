import { createSeedNotifications, createSeedReports, createSeedUsers } from '../data/seed.js'
import { STORAGE_KEYS } from '../utils/constants.js'

const listeners = new Set()

function emptyState() {
  return {
    reports: createSeedReports(),
    notifications: createSeedNotifications(),
    users: createSeedUsers(),
    nextReport: 1020,
    nextNote: 6,
    nextUser: 10,
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DB)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.reports) || !Array.isArray(parsed.notifications)) return emptyState()
    if (!Array.isArray(parsed.users)) parsed.users = createSeedUsers()
    return parsed
  } catch {
    return emptyState()
  }
}

let state = loadState()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEYS.DB, JSON.stringify(state))
  } catch {
    const slimReports = state.reports.map((report) => ({
      ...report,
      imageUrl: typeof report.imageUrl === 'string' && report.imageUrl.startsWith('data:image/svg') ? report.imageUrl : report.imageUrl?.startsWith('data:') ? '' : report.imageUrl,
      completionImageUrl:
        typeof report.completionImageUrl === 'string' && report.completionImageUrl.startsWith('data:image/svg')
          ? report.completionImageUrl
          : '',
    }))
    localStorage.setItem(STORAGE_KEYS.DB, JSON.stringify({ ...state, reports: slimReports }))
  }
  listeners.forEach((listener) => listener())
}

export function getState() {
  return state
}

export function setState(updater) {
  state = typeof updater === 'function' ? updater(state) : updater
  persist()
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function resetState() {
  state = emptyState()
  persist()
}
