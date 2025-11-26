
// src/lib/api/endpoints/delivery-company.ts
import { apiClient } from '../client'
import { ApiResponse } from '@/types'

export interface DeliveryCompany {
  id: string
  userId: string
  name: string
  address: string
  phone: string
  email: string
  licenseNumber: string
  isActive: boolean
  subscriptionStatus: 'active' | 'inactive' | 'expired'
  subscriptionEndDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateDeliveryCompanyData {
  name: string
  address: string
  phone: string
  email: string
  licenseNumber: string
}

export interface CompanyDashboard {
  totalDrivers: number
  activeDrivers: number
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  revenue: number
}

export const deliveryCompanyApi = {
  create: (data: CreateDeliveryCompanyData) =>
    apiClient.post<ApiResponse<DeliveryCompany>>(
      '/api/v1/delivery-company',
      data
    ),

  getMyCompany: () =>
    apiClient.get<ApiResponse<DeliveryCompany>>(
      '/api/v1/delivery-company/my-company'
    ),

  getSubscriptionStatus: () =>
    apiClient.get<ApiResponse<{ status: string; endDate?: string }>>(
      '/api/v1/delivery-company/subscription-status'
    ),

  getDashboard: () =>
    apiClient.get<ApiResponse<CompanyDashboard>>(
      '/api/v1/delivery-company/dashboard'
    ),

  getOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get<ApiResponse<any>>('/api/v1/delivery-company/orders', params),

  // Marketplace: unassigned orders any company can pick from
  getMarketplaceOrders: (params?: { status?: string; city?: string; state?: string }) =>
    apiClient.get<ApiResponse<any>>('/api/v1/delivery-company/marketplace-orders', params),

  // Accept an unassigned order for the logged-in company
  acceptOrder: (orderId: string) =>
    apiClient.post<ApiResponse<any>>(`/api/v1/delivery-company/orders/${orderId}/accept`),

  getDrivers: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<any>>('/api/v1/delivery-company/drivers', params),

  update: (id: string, data: Partial<CreateDeliveryCompanyData>) =>
    apiClient.put<ApiResponse<DeliveryCompany>>(
      `/api/v1/delivery-company/${id}`,
      data
    ),

  getById: (id: string) =>
    apiClient.get<ApiResponse<DeliveryCompany>>(
      `/api/v1/delivery-company/${id}`
    ),
}