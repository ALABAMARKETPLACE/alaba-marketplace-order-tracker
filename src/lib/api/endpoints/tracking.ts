// src/lib/api/endpoints/tracking.ts
import { apiClient } from '../client'
import { TrackingRecord, CreateTrackingData, ApiResponse } from '@/types'

export const trackingApi = {
  create: (data: CreateTrackingData) =>
    apiClient.post<ApiResponse<TrackingRecord>>('/api/v1/tracking', data),

  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<TrackingRecord[]>>('/api/v1/tracking', params),

  getByOrderId: (orderId: string) =>
    apiClient.get<ApiResponse<TrackingRecord[]>>(
      `/api/v1/tracking/order/${orderId}`
    ),

  getLatestByOrderId: (orderId: string) =>
    apiClient.get<ApiResponse<TrackingRecord>>(
      `/api/v1/tracking/order/${orderId}/latest`
    ),

  getByRiderId: (riderId: string) =>
    apiClient.get<ApiResponse<TrackingRecord[]>>(
      `/api/v1/tracking/rider/${riderId}`
    ),

  getById: (id: string) =>
    apiClient.get<ApiResponse<TrackingRecord>>(`/api/v1/tracking/${id}`),

  update: (id: string, data: Partial<CreateTrackingData>) =>
    apiClient.patch<ApiResponse<TrackingRecord>>(`/api/v1/tracking/${id}`, data),

  updateLocation: (id: string, latitude: number, longitude: number) =>
    apiClient.patch<ApiResponse<TrackingRecord>>(
      `/api/v1/tracking/${id}/location`,
      { latitude, longitude }
    ),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/v1/tracking/${id}`),
}

