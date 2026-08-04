import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SaleRepository } from '../repositories/SaleRepository'
import type { SaleItemInput } from '../types/erp'

export function useSales() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['sales'],
    queryFn: () => SaleRepository.getAll(),
  })

  const createSaleMutation = useMutation({
    mutationFn: (saleData: {
      customer_id?: string
      user_id?: string
      cash_register_id?: string
      subtotal: number
      discount: number
      total: number
      payment_method: 'cash' | 'card' | 'transfer' | 'other' | 'pix'
      amount_received?: number
      change?: number
      items: SaleItemInput[]
    }) => SaleRepository.createSale(saleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['cashRegister'] })
    },
  })

  return {
    ...query,
    createSale: createSaleMutation.mutateAsync,
    isSubmitting: createSaleMutation.isPending
  }
}
