// // src/lib/hooks/use-products.ts
// 'use client'

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { ProductFilters, CreateProductData } from '@/types'
// import { productsApi } from '@/lib/api/endpoints/products'
// import { useMockData, mockProducts } from '@/lib/api/mock-data'

// export function useProducts(filters?: ProductFilters) {
//   return useQuery({
//     queryKey: ['products', filters],
//     queryFn: async () => {
//       if (useMockData) {
//         let filteredProducts = [...mockProducts]
        
//         if (filters?.search) {
//           filteredProducts = filteredProducts.filter(p =>
//             p.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
//             p.description.toLowerCase().includes(filters.search!.toLowerCase())
//           )
//         }
        
//         if (filters?.category) {
//           filteredProducts = filteredProducts.filter(p => p.category === filters.category)
//         }
        
//         if (filters?.minPrice) {
//           filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!)
//         }
        
//         if (filters?.maxPrice) {
//           filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!)
//         }

//         return {
//           success: true,
//           data: {
//             items: filteredProducts,
//             total: filteredProducts.length,
//             page: filters?.page || 1,
//             limit: filters?.limit || 10,
//             totalPages: Math.ceil(filteredProducts.length / (filters?.limit || 10)),
//           },
//         }
//       }
//       return productsApi.getAll(filters)
//     },
//   })
// }

// export function useProduct(id: string) {
//   return useQuery({
//     queryKey: ['product', id],
//     queryFn: async () => {
//       if (useMockData) {
//         const product = mockProducts.find((p) => p.id === id)
//         return { success: true, data: product! }
//       }
//       return productsApi.getById(id)
//     },
//     enabled: !!id,
//   })
// }

// export function useMyProducts(params?: { page?: number; limit?: number }) {
//   return useQuery({
//     queryKey: ['my-products', params],
//     queryFn: () => productsApi.getMyProducts(params),
//   })
// }

// export function useCreateProduct() {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (data: CreateProductData) => productsApi.create(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['products'] })
//       queryClient.invalidateQueries({ queryKey: ['my-products'] })
//     },
//   })
// }

// export function useUpdateProduct() {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductData> }) =>
//       productsApi.update(id, data),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['products'] })
//       queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
//       queryClient.invalidateQueries({ queryKey: ['my-products'] })
//     },
//   })
// }

// export function useDeleteProduct() {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (id: string) => productsApi.delete(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['products'] })
//       queryClient.invalidateQueries({ queryKey: ['my-products'] })
//     },
//   })
// }

// src/lib/hooks/use-products.ts - FINAL VERSION (NO MOCK)
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ProductFilters, CreateProductData } from '@/types'
import { productsApi } from '@/lib/api/endpoints/products'

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

export function useMyProducts(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['my-products', params],
    queryFn: () => productsApi.getMyProducts(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductData) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['my-products'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductData> }) =>
      productsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['my-products'] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['my-products'] })
    },
  })
}