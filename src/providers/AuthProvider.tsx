import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { UserRepository } from '../repositories/UserRepository'
import type { Session, User } from '@supabase/supabase-js'
import type { UserProfile } from '../store/authStore'

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSessionAndProfile = async () => {
    try {
      console.log('[AUTH] Fetching session from Supabase...')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('[AUTH] Error fetching session:', error)
        setSession(null)
        setProfile(null)
        return
      }

      console.log('[AUTH] Session restored:', !!session)
      setSession(session)
      
      if (session?.user) {
        try {
          console.log('[AUTH] Fetching profile for user:', session.user.id)
          const profileData = await UserRepository.getProfile(session.user.id)
          setProfile(profileData)
          console.log('[AUTH] Profile found.')
        } catch (profileError) {
          console.error('[AUTH] Profile not found or error. Continuing authenticated.', profileError)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
    } catch (err) {
      console.error('[AUTH] Unexpected error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    console.log('[AUTH] AuthProvider Mounted')

    fetchSessionAndProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      console.log(`[AUTH] onAuthStateChange Event: ${event}`)
      if (!mounted) return

      if (event === 'SIGNED_OUT') {
        console.log('[AUTH] User signed out, clearing state.')
        setSession(null)
        setProfile(null)
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        // Do not use this event to restore session manually as per rule 3.
        // But we can synchronize if needed, or simply log it.
        console.log(`[AUTH] Synchronization event received: ${event}.`)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const refreshSession = async () => {
    setIsLoading(true)
    await fetchSessionAndProfile()
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, profile, isLoading, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

