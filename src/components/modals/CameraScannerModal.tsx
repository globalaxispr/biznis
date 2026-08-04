import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Camera, RefreshCcw, AlertTriangle } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface CameraScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScan: (code: string) => void
}

export function CameraScannerModal({ isOpen, onClose, onScan }: CameraScannerModalProps) {
  const [manualCode, setManualCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment")
  
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null)
  const isScanningRef = useRef(false)
  // Ref to prevent processing the same code multiple times in a short interval
  const lastScannedRef = useRef<{ code: string, time: number }>({ code: '', time: 0 })

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime) // 800Hz
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime) // Volume 10%
      
      oscillator.start()
      
      // Stop after 100ms
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1)
      oscillator.stop(audioCtx.currentTime + 0.1)
    } catch (e) {
      console.error("Audio beep failed", e)
    }
  }

  const startScanner = useCallback(async () => {
    if (!isOpen || isScanningRef.current) return
    
    try {
      setError(null)
      const html5QrCode = new Html5Qrcode("reader")
      html5QrCodeRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: facingMode },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Prevent rapid duplicate scans (wait 2 seconds before same code)
          const now = Date.now()
          if (lastScannedRef.current.code === decodedText && (now - lastScannedRef.current.time) < 2000) {
            return
          }
          
          lastScannedRef.current = { code: decodedText, time: now }
          playBeep()
          onScan(decodedText)
        },
        () => {
          // Ignored: continuous scanning failures (empty frames)
        }
      )
      isScanningRef.current = true
    } catch (err: any) {
      console.error("Scanner Error:", err)
      setError("Pa kapab jwenn aksè nan kamera a. Tanpri tcheke pèmisyon ou yo.")
    }
  }, [isOpen, facingMode, onScan])

  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current && isScanningRef.current) {
      try {
        await html5QrCodeRef.current.stop()
        html5QrCodeRef.current.clear()
        isScanningRef.current = false
      } catch (err) {
        console.error("Error stopping scanner", err)
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      startScanner()
    } else {
      stopScanner()
    }

    return () => {
      stopScanner()
    }
  }, [isOpen, startScanner, stopScanner])

  const toggleCamera = () => {
    stopScanner().then(() => {
      setFacingMode(prev => prev === "environment" ? "user" : "environment")
    })
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      onScan(manualCode.trim())
      setManualCode('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" /> Scanner (Kamera)
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Viewfinder */}
        <div className="relative rounded-xl overflow-hidden bg-black min-h-[250px] flex flex-col items-center justify-center">
          {error ? (
            <div className="p-4 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
              <p className="text-sm font-medium text-red-400">{error}</p>
              <Button onClick={() => startScanner()} variant="outline" className="mt-2 text-white border-white/20 hover:bg-white/10">
                Eseye ankò
              </Button>
            </div>
          ) : (
            <div id="reader" className="w-full h-full"></div>
          )}
          
          {!error && (
            <button 
              onClick={toggleCamera}
              className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-md transition-all z-10"
              title="Chanje kamera"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          )}
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
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
              Souri
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
