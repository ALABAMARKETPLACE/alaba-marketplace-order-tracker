

// src/lib/hooks/use-subscriptions.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionsApi, CreateSubscriptionData } from '@/lib/api/endpoints/subscription'

export function useSubscriptions(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['subscriptions', params],
    queryFn: () => subscriptionsApi.getAll(params),
  })
}

export function useSubscriptionsByStatus(status: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['subscriptions', 'status', status, params],
    queryFn: () => subscriptionsApi.getByStatus(status, params),
  })
}

export function useExpiringSubscriptions(days: number = 7) {
  return useQuery({
    queryKey: ['subscriptions', 'expiring', days],
    queryFn: () => subscriptionsApi.getExpiring(days),
  })
}

export function useUserSubscriptions(userId: string) {
  return useQuery({
    queryKey: ['subscriptions', 'user', userId],
    queryFn: () => subscriptionsApi.getByUserId(userId),
    enabled: !!userId,
  })
}

export function useActiveSubscription(userId: string) {
  return useQuery({
    queryKey: ['subscriptions', 'active', userId],
    queryFn: () => subscriptionsApi.getActiveByUserId(userId),
    enabled: !!userId,
  })
}

export function useSubscription(id: string) {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: () => subscriptionsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSubscriptionData) => subscriptionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    },
  })
}

export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['subscription', id] })
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    },
  })
}

export function useRenewSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.renew(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['subscription', id] })
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    },
  })
}