import { supabase } from '../lib/supabase'
import type { Customer } from '../types/erp'

const isPlaceholder = 
  !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder') || 
  import.meta.env.VITE_SUPABASE_URL.includes('sua-url-aqui')

let mockCustomers: Customer[] = [
  { id: 'cust-1', name: 'Jean-Baptiste Pierre', phone: '+509 3612 8899', email: 'jean.baptiste@gmail.com', address: 'Pétion-Ville, Haiti', is_vip: true, total_spent: 12500, last_purchase_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'cust-2', name: 'Marie Florence Joseph', phone: '+509 4822 1100', email: 'marie.florence@yahoo.fr', address: 'Delmas 75, Haiti', is_vip: false, total_spent: 3400, last_purchase_at: new Date().toISOString(), created_at: new Date().toISOString() },
]

export const CustomerRepository = {
  async getAll(): Promise<Customer[]> {
    if (isPlaceholder) return mockCustomers

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name')
      
    if (error) throw error
    return data || []
  },

  async create(customer: Omit<Customer, 'id' | 'total_spent'>): Promise<Customer> {
    if (isPlaceholder) {
      const newCust: Customer = { 
        ...customer, 
        id: `cust-${Date.now()}`, 
        total_spent: 0,
        created_at: new Date().toISOString() 
      }
      mockCustomers.push(newCust)
      return newCust
    }

    const { data, error } = await supabase
      .from('customers')
      .insert([{ ...customer, total_spent: 0 }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    if (isPlaceholder) {
      mockCustomers = mockCustomers.map(c => c.id === id ? { ...c, ...customer } : c)
      return mockCustomers.find(c => c.id === id)!
    }

    const { data, error } = await supabase
      .from('customers')
      .update(customer)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    if (isPlaceholder) {
      mockCustomers = mockCustomers.filter(c => c.id !== id)
      return
    }

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
