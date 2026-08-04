import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CategoryRepository } from '../repositories/CategoryRepository'
import type { Category } from '../types/erp'

export function useCategories() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryRepository.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: Omit<Category, 'id'>) => CategoryRepository.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => CategoryRepository.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CategoryRepository.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  return {
    ...query,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
  }
}
