// // src/app/(dashboard)/cart/page.tsx
// 'use client'

// import { useRouter } from 'next/navigation'
// import Image from 'next/image'
// import { Trash2, ShoppingBag } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
// import { Separator } from '@/components/ui/separator'
// import { useCart } from '@/components/providers/cart-provider'
// import { formatCurrency } from '@/lib/utils'

// export default function CartPage() {
//   const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()
//   const router = useRouter()

//   if (items.length === 0) {
//     return (
//       <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20">
//         <ShoppingBag className="h-24 w-24 text-muted-foreground" />
//         <h2 className="mt-6 text-2xl font-semibold">Your cart is empty</h2>
//         <p className="mt-2 text-muted-foreground">
//           Add some products to get started
//         </p>
//         <Button className="mt-8" onClick={() => router.push('/products')}>
//           Browse Products
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div className="container py-8">
//       <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

//       <div className="grid gap-8 lg:grid-cols-3">
//         <div className="lg:col-span-2 space-y-4">
//           {items.map(({ product, quantity }) => (
//             <Card key={product.id}>
//               <CardContent className="flex gap-4 p-4">
//                 <div className="relative h-24 w-24 overflow-hidden rounded-lg">
//                   <Image
//                     src={product.imageUrl}
//                     alt={product.name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
                
//                 <div className="flex flex-1 flex-col justify-between">
//                   <div>
//                     <h3 className="font-semibold">{product.name}</h3>
//                     <p className="text-sm text-muted-foreground">{product.category}</p>
//                     <p className="mt-1 font-semibold text-primary">
//                       {formatCurrency(product.price)}
//                     </p>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => updateQuantity(product.id, quantity - 1)}
//                     >
//                       -
//                     </Button>
//                     <span className="w-8 text-center">{quantity}</span>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => updateQuantity(product.id, quantity + 1)}
//                     >
//                       +
//                     </Button>
//                   </div>
//                 </div>
                
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => removeFromCart(product.id)}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         <div>
//           <Card className="sticky top-20">
//             <CardContent className="p-6">
//               <h2 className="text-lg font-semibold">Order Summary</h2>
              
//               <Separator className="my-4" />
              
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Subtotal</span>
//                   <span>{formatCurrency(getTotal())}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Shipping</span>
//                   <span>Calculated at checkout</span>
//                 </div>
//               </div>
              
//               <Separator className="my-4" />
              
//               <div className="flex justify-between text-lg font-semibold">
//                 <span>Total</span>
//                 <span className="text-primary">{formatCurrency(getTotal())}</span>
//               </div>
              
//               <Button
//                 className="mt-6 w-full"
//                 size="lg"
//                 onClick={() => router.push('/checkout')}
//               >
//                 Proceed to Checkout
//               </Button>
              
//               <Button
//                 variant="ghost"
//                 className="mt-2 w-full"
//                 onClick={() => router.push('/products')}
//               >
//                 Continue Shopping
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/lable'
import { useCart } from '@/lib/hooks/use-cart'
import { useCreateOrder } from '@/lib/hooks/use-orders'
import { useAuth } from '@/lib/hooks/use-auth'
import { useToast } from '@/lib/hooks/use-toast'
import type { ApiResponse, Order } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { DEFAULT_PRODUCT_IMAGE_URL } from '@/lib/constants'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()
  const router = useRouter()
  const createOrder = useCreateOrder()
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryCity, setDeliveryCity] = useState('')
  const [deliveryState, setDeliveryState] = useState('')
  const [phone, setPhone] = useState('')
  const [addressError, setAddressError] = useState('')

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <ShoppingBag className="h-24 w-24 text-muted-foreground" />
        <h2 className="mt-6 text-2xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">
          Add some products to get started
        </p>
        <Button className="mt-8" onClick={() => router.push('/products')}>
          Browse Products
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">{items.length} items in your cart</p>
        </div>
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ product, quantity }) => (
            <Card key={product.id}>
              <CardContent className="flex gap-4 p-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                  <Image
                    src={product.imageUrl || DEFAULT_PRODUCT_IMAGE_URL}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.category}
                    </p>
                    <p className="mt-1 font-semibold text-primary">
                      {formatCurrency(product.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <p className="text-lg font-bold">
                    {formatCurrency(product.price * quantity)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              <Separator className="my-4" />

              {/* Delivery address form */}
              <div className="mt-2 space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="deliveryAddress">Delivery address</Label>
                  <Input
                    id="deliveryAddress"
                    placeholder="Street, house number, landmark"
                    value={deliveryAddress}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value)
                      setAddressError('')
                    }}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="deliveryCity">City</Label>
                    <Input
                      id="deliveryCity"
                      placeholder="e.g. Ikeja"
                      value={deliveryCity}
                      onChange={(e) => {
                        setDeliveryCity(e.target.value)
                        setAddressError('')
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="deliveryState">State</Label>
                    <Input
                      id="deliveryState"
                      placeholder="e.g. Lagos"
                      value={deliveryState}
                      onChange={(e) => {
                        setDeliveryState(e.target.value)
                        setAddressError('')
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone number (for delivery)</Label>
                  <Input
                    id="phone"
                    placeholder="+234 XXX XXX XXXX"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      setAddressError('')
                    }}
                  />
                </div>
                {addressError && (
                  <p className="text-sm text-destructive">{addressError}</p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(getTotal())}</span>
              </div>

              <Button
                className="mt-6 w-full"
                size="lg"
                disabled={loading}
                onClick={async () => {
                  if (!user) {
                    toast({
                      title: 'Login required',
                      description: 'Please log in before placing an order.',
                      variant: 'destructive',
                    })
                    router.push('/login')
                    return
                  }

                  if (items.length === 0) {
                    router.push('/products')
                    return
                  }

                  const firstItem = items[0]
                  if (!firstItem) return

                  // Basic validation for address fields
                  if (!deliveryAddress || deliveryAddress.trim().length < 10) {
                    setAddressError('Please enter a full delivery address (at least 10 characters).')
                    return
                  }
                  if (!deliveryCity.trim() || !deliveryState.trim()) {
                    setAddressError('Please enter both city and state for delivery.')
                    return
                  }

                  try {
                    setLoading(true)

                    const orderData = {
                      productId: firstItem.product.id,
                      quantity: firstItem.quantity,
                      deliveryAddress: deliveryAddress.trim(),
                      deliveryCity: deliveryCity.trim(),
                      deliveryState: deliveryState.trim(),
                    }

                    const createdOrderResponse = await createOrder.mutateAsync(orderData)
                    const order = (createdOrderResponse as ApiResponse<Order>).data

                    if (!order) {
                      throw new Error('Order creation failed')
                    }

                    // Clear cart and go directly to the order details page
                    clearCart()
                    router.push(`/orders/${order.id}`)
                  } catch (error) {
                    console.error('Cart checkout error:', error)
                    toast({
                      title: 'Order error',
                      description: 'We could not create your order. Please try again.',
                      variant: 'destructive',
                    })
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                {loading ? 'Creating order...' : 'Proceed to Checkout'}
              </Button>

              <Button
                variant="ghost"
                className="mt-2 w-full"
                onClick={() => router.push('/products')}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}