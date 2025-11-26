import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'

interface CartSummaryProps {
  total: number
  itemCount: number
  onCheckout: () => void
  onContinueShopping: () => void
}

export function CartSummary({
  total,
  itemCount,
  onCheckout,
  onContinueShopping,
}: CartSummaryProps) {
  return (
    <Card className="sticky top-20">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items</span>
            <span>{itemCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>Calculated at checkout</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>

        <Button className="mt-6 w-full" size="lg" onClick={onCheckout}>
          Proceed to Checkout
        </Button>

        <Button
          variant="ghost"
          className="mt-2 w-full"
          onClick={onContinueShopping}
        >
          Continue Shopping
        </Button>
      </CardContent>
    </Card>
  )
}