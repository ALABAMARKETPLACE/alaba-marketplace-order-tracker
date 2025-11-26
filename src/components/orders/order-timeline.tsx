'use client'

import { CheckCircle, Circle, Clock, Package, Truck, Home } from 'lucide-react'
import { TrackingRecord } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface OrderTimelineProps {
  tracking: TrackingRecord[]
  currentStatus: string
}

// Map backend order.status values to human-friendly timeline steps
// We'll still show the detailed 6-step journey, but also expose a high-level
// phase label (In progress, In transit, Completed) derived from order.status.
const STATUS_FALLBACK_MAP: Record<string, string> = {
  pending: 'Order placed',
  payment_confirmed: 'Order placed',
  processing: 'Order placed',
  in_transit: 'In transit',
  assigned: 'Package picked up',
  picked_up: 'Package picked up',
  out_for_delivery: 'Out for delivery',
  package_received: 'Package received',
  delivered: 'Delivered',
}

const STATUS_ICONS: Record<string, any> = {
  'Order placed': Package,
  'Package picked up': Truck,
  'In transit': Truck,
  'Out for delivery': Truck,
  'Package received': Home,
  'Delivered': CheckCircle,
}

const STATUS_STEPS = [
  'Order placed',
  'Package picked up',
  'In transit',
  'Out for delivery',
  'Package received',
  'Delivered',
]

// High-level phase label for UX: In progress / In transit / Completed
const PHASE_MAP: Record<string, 'In progress' | 'In transit' | 'Completed'> = {
  pending: 'In progress',
  payment_confirmed: 'In progress',

  assigned: 'In transit',
  package_received: 'In transit',
  picked_up: 'In transit',
  out_for_delivery: 'In transit',

  delivered: 'Completed',
  failed: 'Completed',
  cancelled: 'Completed',
}

function getPhaseLabel(status: string): 'In progress' | 'In transit' | 'Completed' {
  const key = status?.toLowerCase?.() || ''
  return PHASE_MAP[key] || 'In progress'
}

export function OrderTimeline({ tracking, currentStatus }: OrderTimelineProps) {
  const getCurrentStepIndex = () => {
    // Prefer explicit tracking records when available
    if (tracking.length > 0) {
      const lastTrackingStatus = tracking[tracking.length - 1]?.status || ''
      const idxFromTracking = STATUS_STEPS.findIndex(step =>
        lastTrackingStatus.toLowerCase().includes(step.toLowerCase()),
      )
      if (idxFromTracking !== -1) return idxFromTracking
    }

    // Fallback: derive step from backend order.status when no tracking exists
    const normalized = currentStatus?.toLowerCase?.() || ''
    const mappedStep = STATUS_FALLBACK_MAP[normalized]
    if (!mappedStep) return 0 // default to first step

    const idxFromStatus = STATUS_STEPS.findIndex(
      (step) => step.toLowerCase() === mappedStep.toLowerCase(),
    )
    return idxFromStatus === -1 ? 0 : idxFromStatus
  }

  const currentStepIndex = getCurrentStepIndex()
  const phaseLabel = getPhaseLabel(currentStatus)

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="relative">
        <div className="absolute left-6 top-6 h-full w-0.5 bg-border" />
        
        <div className="space-y-6">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex
            const isCurrent = index === currentStepIndex
            const Icon = STATUS_ICONS[step] || Circle
            const trackingRecord = tracking.find(t => 
              t.status.toLowerCase().includes(step.toLowerCase())
            )

            return (
              <div key={step} className="relative flex items-start gap-4">
                <div
                  className={cn(
                    'relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2',
                    isCompleted
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between">
                    <h3
                      className={cn(
                        'font-semibold',
                        isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {step}
                    </h3>
                    {isCurrent && !trackingRecord && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {phaseLabel}
                      </span>
                    )}
                  </div>
                  
                  {trackingRecord && (
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(trackingRecord.createdAt)}
                      </p>
                      {trackingRecord.location && (
                        <p className="text-sm text-muted-foreground">
                          📍 {trackingRecord.location}
                        </p>
                      )}
                      {trackingRecord.notes && (
                        <p className="text-sm">{trackingRecord.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Tracking Records */}
      {tracking.length > 0 && (
        <div className="rounded-lg border p-4">
          <h4 className="mb-4 font-semibold">Detailed Tracking History</h4>
          <div className="space-y-3">
            {tracking.map((record) => (
              <div key={record.id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{record.status}</p>
                  {record.location && (
                    <p className="text-muted-foreground">📍 {record.location}</p>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {new Date(record.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}