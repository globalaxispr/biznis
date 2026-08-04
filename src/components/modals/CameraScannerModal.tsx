import { useState } from 'react'
import { X, Camera, Barcode } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface CameraScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScan: (code: string) => void
}

export function CameraScannerModal({ isOpen, onClose, onScan }: CameraScannerModalProps) {
  const [manualCode, setManualCode] = useState('')

  if (!isOpen) return null

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      onScan(manualCode.trim())
      setManualCode('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" /> Scan Kòd de Bar (Scanner)
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-lg">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative aspect-video bg-neutral-900 rounded-xl overflow-hidden flex flex-col items-center justify-center text-white border-2 border-primary/40">
          <div className="w-48 h-24 border-2 border-dashed border-emerald-400 rounded-lg flex flex-col items-center justify-center animate-pulse bg-emerald-500/10">
            <Barcode className="w-12 h-12 text-emerald-400 stroke-[1.5]" />
            <span className="text-[10px] font-semibold text-emerald-300 mt-1">Plase kòd la nan kadadra a</span>
          </div>
          <p className="text-xs text-neutral-400 mt-4">Kamera aktif - Abstraksyon entegre</p>
        </div>

        {/* Manual code entry option */}
        <form onSubmit={handleManualSubmit} className="space-y-3 pt-2 border-t">
          <label className="text-xs font-semibold text-neutral-700">Oswa antre kòd de bar la ak men:</label>
          <div className="flex gap-2">
            <Input 
              placeholder="ex: 0123456789"
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              className="h-10 text-sm font-mono"
            />
            <Button type="submit" className="bg-primary text-white">
              Souri
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
