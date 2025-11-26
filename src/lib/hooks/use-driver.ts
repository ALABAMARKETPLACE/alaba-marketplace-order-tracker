// src/lib/hooks/use-drivers.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { driversApi, CreateDriverData } from '@/lib/api/endpoints/drivers'

export function useDrivers(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['drivers', params],
    queryFn: () => driversApi.getAll(params),
  })
}

export function useAvailableDrivers() {
  return useQuery({
    queryKey: ['drivers', 'available'],
    queryFn: () => driversApi.getAvailable(),
  })
}

export function useDriver(id: string) {
  return useQuery({
    queryKey: ['driver', id],
    queryFn: () => driversApi.getById(id),
    enabled: !!id,
  })
}

export function useMyDeliveries(params?: { status?: string }) {
  return useQuery({
    queryKey: ['my-deliveries', params],
    queryFn: () => driversApi.getMyDeliveries(params),
  })
}

export function useMyDriverHistory(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['driver-history', params],
    queryFn: () => driversApi.getMyHistory(params),
  })
}

export function useMyDriverStats() {
  return useQuery({
    queryKey: ['driver-stats'],
    queryFn: () => driversApi.getMyStats(),
  })
}

export function useDriverStats(id: string) {
  return useQuery({
    queryKey: ['driver-stats', id],
    queryFn: () => driversApi.getStatsById(id),
    enabled: !!id,
  })
}

export function useCreateDriver() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDriverData) => driversApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
    },
  })
}

export function useUpdateDriverAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (isAvailable: boolean) => driversApi.updateAvailability(isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
    },
  })
}

export function useAssignDriver() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ driverId, orderId }: { driverId: string; orderId: string }) =>
      driversApi.assignOrder(driverId, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
    },
  })
}
