import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageSkeleton } from '../components/common/Skeletons'

/** Redirects guests to /login and sends them back after signing in. */
export default function ProtectedRoute({ children, admin = false }) {
  const { isAuthenticated, booting, user } = useAuth()
  const location = useLocation()
  if (booting) return <PageSkeleton />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  if (admin && user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}
