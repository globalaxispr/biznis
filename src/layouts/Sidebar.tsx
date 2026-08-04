import { Link, useLocation } from "react-router-dom"
import { cn } from "../utils/cn"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Archive, 
  Users, 
  Truck, 
  Wallet, 
  UserCircle, 
  BarChart3, 
  Settings,
  LogOut,
  X
} from "lucide-react"
import { useAuth } from "../providers/AuthProvider"
import { type UserRole } from "../store/authStore"
import { AuthRepository } from "../repositories/AuthRepository"
import toast from "react-hot-toast"

interface MenuItem {
  name: string
  path: string
  icon: any
  allowedRoles: UserRole[]
}

const menuItems: MenuItem[] = [
  { name: "Akèy", path: "/", icon: LayoutDashboard, allowedRoles: ['admin', 'manager', 'cashier', 'stockist', 'seller'] },
  { name: "Vant (PDV)", path: "/vant", icon: ShoppingCart, allowedRoles: ['admin', 'manager', 'cashier', 'seller'] },
  { name: "Pwodwi", path: "/pwodwi", icon: Package, allowedRoles: ['admin', 'manager', 'stockist'] },
  { name: "Envantè", path: "/envante", icon: Archive, allowedRoles: ['admin', 'manager', 'stockist'] },
  { name: "Kliyan", path: "/kliyan", icon: Users, allowedRoles: ['admin', 'manager', 'seller'] },
  { name: "Founisè", path: "/founise", icon: Truck, allowedRoles: ['admin', 'manager', 'stockist'] },
  { name: "Kès", path: "/kes", icon: Wallet, allowedRoles: ['admin', 'manager', 'cashier'] },
  { name: "Anplwaye", path: "/anplwaye", icon: UserCircle, allowedRoles: ['admin', 'manager'] },
  { name: "Rapò", path: "/rapo", icon: BarChart3, allowedRoles: ['admin', 'manager'] },
  { name: "Paramèt", path: "/paramet", icon: Settings, allowedRoles: ['admin'] },
]

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { profile } = useAuth()

  const currentRole: UserRole = profile?.role || 'admin'

  const filteredMenuItems = menuItems.filter(item => 
    item.allowedRoles.includes(currentRole)
  )

  const handleLogout = async () => {
    try {
      await AuthRepository.signOut()
      // Context state is automatically cleared by AuthProvider's onAuthStateChange
      toast.success("Ou dekonekte avèk siksè")
    } catch (error) {
      toast.error("Yon erè rive pandan w ap dekonekte")
    }
  }

  return (
    <aside className={cn(
      "w-64 border-r bg-white h-screen flex flex-col fixed lg:sticky top-0 z-50 transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-primary">
          <ShoppingBagIcon className="w-6 h-6 text-accent" />
          BizHaiti
        </h1>
        <button onClick={onClose} className="lg:hidden p-1 text-neutral-500 hover:text-primary hover:bg-neutral-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-primary"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 mt-auto space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl border bg-neutral-50/50">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
            {profile?.first_name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{profile ? `${profile.first_name} ${profile.last_name}` : 'Admin'}</p>
            <p className="text-xs text-muted-foreground capitalize">{profile?.role || 'admin'}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-destructive hover:bg-destructive/10 px-3 py-2 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Dekonekte
        </button>
      </div>
    </aside>
  )
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )
}
