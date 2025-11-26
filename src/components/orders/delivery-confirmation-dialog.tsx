'use client'

import { useState } from 'react'
import { CheckCircle, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dailog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/lable'
import { useToast } from '@/lib/hooks/use-toast'
import { useConfirmDelivery } from '@/lib/hooks/use-orders'

interface DeliveryConfirmationDialogProps {
  orderId: string
  deliveryCode: string
  onSuccess?: () => void
}

export function DeliveryConfirmationDialog({
  orderId,
  deliveryCode,
  onSuccess,
}: DeliveryConfirmationDialogProps) {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const { toast } = useToast()
  const confirmDelivery = useConfirmDelivery()

  const handleConfirm = async () => {
    if (!code) {
      setError('Please enter the delivery code')
      return
    }

    if (code !== deliveryCode) {
      setError('Invalid delivery code. Please check and try again.')
      return
    }

    try {
      await confirmDelivery.mutateAsync({ orderId, code })

      toast({
        title: 'Delivery Confirmed',
        description: 'Your order has been marked as delivered successfully.',
      })

      setOpen(false)
      setCode('')
      setError('')
      onSuccess?.()
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } }
        message?: string
      }

      toast({
        title: 'Error',
        description:
          err.response?.data?.message || err.message || 'Failed to confirm delivery',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          <CheckCircle className="mr-2 h-5 w-5" />
          Confirm Delivery
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Confirm Package Delivery</DialogTitle>
          <DialogDescription className="text-center">
            Enter the 4-digit delivery code provided by the driver to confirm you&apos;ve
            received your package.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="delivery-code">Delivery Code</Label>
            <Input
              id="delivery-code"
              placeholder="Enter 4-digit code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError('')
              }}
              maxLength={4}
              className={error ? 'border-destructive' : ''}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          
          <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> Only confirm delivery after you have received
                your package and verified its contents. The delivery code is shown on the
                driver&apos;s device.
              </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false)
              setCode('')
              setError('')
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={confirmDelivery.isPending}
          >
            {confirmDelivery.isPending ? 'Confirming...' : 'Confirm Delivery'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
