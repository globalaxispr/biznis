import { supabase } from '../lib/supabase'
import type { InventoryMovement } from '../types/erp'
import { ProductRepository } from './ProductRepository'

const isPlaceholder = 
  !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder') || 
  import.meta.env.VITE_SUPABASE_URL.includes('sua-url-aqui')

let mockMovements: InventoryMovement[] = []

export const InventoryRepository = {
  async getAll(): Promise<InventoryMovement[]> {
    if (isPlaceholder) return mockMovements

    const { data, error } = await supabase
      .from('inventory_movements')
      .select('*, product:products(*)')
      .order('created_at', { ascending: false })
      
    if (error) throw error
    return data || []
  },

  async addMovement(movement: Omit<InventoryMovement, 'id'>): Promise<InventoryMovement> {
    if (isPlaceholder) {
      const newMov: InventoryMovement = { ...movement, id: `inv-${Date.now()}`, created_at: new Date().toISOString() }
      mockMovements.unshift(newMov)

      // Adjust product stock
      const qtyChange = movement.type === 'in' ? movement.quantity : movement.type === 'out' ? -movement.quantity : movement.quantity
      await ProductRepository.updateStock(movement.product_id, qtyChange)

      return newMov
    }

    const { data, error } = await supabase
      .from('inventory_movements')
      .insert([movement])
      .select()
      .single()

    if (error) throw error

    // Adjust product stock
    const qtyChange = movement.type === 'in' ? movement.quantity : movement.type === 'out' ? -movement.quantity : movement.quantity
    await ProductRepository.updateStock(movement.product_id, qtyChange)

    return data
  }
}
