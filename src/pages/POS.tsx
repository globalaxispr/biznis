import { useState, useMemo, useRef, useEffect } from 'react'
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  CreditCard, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  Camera, 
  ArrowUpDown,
  X,
  Smartphone,
  Landmark
} from 'lucide-react'
import toast from 'react-hot-toast'

import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useCustomers } from '../hooks/useCustomers'
import { useSales } from '../hooks/useSales'
import { useCashRegister } from '../hooks/useCashRegister'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { ReceiptModal } from '../components/modals/ReceiptModal'
import { CameraScannerModal } from '../components/modals/CameraScannerModal'
import { CheckoutSuccessModal } from '../components/modals/CheckoutSuccessModal'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import type { Product, SaleItemInput, Sale } from '../types/erp'

type SortOption = 'name' | 'price_asc' | 'price_desc' | 'stock'
type PaymentMethod = 'cash' | 'card' | 'transfer' | 'pix' | 'other'

export function POS() {
  const { data: products = [] } = useProducts()
  const { data: categories = [] } = useCategories()
  const { data: customers = [] } = useCustomers()
  const { register: cashRegister } = useCashRegister()
  const { createSale, isSubmitting } = useSales()

  const searchInputRef = useRef<HTMLInputElement>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [cart, setCart] = useState<SaleItemInput[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  
  // Checkout Fields
  const [discount, setDiscount] = useState<number>(0)
  const [amountReceivedInput, setAmountReceivedInput] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  
  // Modals & Drawers
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false)
  
  const [completedSale, setCompletedSale] = useState<Sale | null>(null)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)

  // Keyboard Shortcuts (F2 -> Focus search, F9 -> Submit)
  useKeyboardShortcuts([
    { key: 'F2', action: () => searchInputRef.current?.focus() },
    { key: 'F9', action: () => handleFinishSale() }
  ])

  // Barcode scanner USB/Bluetooth hardware key listener
  useEffect(() => {
    let buffer = ''
    let lastKeyTime = Date.now()

    const handleKey = (e: KeyboardEvent) => {
      const currentTime = Date.now()
      if (currentTime - lastKeyTime > 100) {
        buffer = ''
      }
      lastKeyTime = currentTime

      if (e.key === 'Enter') {
        if (buffer.length >= 3) {
          const matched = products.find(p => p.barcode === buffer || p.code === buffer)
          if (matched) {
            addToCart(matched)
            toast.success(`Ajoute: ${matched.name}`)
          } else {
            toast.error(`Kòd pa jwenn: ${buffer}`)
          }
          buffer = ''
        }
      } else if (e.key.length === 1) {
        buffer += e.key
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [products])

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.barcode?.includes(searchQuery) ||
                            p.code?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategoryId ? p.category_id === selectedCategoryId : true
      return matchesSearch && matchesCategory
    })

    return list.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'price_asc') return a.sell_price - b.sell_price
      if (sortBy === 'price_desc') return b.sell_price - a.sell_price
      if (sortBy === 'stock') return b.quantity - a.quantity
      return 0
    })
  }, [products, searchQuery, selectedCategoryId, sortBy])

  // Cart Math
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.total_price, 0), [cart])
  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount])
  
  const amountReceived = parseFloat(amountReceivedInput) || 0
  const change = amountReceived > total ? amountReceived - total : 0
  
  const isReceivedSufficient = amountReceived >= total || paymentMethod !== 'cash'

  const addToCart = (product: Product) => {
    if (product.quantity <= 0) {
      toast.error('Pwodwi sa a esgote!')
      return
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id)
      if (existingIndex > -1) {
        const existing = prev[existingIndex]
        if (existing.quantity >= product.quantity) {
          toast.error('Ou rive nan limit estok ki disponib la')
          return prev
        }
        const newQty = existing.quantity + 1
        const updated = [...prev]
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          total_price: newQty * existing.unit_price
        }
        return updated
      } else {
        return [...prev, {
          product,
          quantity: 1,
          unit_price: product.sell_price,
          total_price: product.sell_price
        }]
      }
    })
  }

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const qty = Math.min(newQty, item.product.quantity)
        return { ...item, quantity: qty, total_price: qty * item.unit_price }
      }
      return item
    }))
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const handleFinishSale = async () => {
    if (cart.length === 0) return
    
    if (paymentMethod === 'cash' && !isReceivedSufficient) {
      toast.error('Kòb la pa kont (Valor insuficiente)')
      return
    }

    try {
      const sale = await createSale({
        customer_id: selectedCustomerId || undefined,
        cash_register_id: cashRegister?.id,
        subtotal,
        discount,
        total,
        payment_method: paymentMethod as any,
        amount_received: paymentMethod === 'cash' ? amountReceived : total,
        change: paymentMethod === 'cash' ? change : 0,
        items: cart
      })

      setCompletedSale(sale)
      setCart([])
      setDiscount(0)
      setAmountReceivedInput('')
      setSelectedCustomerId('')
      setIsMobileCartOpen(false)
      setIsSuccessOpen(true)
    } catch (error: any) {
      toast.error(error.message || 'Yon erè rive pandan vant lan')
    }
  }

  const handleBarcodeScan = (code: string) => {
    const matched = products.find(p => p.barcode === code || p.code === code)
    if (matched) {
      addToCart(matched)
      toast.success(`Jwenn: ${matched.name}`)
    } else {
      toast.error(`Pa jwenn pwodwi ak kòd: ${code}`)
    }
  }

  const handleNewSale = () => {
    setIsSuccessOpen(false)
    setIsReceiptOpen(false)
    setCompletedSale(null)
  }

  const handlePrintReceipt = () => {
    setIsSuccessOpen(false)
    setIsReceiptOpen(true)
  }

  // Cart Component Content
  const renderCartContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b pb-3 mb-3 shrink-0">
        <h3 className="font-bold text-neutral-900 flex items-center gap-2 text-base">
          <ShoppingCart className="w-5 h-5 text-primary" />
          Panye ({cart.length})
        </h3>
        {cart.length > 0 && (
          <button onClick={() => { setCart([]); setAmountReceivedInput(''); setDiscount(0); }} className="text-xs text-red-500 hover:underline">
            Vider panye
          </button>
        )}
      </div>

      {/* Customer Selector */}
      <div className="mb-3 shrink-0">
        <label className="text-xs font-semibold text-neutral-600 mb-1 flex items-center gap-1">
          <User className="w-3.5 h-3.5" /> Chwazi Kliyan
        </label>
        <select 
          value={selectedCustomerId}
          onChange={e => setSelectedCustomerId(e.target.value)}
          className="w-full h-9 border rounded-xl px-3 text-xs bg-neutral-50 border-neutral-200 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Kliyan Pasajè (Ordinaire)</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name} {c.is_vip ? '⭐ VIP' : ''}</option>)}
        </select>
      </div>

      {/* Cart Item List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[150px]">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-400 py-12">
            <ShoppingCart className="w-12 h-12 stroke-[1.5] mb-2 text-neutral-300" />
            <p className="text-sm font-medium">Panye a vid</p>
            <p className="text-xs text-neutral-400 text-center px-4 mt-1">Klike sou yon pwodwi nan grid la pou ajoute li nan panye a</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.product.id} className="flex items-center justify-between p-3 rounded-xl border bg-neutral-50/60">
              <div className="flex-1 min-w-0 pr-2">
                <h5 className="font-semibold text-xs text-neutral-900 truncate">{item.product.name}</h5>
                <p className="text-xs text-primary font-bold">{item.unit_price.toFixed(2)} HTG</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-lg bg-white">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 hover:bg-neutral-100">
                    <Minus className="w-3 h-3 text-neutral-600" />
                  </button>
                  <span className="px-2 text-xs font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 hover:bg-neutral-100">
                    <Plus className="w-3 h-3 text-neutral-600" />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.product.id)} className="text-neutral-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Math & Checkout */}
      <div className="border-t pt-3 mt-3 space-y-3 shrink-0">
        <div className="flex justify-between items-center text-xs text-neutral-500">
          <span>Sous-total:</span>
          <span className="font-medium text-neutral-700">{subtotal.toFixed(2)} HTG</span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-neutral-500">Eskont (HTG):</span>
          <input 
            type="number" 
            value={discount || ''}
            onChange={e => setDiscount(Number(e.target.value))}
            placeholder="0"
            className="w-20 h-7 text-right border rounded px-1.5 text-xs bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex justify-between items-center text-sm font-bold text-neutral-900 border-t border-dashed pt-2">
          <span>Total Vant:</span>
          <span className="text-primary text-lg">{total.toFixed(2)} HTG</span>
        </div>

        {/* Payment Methods */}
        <div className="pt-1">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 block">Mòd Peman</label>
          <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
            <button onClick={() => setPaymentMethod('cash')} className={`flex-1 min-w-[70px] py-1.5 rounded-lg border text-xs flex flex-col items-center justify-center gap-1 transition-colors ${paymentMethod === 'cash' ? 'bg-primary border-primary text-white font-bold' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}>
              <DollarSign className="w-3.5 h-3.5" /> Kach
            </button>
            <button onClick={() => setPaymentMethod('card')} className={`flex-1 min-w-[70px] py-1.5 rounded-lg border text-xs flex flex-col items-center justify-center gap-1 transition-colors ${paymentMethod === 'card' ? 'bg-primary border-primary text-white font-bold' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}>
              <CreditCard className="w-3.5 h-3.5" /> Kat
            </button>
            <button onClick={() => setPaymentMethod('transfer')} className={`flex-1 min-w-[70px] py-1.5 rounded-lg border text-xs flex flex-col items-center justify-center gap-1 transition-colors ${paymentMethod === 'transfer' ? 'bg-primary border-primary text-white font-bold' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}>
              <Landmark className="w-3.5 h-3.5" /> Transfè
            </button>
            <button onClick={() => setPaymentMethod('pix')} className={`flex-1 min-w-[70px] py-1.5 rounded-lg border text-xs flex flex-col items-center justify-center gap-1 transition-colors ${paymentMethod === 'pix' ? 'bg-primary border-primary text-white font-bold' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}>
              <Smartphone className="w-3.5 h-3.5" /> PIX
            </button>
          </div>
        </div>

        {/* Amount Received & Change (Only for Cash) */}
        {paymentMethod === 'cash' && (
          <div className="space-y-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-neutral-700">Lajan Resevwa:</span>
              <input 
                type="number" 
                value={amountReceivedInput}
                onChange={e => setAmountReceivedInput(e.target.value)}
                placeholder="0.00"
                className={`w-24 h-8 text-right border rounded-lg px-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  amountReceived > 0 && amountReceived < total ? 'border-red-400 bg-red-50 text-red-600' : 'bg-white'
                }`}
              />
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-neutral-700">Troko (Chanj):</span>
              <span className={`font-bold text-sm ${amountReceived > 0 && amountReceived < total ? 'text-red-500' : 'text-emerald-600'}`}>
                {amountReceived > 0 && amountReceived < total ? 'Kòb pa kont' : `${change.toFixed(2)} HTG`}
              </span>
            </div>
          </div>
        )}

        <Button
          onClick={handleFinishSale}
          disabled={cart.length === 0 || isSubmitting || (paymentMethod === 'cash' && !isReceivedSufficient)}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl mt-1 flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
        >
          <ShoppingCart className="w-5 h-5" />
          Fini Vant (F9)
        </Button>
      </div>
    </div>
  )

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col lg:flex-row gap-5 relative">
      {/* Main Catalog View */}
      <div className="flex-1 flex flex-col min-w-0 space-y-4 h-full">
        {/* Search, Scanner Button, Categories & Sort Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border shadow-sm space-y-3 shrink-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <Input 
                ref={searchInputRef}
                placeholder="Chèche pwodwi nan non, kòd oswa barkòd (F2)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-neutral-50 border-neutral-200 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>

            <Button 
              onClick={() => setIsCameraOpen(true)}
              variant="outline" 
              className="h-11 px-3 border-primary/30 text-primary gap-2 bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <Camera className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Scanner</span>
            </Button>
          </div>

          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 hide-scrollbar">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategoryId === null ? 'bg-primary text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Tout ({products.length})
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryId(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategoryId === c.id ? 'bg-primary text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-xl border border-neutral-100">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="h-7 text-xs bg-transparent font-medium text-neutral-600 focus:outline-none"
              >
                <option value="name">Non (A-Z)</option>
                <option value="price_asc">Prix (Pi ba)</option>
                <option value="price_desc">Prix (Pi wo)</option>
                <option value="stock">Estok (Pi wo)</option>
              </select>
            </div>
          </div>
        </div>

        {/* RICH PRODUCT CARDS GRID: High Density */}
        <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 p-1 pb-20 lg:pb-1">
          {filteredProducts.map(p => {
            const isOutOfStock = p.quantity <= 0
            const isLowStock = p.quantity > 0 && p.quantity <= p.min_stock

            return (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className={`bg-white rounded-2xl border p-2 flex flex-col justify-between cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden group border-neutral-200 hover:border-primary h-44 ${
                  isOutOfStock ? 'opacity-60 bg-neutral-50 grayscale-[0.5]' : ''
                }`}
              >
                {/* Product Thumbnail / Icon */}
                <div className="h-20 bg-neutral-100 rounded-xl mb-2 flex items-center justify-center relative overflow-hidden group-hover:bg-primary/5 transition-colors">
                  <Package className="w-8 h-8 text-neutral-400 group-hover:text-primary stroke-[1.5] transition-colors" />
                  
                  {/* Status Badges */}
                  <div className="absolute top-1 left-1 flex flex-col gap-1">
                    {isOutOfStock && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-red-600 text-white shadow-sm">
                        Esgote
                      </span>
                    )}
                    {isLowStock && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500 text-white flex items-center gap-0.5 shadow-sm">
                        <AlertTriangle className="w-2.5 h-2.5" /> Ba
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[11px] text-neutral-900 truncate group-hover:text-primary transition-colors" title={p.name}>
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400">
                      Qte: <strong className={isLowStock ? 'text-amber-600' : isOutOfStock ? 'text-red-500' : 'text-neutral-700'}>{p.quantity}</strong>
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pt-1.5 mt-auto border-t flex items-center justify-between">
                    <span className="text-xs font-bold text-primary truncate max-w-[70%]">{p.sell_price.toFixed(2)}</span>
                    <div className="w-5 h-5 rounded bg-neutral-100 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-neutral-600 transition-colors shrink-0">
                      <Plus className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* DESKTOP FIXED CART (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col w-[380px] bg-white border rounded-2xl p-4 shadow-sm h-full shrink-0">
        {renderCartContent()}
      </div>

      {/* MOBILE FLOATING CART BUTTON (lg:hidden) */}
      <div className="lg:hidden fixed bottom-4 right-4 left-4 z-30">
        <Button
          onClick={() => setIsMobileCartOpen(true)}
          className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-between px-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center relative">
              <ShoppingCart className="w-4 h-4 text-white" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] border-2 border-primary">
                  {cart.length}
                </span>
              )}
            </div>
            <span className="text-sm">Panye Mobile</span>
          </div>
          <span className="text-base font-bold">{total.toFixed(2)} HTG</span>
        </Button>
      </div>

      {/* MOBILE DRAWER SLIDE-OVER */}
      {isMobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileCartOpen(false)} />
          <div className="relative w-[90%] max-w-sm bg-white h-full p-4 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center border-b pb-3 mb-2 shrink-0">
              <span className="font-bold text-neutral-900 text-lg">Panye Vant</span>
              <button onClick={() => setIsMobileCartOpen(false)} className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderCartContent()}
          </div>
        </div>
      )}

      {/* Camera Scanner Modal */}
      <CameraScannerModal 
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onScan={handleBarcodeScan}
      />

      {/* Success Modal */}
      <CheckoutSuccessModal
        isOpen={isSuccessOpen}
        sale={completedSale}
        onNewSale={handleNewSale}
        onPrintReceipt={handlePrintReceipt}
      />

      {/* Printable Receipt Modal */}
      <ReceiptModal 
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        sale={completedSale}
      />
    </div>
  )
}
