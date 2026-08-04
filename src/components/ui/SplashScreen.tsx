import { Loader2 } from 'lucide-react'

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-6 animate-pulse">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">BizHaiti ERP</h1>
          <div className="flex items-center justify-center gap-2 text-neutral-500">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <p className="text-sm font-medium">Ap chaje sistèm nan...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
