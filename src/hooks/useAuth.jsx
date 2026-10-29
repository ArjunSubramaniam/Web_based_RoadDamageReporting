import { createContext, useContext, useMemo, useState } from 'react'
import { getSession, loginWithCredentials, logout as clearSession, refreshSessionFromStore, registerCitizen, updateProfile } from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession())

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: async (email, password) => {
        const session = await loginWithCredentials(email, password)
        setUser(session)
        return session
      },
      register: async (payload) => {
        const session = await registerCitizen(payload)
        setUser(session)
        return session
      },
      saveProfile: async (patch) => {
        const session = await updateProfile(user.id, patch)
        setUser(session)
        return session
      },
      logout: () => {
        clearSession()
        setUser(null)
      },
      syncSession: () => {
        const session = refreshSessionFromStore(user.id)
        setUser(session)
        return session
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
