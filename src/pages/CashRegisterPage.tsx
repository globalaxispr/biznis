import { useState } from 'react'
import { Wallet, Lock, Unlock, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

import { useCashRegister } from '../hooks/useCashRegister'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

export function CashRegisterPage() {
  const { register, isLoading, openRegister, closeRegister, addMovement } = useCashRegister()
  
  const [initialBalance, setInitialBalance] = useState<number>(1000)
  const [movementType, setMovementType] = useState<'in' | 'out'>('in')
  const [amount, setAmount] = useState<number>(0)
  const [reason, setReason] = useState<string>('')

  const handleOpen = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await openRegister({ initialBalance })
      toast.success('Kès la ouvri avèk siksè!')
    } catch (err: any) {
      toast.error('Erè pandan ouvèti kès la')
    }
  }

  const handleClose = async () => {
    if (!register) return
    if (confirm('Eske ou sèten ou vle fèmen kès la pou jodi a?')) {
      try {
        await closeRegister({ id: register.id })
        toast.success('Kès la fèmen!')
      } catch (err: any) {
        toast.error('Erè pandan fermeture a')
      }
    }
  }

  const handleMovement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!register) return
    if (amount <= 0) {
      toast.error('Montan an dwe pi gran pase 0')
      return
    }

    try {
      await addMovement({
        cash_register_id: register.id,
        type: movementType,
        amount,
        reason: reason || (movementType === 'in' ? 'Refòs kès' : 'Sangri / Sòti kès')
      })
      toast.success('Mouvman kès la anregistre!')
      setAmount(0)
      setReason('')
    } catch (err: any) {
      toast.error('Erè pandan anregistreman an')
    }
  }

  if (isLoading) {
    return <div className="p-12 text-center text-neutral-400">Ap chaje enfòmasyon kès la...</div>
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Jestyon Kès</h2>
        <p className="text-sm text-neutral-500">Kontwole lajan nan kès, ouvèti, fermeture ak sangri</p>
      </div>

      {!register ? (
        <div className="bg-white p-8 rounded-2xl border shadow-sm max-w-md mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">Kès la fèmen</h3>
            <p className="text-sm text-neutral-500 mt-1">Antre sol fond de kès la pou w kapab kòmanse vann.</p>
          </div>

          <form onSubmit={handleOpen} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block text-left">Sol Inisyal (Fond de kès) in HTG *</label>
              <Input 
                type="number" 
                value={initialBalance}
                onChange={e => setInitialBalance(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-white font-bold gap-2">
              <Unlock className="w-4 h-4" /> Ouvri Kès la
            </Button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Wallet className="w-7 h-7" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Kès Ouvè
                </span>
                <h3 className="text-3xl font-bold text-neutral-900 mt-1">{register.current_balance.toFixed(2)} HTG</h3>
                <p className="text-xs text-neutral-500">Sol inisyal: {register.initial_balance.toFixed(2)} HTG</p>
              </div>
            </div>

            <Button onClick={handleClose} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-2">
              <Lock className="w-4 h-4" /> Fèmen Kès la
            </Button>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <h4 className="font-bold text-neutral-900">Mouvman Lajan nan Kès (Sangri / Refòs)</h4>
            <form onSubmit={handleMovement} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select 
                value={movementType} 
                onChange={e => setMovementType(e.target.value as any)}
                className="h-10 border rounded-xl px-3 text-sm bg-white"
              >
                <option value="in">Refòs (+ Lajan)</option>
                <option value="out">Sangri (- Lajan)</option>
              </select>
              <Input 
                type="number" 
                placeholder="Montan (HTG)" 
                value={amount || ''}
                onChange={e => setAmount(Number(e.target.value))}
              />
              <Input 
                placeholder="Rezon (ex: Achte kafe...)" 
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
              <Button type="submit" className="bg-primary text-white gap-2">
                <Plus className="w-4 h-4" /> Anregistre
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
