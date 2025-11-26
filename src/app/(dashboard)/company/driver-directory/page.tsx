'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User as UserIcon, Mail, Users } from 'lucide-react'

import { useAuth } from '@/lib/hooks/use-auth'
import { useDeliveryCompanyDrivers } from '@/lib/hooks/use-delivery-company'
import { useDriverDirectory, useSendDriverInvite } from '@/lib/hooks/use-drivers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/lib/hooks/use-toast'

export default function CompanyDriverDirectoryPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'company')) {
      router.replace('/dashboard')
    }
  }, [authLoading, user, router])

  const { data: driversData } = useDeliveryCompanyDrivers()
  const { data: directoryData, isLoading, isError, refetch } = useDriverDirectory()
  const sendInvite = useSendDriverInvite()

  type CompanyDriver = {
    id: string
    userId: string | null
  }

  type DirectoryDriverUser = {
    id: string
    firstName?: string | null
    lastName?: string | null
    email?: string | null
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user || user.role !== 'company') return null

  const rawCompanyDrivers =
    (driversData as { data?: CompanyDriver[] } | CompanyDriver[] | undefined) ?? []
  const companyDrivers: CompanyDriver[] = Array.isArray((rawCompanyDrivers as any).data)
    ? (rawCompanyDrivers as { data: CompanyDriver[] }).data
    : (rawCompanyDrivers as CompanyDriver[])

  const acceptedUserIds = new Set(
    companyDrivers
      .map((d) => d.userId)
      .filter((id): id is string => typeof id === 'string' && id.length > 0),
  )

  const rawDirectory =
    (directoryData as { data?: DirectoryDriverUser[] } | DirectoryDriverUser[] | undefined) ?? []
  const allDirectoryUsers: DirectoryDriverUser[] = Array.isArray((rawDirectory as any).data)
    ? (rawDirectory as { data: DirectoryDriverUser[] }).data
    : (rawDirectory as DirectoryDriverUser[])

  const directoryUsers = allDirectoryUsers.filter((user) => !acceptedUserIds.has(user.id))

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Driver Directory
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse all drivers on the platform and invite them to join your company. Accepted drivers
            will move to your Company Drivers page.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading driver directory...</p>}

      {isError && <p className="text-sm text-destructive">Failed to load driver directory.</p>}

      {!isLoading && !isError && directoryUsers.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No drivers available to invite right now. Drivers who already joined your company appear on the
          Company Drivers page.
        </p>
      )}

      {directoryUsers.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mt-4">
          {directoryUsers.map((user) => (
            <Card key={user.id} className="flex flex-col justify-between">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    {user.firstName} {user.lastName}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="h-3 w-3" />
                  <span>{user.email}</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={sendInvite.isPending}
                    onClick={async () => {
                      try {
                        await sendInvite.mutateAsync({ driverUserId: user.id })
                        toast({
                          title: 'Invite sent',
                          description: 'The driver has been invited to join your company.',
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
                          'Failed to send invite.'
                        toast({ title: 'Error', description: message, variant: 'destructive' })
                      }
                    }}
                  >
                    Invite Driver
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}