import { supabase } from '../lib/supabase'
import type { StoreSettings } from '../types/erp'

const isPlaceholder = 
  !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder') || 
  import.meta.env.VITE_SUPABASE_URL.includes('sua-url-aqui')

let mockSettings: StoreSettings = {
  id: 1,
  name: 'BizHaiti Commerce',
  phone: '+509 3700 0000',
  email: 'contact@bizhaiti.ht',
  address: 'Port-au-Prince, Haiti',
  city: 'Port-au-Prince',
  country: 'Haiti',
  nif: '000-000-000',
  currency: 'HTG',
  language: 'ht',
  tax_rate: 0,
  receipt_message: 'Mèsi paske ou achte lakay nou. Nou swete wè ou ankò.',
  printer_name: 'POS-80 Thermal Printer'
}

export const SettingsRepository = {
  async getSettings(): Promise<StoreSettings> {
    if (isPlaceholder) return mockSettings

    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .single()
      
    if (error && error.code !== 'PGRST116') throw error
    return data || mockSettings
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    if (isPlaceholder) {
      mockSettings = { ...mockSettings, ...settings }
      return mockSettings
    }

    const { data, error } = await supabase
      .from('store_settings')
      .update(settings)
      .eq('id', 1)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
