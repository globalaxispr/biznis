import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../providers/AuthProvider"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return null // Return null, SplashScreen handles loading in AuthProvider
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
