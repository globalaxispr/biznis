import { useState } from 'react'
import { Plus, Search, Truck, Phone, Mail, Trash2, Edit, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

import { useSuppliers } from '../hooks/useSuppliers'
import { SupplierModal } from '../components/modals/SupplierModal'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import type { Supplier } from '../types/erp'

export function Suppliers() {
  const { data: suppliers = [], createSupplier, updateSupplier, deleteSupplier } = useSuppliers()
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.company_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async (data: any) => {
    try {
      if (editingSupplier) {
        await updateSupplier({ id: editingSupplier.id, data })
        toast.success('Founisè a modiye avèk siksè!')
      } else {
        await createSupplier(data)
        toast.success('Founisè a ajoute avèk siksè!')
      }
      setIsModalOpen(false)
      setEditingSupplier(null)
    } catch (err: any) {
      toast.error('Erè pandan anregistreman an')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Eske ou sèten ou vle efase founisè sa a?')) {
      try {
        await deleteSupplier(id)
        toast.success('Founisè a efase')
      } catch (err: any) {
        toast.error('Erè pandan efasman an')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Lis Founisè yo (Suppliers)</h2>
          <p className="text-sm text-neutral-500">Jere partnenè, achte ak founisè pwodwi ou yo</p>
        </div>
        <Button onClick={() => { setEditingSupplier(null); setIsModalOpen(true); }} className="bg-primary text-white gap-2">
          <Plus className="w-4 h-4" /> Nouvo Founisè
        </Button>
      </div>

      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Chèche yon founisè nan non, konpayi oswa vil..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map(s => (
          <div key={s.id} className="bg-white p-6 rounded-2xl border shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-accent/10 text-accent flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">{s.name}</h4>
                  <p className="text-xs text-neutral-500 font-medium">{s.company_name || 'Founisè Agreye'}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={() => { setEditingSupplier(s); setIsModalOpen(true); }} className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-neutral-100 rounded-lg text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs text-neutral-600 pt-2 border-t">
              {s.phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-neutral-400" /> {s.phone}</p>}
              {s.email && <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-neutral-400" /> {s.email}</p>}
              {(s.address || s.city) && (
                <p className="flex items-center gap-2 text-neutral-500">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" /> {s.address} {s.city ? `, ${s.city}` : ''}
                </p>
              )}
            </div>

            <div className="pt-2 border-t flex justify-between items-center text-[11px] text-neutral-400">
              <span>Achats Total: <strong className="text-neutral-700">{s.total_purchases || 0}</strong></span>
              <span>Peyi: <strong className="text-neutral-700">{s.country || 'Haiti'}</strong></span>
            </div>
          </div>
        ))}
      </div>

      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingSupplier(null); }}
        onSave={handleSave}
        supplier={editingSupplier}
      />
    </div>
  )
}
