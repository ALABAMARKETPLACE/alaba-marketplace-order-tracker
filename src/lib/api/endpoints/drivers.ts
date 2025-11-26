/* eslint-disable @typescript-eslint/no-explicit-any */

// src/lib/api/endpoints/drivers.ts
import { apiClient } from '../client'
import { ApiResponse, PaginatedResponse } from '@/types'

export interface Driver {
  id: string
  userId: string
  deliveryCompanyId: string
  vehicleType: string
  vehicleNumber: string
  licenseNumber: string
  isAvailable: boolean
  rating: number
  completedDeliveries: number
  createdAt: string
  updatedAt: string
}

export interface CreateDriverData {
  userId: string
  vehicleType: string
  vehicleNumber: string
  licenseNumber: string
}

export interface DriverStats {
  totalDeliveries: number
  completedDeliveries: number
  pendingDeliveries: number
  rating: number
  earnings: number
}

export interface DriverInvitation {
  id: string
  companyId: string
  driverUserId: string
  status: 'pending' | 'accepted' | 'rejected'
  message?: string | null
  createdAt: string
  updatedAt: string
  company?: {
    id: string
    companyName: string
  }
}

export const driversApi = {
  create: (data: CreateDriverData) =>
    apiClient.post<ApiResponse<Driver>>('/api/v1/drivers', data),

  // Directory of all driver users (for companies to invite)
  getDirectory: (params?: { q?: string }) =>
    apiClient.get<ApiResponse<any[]>>('/api/v1/drivers/directory', params),

  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Driver>>>('/api/v1/drivers', params),

  getAvailable: () =>
    apiClient.get<ApiResponse<Driver[]>>('/api/v1/drivers/available'),

  getMyDeliveries: (params?: { status?: string }) =>
    apiClient.get<ApiResponse<any[]>>('/api/v1/drivers/my-deliveries', params),

  getMyHistory: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      '/api/v1/drivers/my-history',
      params
    ),

  getMyStats: () =>
    apiClient.get<ApiResponse<DriverStats>>('/api/v1/drivers/my-stats'),

  getStatsById: (id: string) =>
    apiClient.get<ApiResponse<DriverStats>>(`/api/v1/drivers/${id}/stats`),

  updateAvailability: (isAvailable: boolean) =>
    apiClient.patch<ApiResponse<Driver>>('/api/v1/drivers/availability', {
      isAvailable,
    }),

  assignOrder: (driverId: string, orderId: string) =>
    apiClient.post<ApiResponse<any>>('/api/v1/drivers/assign', {
      driverId,
      orderId,
    }),

  // Invitations
  invite: (driverUserId: string, message?: string) =>
    apiClient.post<ApiResponse<DriverInvitation>>('/api/v1/drivers/invite', {
      driverUserId,
      message,
    }),

  getMyInvitations: () =>
    apiClient.get<ApiResponse<DriverInvitation[]>>('/api/v1/drivers/my-invitations'),

  acceptInvitation: (id: string) =>
    apiClient.post<ApiResponse<Driver>>(`/api/v1/drivers/invitations/${id}/accept`),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Driver>>(`/api/v1/drivers/${id}`),

  update: (id: string, data: Partial<CreateDriverData>) =>
    apiClient.put<ApiResponse<Driver>>(`/api/v1/drivers/${id}`, data),

  deactivate: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/v1/drivers/${id}`),
}
