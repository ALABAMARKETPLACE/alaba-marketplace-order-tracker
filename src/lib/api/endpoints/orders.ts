// import { apiClient } from '../client'
// import {
//   Order,
//   CreateOrderData,
//   OrderFilters,
//   ApiResponse,
//   PaginatedResponse,
// } from '@/types'

// export const ordersApi = {
//   getAll: (filters?: OrderFilters) =>
//     apiClient.get<ApiResponse<PaginatedResponse<Order>>>('/orders', filters),

//   getById: (id: string) => apiClient.get<ApiResponse<Order>>(`/orders/${id}`),

//   create: (data: CreateOrderData) =>
//     apiClient.post<ApiResponse<Order>>('/orders', data),

//   updateStatus: (id: string, status: string) =>
//     apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status }),

//   verifyDelivery: (id: string, code: string) =>
//     apiClient.post<ApiResponse<Order>>(`/orders/${id}/verify`, { code }),
// }

// src/lib/api/endpoints/orders.ts
import { apiClient } from '../client'
import {
  Order,
  CreateOrderData,
  OrderFilters,
  ApiResponse,
  PaginatedResponse,
} from '@/types'

export const ordersApi = {
  create: (data: CreateOrderData) =>
    apiClient.post<ApiResponse<Order>>('/api/v1/orders', data),

  getMyOrders: (filters?: OrderFilters) => {
    // Clean filters so we don't send invalid status values like "All" or empty string
    const params: Record<string, unknown> = {}
    if (filters) {
      if (filters.status && filters.status !== 'All') {
        params.status = filters.status
      }
      if (typeof filters.page !== 'undefined') {
        params.page = filters.page
      }
      if (typeof filters.limit !== 'undefined') {
        params.limit = filters.limit
      }
    }

    return apiClient.get<ApiResponse<PaginatedResponse<Order>>>(
      '/api/v1/orders/my-orders',
      params
    )
  },

  getById: (id: string) =>
    apiClient.get<ApiResponse<Order>>(`/api/v1/orders/${id}`),

  confirmPackageReceived: (id: string) =>
    apiClient.post<ApiResponse<Order>>(`/api/v1/orders/${id}/package-received`),

  confirmDelivery: (id: string, code: string) =>
    apiClient.post<ApiResponse<Order>>(`/api/v1/orders/${id}/confirm-delivery`, {
      deliveryCode: code,
    }),
}