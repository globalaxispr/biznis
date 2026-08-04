import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SettingsRepository } from '../repositories/SettingsRepository'
import type { StoreSettings } from '../types/erp'

export function useStoreSettings() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['storeSettings'],
    queryFn: () => SettingsRepository.getSettings(),
  })

  const updateMutation = useMutation({
    mutationFn: (settings: Partial<StoreSettings>) => SettingsRepository.updateSettings(settings),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['storeSettings'] }),
  })

  return {
    settings: query.data,
    isLoading: query.isLoading,
    updateSettings: updateMutation.mutateAsync,
  }
}
