import { useAuthStore, type UserRole } from '../../store/authStore'

interface PermissionGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallback?: React.ReactNode
}

export function PermissionGuard({ children, allowedRoles, fallback = null }: PermissionGuardProps) {
  const { profile } = useAuthStore()

  if (!profile) return <>{fallback}</>

  if (allowedRoles.includes(profile.role)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
