import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { UserRepository } from '../repositories/UserRepository'
import { AuthRepository } from '../repositories/AuthRepository'
import type { Session, User } from '@supabase/supabase-js'
import type { UserProfile } from '../store/authStore' // Re-using types

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  setSession: (session: Session | null) => void
  setProfile: (profile: UserProfile | null) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const user = session?.user ?? null

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      console.log('[AUTH] Starting initializeAuth. Getting session...')
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.log('[AUTH] getSession finished. Session found:', !!session)
        if (error) {
          console.error('[AUTH] getSession error:', error)
          throw error
        }

        if (mounted) {
          setSession(session)
          if (session?.user) {
            console.log('[AUTH] Fetching user profile for:', session.user.id)
            const profileData = await UserRepository.getProfile(session.user.id)
            setProfile(profileData)
            console.log('[AUTH] Profile fetched successfully')
          } else {
            console.log('[AUTH] No user in session')
          }
        }
      } catch (error) {
        console.error('[AUTH] Error during auth initialization:', error)
      } finally {
        if (mounted) {
          console.log('[AUTH] Setting isLoading to false')
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`[AUTH EVENT] ${event}. Session present: ${!!currentSession}`)
      if (mounted) {
        if (event === 'INITIAL_SESSION') {
          console.log('[AUTH] Ignoring INITIAL_SESSION event, initializeAuth handles it.')
          return
        }

        if (event === 'SIGNED_OUT') {
          console.log('[AUTH] Handling SIGNED_OUT event. Clearing session.')
          setSession(null)
          setProfile(null)
          return
        }

        setSession(currentSession)
        
        if (currentSession?.user && event === 'SIGNED_IN') {
          console.log('[AUTH] SIGNED_IN event. Fetching profile.')
          try {
            const profileData = await UserRepository.getProfile(currentSession.user.id)
            setProfile(profileData)
          } catch (error) {
            console.error('[AUTH] Error loading profile on auth state change:', error)
          }
        }
      }
    })

    return () => {
      console.log('[AUTH] Unmounting AuthProvider')
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    try {
      setIsLoading(true)
      await AuthRepository.signOut()
    } finally {
      setSession(null)
      setProfile(null)
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, isLoading, setSession, setProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
