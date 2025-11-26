// import { apiClient } from '../client'
// import {
//   Product,
//   CreateProductData,
//   ProductFilters,
//   ApiResponse,
//   PaginatedResponse,
// } from '@/types'

// export const productsApi = {
//   getAll: (filters?: ProductFilters) =>
//     apiClient.get<ApiResponse<PaginatedResponse<Product>>>('/products', filters),

//   getById: (id: string) =>
//     apiClient.get<ApiResponse<Product>>(`/products/${id}`),

//   create: (data: CreateProductData) =>
//     apiClient.post<ApiResponse<Product>>('/products', data),

//   update: (id: string, data: Partial<CreateProductData>) =>
//     apiClient.put<ApiResponse<Product>>(`/products/${id}`, data),

//   delete: (id: string) =>
//     apiClient.delete<ApiResponse<null>>(`/products/${id}`),
// }

// src/lib/api/endpoints/products.ts
import { apiClient } from '../client'
import {
  Product,
  CreateProductData,
  ProductFilters,
  ApiResponse,
  PaginatedResponse,
} from '@/types'

export const productsApi = {
  getAll: (filters?: ProductFilters) =>
    apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      '/api/v1/products',
      filters as Record<string, unknown> | undefined,
    ),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Product>>(`/api/v1/products/${id}`),

  getMyProducts: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      '/api/v1/products/my-products',
      params
    ),

  create: (data: CreateProductData) =>
    apiClient.post<ApiResponse<Product>>('/api/v1/products', data),

  update: (id: string, data: Partial<CreateProductData>) =>
    apiClient.put<ApiResponse<Product>>(`/api/v1/products/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/v1/products/${id}`),
}
