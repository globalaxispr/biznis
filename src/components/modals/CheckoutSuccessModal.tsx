import { CheckCircle, Printer, RotateCcw, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import type { Sale } from '../../types/erp'

interface CheckoutSuccessModalProps {
  isOpen: boolean
  sale: Sale | null
  onNewSale: () => void
  onPrintReceipt: () => void
}

export function CheckoutSuccessModal({ isOpen, sale, onNewSale, onPrintReceipt }: CheckoutSuccessModalProps) {
  const navigate = useNavigate()

  if (!isOpen || !sale) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl opacity-60"></div>

        <div className="relative">
          <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Vant Reyisi!</h2>
          <p className="text-sm text-neutral-500 mb-6">Tranzaksyon #{sale.sale_number} anrejistre ak siksè.</p>

          <div className="bg-neutral-50 border rounded-2xl p-4 mb-8 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Total Vant:</span>
              <span className="font-bold text-neutral-900">{sale.total.toFixed(2)} HTG</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Lajan Resevwa:</span>
              <span className="font-medium text-neutral-700">{(sale.amount_received || sale.total).toFixed(2)} HTG</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-neutral-500 font-semibold">Troko (Chanj):</span>
              <span className="font-bold text-emerald-600 text-lg">{(sale.change || 0).toFixed(2)} HTG</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={onPrintReceipt} className="w-full bg-primary text-white font-bold h-12 text-sm rounded-xl gap-2 shadow-sm">
              <Printer className="w-5 h-5" /> Enprime Resi
            </Button>
            
            <div className="flex gap-3">
              <Button onClick={onNewSale} variant="outline" className="flex-1 h-12 text-sm rounded-xl gap-2 font-semibold">
                <RotateCcw className="w-4 h-4" /> Nouvo Vant
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="flex-1 h-12 text-sm rounded-xl gap-2 font-semibold bg-neutral-50">
                <Home className="w-4 h-4" /> Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
