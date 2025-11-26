export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  imageUrl: string
  sellerId: string
  createdAt: string
  updatedAt: string
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  category: string
  stock: number
  imageUrl: string
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  page?: number
  limit?: number
}