// src/lib/api/endpoints/paystack.ts
import { apiClient } from '../client'
import { PaymentInitializeData, PaymentInitializeResponse, PaymentVerificationResponse, ApiResponse } from '@/types'

export const paystackApi = {
  initialize: (data: PaymentInitializeData) =>
    apiClient.post<ApiResponse<PaymentInitializeResponse>>(
      '/api/v1/paystack/initialize',
      data
    ),

  verify: (reference: string) =>
    apiClient.post<ApiResponse<PaymentVerificationResponse>>(
      '/api/v1/paystack/verify',
      { reference }
    ),
}