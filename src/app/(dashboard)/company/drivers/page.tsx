'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User as UserIcon, Phone, Mail, Truck, MapPin, Activity } from 'lucide-react'

import { useAuth } from '@/lib/hooks/use-auth'
import { useDeliveryCompanyDrivers } from '@/lib/hooks/use-delivery-company'
import { useAssignDriverToOrder } from '@/lib/hooks/use-drivers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/lib/hooks/use-toast'

export default function CompanyDriversPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [orderIdForAssign, setOrderIdForAssign] = useState('')

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'company')) {
      router.replace('/dashboard')
    }
  }, [authLoading, user, router])

  const { data, isLoading, isError, refetch } = useDeliveryCompanyDrivers()
  const assignDriver = useAssignDriverToOrder()

  type CompanyDriver = {
    id: string
    name: string
    phone: string | null
    email?: string | null
    vehicleNumber?: string | null
    currentLocation?: string | null
    isAvailable: boolean
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user || user.role !== 'company') return null

  const rawDrivers = (data as { data?: CompanyDriver[] } | CompanyDriver[] | undefined) ?? []
  const drivers: CompanyDriver[] = Array.isArray((rawDrivers as any).data)
    ? (rawDrivers as { data: CompanyDriver[] }).data
    : (rawDrivers as CompanyDriver[])

  const handleAssign = async (driverId: string) => {
    if (!orderIdForAssign.trim()) {
      toast({
        title: 'Order ID required',
        description: 'Enter an Order ID to assign a driver.',
        variant: 'destructive',
      })
      return
    }

    try {
      await assignDriver.mutateAsync({ driverId, orderId: orderIdForAssign.trim() })
      toast({
        title: 'Driver assigned',
        description: 'Driver has been assigned to the order.',
      })
      setOrderIdForAssign('')
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } }
        message?: string
      }
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to assign driver.'
      toast({ title: 'Error', description: message, variant: 'destructive' })
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Company Drivers
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-500" />
            Manage your drivers and assign them to orders.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
        <div className="flex-1">
          <label className="text-xs font-medium" htmlFor="assign-order-id">
            Order ID to assign
          </label>
          <Input
            id="assign-order-id"
            placeholder="Paste Order ID here"
            value={orderIdForAssign}
            onChange={(e) => setOrderIdForAssign(e.target.value)}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Select a driver below to assign them to this order.
          </p>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading drivers...</p>}

      {isError && <p className="text-sm text-destructive">Failed to load drivers.</p>}

      {!isLoading && !isError && drivers.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You have no drivers yet. Invite drivers from the directory below to join your company.
        </p>
      )}

      {/* My Company Drivers */}
      {drivers.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">My Drivers</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {drivers.map((driver) => (
              <Card key={driver.id} className="flex flex-col justify-between">
                <CardHeader className="space-y-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      {driver.name}
                    </span>
                    <Badge
                      variant={driver.isAvailable ? 'default' : 'outline'}
                      className={driver.isAvailable ? 'bg-green-500 text-white' : ''}
                    >
                      {driver.isAvailable ? 'Available' : 'Busy'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="h-3 w-3" />
                    <span>{driver.phone}</span>
                  </div>
                  {driver.email && (
                    <div className="flex items-center gap-2 text-xs">
                      <Mail className="h-3 w-3" />
                      <span>{driver.email}</span>
                    </div>
                  )}
                  {driver.vehicleNumber && (
                    <div className="flex items-center gap-2 text-xs">
                      <Truck className="h-3 w-3" />
                      <span>{driver.vehicleNumber}</span>
                    </div>
                  )}
                  {driver.currentLocation && (
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="h-3 w-3" />
                      <span>{driver.currentLocation}</span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={assignDriver.isPending || !orderIdForAssign.trim()}
                      onClick={() => handleAssign(driver.id)}
                    >
                      Assign to Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
)}
   
