import { User, Product, Order, TrackingRecord } from '@/types'

export const useMockData = true

export const mockUser: User = {
  id: '1',
  email: 'buyer@alaba.com',
  firstName: 'John',
  lastName: 'Buyer',
  role: 'buyer',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Samsung Galaxy S23',
    description: 'Latest flagship smartphone with amazing features',
    price: 450000,
    category: 'Electronics',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
    sellerId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Nike Air Max 2024',
    description: 'Comfortable running shoes for all terrains',
    price: 85000,
    category: 'Fashion',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    sellerId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockOrders: Order[] = [
  {
    id: '1',
    buyerId: '1',
    totalAmount: 450000,
    status: 'in_transit',
    deliveryAddress: '123 Market Street, Lagos, Nigeria',
    deliveryCode: '1234',
    packageBarcode: 'PKG-2024-001',
    paymentReference: 'PAY-REF-001',
    items: [
      {
        id: '1',
        orderId: '1',
        productId: '1',
        quantity: 1,
        price: 450000,
        product: mockProducts[0],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockTracking: TrackingRecord[] = [
  {
    id: '1',
    orderId: '1',
    status: 'Order placed',
    location: 'Alaba International Market',
    latitude: 6.4550575,
    longitude: 3.2846072,
    notes: 'Order has been placed successfully',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    orderId: '1',
    status: 'Package picked up',
    location: 'Alaba International Market',
    latitude: 6.4550575,
    longitude: 3.2846072,
    notes: 'Package picked up by driver',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
]