// src/lib/api/endpoints/users.ts
import { apiClient } from '../client'
import { User, ApiResponse, PaginatedResponse } from '@/types'

export interface UpdateProfileData {
  name?: string
  phone?: string
  address?: string
}

export interface UserStats {
  totalOrders: number
  totalSpent: number
  completedOrders: number
  cancelledOrders: number
}

export const usersApi = {
  getProfile: () =>
    apiClient.get<ApiResponse<User>>('/api/v1/users/profile'),

  updateProfile: (data: UpdateProfileData) =>
    apiClient.patch<ApiResponse<User>>('/api/v1/users/profile', data),

  getStats: () =>
    apiClient.get<ApiResponse<UserStats>>('/api/v1/users/stats'),

  // Admin endpoints
  getAllUsers: (params?: { page?: number; limit?: number; role?: string }) =>
    apiClient.get<ApiResponse<PaginatedResponse<User>>>('/api/v1/users', params),

  getUserById: (id: string) =>
    apiClient.get<ApiResponse<User>>(`/api/v1/users/${id}`),

  getUsersByRole: (role: string) =>
    apiClient.get<ApiResponse<User[]>>(`/api/v1/users/by-role/${role}`),

  updateUser: (id: string, data: Partial<User>) =>
    apiClient.patch<ApiResponse<User>>(`/api/v1/users/${id}`, data),

  deleteUser: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/v1/users/${id}`),

  deactivateUser: (id: string) =>
    apiClient.patch<ApiResponse<User>>(`/api/v1/users/${id}/deactivate`),

  activateUser: (id: string) =>
    apiClient.patch<ApiResponse<User>>(`/api/v1/users/${id}/activate`),

  verifyEmail: (id: string) =>
    apiClient.patch<ApiResponse<User>>(`/api/v1/users/${id}/verify-email`),
}
