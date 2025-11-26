'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, MapPin, Package, ImageIcon, User as UserIcon, Truck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { useOrder, useOrderTracking } from '@/lib/hooks/use-orders'
import { useUploadsByEntity, useUploadFiles } from '@/lib/hooks/use-upload'
import { useInitializePayment } from '@/lib/hooks/use-payment'
import { useAuth } from '@/lib/hooks/use-auth'
import { useToast } from '@/lib/hooks/use-toast'
import { formatCurrency, formatDate } from '@/lib/utils'
import { OrderStatusBadge } from '@/components/orders/order-status-badge'
import { OrderTimeline } from '@/components/orders/order-timeline'
import { DeliveryConfirmationDialog } from '@/components/orders/delivery-confirmation-dialog'
import { PackageReceivedButton } from '@/components/orders/package-received-button'
import type { Upload } from '@/lib/api/endpoints/upload'
import type { ApiResponse, PaymentInitializeResponse } from '@/types'
import { DEFAULT_PRODUCT_IMAGE_URL } from '@/lib/constants'

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const isBuyer = user?.role === 'buyer'
  const { toast } = useToast()
  const initializePayment = useInitializePayment()
  const { data: orderData, isLoading, refetch } = useOrder(id)
  const { data: trackingData, refetch: refetchTracking } = useOrderTracking(id)

  const order = orderData?.data
  const tracking = trackingData?.data || []

  const {
    data: uploadsData,
    isLoading: uploadsLoading,
    refetch: refetchUploads,
  } = useUploadsByEntity('order', order?.id || '')

  const uploadFiles = useUploadFiles()
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [uploadError, setUploadError] = useState('')

  const paymentSchema = z.object({
    email: z.string().email('A valid email address is required'),
  })

  type PaymentForm = z.infer<typeof paymentSchema>

  const {
    register: registerPayment,
    handleSubmit: handlePaymentSubmit,
    formState: { errors: paymentErrors, isSubmitting: isSubmittingPayment },
    reset: resetPaymentForm,
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      email: user?.email ?? '',
    },
  })

  const handleSuccess = () => {
    refetch()
    refetchTracking()
    refetchUploads()
  }

  const onSubmitPayment = async (values: { email: string }) => {
    if (!order || !user) return

    try {
      const hostname = typeof window !== 'undefined' ? window.location.origin : undefined

      const response = await initializePayment.mutateAsync({
        orderId: order.id,
        amount: order.totalAmount,
        email: values.email,
        currency: 'NGN',
        callbackUrl: hostname ? `${hostname}/payment/callback` : undefined,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        userId: user.id,
        paymentType: 'order',
        metadata: { orderId: order.id },
        firstName: user.firstName,
        lastName: user.lastName,
        invoiceDescription: `Payment for Order #${order.id.slice(0, 8).toUpperCase()}`,
      })

      const { success, data } = response as ApiResponse<PaymentInitializeResponse>

      if (!success || !data?.authorization_url) {
        throw new Error('Payment initialization failed')
      }

      resetPaymentForm()

      if (typeof window !== 'undefined') {
        window.location.href = data.authorization_url
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } }
        message?: string
      }
      console.error('Payment initialization error:', err?.response || err)
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'We could not start the payment. Please try again.'

      toast({
        title: 'Payment error',
        description: backendMessage,
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Order not found</p>
      </div>
    )
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      setSelectedFiles(null)
      return
    }
    setSelectedFiles(event.target.files)
    setUploadError('')
  }

  const handleUploadImages = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setUploadError('Please select at least one image to upload.')
      return
    }

    try {
      const formData = new FormData()
      Array.from(selectedFiles).forEach((file) => {
        formData.append('files', file)
      })
      formData.append('entityType', 'order')
      formData.append('entityId', order.id)

      await uploadFiles.mutateAsync(formData)
      setSelectedFiles(null)
      setUploadError('')
      refetchUploads()
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } }
        message?: string
      }
      console.error('Failed to upload order images:', err?.response || err)
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to upload images. Please try again.'
      setUploadError(backendMessage)
    }
  }

  const canConfirmPackageReceived = order.status === 'in_transit'
  const canConfirmDelivery = order.status === 'in_transit' || tracking.some(t => 
    t.status.toLowerCase().includes('package received')
  )
  const isDelivered = order.status === 'delivered'

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-8" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                    <Image
                      src={item.product.imageUrl || DEFAULT_PRODUCT_IMAGE_URL}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                    <p className="font-semibold text-primary">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline tracking={tracking} currentStatus={order.status} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Delivery Actions - buyer only */}
          {!isDelivered && isBuyer && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {canConfirmPackageReceived && (
                  <PackageReceivedButton 
                    orderId={order.id} 
                    onSuccess={handleSuccess}
                  />
                )}
                
                {canConfirmDelivery && (
                  <DeliveryConfirmationDialog
                    orderId={order.id}
                    deliveryCode={order.deliveryCode}
                    onSuccess={handleSuccess}
                  />
                )}
                
                {!canConfirmPackageReceived && !canConfirmDelivery && (
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Delivery actions will be available when your package is in transit
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Driver Information (visible to buyer and company when assigned) */}
          {order.driver && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4" /> Assigned Driver
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <UserIcon className="mt-0.5 h-4 w-4" />
                  <div>
                    <p className="font-medium text-foreground">{order.driver.name}</p>
                    {order.driver.email && <p>{order.driver.email}</p>}
                    {order.driver.phone && <p>{order.driver.phone}</p>}
                  </div>
                </div>
                <p className="mt-2">
                  Current status: <span className="font-medium text-foreground">{order.status}</span>
                </p>
              </CardContent>
            </Card>
          )}

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{order.deliveryAddress}</p>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Codes & Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 rounded-lg bg-muted p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ownership Code (Package Barcode)</span>
                  <span className="font-mono text-xs sm:text-sm break-all">
                    {order.packageBarcode}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This code can be used to prove ownership of the package.
                </p>
              </div>

              {isBuyer && (
                <div className="space-y-2 rounded-lg bg-muted p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Confirmation Code</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-primary break-all">
                      {order.deliveryCode}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You will enter this code to confirm final delivery.
                  </p>
                </div>
              )}

              {order.paymentReference && (
                <div className="space-y-2 rounded-lg bg-muted p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tracking Reference</span>
                    <span className="font-mono text-xs sm:text-sm break-all">
                      {order.paymentReference}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share this reference with support or the delivery company to help
                    track this order.
                  </p>
                </div>
              )}

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>Included</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment section - only show if payment is not yet initialized */}
          {!order.paymentReference && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Complete Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Pay for this order securely using Paystack. Your payment reference will
                  be attached to this order and shown here once payment succeeds.
                </p>

                <form
                  onSubmit={handlePaymentSubmit(onSubmitPayment)}
                  className="space-y-3"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-medium" htmlFor="payment-email">
                      Email for receipt
                    </label>
                    <Input
                      id="payment-email"
                      type="email"
                      placeholder="you@example.com"
                      {...registerPayment('email')}
                    />
                    {paymentErrors.email && (
                      <p className="text-xs text-destructive">
                        {paymentErrors.email.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="sm"
                    disabled={isSubmittingPayment}
                  >
                    {isSubmittingPayment ? 'Redirecting to Paystack...' : 'Pay with Paystack'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Delivery Instructions (buyer only) */}
          {canConfirmDelivery && isBuyer && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base">Delivery Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>Step 1:</strong> Wait for the driver to arrive at your location.
                </p>
                <p>
                  <strong>Step 2:</strong> Verify the package contents before accepting.
                </p>
                <p>
                  <strong>Step 3:</strong> Ask the driver for the 4-digit delivery code.
                </p>
                <p>
                  <strong>Step 4:</strong> Enter the code above to confirm delivery.
                </p>
                <Separator className="my-2" />
                <p className="text-muted-foreground">
                  Keep your delivery code safe. Only enter it after you have received and checked your package.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Order Images */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ImageIcon className="h-5 w-5" /> Order Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground">
                  Upload photos of the product or receipts after payment has been
                  confirmed. These images can help with dispute resolution.
                </p>

                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  {uploadError && (
                    <p className="text-xs text-destructive">{uploadError}</p>
                  )}
                  <Button
                    type="button"
                    className="mt-1 w-full"
                    size="sm"
                    onClick={handleUploadImages}
                    disabled={uploadFiles.isPending}
                  >
                    {uploadFiles.isPending ? 'Uploading...' : 'Upload Images'}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Uploaded Images
                  </p>
                  {uploadsLoading ? (
                    <p className="text-xs text-muted-foreground">Loading images...</p>
                  ) : !uploadsData?.data?.length ? (
                    <p className="text-xs text-muted-foreground">
                      No images uploaded for this order yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {(uploadsData.data as Upload[]).map((upload) => (
                        <a
                          key={upload.id}
                          href={upload.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group block overflow-hidden rounded-md border bg-muted"
                        >
                          <Image
                            src={upload.fileUrl}
                            alt={upload.fileName}
                            width={200}
                            height={80}
                            className="h-20 w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
