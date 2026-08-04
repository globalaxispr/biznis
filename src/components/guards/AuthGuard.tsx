import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../providers/AuthProvider"
import { SplashScreen } from "../ui/SplashScreen"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth()
  const location = useLocation()

  console.log(`[AUTH GUARD] Rendering. isLoading: ${isLoading}, session: ${!!session}, path: ${location.pathname}`)

  if (isLoading) {
    console.log('[AUTH GUARD] Still loading, returning SplashScreen')
    return <SplashScreen />
  }

  if (!session) {
    console.log('[AUTH GUARD] No session found. Redirecting to /login')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  console.log('[AUTH GUARD] Session found. Rendering children.')
  return <>{children}</>
}
