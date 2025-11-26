// 'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/lib/hooks/use-auth'

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const { isAuthenticated, loading } = useAuth()
//   const router = useRouter()

//   useEffect(() => {
//     if (!loading && isAuthenticated) {
//       router.push('/dashboard')
//     }
//   }, [isAuthenticated, loading, router])

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//       </div>
//     )
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background">
//       {children}
//     </div>
//   )
// }


// Simplified auth layout: do not gate or redirect here to avoid login loops.
// The login/register pages themselves will handle navigation after success.
'use client'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      {children}
    </div>
  )
}
