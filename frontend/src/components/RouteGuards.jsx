import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { hasAnyRole } from '../lib/token'

export function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

export function RequireRole({ children, roles }) {
  const { isAuthenticated, currentUser } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!hasAnyRole(currentUser, roles)) {
    return <Navigate to="/" replace />
  }

  return children
}
