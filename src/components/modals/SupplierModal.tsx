import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import type { Supplier } from '../../types/erp'

const supplierSchema = z.object({
  name: z.string().min(2, 'Non founisè a obligatwa'),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email('Imèl pa valab').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
})

type SupplierFormValues = z.infer<typeof supplierSchema>

interface SupplierModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: SupplierFormValues) => Promise<void>
  supplier?: Supplier | null
}

export function SupplierModal({ isOpen, onClose, onSave, supplier }: SupplierModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: '',
      company_name: '',
      phone: '',
      whatsapp: '',
      email: '',
      address: '',
      city: 'Port-au-Prince',
      country: 'Haiti',
      notes: '',
    }
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        name: supplier?.name || '',
        company_name: supplier?.company_name || '',
        phone: supplier?.phone || '',
        whatsapp: supplier?.whatsapp || '',
        email: supplier?.email || '',
        address: supplier?.address || '',
        city: supplier?.city || 'Port-au-Prince',
        country: supplier?.country || 'Haiti',
        notes: supplier?.notes || '',
      })
    }
  }, [supplier, isOpen, reset])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-bold text-neutral-900">
            {supplier ? 'Modifye Founisè' : 'Nouvo Founisè'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-lg">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-800">Non Founisè *</label>
              <Input {...register('name')} className="mt-1" placeholder="ex: Brana S.A." />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-800">Non Konpayi</label>
              <Input {...register('company_name')} className="mt-1" placeholder="ex: Brasserie Nationale" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-800">Telefòn</label>
              <Input {...register('phone')} className="mt-1" placeholder="+509 3700 0000" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-800">WhatsApp</label>
              <Input {...register('whatsapp')} className="mt-1" placeholder="+509 3700 0000" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-800">Imèl</label>
              <Input {...register('email')} className="mt-1" placeholder="contact@sup.ht" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-800">Adrès</label>
              <Input {...register('address')} className="mt-1" placeholder="Delmas 33" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-800">Vil</label>
              <Input {...register('city')} className="mt-1" placeholder="Port-au-Prince" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-800">Peyi</label>
              <Input {...register('country')} className="mt-1" placeholder="Haiti" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-800">Nòt / Observasyon</label>
            <Input {...register('notes')} className="mt-1" placeholder="Detay adisyonèl..." />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Anule</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-white font-bold">
              {isSubmitting ? 'Ap sove...' : 'Sove Founisè'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
