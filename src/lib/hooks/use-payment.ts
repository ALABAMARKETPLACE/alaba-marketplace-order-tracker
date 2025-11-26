// src/lib/hooks/use-payment.ts
'use client'

import { useMutation } from '@tanstack/react-query'
import { paystackApi } from '@/lib/api/endpoints/paystack'
import { PaymentInitializeData } from '@/types'

export function useInitializePayment() {
  return useMutation({
    mutationFn: (data: PaymentInitializeData) => paystackApi.initialize(data),
  })
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (reference: string) => paystackApi.verify(reference),
  })
}
