import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { DollarSign, ShoppingBag, Package, Wallet, TrendingUp, TrendingDown, AlertTriangle, Star } from "lucide-react"

import { useSales } from "../hooks/useSales"
import { useProducts } from "../hooks/useProducts"
import { useCashRegister } from "../hooks/useCashRegister"
import { useCustomers } from "../hooks/useCustomers"
import { useCategories } from "../hooks/useCategories"

export function Dashboard() {
  const { data: sales = [] } = useSales()
  const { data: products = [] } = useProducts()
  const { register: cashRegister } = useCashRegister()
  const { data: customers = [] } = useCustomers()
  const { data: categories = [] } = useCategories()

  // Dynamic Metrics
  const todaySalesRevenue = sales.reduce((acc, s) => acc + s.total, 0)
  const lowStockProducts = products.filter(p => p.quantity <= p.min_stock)
  const currentCashBalance = cashRegister?.current_balance || 0
  const vipCustomers = customers.filter(c => c.is_vip)

  const lineChartData = [
    { name: 'Lendi', sales: 4200 },
    { name: 'Madi', sales: 5800 },
    { name: 'Mèkredi', sales: 7100 },
    { name: 'Jedi', sales: 6300 },
    { name: 'Vandredi', sales: 12400 },
    { name: 'Samdi', sales: 15200 },
    { name: 'Dimanch', sales: todaySalesRevenue },
  ]

  const categorySalesData = categories.map(c => {
    const categoryProds = products.filter(p => p.category_id === c.id)
    const count = categoryProds.reduce((acc, p) => acc + p.quantity, 0)
    return { name: c.name, count }
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Akèy Dashboard</h2>
        <div className="mt-1 text-neutral-500">
          Bonjou, Admin 👋
          <p className="mt-1">Men yon rezime jodi a sou aktivite biznis ou an.</p>
        </div>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-green-50/50 border-green-100 shadow-sm relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#104C64] text-white rounded-xl flex items-center justify-center shadow-sm">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">Vant jodi a</p>
                <h3 className="text-2xl font-bold text-neutral-900">{todaySalesRevenue.toFixed(2)} HTG</h3>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-neutral-500">{sales.length} tranzaksyon</p>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Kliyan</p>
                <h3 className="text-2xl font-bold text-neutral-900">{customers.length}</h3>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-neutral-500">{vipCustomers.length} Kliyan VIP</p>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50/50 border-orange-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#B6410F] text-white rounded-xl flex items-center justify-center shadow-sm">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">Estok ki ba</p>
                <h3 className="text-2xl font-bold text-neutral-900">{lowStockProducts.length}</h3>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-neutral-500">Pwodwi nan alèt</p>
              <TrendingDown className="w-4 h-4 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#FAF8F5] border-[#E8E0D5] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#3A271B] text-white rounded-xl flex items-center justify-center shadow-sm">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">Lajan nan kès</p>
                <h3 className="text-2xl font-bold text-neutral-900">{currentCashBalance.toFixed(2)} HTG</h3>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6 pt-2 border-t border-black/5">
              <p className="text-xs font-medium text-neutral-500">
                Statut: {cashRegister?.status === 'open' ? '🟢 Kès Ouvè' : '🔴 Kès Fèmen'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-neutral-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <CardTitle className="text-lg font-semibold text-neutral-800">Tendance Vant yo (7 jou)</CardTitle>
            <div className="px-3 py-1.5 border rounded-lg text-xs font-medium text-neutral-600 bg-neutral-50">
              7 dènye jou yo
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip cursor={{ stroke: '#104C64', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Line type="monotone" dataKey="sales" stroke="#104C64" strokeWidth={3} dot={{ fill: '#104C64', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#104C64', stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Sales Distribution */}
        <Card className="lg:col-span-3 border-neutral-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-800">Estok pa Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySalesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#C0754D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Widgets: Low Stock Alerts & Recent Transactions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Low stock alert list */}
        <Card className="border-neutral-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Pwodwi ak Estok Kritik
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[220px] overflow-y-auto">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-neutral-400 py-6 text-center">Tout pwodwi yo gen ase estok!</p>
            ) : (
              <div className="divide-y text-xs">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-neutral-800">{p.name}</span>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">
                      {p.quantity} sèlman (Min: {p.min_stock})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top VIP Customers */}
        <Card className="border-neutral-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" /> Kliyan VIP yo
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[220px] overflow-y-auto">
            {vipCustomers.length === 0 ? (
              <p className="text-xs text-neutral-400 py-6 text-center">Pa gen kliyan VIP mouri ankò.</p>
            ) : (
              <div className="divide-y text-xs">
                {vipCustomers.map(c => (
                  <div key={c.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-neutral-800 block">{c.name}</span>
                      <span className="text-[10px] text-neutral-400">{c.phone || c.email || 'Kliyan FIDÈL'}</span>
                    </div>
                    <span className="font-bold text-primary">{c.total_spent.toFixed(2)} HTG</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
