import { supabase } from '../lib/supabase'
import type { Category } from '../types/erp'

const isPlaceholder = 
  !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder') || 
  import.meta.env.VITE_SUPABASE_URL.includes('sua-url-aqui')

let mockCategories: Category[] = [
  { id: 'cat-1', name: 'Bwason ak Ji', description: 'Ji natirèl, sodas ak dlo', created_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Manje ak Pwovizyon', description: 'Riz, pwa, lwil, sik ak farin', created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Hygiène ak Pwòpte', description: 'Savon, pat, poud lave', created_at: new Date().toISOString() },
]

export const CategoryRepository = {
  async getAll(): Promise<Category[]> {
    if (isPlaceholder) return mockCategories

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
      
    if (error) throw error
    return data || []
  },

  async create(category: Omit<Category, 'id'>): Promise<Category> {
    if (isPlaceholder) {
      const newCat: Category = { ...category, id: `cat-${Date.now()}`, created_at: new Date().toISOString() }
      mockCategories.push(newCat)
      return newCat
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, category: Partial<Category>): Promise<Category> {
    if (isPlaceholder) {
      mockCategories = mockCategories.map(c => c.id === id ? { ...c, ...category } : c)
      return mockCategories.find(c => c.id === id)!
    }

    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    if (isPlaceholder) {
      mockCategories = mockCategories.filter(c => c.id !== id)
      return
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
