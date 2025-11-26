'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/lable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/components/providers/cart-provider'
import { useCreateOrder } from '@/lib/hooks/use-orders'
import { useAuth } from '@/lib/hooks/use-auth'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'
import type { ApiResponse } from '@/types'
import type { Order } from '@/types'

const checkoutSchema = z.object({
  deliveryAddress: z.string().min(10, 'Address must be at least 10 characters'),
  phone: z.string().min(10, 'Phone number is required'),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const { items, getTotal, clearCart } = useCart()
  const createOrder = useCreateOrder()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const shouldRedirectToCart = items.length === 0

  // Avoid calling router.push during render to prevent React warnings
  useEffect(() => {
    if (shouldRedirectToCart) {
      router.replace('/cart')
    }
  }, [shouldRedirectToCart, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  })

  const onSubmit = async (data: CheckoutForm) => {
    if (!user?.email) {
      toast({
        title: 'Login required',
        description: 'Please log in before checking out.',
        variant: 'destructive',
      })
      router.push('/login')
      return
    }

    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add some items to your cart before checking out.',
        variant: 'destructive',
      })
      router.push('/products')
      return
    }

    setLoading(true)
    try {
      // Backend currently supports single-product orders. Use the first cart item.
      const firstItem = items[0]
      if (!firstItem) {
        throw new Error('No items in cart')
      }

      const orderData = {
        productId: firstItem.product.id,
        quantity: firstItem.quantity,
        deliveryAddress: data.deliveryAddress,
      }

      // 1) Create order
      const createdOrderResponse = await createOrder.mutateAsync(orderData)
      const order = (createdOrderResponse as ApiResponse<Order>).data

      if (!order) {
        throw new Error('Order creation failed')
      }

      // 2) Clear cart locally now that order is created
      clearCart()

      // 3) Redirect to the order details page where payment can be completed
      router.push(`/orders/${order.id}`)
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: 'Order error',
        description: 'We could not create your order. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (shouldRedirectToCart) {
    // Redirect is handled in useEffect above
    return null
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress">Delivery Address</Label>
                  <Input
                    id="deliveryAddress"
                    placeholder="Enter your full address"
                    {...register('deliveryAddress')}
                  />
                  {errors.deliveryAddress && (
                    <p className="text-sm text-destructive">
                      {errors.deliveryAddress.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+234 XXX XXX XXXX"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span>
                      {product.name} x {quantity}
                    </span>
                    <span>{formatCurrency(product.price * quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(getTotal())}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}