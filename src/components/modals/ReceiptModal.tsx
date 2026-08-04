import { X, Printer, Download, QrCode, Barcode, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { useStoreSettings } from '../../hooks/useStoreSettings'
import { Button } from '../ui/button'
import type { Sale } from '../../types/erp'

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  sale: Sale | null
}

export function ReceiptModal({ isOpen, onClose, sale }: ReceiptModalProps) {
  const { settings } = useStoreSettings()

  if (!isOpen || !sale) return null

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const text = `BizHaiti Resi Vant #${sale.sale_number}\nTotal: ${sale.total.toFixed(2)} HTG\nMèsi paske ou achte lakay nou!`
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Resi ${sale.sale_number}`,
          text,
        })
      } catch (err) {
        // Share cancelled or failed
      }
    } else {
      await navigator.clipboard.writeText(text)
      toast.success('Rezime resi a kopye nan presse-papier!')
    }
  }

  const taxRate = settings?.tax_rate || 0
  const taxAmount = (sale.subtotal * taxRate) / 100
  const amountReceived = sale.amount_received || sale.total
  const change = sale.change || 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-bold text-neutral-900">Resi Vant Swiv (80mm)</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-lg">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Printable Receipt Area */}
        <div id="printable-receipt" className="space-y-4 text-xs text-neutral-900 border p-5 rounded-xl bg-white shadow-inner font-mono">
          {/* Header loaded dynamically from Store Settings */}
          <div className="text-center pb-3 border-b border-dashed">
            <h4 className="font-bold text-base text-primary uppercase tracking-wider">{settings?.name || 'BizHaiti Commerce'}</h4>
            <p className="text-[11px] text-neutral-500">{settings?.address || 'Port-au-Prince'}, {settings?.city || 'Haiti'}</p>
            <p className="text-[11px] text-neutral-500">Tél: {settings?.phone || '+509 3700 0000'} | NIF: {settings?.nif || '000-000-000'}</p>
          </div>

          <div className="space-y-1 text-[11px] text-neutral-600 border-b border-dashed pb-2">
            <div className="flex justify-between">
              <span>Vant N°:</span>
              <span className="font-bold text-neutral-900">{sale.sale_number}</span>
            </div>
            <div className="flex justify-between">
              <span>Dat / Lè:</span>
              <span>{sale.created_at ? new Date(sale.created_at).toLocaleString() : new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Operatè:</span>
              <span>Admin (Caissier)</span>
            </div>
            {sale.customer && (
              <div className="flex justify-between">
                <span>Kliyan:</span>
                <span className="font-semibold text-neutral-800">{sale.customer.name}</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="space-y-2 border-b border-dashed py-2">
            <div className="flex justify-between font-bold text-[11px] text-neutral-700 pb-1 border-b">
              <span>Atik</span>
              <span>Kte x Prix</span>
              <span>Total</span>
            </div>
            {sale.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-[11px]">
                <span className="truncate max-w-[140px]">{item.product?.name || 'Pwodwi'}</span>
                <span>{item.quantity} x {item.unit_price.toFixed(2)}</span>
                <span className="font-bold">{item.total_price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Financial Footer */}
          <div className="space-y-1 pt-1 text-[11px]">
            <div className="flex justify-between text-neutral-600">
              <span>Sous-total:</span>
              <span>{sale.subtotal.toFixed(2)} HTG</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-orange-600">
                <span>Eskont:</span>
                <span>-{sale.discount.toFixed(2)} HTG</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Taks ({taxRate}%):</span>
              <span>{taxAmount.toFixed(2)} HTG</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-primary pt-1.5 border-t">
              <span>TOTAL NET:</span>
              <span>{sale.total.toFixed(2)} HTG</span>
            </div>
            <div className="flex justify-between text-neutral-500 pt-1">
              <span>Lajan Resevwa:</span>
              <span>{amountReceived.toFixed(2)} HTG</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Troko (Chanj):</span>
              <span className="font-bold text-emerald-600">{change.toFixed(2)} HTG</span>
            </div>
            <div className="flex justify-between text-[11px] text-neutral-500 pt-1 border-t border-dashed">
              <span>Mòd Peman:</span>
              <span className="uppercase font-semibold text-neutral-800">{sale.payment_method}</span>
            </div>
          </div>

          {/* Barcode & QR code representation */}
          <div className="text-center pt-3 border-t border-dashed space-y-2">
            <div className="flex justify-center items-center gap-4">
              <QrCode className="w-10 h-10 text-neutral-800" />
              <Barcode className="w-20 h-9 text-neutral-800" />
            </div>
            <p className="font-bold text-neutral-800">{settings?.receipt_message || 'Mèsi paske ou achte lakay nou. Nou swete wè ou ankò.'}</p>
            <p className="text-[10px] text-neutral-400">BizHaiti ERP • Paspò biznis ou nan Ayiti</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={handleShare} className="p-2 border-neutral-300">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={handlePrint} className="flex-1 gap-1 border-neutral-300 text-xs">
            <Download className="w-4 h-4" /> PDF
          </Button>
          <Button onClick={handlePrint} className="flex-1 bg-primary text-white gap-1 text-xs font-bold">
            <Printer className="w-4 h-4" /> Enprime (80mm)
          </Button>
        </div>
      </div>
    </div>
  )
}
