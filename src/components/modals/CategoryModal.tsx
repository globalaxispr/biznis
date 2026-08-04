import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import type { Category } from '../../types/erp'

const categorySchema = z.object({
  name: z.string().min(2, 'Non kategori a obligatwa'),
  description: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CategoryFormValues) => Promise<void>
  category?: Category | null
}

export function CategoryModal({ isOpen, onClose, onSave, category }: CategoryModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category?.name || '', description: category?.description || '' }
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-bold text-neutral-900">
            {category ? 'Modifye Kategori' : 'Nouvo Kategori'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-lg">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-800">Non Kategori *</label>
            <Input {...register('name')} className="mt-1" placeholder="ex: Bwason ak Ji" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-800">Deskripsyon</label>
            <Input {...register('description')} className="mt-1" placeholder="Deskripsyon kout..." />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Anule</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-white">
              {isSubmitting ? 'Ap sove...' : 'Sove'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
