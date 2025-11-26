// src/lib/hooks/use-delivery-company.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deliveryCompanyApi, CreateDeliveryCompanyData } from '@/lib/api/endpoints/delivery-company'

export function useMyDeliveryCompany() {
  return useQuery({
    queryKey: ['my-delivery-company'],
    queryFn: () => deliveryCompanyApi.getMyCompany(),
  })
}

export function useDeliveryCompanySubscription() {
  return useQuery({
    queryKey: ['delivery-company-subscription'],
    queryFn: () => deliveryCompanyApi.getSubscriptionStatus(),
  })
}

export function useDeliveryCompanyDashboard() {
  return useQuery({
    queryKey: ['delivery-company-dashboard'],
    queryFn: () => deliveryCompanyApi.getDashboard(),
  })
}

export function useDeliveryCompanyOrders(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: ['delivery-company-orders', params],
    queryFn: () => deliveryCompanyApi.getOrders(params),
  })
}

export function useDeliveryCompanyDrivers(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['delivery-company-drivers', params],
    queryFn: () => deliveryCompanyApi.getDrivers(params),
  })
}

export function useDeliveryCompanyMarketplaceOrders(params?: { status?: string; city?: string; state?: string }) {
  return useQuery({
    queryKey: ['delivery-company-marketplace-orders', params],
    queryFn: () => deliveryCompanyApi.getMarketplaceOrders(params),
  })
}

export function useAcceptDeliveryCompanyOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => deliveryCompanyApi.acceptOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-company-marketplace-orders'] })
      queryClient.invalidateQueries({ queryKey: ['delivery-company-orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useCreateDeliveryCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDeliveryCompanyData) => deliveryCompanyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-delivery-company'] })
    },
  })
}

export function useUpdateDeliveryCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDeliveryCompanyData> }) =>
      deliveryCompanyApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-delivery-company'] })
    },
  })
}