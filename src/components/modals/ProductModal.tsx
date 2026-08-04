import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import type { Product, Category, Supplier } from '../../types/erp'

const productSchema = z.object({
  name: z.string().min(2, 'Non pwodwi a obligatwa'),
  code: z.string().optional(),
  barcode: z.string().optional(),
  category_id: z.string().optional(),
  supplier_id: z.string().optional(),
  buy_price: z.number().min(0, 'Prix achte a dwe ≥ 0'),
  sell_price: z.number().min(0, 'Prix vann nan dwe ≥ 0'),
  quantity: z.number().int().min(0, 'Kantite a dwe ≥ 0'),
  min_stock: z.number().int().min(0, 'Estok minimòm nan dwe ≥ 0'),
  is_active: z.boolean(),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ProductFormValues) => Promise<void>
  product?: Product | null
  categories: Category[]
  suppliers: Supplier[]
}

export function ProductModal({ isOpen, onClose, onSave, product, categories, suppliers }: ProductModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      code: '',
      barcode: '',
      category_id: '',
      supplier_id: '',
      buy_price: 0,
      sell_price: 0,
      quantity: 0,
      min_stock: 5,
      is_active: true,
    }
  })

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        code: product.code || '',
        barcode: product.barcode || '',
        category_id: product.category_id || '',
        supplier_id: product.supplier_id || '',
        buy_price: product.buy_price,
        sell_price: product.sell_price,
        quantity: product.quantity,
        min_stock: product.min_stock,
        is_active: product.is_active,
      })
    } else {
      reset({
        name: '',
        code: '',
        barcode: '',
        category_id: '',
        supplier_id: '',
        buy_price: 0,
        sell_price: 0,
        quantity: 0,
        min_stock: 5,
        is_active: true,
      })
    }
  }, [product, reset, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-neutral-900">
            {product ? 'Modifye Pwodwi' : 'Ajoute yon nouvo Pwodwi'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-800">Non Pwodwi *</label>
            <Input {...register('name')} className="mt-1" placeholder="ex: Kola Couronne 50cl" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-800">Kòd Pwodwi</label>
              <Input {...register('code')} className="mt-1" placeholder="ex: PRD-001" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-800">Kòd de Bar (Barcode)</label>
              <Input {...register('barcode')} className="mt-1" placeholder="ex: 0123456789" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-800">Kategori</label>
              <select {...register('category_id')} className="w-full h-10 border rounded-md px-3 mt-1 text-sm bg-white border-input">
                <option value="">Chwazi Kategori</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-800">Founisè</label>
              <select {...register('supplier_id')} className="w-full h-10 border rounded-md px-3 mt-1 text-sm bg-white border-input">
                <option value="">Chwazi Founisè</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-800">Prix Achte (HTG) *</label>
              <Input type="number" step="0.01" {...register('buy_price', { valueAsNumber: true })} className="mt-1" />
              {errors.buy_price && <p className="text-xs text-destructive mt-1">{errors.buy_price.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-800">Prix Vann (HTG) *</label>
              <Input type="number" step="0.01" {...register('sell_price', { valueAsNumber: true })} className="mt-1" />
              {errors.sell_price && <p className="text-xs text-destructive mt-1">{errors.sell_price.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-800">Kantite nan Estok *</label>
              <Input type="number" {...register('quantity', { valueAsNumber: true })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-800">Estok Minimòm *</label>
              <Input type="number" {...register('min_stock', { valueAsNumber: true })} className="mt-1" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Anule</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-white">
              {isSubmitting ? 'Ap sove...' : 'Sove Pwodwi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
