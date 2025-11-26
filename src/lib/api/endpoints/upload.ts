import { apiClient } from '../client'
import { ApiResponse, PaginatedResponse } from '@/types'

export interface Upload {
  id: string
  userId: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  entityType?: string
  entityId?: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export const uploadsApi = {
  uploadFile: (formData: FormData) =>
    apiClient.uploadFile<ApiResponse<Upload>>('/api/v1/uploads/file', formData),

  uploadFiles: (formData: FormData) =>
    apiClient.uploadFile<ApiResponse<Upload[]>>(
      '/api/v1/uploads/files',
      formData
    ),

  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Upload>>>('/api/v1/uploads', params),

  getByUserId: (userId: string) =>
    apiClient.get<ApiResponse<Upload[]>>(`/api/v1/uploads/user/${userId}`),

  getByEntity: (entityType: string, entityId: string) =>
    apiClient.get<ApiResponse<Upload[]>>(
      `/api/v1/uploads/entity/${entityType}/${entityId}`
    ),

  getByType: (fileType: string) =>
    apiClient.get<ApiResponse<Upload[]>>(`/api/v1/uploads/type/${fileType}`),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Upload>>(`/api/v1/uploads/${id}`),

  update: (id: string, data: Partial<Upload>) =>
    apiClient.patch<ApiResponse<Upload>>(`/api/v1/uploads/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/v1/uploads/${id}`),

  getRefreshedUrl: (id: string) =>
    apiClient.get<ApiResponse<{ url: string }>>(`/api/v1/uploads/${id}/url`),

  softDelete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/v1/uploads/${id}/soft`),
}