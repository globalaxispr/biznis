import { supabase } from '../lib/supabase'

const isPlaceholder = 
  !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder') || 
  import.meta.env.VITE_SUPABASE_URL.includes('sua-url-aqui')

export const AuthRepository = {
  async signIn(email: string, password: string) {
    if (isPlaceholder) {
      if (email === 'admin@bizhaiti.com' && password === 'Admin123!') {
        const mockUser = {
          id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          email: 'admin@bizhaiti.com',
          app_metadata: {},
          user_metadata: { first_name: 'Admin', last_name: 'BizHaiti', role: 'admin' },
          aud: 'authenticated',
          created_at: new Date().toISOString()
        }
        const mockSession = {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user: mockUser as any
        }
        return { user: mockUser, session: mockSession }
      } else {
        throw new Error('Imèl oswa modpas la pa bon (Sèvi ak: admin@bizhaiti.com / Admin123!)')
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    if (isPlaceholder) {
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    if (isPlaceholder) {
      return null
    }
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  }
}
