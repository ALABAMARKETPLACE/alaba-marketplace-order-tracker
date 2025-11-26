
// src/lib/hooks/use-users.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi, UpdateProfileData } from '@/lib/api/endpoints/users'

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: () => usersApi.getProfile(),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileData) => usersApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    },
  })
}

export function useUserStats() {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: () => usersApi.getStats(),
  })
}