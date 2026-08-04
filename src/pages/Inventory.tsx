import { useState } from 'react'
import { Archive, ArrowUpRight, ArrowDownLeft, AlertCircle, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

import { useProducts } from '../hooks/useProducts'
import { useInventory } from '../hooks/useInventory'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

export function Inventory() {
  const { data: products = [] } = useProducts()
  const { data: movements = [], addMovement } = useInventory()

  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [movementType, setMovementType] = useState<'in' | 'out' | 'adjustment'>('in')
  const [quantity, setQuantity] = useState<number>(1)
  const [reason, setReason] = useState<string>('')

  const lowStockProducts = products.filter(p => p.quantity <= p.min_stock)

  const handleRegisterMovement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProductId) {
      toast.error('Chwazi yon pwodwi')
      return
    }
    if (quantity <= 0) {
      toast.error('Kantite a dwe pi gran pase 0')
      return
    }

    try {
      await addMovement({
        product_id: selectedProductId,
        type: movementType,
        quantity,
        reason: reason || (movementType === 'in' ? 'Achats / Antre' : 'Sòti nan estok')
      })
      toast.success('Mouvman estok la anregistre!')
      setSelectedProductId('')
      setQuantity(1)
      setReason('')
    } catch (err: any) {
      toast.error('Erè pandan anregistreman an')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Kontwòl Envantè</h2>
        <p className="text-sm text-neutral-500">Mouvman estok, antre ak sòti pwodwi yo</p>
      </div>

      {/* Low Stock Banner */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center gap-3 text-orange-900">
          <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-bold">{lowStockProducts.length} pwodwi gen yon nivo estok ki ba!</p>
            <p className="text-xs text-orange-700">Verifye lis la epi kontakte founisè yo pou pase lòd.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Movement */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
            <Archive className="w-5 h-5 text-primary" /> Nouvo Mouvman
          </h3>

          <form onSubmit={handleRegisterMovement} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-700">Pwodwi *</label>
              <select 
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                className="w-full h-10 border rounded-xl px-3 text-sm bg-white border-neutral-200 mt-1"
              >
                <option value="">Chwazi yon pwodwi</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Estok: {p.quantity})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700">Tip Mouvman *</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setMovementType('in')}
                  className={`p-2 text-xs font-bold rounded-xl border flex flex-col items-center gap-1 ${
                    movementType === 'in' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-neutral-50 text-neutral-600'
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4 text-emerald-600" /> Antre
                </button>
                <button
                  type="button"
                  onClick={() => setMovementType('out')}
                  className={`p-2 text-xs font-bold rounded-xl border flex flex-col items-center gap-1 ${
                    movementType === 'out' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-neutral-50 text-neutral-600'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-red-600" /> Sòti
                </button>
                <button
                  type="button"
                  onClick={() => setMovementType('adjustment')}
                  className={`p-2 text-xs font-bold rounded-xl border flex flex-col items-center gap-1 ${
                    movementType === 'adjustment' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-neutral-50 text-neutral-600'
                  }`}
                >
                  Ajustman
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700">Kantite *</label>
              <Input 
                type="number" 
                min="1" 
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700">Rezon / Eksplikasyon</label>
              <Input 
                placeholder="ex: Livrezon founisè, pwodwi abime..." 
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full bg-primary text-white font-bold gap-2">
              <Plus className="w-4 h-4" /> Anregistre Mouvman
            </Button>
          </form>
        </div>

        {/* Movements History */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-neutral-900">Istwa Mouvman Estok yo</h3>

          {movements.length === 0 ? (
            <p className="text-sm text-neutral-400 py-8 text-center">Pa gen okenn mouvman anregistre.</p>
          ) : (
            <div className="divide-y overflow-y-auto max-h-[500px]">
              {movements.map(m => (
                <div key={m.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      m.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {m.type === 'in' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{m.product?.name || 'Pwodwi'}</p>
                      <p className="text-xs text-neutral-400">{m.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${m.type === 'in' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {m.type === 'in' ? '+' : '-'}{m.quantity}
                    </span>
                    <p className="text-xs text-neutral-400">
                      {m.created_at ? new Date(m.created_at).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
