import { type UserRole } from '../../store/authStore'
import { useAuth } from '../../providers/AuthProvider'

interface PermissionGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallback?: React.ReactNode
}

export function PermissionGuard({ children, allowedRoles, fallback = null }: PermissionGuardProps) {
  const { profile } = useAuth()

  if (!profile) return <>{fallback}</>

  if (allowedRoles.includes(profile.role)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
