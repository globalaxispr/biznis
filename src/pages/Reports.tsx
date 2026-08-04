import { useSales } from '../hooks/useSales'
import { useProducts } from '../hooks/useProducts'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, TrendingUp, ShoppingBag, Package } from 'lucide-react'

export function Reports() {
  const { data: sales = [] } = useSales()
  const { data: products = [] } = useProducts()

  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.total, 0)
  const totalItemsSold = sales.reduce((acc, s) => acc + (s.items?.reduce((iAcc, item) => iAcc + item.quantity, 0) || 0), 0)

  const chartData = [
    { name: 'Lendi', sales: 4500 },
    { name: 'Madi', sales: 6200 },
    { name: 'Mèkredi', sales: 8100 },
    { name: 'Jedi', sales: 5400 },
    { name: 'Vandredi', sales: 11200 },
    { name: 'Samdi', sales: 14500 },
    { name: 'Dimanch', sales: 9800 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Rapò ak Estatistik</h2>
        <p className="text-sm text-neutral-500">Analiz pèfòmans biznis ou an sou lavant ak pwodwi yo</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500">Chiffre d'Affaires Total</p>
                <h3 className="text-2xl font-bold text-neutral-900">{totalSalesRevenue.toFixed(2)} HTG</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500">Total Vant Efektue</p>
                <h3 className="text-2xl font-bold text-neutral-900">{sales.length} Vant</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500">Pwodwi Vendus</p>
                <h3 className="text-2xl font-bold text-neutral-900">{totalItemsSold} Inite</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500">Katalòg Aktif</p>
                <h3 className="text-2xl font-bold text-neutral-900">{products.length} Pwodwi</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neutral-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-neutral-900">Vant pa Semèn (HTG)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} HTG`} />
                <Bar dataKey="sales" fill="#104C64" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
