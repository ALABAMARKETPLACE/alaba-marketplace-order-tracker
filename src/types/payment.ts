import type { Order } from './order'

export interface PaymentInitializeData {
  orderId: string
  amount: number
  email: string
  currency?: string
  reference?: string
  callbackUrl?: string
  plan?: string
  channels?: string[]
  userId?: string
  subscriptionId?: string
  paymentType?: 'order' | 'subscription' | 'wallet_topup' | 'other'
  metadata?: Record<string, unknown>
  firstName?: string
  lastName?: string
  phone?: string
  invoiceDescription?: string
  splitCode?: string
  subaccount?: string
  bearer?: 'account' | 'subaccount'
}

export interface PaymentInitializeResponse {
  authorization_url: string
  access_code: string
  reference: string
}

export interface PaymentVerificationResponse {
  reference: string
  amount: number
  status: string
  // Optional full order payload so frontend can show codes and deep-link
  order?: Order | null
}

export interface PaymentCheckoutPayload extends PaymentInitializeData {
  // Optional additional metadata that backend may attach
  metadata?: Record<string, unknown>
}

// src/types/api.ts
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}