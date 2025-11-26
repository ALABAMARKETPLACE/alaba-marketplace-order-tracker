// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
// export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

// export const CATEGORIES = [
//   'Electronics',
//   'Fashion',
//   'Home & Garden',
//   'Sports',
//   'Books',
//   'Toys',
//   'Other',
// ] as const

// export const ORDER_STATUSES = {
//   PENDING: 'pending',
//   PROCESSING: 'processing',
//   IN_TRANSIT: 'in_transit',
//   DELIVERED: 'delivered',
//   CANCELLED: 'cancelled',
// } as const

// src/lib/constants.ts - APPLICATION CONSTANTS
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Books',
  'Toys',
  'Other',
] as const

export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  DRIVER: 'driver',
  COMPANY: 'company',
} as const

// Token storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  CART: 'alaba-market-cart',
  USER: 'alaba-market-user',
} as const

// Default product image (valid Unsplash image) used when product.imageUrl is missing or invalid
export const DEFAULT_PRODUCT_IMAGE_URL =
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'
