import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import type { Customer } from '../../types/erp'

const customerSchema = z.object({
  name: z.string().min(2, 'Non kliyan an obligatwa'),
  phone: z.string().optional(),
  email: z.string().email('Imèl sa a pa valab').optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
  is_vip: z.boolean(),
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CustomerFormValues) => Promise<void>
  customer?: Customer | null
}

export function CustomerModal({ isOpen, onClose, onSave, customer }: CustomerModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || '',
      phone: customer?.phone || '',
      email: customer?.email || '',
      address: customer?.address || '',
      notes: customer?.notes || '',
      is_vip: customer?.is_vip ?? false,
    }
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-bold text-neutral-900">
            {customer ? 'Modifye Kliyan' : 'Nouvo Kliyan'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-lg">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-800">Non Kliyan *</label>
            <Input {...register('name')} className="mt-1" placeholder="ex: Jean-Baptiste Pierre" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-800">Telefòn</label>
              <Input {...register('phone')} className="mt-1" placeholder="+509 3600 0000" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-800">Imèl</label>
              <Input {...register('email')} className="mt-1" placeholder="email@gmail.com" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-800">Adrès</label>
            <Input {...register('address')} className="mt-1" placeholder="Pétion-Ville, Haiti" />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="is_vip" {...register('is_vip')} className="w-4 h-4 text-primary rounded" />
            <label htmlFor="is_vip" className="text-sm text-neutral-800 font-medium">Marke kòm Kliyan VIP</label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Anule</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-white">
              {isSubmitting ? 'Ap sove...' : 'Sove Kliyan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
