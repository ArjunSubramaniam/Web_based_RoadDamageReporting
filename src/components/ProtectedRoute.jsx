import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export function ProtectedRoute({ roles }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(user.role)) {
    const home = user.role === 'admin' ? '/admin' : user.role === 'maintenance' ? '/maintenance' : '/citizen'
    return <Navigate to={home} replace />
  }

  return <Outlet />
}

export function GuestOnly() {
  const { user } = useAuth()
  if (user) {
    const home = user.role === 'admin' ? '/admin' : user.role === 'maintenance' ? '/maintenance' : '/citizen'
    return <Navigate to={home} replace />
  }
  return <Outlet />
}
