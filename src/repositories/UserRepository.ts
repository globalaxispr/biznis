import { supabase } from '../lib/supabase'
import type { UserProfile } from '../store/authStore'

const isPlaceholder = 
  !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder') || 
  import.meta.env.VITE_SUPABASE_URL.includes('sua-url-aqui')

export const UserRepository = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (isPlaceholder) {
      return {
        id: userId,
        first_name: 'Admin',
        last_name: 'BizHaiti',
        role: 'admin',
        is_active: true
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
      
    if (error && error.code !== 'PGRST116') throw error
    return data
  }
}
