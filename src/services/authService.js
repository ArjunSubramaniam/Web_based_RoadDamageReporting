import { STORAGE_KEYS } from '../utils/constants.js'
import { hashPassword, passwordsMatch } from '../utils/password.js'
import { getState, setState } from './store.js'

function publicUser(user) {
  if (!user) return null
  const { passwordHash, ...rest } = user
  return rest
}

export function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persistSession(user) {
  const session = publicUser(user)
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session))
  return session
}

export async function loginWithCredentials(email, password) {
  const user = getState().users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase())
  if (!user || !(await passwordsMatch(password, user.passwordHash))) {
    throw new Error('Invalid email or password.')
  }
  return persistSession(user)
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.SESSION)
}

export function refreshSessionFromStore(userId) {
  const user = getState().users.find((item) => item.id === userId)
  if (!user) {
    logout()
    return null
  }
  return persistSession(user)
}

export async function registerCitizen(payload) {
  const email = payload.email.trim().toLowerCase()
  const existing = getState().users.find((item) => item.email.toLowerCase() === email)
  if (existing) throw new Error('An account with this email already exists.')
  const user = {
    id: `u-citizen-${getState().nextUser}`,
    email,
    passwordHash: await hashPassword(payload.password),
    role: 'citizen',
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    city: payload.city.trim(),
  }
  setState((state) => ({
    ...state,
    nextUser: state.nextUser + 1,
    users: [...state.users, user],
  }))
  return persistSession(user)
}

export async function updateProfile(userId, patch) {
  const allowed = {
    name: patch.name?.trim(),
    phone: patch.phone?.trim(),
    city: patch.city?.trim(),
  }
  let updated
  setState((state) => ({
    ...state,
    users: state.users.map((item) => {
      if (item.id !== userId) return item
      updated = { ...item, ...allowed }
      return updated
    }),
  }))
  if (!updated) throw new Error('Account not found.')
  return persistSession(updated)
}

export function getUsersByRole(role) {
  return getState().users.filter((item) => item.role === role).map(publicUser)
}
