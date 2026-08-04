import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import type { Employee } from '../../types/erp'

const employeeSchema = z.object({
  first_name: z.string().min(2, 'Prenon an obligatwa'),
  last_name: z.string().min(2, 'Non an obligatwa'),
  email: z.string().email('Imèl sa a pa valab'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'manager', 'cashier', 'stockist', 'seller']),
  department: z.string().optional(),
  salary: z.number().min(0).optional(),
  status: z.enum(['active', 'inactive']),
})

type EmployeeFormValues = z.infer<typeof employeeSchema>

interface EmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: EmployeeFormValues) => Promise<void>
  employee?: Employee | null
}

export function EmployeeModal({ isOpen, onClose, onSave, employee }: EmployeeModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name: employee?.first_name || '',
      last_name: employee?.last_name || '',
      email: employee?.email || '',
      phone: employee?.phone || '',
      role: employee?.role || 'cashier',
      department: employee?.department || 'Vant',
      salary: employee?.salary || 0,
      status: employee?.status || 'active',
    }
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-bold text-neutral-900">
            {employee ? 'Modifye Anplwaye' : 'Nouvo Anplwaye (RH)'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-lg">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-800">Prenon *</label>
              <Input {...register('first_name')} className="mt-1" placeholder="ex: Jean" />
              {errors.first_name && <p className="text-xs text-destructive mt-1">{errors.first_name.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-800">Non *</label>
              <Input {...register('last_name')} className="mt-1" placeholder="ex: Baptiste" />
              {errors.last_name && <p className="text-xs text-destructive mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-800">Imèl (Login) *</label>
              <Input {...register('email')} className="mt-1" placeholder="jean@bizhaiti.ht" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-800">Telefòn</label>
              <Input {...register('phone')} className="mt-1" placeholder="+509 3700 0000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-800">Pòs / Cargo (Permisyon) *</label>
              <select {...register('role')} className="w-full h-10 border rounded-md px-3 mt-1 text-sm bg-white border-input">
                <option value="admin">Administratè (Aksè Total)</option>
                <option value="manager">Jiran / Manager</option>
                <option value="cashier">Kasye / Cashier (PDV Sèlman)</option>
                <option value="stockist">Mèt Estok / Estoquista</option>
                <option value="seller">Vandè / Seller</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-800">Depatman</label>
              <Input {...register('department')} className="mt-1" placeholder="ex: Kès 1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-800">Salè (HTG)</label>
              <Input type="number" {...register('salary', { valueAsNumber: true })} className="mt-1" placeholder="15000" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-800">Statut</label>
              <select {...register('status')} className="w-full h-10 border rounded-md px-3 mt-1 text-sm bg-white border-input">
                <option value="active">Aktif (🟢)</option>
                <option value="inactive">Inaktif (🔴)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border text-xs text-neutral-500">
            <strong>Atansyon:</strong> Lè ou kreye yon anplwaye, modpas inisyal la ap otomatikman etabli kòm <code className="font-mono bg-white px-1 border rounded">BizHaiti123!</code>.
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Anule</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-white font-bold">
              {isSubmitting ? 'Ap sove...' : 'Sove Anplwaye'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
