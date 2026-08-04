import { useState, useRef } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Tag, AlertTriangle, Download, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useSuppliers } from '../hooks/useSuppliers'
import { ProductModal } from '../components/modals/ProductModal'
import { CategoryModal } from '../components/modals/CategoryModal'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { exportToCSV, parseCSV } from '../utils/csv'
import type { Product } from '../types/erp'

export function Products() {
  const { data: products = [], isLoading, createProduct, updateProduct, deleteProduct } = useProducts()
  const { data: categories = [], createCategory } = useCategories()
  const { data: suppliers = [] } = useSuppliers()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  const handleExportCSV = () => {
    if (products.length === 0) {
      toast.error('Pa gen pwodwi pou ekspòte')
      return
    }

    const dataToExport = products.map(p => ({
      Non: p.name,
      Kod: p.code || '',
      Barkod: p.barcode || '',
      PrixAchte: p.buy_price,
      PrixVann: p.sell_price,
      Kantite: p.quantity,
      EstokMin: p.min_stock,
      Kategori: p.category?.name || '',
      Founise: p.supplier?.name || '',
    }))

    exportToCSV('bizhaiti_pwodwi', dataToExport)
    toast.success('Fichye CSV a telechaje!')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string
        const parsed = parseCSV(text)

        for (const row of parsed) {
          if (row.Non && row.PrixVann) {
            await createProduct({
              name: row.Non,
              code: row.Kod || `PRD-${Date.now()}`,
              barcode: row.Barkod || '',
              buy_price: Number(row.PrixAchte) || 0,
              sell_price: Number(row.PrixVann) || 0,
              quantity: Number(row.Kantite) || 0,
              min_stock: Number(row.EstokMin) || 5,
              is_active: true
            })
          }
        }
        toast.success(`Enpòte ${parsed.length} pwodwi avèk siksè!`)
      } catch (err) {
        toast.error('Erè pandan enpòtasyon fichye an')
      }
    }
    reader.readAsText(file)
  }

  const handleSaveProduct = async (data: any) => {
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data })
        toast.success('Pwodwi a modiye avèk siksè!')
      } else {
        await createProduct(data)
        toast.success('Pwodwi a ajoute avèk siksè!')
      }
      setIsProductModalOpen(false)
      setEditingProduct(null)
    } catch (err: any) {
      toast.error(err.message || 'Yon erè rive')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Eske ou sèten ou vle efase pwodwi sa a?')) {
      try {
        await deleteProduct(id)
        toast.success('Pwodwi a efase')
      } catch (err: any) {
        toast.error('Erè pandan efasman an')
      }
    }
  }

  const handleSaveCategory = async (data: any) => {
    try {
      await createCategory(data)
      toast.success('Kategori a kreye!')
      setIsCategoryModalOpen(false)
    } catch (err: any) {
      toast.error('Erè pandan kreyasyon an')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Katalòg Pwodwi</h2>
          <p className="text-sm text-neutral-500">Jere stok, pri, marj pwofi ak kategori yo</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden" 
          />
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="gap-2 text-xs">
            <Upload className="w-4 h-4" /> Enpòte CSV
          </Button>
          <Button onClick={handleExportCSV} variant="outline" className="gap-2 text-xs">
            <Download className="w-4 h-4" /> Ekspòte CSV
          </Button>
          <Button onClick={() => setIsCategoryModalOpen(true)} variant="outline" className="gap-2 text-xs">
            <Tag className="w-4 h-4" /> Kategori Nouvo
          </Button>
          <Button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="bg-primary text-white gap-2 text-xs">
            <Plus className="w-4 h-4" /> Ajoute Pwodwi
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Chèche yon pwodwi nan non oswa kòd..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select 
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="h-10 border rounded-lg px-3 text-sm bg-white"
          >
            <option value="">Tout Kategori ({categories.length})</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-neutral-400">Ap chaje pwodwi yo...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">Pa gen okenn pwodwi ki jwenn.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 border-b text-neutral-600 font-semibold">
                <tr>
                  <th className="p-4">Non Pwodwi</th>
                  <th className="p-4">Kòd</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Prix Achte</th>
                  <th className="p-4">Prix Vann</th>
                  <th className="p-4">Marj Pwofi</th>
                  <th className="p-4">Estok</th>
                  <th className="p-4 text-right">Aksyon</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map(p => {
                  const margin = p.sell_price > 0 ? (((p.sell_price - p.buy_price) / p.sell_price) * 100).toFixed(0) : '0'
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 font-semibold text-neutral-900">{p.name}</td>
                      <td className="p-4 text-neutral-500 font-mono text-xs">{p.code || '-'}</td>
                      <td className="p-4 text-neutral-600">{p.category?.name || '-'}</td>
                      <td className="p-4 text-neutral-600">{p.buy_price.toFixed(2)} HTG</td>
                      <td className="p-4 font-bold text-primary">{p.sell_price.toFixed(2)} HTG</td>
                      <td className="p-4 font-bold text-emerald-600">+{margin}%</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          p.quantity <= p.min_stock ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {p.quantity <= p.min_stock && <AlertTriangle className="w-3 h-3" />}
                          {p.quantity} un
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }} className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 hover:bg-neutral-100 rounded-lg text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
        suppliers={suppliers}
      />
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />
    </div>
  )
}
