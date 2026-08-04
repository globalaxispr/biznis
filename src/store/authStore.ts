import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'

export type UserRole = 'admin' | 'manager' | 'cashier' | 'stockist' | 'seller'

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  role: UserRole
  is_active: boolean
}

interface AuthState {
  session: Session | null
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  setSession: (session: Session | null) => void
  setProfile: (profile: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ session: null, user: null, profile: null })
}))
