import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CartItem as CartItemType } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <Card>
      <CardContent className="flex gap-4 p-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-lg">
          <Image
            src={item.product.imageUrl}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="font-semibold">{item.product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {item.product.category}
            </p>
            <p className="mt-1 font-semibold text-primary">
              {formatCurrency(item.product.price)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                onUpdateQuantity(item.product.id, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                onUpdateQuantity(item.product.id, item.quantity + 1)
              }
              disabled={item.quantity >= item.product.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.product.id)}
          className="self-start"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
