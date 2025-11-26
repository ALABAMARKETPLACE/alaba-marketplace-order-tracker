'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrder, useOrderTracking } from '@/lib/hooks/use-orders'
import { OrderStatusBadge } from '@/components/orders/order-status-badge'
import { OrderTimeline } from '@/components/orders/order-timeline'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function TrackPage() {
  const [query, setQuery] = useState('')
  const [submittedId, setSubmittedId] = useState('')
  const [error, setError] = useState('')

  const {
    data: orderData,
    isLoading: orderLoading,
  } = useOrder(submittedId || '')

  const {
    data: trackingData,
    isLoading: trackingLoading,
  } = useOrderTracking(submittedId || '')

  const order = orderData?.data
  const tracking = trackingData?.data || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      setError('Please enter an order ID to track.')
      setSubmittedId('')
      return
    }
    setError('')
    setSubmittedId(query.trim())
  }

  const isLoading = (submittedId && (orderLoading || trackingLoading)) || false

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Track Your Order</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your order ID to see the latest delivery status and timeline.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tracking Lookup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter order ID (e.g. 1, 2, or full UUID)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={!query.trim() || isLoading}>
                {isLoading ? 'Searching...' : 'Track Order'}
              </Button>
            </form>
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          </CardContent>
        </Card>

        {submittedId && (
          <div className="space-y-6">
            {isLoading && (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            )}

            {!isLoading && !order && (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No order found for ID <span className="font-mono">{submittedId}</span>.
                  <br />
                  Please check the ID and try again.
                </CardContent>
              </Card>
            )}

            {!isLoading && order && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Amount</span>
                      <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tracking Reference</span>
                      <span className="font-mono text-xs break-all">
                        {order.paymentReference || 'Not available'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tracking.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No tracking updates available yet for this order.
                      </p>
                    ) : (
                      <OrderTimeline tracking={tracking} currentStatus={order.status} />
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
