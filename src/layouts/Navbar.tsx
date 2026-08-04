import { Bell, Menu, CloudOff } from "lucide-react"

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-neutral-500 hover:text-primary">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-medium border border-orange-100">
          <CloudOff className="w-4 h-4" />
          <span>Offline</span>
        </div>
        
        <button className="text-neutral-500 hover:text-primary transition-colors relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="hidden md:block text-sm font-medium text-neutral-600">
          Kreyòl (HT)
        </div>
      </div>
    </header>
  )
}
