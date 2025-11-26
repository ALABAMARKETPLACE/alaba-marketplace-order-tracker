// 'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { Header } from '@/components/layout/hearder'
// import { Footer } from '@/components/layout/footer'
// import { useAuth } from '@/lib/hooks/use-auth'

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const { isAuthenticated, loading } = useAuth()
//   const router = useRouter()

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       router.push('/login')
//     }
//   }, [isAuthenticated, loading, router])

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//       </div>
//     )
//   }

//   if (!isAuthenticated) {
//     return null
//   }

//   return (
//     <div className="flex min-h-screen flex-col">
//       <Header />
//       <main className="flex-1">{children}</main>
//       <Footer />
//     </div>
//   )
// }

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { useAuth } from '@/lib/hooks/use-auth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
