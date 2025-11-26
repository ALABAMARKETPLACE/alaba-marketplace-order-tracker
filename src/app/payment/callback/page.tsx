'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, Package, Barcode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useVerifyPayment } from '@/lib/hooks/use-payment'
import type { Order, ApiResponse, PaymentVerificationResponse } from '@/types'

export default function PaymentCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [order, setOrder] = useState<Order | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const verifyPayment = useVerifyPayment()
  
  // Paystack may return both `reference` and `trxref`; prefer `reference` but fall back to `trxref`
  const reference = searchParams.get('reference') ?? searchParams.get('trxref')

  useEffect(() => {
    if (!reference) {
      setStatus('failed')
      return
    }

    const runVerification = async () => {
      try {
        const response = await verifyPayment.mutateAsync(reference)
        const { success, data } = response as ApiResponse<PaymentVerificationResponse>

        if (!success || data.status !== 'success') {
          setStatus('failed')
          return
        }

        setOrder(data.order ?? null)
        setStatus('success')
      } catch (error) {
        console.error('Payment verification failed:', error)
        setStatus('failed')
      }
    }

    runVerification()
  }, [reference, verifyPayment])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg font-semibold">Verifying Payment...</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please wait while we confirm your payment
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    const ownershipCode = order?.packageBarcode
    const trackingRef = order?.paymentReference ?? reference ?? undefined

    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-center">Payment Successful!</CardTitle>
            <CardDescription className="text-center">
              Your order has been confirmed and is being processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Payment Reference
              </p>
              <p className="mt-1 font-mono text-sm break-all">{reference}</p>
            </div>

            {ownershipCode && (
              <div className="rounded-lg bg-muted p-3">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <Package className="h-3 w-3" /> Ownership Code (Package Barcode)
                </p>
                <p className="mt-1 font-mono text-base font-semibold">{ownershipCode}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Keep this code safe. It proves ownership of your package.
                </p>
              </div>
            )}

            {trackingRef && (
              <div className="rounded-lg bg-muted p-3">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <Barcode className="h-3 w-3" /> Tracking Reference
                </p>
                <p className="mt-1 font-mono text-sm break-all">{trackingRef}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Use this reference to track your order status.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="w-full flex-1"
              onClick={() => router.push('/products')}
            >
              Continue Shopping
            </Button>
            <Button
              className="w-full flex-1"
              onClick={() =>
                order ? router.push(`/orders/${order.id}`) : router.push('/orders')
              }
            >
              View Order Details
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-center">Payment Failed</CardTitle>
          <CardDescription className="text-center">
        {`    We couldn't process your payment. Please try again.`}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push('/cart')}
          >
            Back to Cart
          </Button>
          <Button
            className="flex-1"
            onClick={() => router.push('/checkout')}
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}