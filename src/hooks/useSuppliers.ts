import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupplierRepository } from '../repositories/SupplierRepository'
import type { Supplier } from '../types/erp'

export function useSuppliers() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => SupplierRepository.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: Omit<Supplier, 'id'>) => SupplierRepository.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Supplier> }) => SupplierRepository.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => SupplierRepository.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
  })

  return {
    ...query,
    createSupplier: createMutation.mutateAsync,
    updateSupplier: updateMutation.mutateAsync,
    deleteSupplier: deleteMutation.mutateAsync,
  }
}
