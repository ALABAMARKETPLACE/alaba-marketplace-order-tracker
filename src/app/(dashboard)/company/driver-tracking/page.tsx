'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Truck, MapPin, Clock, User as UserIcon, Activity } from 'lucide-react'

import { useAuth } from '@/lib/hooks/use-auth'
import { useOrders } from '@/lib/hooks/use-orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

export default function CompanyDriverTrackingPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Only delivery companies can access this page
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'company')) {
      router.replace('/dashboard')
    }
  }, [authLoading, user, router])

  const { data, isLoading, isError, refetch } = useOrders({ status: 'out_for_delivery' })

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user || user.role !== 'company') {
    return null
  }

  const orders = data?.data?.items ?? []

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Drivers Out for Delivery
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-500" />
            Live view of orders currently out for delivery with your drivers.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading orders in transit...</p>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Failed to load orders. Please try again.
        </p>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No orders currently out for delivery for your company.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mt-4">
        {orders.map((order) => (
          <Card key={order.id} className="flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span>
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <Badge
                  variant="default"
                  className="uppercase text-xs"
                >
                  {order.status.replace('_', ' ')}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Created {formatDate(order.createdAt)}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Destination</p>
                  <p className="text-muted-foreground break-words">
                    {order.deliveryAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm">
                <UserIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Assigned Driver</p>
                  {order.driver ? (
                    <div className="text-muted-foreground text-xs space-y-0.5">
                      <p>
                        {order.driver.name}
                      </p>
                      <p>{order.driver.email}</p>
                      {order.driver.phone && <p>{order.driver.phone}</p>}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs">
                      No driver assigned yet
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-xs text-muted-foreground">
                  <p>Delivery code</p>
                  <p className="font-mono font-semibold">
                    {order.deliveryCode}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  View order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
