import { useState } from 'react'
import { Plus, Search, Star, Edit, Trash2, Download } from 'lucide-react'
import toast from 'react-hot-toast'

import { useCustomers } from '../hooks/useCustomers'
import { CustomerModal } from '../components/modals/CustomerModal'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { exportToCSV } from '../utils/csv'
import type { Customer } from '../types/erp'

export function Customers() {
  const { data: customers = [], isLoading, createCustomer, updateCustomer, deleteCustomer } = useCustomers()
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone?.includes(search) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleExportCSV = () => {
    if (customers.length === 0) {
      toast.error('Pa gen kliyan pou ekspòte')
      return
    }

    const dataToExport = customers.map(c => ({
      Non: c.name,
      Telefon: c.phone || '',
      Imel: c.email || '',
      Adres: c.address || '',
      VIP: c.is_vip ? 'Wi' : 'Non',
      TotalDepanse: c.total_spent
    }))

    exportToCSV('bizhaiti_kliyan', dataToExport)
    toast.success('Fichye CSV a telechaje!')
  }

  const handleSave = async (data: any) => {
    try {
      if (editingCustomer) {
        await updateCustomer({ id: editingCustomer.id, data })
        toast.success('Kliyan an modiye avèk siksè!')
      } else {
        await createCustomer(data)
        toast.success('Kliyan an ajoute avèk siksè!')
      }
      setIsModalOpen(false)
      setEditingCustomer(null)
    } catch (err: any) {
      toast.error('Erè pandan anregistreman an')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Eske ou sèten ou vle efase kliyan sa a?')) {
      try {
        await deleteCustomer(id)
        toast.success('Kliyan an efase')
      } catch (err: any) {
        toast.error('Erè pandan efasman an')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Lis Kliyan yo</h2>
          <p className="text-sm text-neutral-500">Jere kliyan ou yo ak istwa acha yo</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline" className="gap-2 text-xs">
            <Download className="w-4 h-4" /> Ekspòte CSV
          </Button>
          <Button onClick={() => { setEditingCustomer(null); setIsModalOpen(true); }} className="bg-primary text-white gap-2 text-xs">
            <Plus className="w-4 h-4" /> Nouvo Kliyan
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Chèche yon kliyan nan non, telefòn oswa imèl..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-neutral-400">Ap chaje kliyan yo...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">Pa gen kliyan ki jwenn.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 border-b text-neutral-600 font-semibold">
                <tr>
                  <th className="p-4">Non Kliyan</th>
                  <th className="p-4">Telefòn</th>
                  <th className="p-4">Imèl</th>
                  <th className="p-4">Total Depanse</th>
                  <th className="p-4">Statut VIP</th>
                  <th className="p-4 text-right">Aksyon</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCustomers.map(c => (
                  <tr key={c.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 font-semibold text-neutral-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {c.name.charAt(0)}
                      </div>
                      {c.name}
                    </td>
                    <td className="p-4 text-neutral-600 font-mono text-xs">{c.phone || '-'}</td>
                    <td className="p-4 text-neutral-600">{c.email || '-'}</td>
                    <td className="p-4 font-bold text-primary">{c.total_spent.toFixed(2)} HTG</td>
                    <td className="p-4">
                      {c.is_vip ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> VIP
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-xs">Ordinaire</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditingCustomer(c); setIsModalOpen(true); }} className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-neutral-100 rounded-lg text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCustomer(null); }}
        onSave={handleSave}
        customer={editingCustomer}
      />
    </div>
  )
}
