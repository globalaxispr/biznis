import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CashRegisterRepository } from '../repositories/CashRegisterRepository'

export function useCashRegister() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['cashRegister'],
    queryFn: () => CashRegisterRepository.getCurrent(),
  })

  const openMutation = useMutation({
    mutationFn: ({ initialBalance, userId }: { initialBalance: number; userId?: string }) => 
      CashRegisterRepository.openRegister(initialBalance, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cashRegister'] }),
  })

  const closeMutation = useMutation({
    mutationFn: ({ id, userId }: { id: string; userId?: string }) => 
      CashRegisterRepository.closeRegister(id, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cashRegister'] }),
  })

  const movementMutation = useMutation({
    mutationFn: (movement: { cash_register_id: string; type: 'in' | 'out'; amount: number; reason: string }) => 
      CashRegisterRepository.addMovement(movement),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cashRegister'] }),
  })

  return {
    register: query.data,
    isLoading: query.isLoading,
    openRegister: openMutation.mutateAsync,
    closeRegister: closeMutation.mutateAsync,
    addMovement: movementMutation.mutateAsync,
  }
}
