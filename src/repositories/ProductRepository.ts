import { supabase } from '../lib/supabase'
import type { Product } from '../types/erp'

const isPlaceholder = 
  !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder') || 
  import.meta.env.VITE_SUPABASE_URL.includes('sua-url-aqui')

let mockProducts: Product[] = [
  { id: 'prod-1', name: 'Kola Couronne 50cl', code: 'PRD-001', barcode: '012345678901', buy_price: 150, sell_price: 250, quantity: 48, min_stock: 12, is_active: true, category_id: 'cat-1', supplier_id: 'sup-1', created_at: new Date().toISOString() },
  { id: 'prod-2', name: 'Riz Tchako 25kg', code: 'PRD-002', barcode: '012345678902', buy_price: 2200, sell_price: 2800, quantity: 8, min_stock: 10, is_active: true, category_id: 'cat-2', supplier_id: 'sup-2', created_at: new Date().toISOString() },
  { id: 'prod-3', name: 'Lwil Soleil 1L', code: 'PRD-003', barcode: '012345678903', buy_price: 350, sell_price: 500, quantity: 3, min_stock: 5, is_active: true, category_id: 'cat-2', supplier_id: 'sup-2', created_at: new Date().toISOString() },
  { id: 'prod-4', name: 'Savon Marseille', code: 'PRD-004', barcode: '012345678904', buy_price: 75, sell_price: 125, quantity: 60, min_stock: 15, is_active: true, category_id: 'cat-3', supplier_id: 'sup-2', created_at: new Date().toISOString() },
]

export const ProductRepository = {
  async getAll(): Promise<Product[]> {
    if (isPlaceholder) return mockProducts

    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*), supplier:suppliers(*)')
      .order('name')
      
    if (error) throw error
    return data || []
  },

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    if (isPlaceholder) {
      const newProd: Product = { ...product, id: `prod-${Date.now()}`, created_at: new Date().toISOString() }
      mockProducts.push(newProd)
      return newProd
    }

    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    if (isPlaceholder) {
      mockProducts = mockProducts.map(p => p.id === id ? { ...p, ...product } : p)
      return mockProducts.find(p => p.id === id)!
    }

    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    if (isPlaceholder) {
      mockProducts = mockProducts.filter(p => p.id !== id)
      return
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async updateStock(id: string, quantityChange: number): Promise<void> {
    if (isPlaceholder) {
      const prod = mockProducts.find(p => p.id === id)
      if (prod) prod.quantity += quantityChange
      return
    }

    const { data: prod } = await supabase.from('products').select('quantity').eq('id', id).single()
    if (prod) {
      await supabase.from('products').update({ quantity: prod.quantity + quantityChange }).eq('id', id)
    }
  }
}
