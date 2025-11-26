'use client'

import { use } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useProduct } from '@/lib/hooks/use-products'
import { useCart } from '@/components/providers/cart-provider'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'
import { DEFAULT_PRODUCT_IMAGE_URL } from '@/lib/constants'

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [quantity, setQuantity] = useState(1)
  const { data, isLoading } = useProduct(id)
  const { addToCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  const product = data?.data

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      toast({
        title: 'Added to cart',
        description: `${quantity}x ${product.name} added to your cart`,
      })
      router.push('/cart')
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={product.imageUrl || DEFAULT_PRODUCT_IMAGE_URL}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-muted-foreground">{product.category}</p>
          
          <Separator className="my-4" />
          
          <p className="text-4xl font-bold text-primary">
            {formatCurrency(product.price)}
          </p>
          
          <p className="mt-4 text-muted-foreground">{product.description}</p>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Availability</p>
              <p className="text-sm text-muted-foreground">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            </div>
            
            <div>
              <p className="mb-2 text-sm font-medium">Quantity</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Button
            size="lg"
            className="mt-8 w-full"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  )
}