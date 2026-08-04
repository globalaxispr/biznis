import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CustomerRepository } from '../repositories/CustomerRepository'
import type { Customer } from '../types/erp'

export function useCustomers() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['customers'],
    queryFn: () => CustomerRepository.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: Omit<Customer, 'id' | 'total_spent'>) => CustomerRepository.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) => CustomerRepository.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CustomerRepository.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })

  return {
    ...query,
    createCustomer: createMutation.mutateAsync,
    updateCustomer: updateMutation.mutateAsync,
    deleteCustomer: deleteMutation.mutateAsync,
  }
}
