import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { UserRepository } from '../repositories/UserRepository'
import { AuthRepository } from '../repositories/AuthRepository'
import type { Session, User } from '@supabase/supabase-js'
import { SplashScreen } from '../components/ui/SplashScreen'
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
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error

        if (mounted) {
          setSession(session)
          if (session?.user) {
            const profileData = await UserRepository.getProfile(session.user.id)
            setProfile(profileData)
          }
        }
      } catch (error) {
        console.error('Error during auth initialization:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (mounted) {
        if (event === 'SIGNED_OUT') {
          setSession(null)
          setProfile(null)
          return
        }

        setSession(currentSession)
        
        if (currentSession?.user && event === 'SIGNED_IN') {
          try {
            const profileData = await UserRepository.getProfile(currentSession.user.id)
            setProfile(profileData)
          } catch (error) {
            console.error('Error loading profile on auth state change:', error)
          }
        }
      }
    })

    return () => {
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

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, isLoading, setSession, setProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
