// // src/lib/hooks/use-orders.ts
// 'use client'

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { OrderFilters, CreateOrderData } from '@/types'
// import { ordersApi } from '@/lib/api/endpoints/orders'
// import { trackingApi } from '@/lib/api/endpoints/tracking'
// import { useMockData, mockOrders, mockTracking } from '@/lib/api/mock-data'

// export function useOrders(filters?: OrderFilters) {
//   return useQuery({
//     queryKey: ['orders', filters],
//     queryFn: async () => {
//       if (useMockData) {
//         let filteredOrders = [...mockOrders]
        
//         if (filters?.status) {
//           filteredOrders = filteredOrders.filter(o => o.status === filters.status)
//         }

//         return {
//           success: true,
//           data: {
//             items: filteredOrders,
//             total: filteredOrders.length,
//             page: filters?.page || 1,
//             limit: filters?.limit || 10,
//             totalPages: Math.ceil(filteredOrders.length / (filters?.limit || 10)),
//           },
//         }
//       }
//       return ordersApi.getMyOrders(filters)
//     },
//   })
// }

// export function useOrder(id: string) {
//   return useQuery({
//     queryKey: ['order', id],
//     queryFn: async () => {
//       if (useMockData) {
//         const order = mockOrders.find((o) => o.id === id)
//         return { success: true, data: order! }
//       }
//       return ordersApi.getById(id)
//     },
//     enabled: !!id,
//   })
// }

// export function useCreateOrder() {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (data: CreateOrderData) => ordersApi.create(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['orders'] })
//     },
//   })
// }

// export function useConfirmPackageReceived() {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (orderId: string) => ordersApi.confirmPackageReceived(orderId),
//     onSuccess: (_, orderId) => {
//       queryClient.invalidateQueries({ queryKey: ['order', orderId] })
//       queryClient.invalidateQueries({ queryKey: ['orders'] })
//       queryClient.invalidateQueries({ queryKey: ['tracking', orderId] })
//     },
//   })
// }

// export function useConfirmDelivery() {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: ({ orderId, code }: { orderId: string; code: string }) =>
//       ordersApi.confirmDelivery(orderId, code),
//     onSuccess: (_, { orderId }) => {
//       queryClient.invalidateQueries({ queryKey: ['order', orderId] })
//       queryClient.invalidateQueries({ queryKey: ['orders'] })
//       queryClient.invalidateQueries({ queryKey: ['tracking', orderId] })
//     },
//   })
// }

// export function useOrderTracking(orderId: string) {
//   return useQuery({
//     queryKey: ['tracking', orderId],
//     queryFn: async () => {
//       if (useMockData) {
//         return {
//           success: true,
//           data: mockTracking.filter((t) => t.orderId === orderId),
//         }
//       }
//       return trackingApi.getByOrderId(orderId)
//     },
//     enabled: !!orderId,
//   })
// }

// src/lib/hooks/use-orders.ts - FINAL VERSION (NO MOCK)
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { OrderFilters, CreateOrderData } from '@/types'
import { ordersApi } from '@/lib/api/endpoints/orders'
import { trackingApi } from '@/lib/api/endpoints/tracking'

export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersApi.getMyOrders(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOrderData) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useConfirmPackageReceived() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.confirmPackageReceived(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['tracking', orderId] })
    },
  })
}

export function useConfirmDelivery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, code }: { orderId: string; code: string }) =>
      ordersApi.confirmDelivery(orderId, code),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['tracking', orderId] })
    },
  })
}

export function useOrderTracking(orderId: string) {
  return useQuery({
    queryKey: ['tracking', orderId],
    queryFn: () => trackingApi.getByOrderId(orderId),
    enabled: !!orderId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refresh every minute
    retry: 2,
  })
}