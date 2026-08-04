import { supabase } from '../lib/supabase'
import type { CashRegister, CashMovement } from '../types/erp'

const isPlaceholder = 
  !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder') || 
  import.meta.env.VITE_SUPABASE_URL.includes('sua-url-aqui')

let mockCurrentRegister: CashRegister | null = {
  id: 'cash-1',
  initial_balance: 5000,
  current_balance: 5000,
  status: 'open',
  opened_at: new Date().toISOString()
}

let mockMovements: CashMovement[] = []

export const CashRegisterRepository = {
  async getCurrent(): Promise<CashRegister | null> {
    if (isPlaceholder) return mockCurrentRegister

    const { data, error } = await supabase
      .from('cash_registers')
      .select('*')
      .eq('status', 'open')
      .order('opened_at', { ascending: false })
      .maybeSingle()
      
    if (error) throw error
    return data
  },

  async openRegister(initial_balance: number, user_id?: string): Promise<CashRegister> {
    if (isPlaceholder) {
      mockCurrentRegister = {
        id: `cash-${Date.now()}`,
        opened_by: user_id,
        initial_balance,
        current_balance: initial_balance,
        status: 'open',
        opened_at: new Date().toISOString()
      }
      return mockCurrentRegister
    }

    const { data, error } = await supabase
      .from('cash_registers')
      .insert([{ initial_balance, current_balance: initial_balance, opened_by: user_id, status: 'open' }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async closeRegister(id: string, user_id?: string): Promise<void> {
    if (isPlaceholder) {
      if (mockCurrentRegister) {
        mockCurrentRegister.status = 'closed'
        mockCurrentRegister.closed_at = new Date().toISOString()
        mockCurrentRegister.closed_by = user_id
        mockCurrentRegister = null
      }
      return
    }

    const { error } = await supabase
      .from('cash_registers')
      .update({ status: 'closed', closed_at: new Date().toISOString(), closed_by: user_id })
      .eq('id', id)

    if (error) throw error
  },

  async addMovement(movement: Omit<CashMovement, 'id'>): Promise<CashMovement> {
    if (isPlaceholder) {
      const newMov: CashMovement = { ...movement, id: `mov-${Date.now()}`, created_at: new Date().toISOString() }
      mockMovements.unshift(newMov)
      if (mockCurrentRegister) {
        if (movement.type === 'in') mockCurrentRegister.current_balance += movement.amount
        else mockCurrentRegister.current_balance -= movement.amount
      }
      return newMov
    }

    const { data, error } = await supabase
      .from('cash_movements')
      .insert([movement])
      .select()
      .single()

    if (error) throw error
    return data
  }
}
