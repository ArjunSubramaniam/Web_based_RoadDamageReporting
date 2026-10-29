export const ROLES = {
  CITIZEN: 'citizen',
  ADMIN: 'admin',
  MAINTENANCE: 'maintenance',
}

export const STATUSES = [
  'Submitted',
  'Under Review',
  'Verified',
  'Maintenance Assigned',
  'In Progress',
  'Resolved',
  'Closed',
  'Rejected',
]

export const ALLOWED_TRANSITIONS = {
  Submitted: ['Under Review', 'Rejected'],
  'Under Review': ['Verified', 'Rejected'],
  Verified: ['Maintenance Assigned'],
  'Maintenance Assigned': ['In Progress'],
  'In Progress': ['Resolved'],
  Resolved: ['Closed'],
  Closed: [],
  Rejected: [],
}

export const CATEGORIES = [
  'Pothole',
  'Road Crack',
  'Broken Road Surface',
  'Waterlogging/Flooding',
  'Damaged Manhole',
  'Other',
]

export const SEVERITIES = ['Low', 'Medium', 'High', 'Critical']

export const STATUS_STYLES = {
  Submitted: 'bg-slate-100 text-slate-700 border-slate-200',
  'Under Review': 'bg-sky-50 text-sky-800 border-sky-200',
  Verified: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  'Maintenance Assigned': 'bg-violet-50 text-violet-800 border-violet-200',
  'In Progress': 'bg-amber-50 text-amber-800 border-amber-200',
  Resolved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Closed: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  Rejected: 'bg-red-50 text-red-800 border-red-200',
}

export const SEVERITY_STYLES = {
  Low: 'bg-slate-100 text-slate-700 border-slate-200',
  Medium: 'bg-amber-50 text-amber-800 border-amber-200',
  High: 'bg-orange-50 text-orange-800 border-orange-200',
  Critical: 'bg-red-50 text-red-800 border-red-200',
}

export const STORAGE_KEYS = {
  DB: 'roadwatch_db_v2',
  SESSION: 'roadwatch_session_v2',
}

export const SEED_PASSWORD_HASH = '37c415ee3b1d009ed72e7cc40d60b0702848f6c84c1a24a8dc8687a180fd0407'
export const MAX_IMAGE_BYTES = 450 * 1024
export const PAGE_SIZE = 8

export const CATEGORY_ALIASES = {
  Flooding: 'Waterlogging/Flooding',
  'Broken Road': 'Broken Road Surface',
  'Missing Manhole': 'Damaged Manhole',
}
