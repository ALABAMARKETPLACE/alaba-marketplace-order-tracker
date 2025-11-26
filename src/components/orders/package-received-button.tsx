'use client'

import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/lib/hooks/use-toast'
import { useConfirmPackageReceived } from '@/lib/hooks/use-orders'

interface PackageReceivedButtonProps {
  orderId: string
  onSuccess?: () => void
}

export function PackageReceivedButton({
  orderId,
  onSuccess,
}: PackageReceivedButtonProps) {
  const { toast } = useToast()
  const confirmPackageReceived = useConfirmPackageReceived()

  const handleConfirm = async () => {
    try {
      await confirmPackageReceived.mutateAsync(orderId)

      toast({
        title: 'Package Received',
        description: 'You have confirmed receipt of your package.',
      })

      onSuccess?.()
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } }
        message?: string
      }

      toast({
        title: 'Error',
        description:
          err.response?.data?.message || err.message || 'Failed to confirm package receipt',
        variant: 'destructive',
      })
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleConfirm}
      disabled={confirmPackageReceived.isPending}
    >
      <Package className="mr-2 h-4 w-4" />
      {confirmPackageReceived.isPending ? 'Confirming...' : 'Confirm Package Received'}
    </Button>
  )
}
