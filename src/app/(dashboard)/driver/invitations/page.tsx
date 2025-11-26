'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Building2, CheckCircle2 } from 'lucide-react'

import { useAuth } from '@/lib/hooks/use-auth'
import { useMyDriverInvitations, useAcceptDriverInvitation } from '@/lib/hooks/use-drivers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/lib/hooks/use-toast'

export default function DriverInvitationsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'driver')) {
      router.replace('/dashboard')
    }
  }, [authLoading, user, router])

  const { data, isLoading, isError, refetch } = useMyDriverInvitations()
  const acceptInvitation = useAcceptDriverInvitation()

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user || user.role !== 'driver') {
    return null
  }

  const invitations = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : []

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Company Invitations
          </h1>
          <p className="text-sm text-muted-foreground">
            Companies that want to work with you will appear here. Accept an invite to join their driver list.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading invitations...</p>
      )}

      {isError && (
        <p className="text-sm text-destructive">Failed to load invitations.</p>
      )}

      {!isLoading && !isError && invitations.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You have no pending invitations at the moment.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mt-4">
        {invitations.map((invite) => (
          <Card key={invite.id} className="flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4" />
                {invite.company?.companyName || 'Delivery Company'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {invite.message && <p>{invite.message}</p>}
              <p className="text-xs">Status: <strong>{invite.status}</strong></p>
              {invite.status === 'pending' && (
                <Button
                  size="sm"
                  className="mt-2"
                  disabled={acceptInvitation.isPending}
                  onClick={async () => {
                    try {
                      await acceptInvitation.mutateAsync(invite.id)
                      toast({
                        title: 'Invitation accepted',
                        description: 'You have been added as a driver for this company.',
                      })
                    } catch (error: unknown) {
                      const err = error as {
                        response?: { data?: { message?: string; error?: string } }
                        message?: string
                      }
                      const message =
                        err.response?.data?.message ||
                        err.response?.data?.error ||
                        err.message ||
                        'Failed to accept invitation.'
                      toast({ title: 'Error', description: message, variant: 'destructive' })
                    }
                  }}
                >
                  <CheckCircle2 className="mr-1 h-4 w-4" /> Accept
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}