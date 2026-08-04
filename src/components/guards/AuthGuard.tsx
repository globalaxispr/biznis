import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return null // Return null, SplashScreen handles loading in App.tsx
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
