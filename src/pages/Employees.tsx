import { useState } from 'react'
import { Plus, Search, Shield, UserCheck, Key, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { useAuthStore } from '../store/authStore'
import { EmployeeModal } from '../components/modals/EmployeeModal'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import type { Employee } from '../types/erp'

export function Employees() {
  const { profile } = useAuthStore()

  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', first_name: profile?.first_name || 'Admin', last_name: profile?.last_name || 'Principal', email: 'admin@bizhaiti.com', role: profile?.role || 'admin', status: 'active', department: 'Direction', salary: 45000 },
    { id: '2', first_name: 'Marie', last_name: 'Joseph', email: 'marie@bizhaiti.com', role: 'manager', status: 'active', department: 'Magazen', salary: 25000 },
    { id: '3', first_name: 'Pierre', last_name: 'Jean', email: 'pierre@bizhaiti.com', role: 'cashier', status: 'active', department: 'Kès 1', salary: 15000 },
  ])

  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const filteredEmployees = employees.filter(e => 
    `${e.first_name} ${e.last_name}`.toLowerCase().includes(search.toLowerCase()) || 
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async (data: any) => {
    if (editingEmployee) {
      setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? { ...emp, ...data } : emp))
      toast.success('Anplwaye a modiye avèk siksè!')
    } else {
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        ...data,
        created_at: new Date().toISOString()
      }
      setEmployees(prev => [...prev, newEmp])
      toast.success('Anplwaye a ajoute avèk siksè!')
    }
    setIsModalOpen(false)
    setEditingEmployee(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Eske ou sèten ou vle efase anplwaye sa a?')) {
      setEmployees(prev => prev.filter(e => e.id !== id))
      toast.success('Anplwaye a efase!')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Ressources Humaines (RH / Anplwaye)</h2>
          <p className="text-sm text-neutral-500">Jere aksè, wòl, salè ak pèmisyon itilizatè yo</p>
        </div>
        <Button onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }} className="bg-primary text-white gap-2">
          <Plus className="w-4 h-4" /> Nouvo Anplwaye
        </Button>
      </div>

      {/* Role Summary Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-semibold">Administratè</p>
            <h4 className="text-xl font-bold text-neutral-900">Aksè Total</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-semibold">Jiran (Manager)</p>
            <h4 className="text-xl font-bold text-neutral-900">Aksè Limite</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-semibold">Kasye (Cashier)</p>
            <h4 className="text-xl font-bold text-neutral-900">PDV Sèlman</h4>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Chèche yon anplwaye nan non, imèl oswa pòs..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 border-b text-neutral-600 font-semibold">
            <tr>
              <th className="p-4">Non Anplwaye</th>
              <th className="p-4">Imèl (Login)</th>
              <th className="p-4">Depatman</th>
              <th className="p-4">Pòs (Permisyon)</th>
              <th className="p-4">Salè</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Aksyon</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredEmployees.map(emp => (
              <tr key={emp.id} className="hover:bg-neutral-50/50">
                <td className="p-4 font-semibold text-neutral-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {emp.first_name.charAt(0)}
                  </div>
                  {emp.first_name} {emp.last_name}
                </td>
                <td className="p-4 text-neutral-600 font-mono text-xs">{emp.email}</td>
                <td className="p-4 text-neutral-500">{emp.department || '-'}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                    emp.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    emp.role === 'manager' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {emp.role}
                  </span>
                </td>
                <td className="p-4 font-semibold text-neutral-700">{emp.salary ? `${emp.salary.toFixed(2)} HTG` : '-'}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    emp.status === 'active' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                  }`}>
                    {emp.status === 'active' ? 'Aktif 🟢' : 'Inaktif 🔴'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setEditingEmployee(emp); setIsModalOpen(true); }} className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(emp.id)} className="p-1.5 hover:bg-neutral-100 rounded-lg text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingEmployee(null); }}
        onSave={handleSave}
        employee={editingEmployee}
      />
    </div>
  )
}
