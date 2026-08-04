import { supabase } from '../lib/supabase'
import type { Supplier } from '../types/erp'

const isPlaceholder = 
  !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder') || 
  import.meta.env.VITE_SUPABASE_URL.includes('sua-url-aqui')

let mockSuppliers: Supplier[] = [
  { id: 'sup-1', name: 'Brana S.A.', company_name: 'Brasserie Nationale d\'Haïti', phone: '+509 2940 0000', email: 'orders@brana.ht', address: 'Boulevard Toussaint Louverture', created_at: new Date().toISOString() },
  { id: 'sup-2', name: 'Dinsa Distributeur', company_name: 'Distribution S.A.', phone: '+509 3811 2233', email: 'sales@dinsa.ht', address: 'Delmas 33, Port-au-Prince', created_at: new Date().toISOString() },
]

export const SupplierRepository = {
  async getAll(): Promise<Supplier[]> {
    if (isPlaceholder) return mockSuppliers

    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name')
      
    if (error) throw error
    return data || []
  },

  async create(supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
    if (isPlaceholder) {
      const newSup: Supplier = { ...supplier, id: `sup-${Date.now()}`, created_at: new Date().toISOString() }
      mockSuppliers.push(newSup)
      return newSup
    }

    const { data, error } = await supabase
      .from('suppliers')
      .insert([supplier])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, supplier: Partial<Supplier>): Promise<Supplier> {
    if (isPlaceholder) {
      mockSuppliers = mockSuppliers.map(s => s.id === id ? { ...s, ...supplier } : s)
      return mockSuppliers.find(s => s.id === id)!
    }

    const { data, error } = await supabase
      .from('suppliers')
      .update(supplier)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    if (isPlaceholder) {
      mockSuppliers = mockSuppliers.filter(s => s.id !== id)
      return
    }

    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
