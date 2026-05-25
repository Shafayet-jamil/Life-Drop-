import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, userRole, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />
  }

  return children
}
