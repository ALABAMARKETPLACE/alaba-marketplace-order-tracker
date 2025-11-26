import { apiClient } from '../client'
import { ApiResponse, PaginatedResponse } from '@/types'

export interface Subscription {
  id: string
  userId: string
  planName: string
  planType: 'monthly' | 'quarterly' | 'yearly'
  amount: number
  status: 'active' | 'inactive' | 'expired' | 'cancelled'
  startDate: string
  endDate: string
  autoRenew: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSubscriptionData {
  userId: string
  planName: string
  planType: 'monthly' | 'quarterly' | 'yearly'
  amount: number
}

export const subscriptionsApi = {
  create: (data: CreateSubscriptionData) =>
    apiClient.post<ApiResponse<Subscription>>('/api/v1/subscriptions', data),

  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Subscription>>>(
      '/api/v1/subscriptions',
      params
    ),

  getByStatus: (status: string, params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Subscription>>>(
      `/api/v1/subscriptions/status/${status}`,
      params
    ),

  getExpiring: (days: number = 7) =>
    apiClient.get<ApiResponse<Subscription[]>>('/api/v1/subscriptions/expiring', {
      days,
    }),

  getByUserId: (userId: string) =>
    apiClient.get<ApiResponse<Subscription[]>>(
      `/api/v1/subscriptions/user/${userId}`
    ),

  getActiveByUserId: (userId: string) =>
    apiClient.get<ApiResponse<Subscription>>(
      `/api/v1/subscriptions/user/${userId}/active`
    ),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Subscription>>(`/api/v1/subscriptions/${id}`),

  update: (id: string, data: Partial<Subscription>) =>
    apiClient.patch<ApiResponse<Subscription>>(
      `/api/v1/subscriptions/${id}`,
      data
    ),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/v1/subscriptions/${id}`),

  cancel: (id: string) =>
    apiClient.patch<ApiResponse<Subscription>>(
      `/api/v1/subscriptions/${id}/cancel`
    ),

  renew: (id: string) =>
    apiClient.patch<ApiResponse<Subscription>>(
      `/api/v1/subscriptions/${id}/renew`
    ),

  checkExpired: () =>
    apiClient.post<ApiResponse<{ expired: number }>>(
      '/api/v1/subscriptions/expire-check'
    ),
}