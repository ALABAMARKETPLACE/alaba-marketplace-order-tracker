import { Product } from './product'

export interface Order {
  id: string
  buyerId: string
  totalAmount: number
  status: 'pending' | 'processing' | 'in_transit' | 'delivered' | 'cancelled'
  deliveryAddress: string
  deliveryCode: string
  packageBarcode: string
  paymentReference?: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
  // Optional driver info for company/driver tracking views
  driverId?: string | null
  driver?: {
    id: string
    name: string
    email: string
    phone?: string
  } | null
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product: Product
}

export interface CreateOrderData {
  productId: string
  quantity: number
  deliveryAddress: string
  deliveryCompanyId?: string
  selectedRoute?: string
  deliveryCity?: string
  deliveryState?: string
}

export interface OrderFilters {
  status?: string
  page?: number
  limit?: number
}

export interface TrackingRecord {
  id: string
  orderId: string
  status: string
  location?: string
  latitude?: number
  longitude?: number
  notes?: string
  createdAt: string
}

export interface CreateTrackingData {
  orderId: string
  status: string
  location?: string
  latitude?: number
  longitude?: number
  notes?: string
}