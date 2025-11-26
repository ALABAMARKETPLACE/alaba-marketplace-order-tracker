// import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import './globals.css'

// import { QueryProvider } from '@/components/providers/query-provider'
// import { CartProvider } from '@/components/providers/cart-provider'
// import { ThemeProvider } from '@/components/providers/theme-provider'

// import { Toaster } from '@/components/ui/toaster'
// import { Toaster as Sonner } from '@/components/ui/sonner'

// import { Header } from '../components/layout/hearder'
// import { Footer } from '../components/layout/footer'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Alaba Market - Shop Electronics & More',
//   description: 'Buy and sell products from Alaba International Market',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <QueryProvider>
//             <CartProvider>

//               {/* HEADER */}
//               <Header />

//               {/* MAIN CONTENT */}
//               <main className="min-h-screen">
//                 {children}
//               </main>

//               {/* FOOTER */}
//               <Footer />

//               {/* TOASTERS */}
//               <Toaster />
//               <Sonner />

//             </CartProvider>
//           </QueryProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/providers/query-provider'
import { CartProvider } from '@/components/providers/cart-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alaba Market - Shop Electronics & More',
  description: 'Buy and sell products from Alaba International Market',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <CartProvider>
              {children}
              <Toaster />
              <Sonner />
            </CartProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}