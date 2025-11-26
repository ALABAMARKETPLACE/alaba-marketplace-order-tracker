'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Truck, MapPin, User as UserIcon, Clock } from 'lucide-react'

import { useAuth } from '@/lib/hooks/use-auth'
import { useDeliveryCompanyMarketplaceOrders, useAcceptDeliveryCompanyOrder } from '@/lib/hooks/use-delivery-company'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/lib/hooks/use-toast'
import { formatDate } from '@/lib/utils'

export default function CompanyMarketplaceOrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'company')) {
      router.replace('/dashboard')
    }
  }, [authLoading, user, router])

  const { data, isLoading, isError, refetch } = useDeliveryCompanyMarketplaceOrders({ status: 'pending' })
  const acceptOrder = useAcceptDeliveryCompanyOrder()

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

  const orders = data?.data ?? data ?? []

  const handleAccept = async (orderId: string) => {
    try {
      await acceptOrder.mutateAsync(orderId)
      toast({
        title: 'Order accepted',
        description: 'This order is now assigned to your company.',
      })
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to accept order.'
      toast({ title: 'Error', description: message, variant: 'destructive' })
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Marketplace Orders
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse unassigned buyer orders and accept the ones your company will deliver.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading unassigned orders...</p>
      )}

      {isError && (
        <p className="text-sm text-destructive">Failed to load marketplace orders.</p>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <p className="text-sm text-muted-foreground">
          There are currently no unassigned orders. Check back later.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mt-4">
        {orders.map((order: any) => (
          <Card key={order.id} className="flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span>Order #{order.id.slice(0, 8).toUpperCase()}</span>
                <Badge variant="outline" className="uppercase text-xs">
                  {order.status?.toString().replace('_', ' ')}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Created {formatDate(order.createdAt)}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <UserIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Buyer</p>
                  <p className="text-xs text-muted-foreground">
                    {order.buyer?.firstName} {order.buyer?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground break-all">
                    {order.buyer?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Destination</p>
                  <p className="text-xs text-muted-foreground break-words">
                    {order.deliveryAddress}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.deliveryCity}, {order.deliveryState}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  View order
                </Button>
                <Button
                  size="sm"
                  disabled={acceptOrder.isPending}
                  onClick={() => handleAccept(order.id)}
                >
                  Accept
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
