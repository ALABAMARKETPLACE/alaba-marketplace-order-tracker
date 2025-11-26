'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/lable'
import { useToast } from '@/lib/hooks/use-toast'
import { apiClient } from '@/lib/api/client'
import { useAuth } from '@/lib/hooks/use-auth'
import type { ApiResponse, Order } from '@/types'

export default function DriverConfirmDeliveryPage() {
  const [orderId, setOrderId] = useState('')
  const [code, setCode] = useState('')
  const [photoNote, setPhotoNote] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'driver')) {
      router.replace('/dashboard')
    }
  }, [authLoading, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderId.trim() || !code.trim()) {
      toast({
        title: 'Missing data',
        description: 'Please enter both Order ID and delivery code.',
        variant: 'destructive',
      })
      return
    }

    const latNum = latitude ? Number(latitude) : 0
    const lngNum = longitude ? Number(longitude) : 0

    try {
      setLoading(true)

      let deliveryPhoto = photoNote.trim() || 'Delivered (no photo provided)'

      // If a file is selected, upload it first and use its URL
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('entityType', 'order')
        formData.append('entityId', orderId.trim())

        const uploadResp = await apiClient.uploadFile<any>(
          '/api/v1/uploads/file',
          formData,
        )

        const uploadedUrl = uploadResp?.data?.url || uploadResp?.data?.fileUrl
        if (uploadedUrl) {
          deliveryPhoto = uploadedUrl
        }
      }

      const response = await apiClient.post<ApiResponse<Order>>(
        `/api/v1/orders/${orderId.trim()}/confirm-delivery`,
        {
          deliveryCode: code.trim(),
          deliveryPhoto,
          geolocation: {
            latitude: latNum,
            longitude: lngNum,
          },
        },
      )

      toast({
        title: 'Delivery confirmed',
        description: `Order ${response.data.id.slice(0, 8).toUpperCase()} marked as DELIVERED.`,
      })

      router.push(`/orders/${response.data.id}`)
    } catch (error: any) {
      console.error('Driver confirm delivery error:', error?.response || error)
      toast({
        title: 'Error',
        description:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Failed to confirm delivery.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user || user.role !== 'driver') {
    // Redirect is handled in useEffect; avoid flashing unauthorized UI
    return null
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Driver – Confirm Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="order-id">Order ID</Label>
                <Input
                  id="order-id"
                  placeholder="Paste order ID here"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="code">Delivery Code</Label>
                <Input
                  id="code"
                  placeholder="Enter 4-digit delivery code"
                  maxLength={10}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="photo-file">Delivery photo (optional)</Label>
                <Input
                  id="photo-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null
                    setFile(f)
                  }}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="photo-note">Photo note (optional)</Label>
                <Input
                  id="photo-note"
                  placeholder="Short note about the delivery"
                  value={photoNote}
                  onChange={(e) => setPhotoNote(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="lat">Latitude (optional)</Label>
                  <Input
                    id="lat"
                    placeholder="e.g. 6.5244"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor="lng">Longitude (optional)</Label>
                  <Input
                    id="lng"
                    placeholder="e.g. 3.3792"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Confirming...' : 'Confirm Delivery'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}