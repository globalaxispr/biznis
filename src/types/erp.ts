export interface Category {
  id: string
  name: string
  description?: string
  created_at?: string
}

export interface Supplier {
  id: string
  name: string
  company_name?: string
  phone?: string
  whatsapp?: string
  email?: string
  address?: string
  city?: string
  country?: string
  notes?: string
  total_purchases?: number
  last_purchase_at?: string
  created_at?: string
}

export interface Customer {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  is_vip: boolean
  total_spent: number
  last_purchase_at?: string
  created_at?: string
}

export interface Product {
  id: string
  name: string
  code?: string
  barcode?: string
  category_id?: string
  supplier_id?: string
  buy_price: number
  sell_price: number
  quantity: number
  min_stock: number
  image_url?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
  category?: Category
  supplier?: Supplier
}

export interface Employee {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  address?: string
  role: 'admin' | 'manager' | 'cashier' | 'stockist' | 'seller'
  department?: string
  hire_date?: string
  salary?: number
  username?: string
  status: 'active' | 'inactive'
  last_login_at?: string
  created_at?: string
}

export interface CashRegister {
  id: string
  opened_by?: string
  closed_by?: string
  initial_balance: number
  current_balance: number
  status: 'open' | 'closed'
  opened_at: string
  closed_at?: string
}

export interface CashMovement {
  id: string
  cash_register_id: string
  user_id?: string
  type: 'in' | 'out'
  amount: number
  reason: string
  created_at?: string
}

export interface SaleItemInput {
  product: Product
  quantity: number
  unit_price: number
  total_price: number
}

export interface Sale {
  id: string
  sale_number: string
  customer_id?: string
  user_id?: string
  cash_register_id?: string
  subtotal: number
  discount: number
  total: number
  payment_method: 'cash' | 'card' | 'transfer' | 'other'
  amount_received?: number
  change?: number
  created_at?: string
  customer?: Customer
  items?: {
    id: string
    product_id: string
    quantity: number
    unit_price: number
    total_price: number
    product?: Product
  }[]
}

export interface InventoryMovement {
  id: string
  product_id: string
  user_id?: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reason: string
  created_at?: string
  product?: Product
}

export interface StoreSettings {
  id: number
  name: string
  logo_url?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  country?: string
  nif?: string
  currency: string
  language: string
  tax_rate: number
  receipt_message: string
  printer_name?: string
}
