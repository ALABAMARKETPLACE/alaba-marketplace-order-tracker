'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { driversApi } from '@/lib/api/endpoints/drivers'

export function useCompanyDrivers() {
  return useQuery({
    queryKey: ['company-drivers'],
    queryFn: () => driversApi.getAll(),
  })
}

export function useDriverDirectory(params?: { q?: string }) {
  return useQuery({
    queryKey: ['driver-directory', params],
    queryFn: () => driversApi.getDirectory(params),
  })
}

export function useAssignDriverToOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ driverId, orderId }: { driverId: string; orderId: string }) =>
      driversApi.assignOrder(driverId, orderId),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['company-drivers'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
    },
  })
}

export function useSendDriverInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ driverUserId, message }: { driverUserId: string; message?: string }) =>
      driversApi.invite(driverUserId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-directory'] })
    },
  })
}

export function useMyDriverInvitations() {
  return useQuery({
    queryKey: ['my-driver-invitations'],
    queryFn: () => driversApi.getMyInvitations(),
  })
}

export function useAcceptDriverInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invitationId: string) => driversApi.acceptInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-driver-invitations'] })
      queryClient.invalidateQueries({ queryKey: ['company-drivers'] })
    },
  })
}
