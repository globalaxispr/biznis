import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ProductRepository } from '../repositories/ProductRepository'
import type { Product } from '../types/erp'

export function useProducts() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['products'],
    queryFn: () => ProductRepository.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: Omit<Product, 'id'>) => ProductRepository.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => ProductRepository.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductRepository.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })

  return {
    ...query,
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    isSubmitting: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  }
}
