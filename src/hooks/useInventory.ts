import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { InventoryRepository } from '../repositories/InventoryRepository'
import type { InventoryMovement } from '../types/erp'

export function useInventory() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['inventory'],
    queryFn: () => InventoryRepository.getAll(),
  })

  const addMovementMutation = useMutation({
    mutationFn: (movement: Omit<InventoryMovement, 'id'>) => InventoryRepository.addMovement(movement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return {
    ...query,
    addMovement: addMovementMutation.mutateAsync,
  }
}
