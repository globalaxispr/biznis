import { supabase } from '../lib/supabase'
import type { Sale, SaleItemInput } from '../types/erp'
import { ProductRepository } from './ProductRepository'

const isPlaceholder = 
  !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder') || 
  import.meta.env.VITE_SUPABASE_URL.includes('sua-url-aqui')

let mockSales: Sale[] = []

export const SaleRepository = {
  async getAll(): Promise<Sale[]> {
    if (isPlaceholder) return mockSales

    const { data, error } = await supabase
      .from('sales')
      .select('*, customer:customers(*), items:sale_items(*, product:products(*))')
      .order('created_at', { ascending: false })
      
    if (error) throw error
    return data || []
  },

  async createSale(saleData: {
    customer_id?: string
    user_id?: string
    cash_register_id?: string
    subtotal: number
    discount: number
    total: number
    payment_method: 'cash' | 'card' | 'transfer' | 'other' | 'pix'
    amount_received?: number
    change?: number
    items: SaleItemInput[]
  }): Promise<Sale> {
    const sale_number = `VEN-${Date.now().toString().slice(-6)}`

    if (isPlaceholder) {
      const newSale: Sale = {
        id: `sale-${Date.now()}`,
        sale_number,
        customer_id: saleData.customer_id,
        user_id: saleData.user_id,
        cash_register_id: saleData.cash_register_id,
        subtotal: saleData.subtotal,
        discount: saleData.discount,
        total: saleData.total,
        payment_method: saleData.payment_method as any,
        amount_received: saleData.amount_received,
        change: saleData.change,
        created_at: new Date().toISOString(),
        items: saleData.items.map((item, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          product: item.product
        }))
      }

      // Deduct stock for mock
      for (const item of saleData.items) {
        await ProductRepository.updateStock(item.product.id, -item.quantity)
      }

      mockSales.unshift(newSale)
      return newSale
    }

    // Insert sale into Supabase
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([{
        sale_number,
        customer_id: saleData.customer_id,
        user_id: saleData.user_id,
        cash_register_id: saleData.cash_register_id,
        subtotal: saleData.subtotal,
        discount: saleData.discount,
        total: saleData.total,
        payment_method: saleData.payment_method,
        amount_received: saleData.amount_received,
        change: saleData.change
      }])
      .select()
      .single()

    if (saleError) throw saleError

    // Insert sale items
    const itemsToInsert = saleData.items.map(item => ({
      sale_id: sale.id,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price
    }))

    const { error: itemsError } = await supabase.from('sale_items').insert(itemsToInsert)
    if (itemsError) throw itemsError

    // Deduct stock for each product
    for (const item of saleData.items) {
      await ProductRepository.updateStock(item.product.id, -item.quantity)
    }

    return sale
  }
}
