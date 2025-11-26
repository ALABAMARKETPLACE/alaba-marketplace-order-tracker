// src/lib/api/endpoints/payments.ts
import { apiClient } from '../client'
import { ApiResponse, PaymentCheckoutPayload, PaymentInitializeResponse } from '@/types'

export const paymentsApi = {
  checkout: (payload: PaymentCheckoutPayload) =>
    apiClient.post<ApiResponse<PaymentInitializeResponse>>(
      '/api/v1/payments/checkout',
      payload,
    ),
}
