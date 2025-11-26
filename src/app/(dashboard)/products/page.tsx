// 'use client'

// import { useState } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { Search, Filter } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { useProducts } from '@/lib/hooks/use-products'
// import { useCart } from '@/components/providers/cart-provider'
// import { formatCurrency } from '@/lib/utils'
// import { CATEGORIES } from '@/lib/constants'
// import { useToast } from '@/lib/hooks/use-toast'

// export default function ProductsPage() {
//   const [search, setSearch] = useState('')
//   const [category, setCategory] = useState<string>('')
//   const { data, isLoading } = useProducts({ search, category })
//   const { addToCart } = useCart()
//   const { toast } = useToast()

//   const products = data?.data?.items || []

//   const handleAddToCart = (product: any) => {
//     addToCart(product)
//     toast({
//       title: 'Added to cart',
//       description: `${product.name} has been added to your cart`,
//     })
//   }

//   return (
//     <div className="container py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Products</h1>
//         <p className="text-muted-foreground">
//           Browse our collection of products from Alaba Market
//         </p>
//       </div>

//       {/* Filters */}
//       <div className="mb-8 flex flex-col gap-4 md:flex-row">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search products..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         <Select value={category} onValueChange={setCategory}>
//           <SelectTrigger className="w-full md:w-[200px]">
//             <SelectValue placeholder="All Categories" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="">All Categories</SelectItem>
//             {CATEGORIES.map((cat) => (
//               <SelectItem key={cat} value={cat}>
//                 {cat}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Products Grid */}
//       {isLoading ? (
//         <div className="flex items-center justify-center py-20">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//         </div>
//       ) : products.length === 0 ? (
//         <div className="py-20 text-center">
//           <p className="text-muted-foreground">No products found</p>
//         </div>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {products.map((product: any) => (
//             <Card key={product.id} className="overflow-hidden">
//               <Link href={`/products/${product.id}`}>
//                 <div className="relative aspect-square overflow-hidden">
//                   <Image
//                     src={product.imageUrl}
//                     alt={product.name}
//                     fill
//                     className="object-cover transition-transform hover:scale-105"
//                   />
//                 </div>
//               </Link>
//               <CardHeader>
//                 <CardTitle className="line-clamp-1">{product.name}</CardTitle>
//                 <p className="text-sm text-muted-foreground">{product.category}</p>
//               </CardHeader>
//               <CardContent>
//                 <p className="line-clamp-2 text-sm text-muted-foreground">
//                   {product.description}
//                 </p>
//                 <p className="mt-2 text-2xl font-bold text-primary">
//                   {formatCurrency(product.price)}
//                 </p>
//               </CardContent>
//               <CardFooter>
//                 <Button
//                   className="w-full"
//                   onClick={() => handleAddToCart(product)}
//                   disabled={product.stock === 0}
//                 >
//                   {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProducts } from '@/lib/hooks/use-products'
import { useCart } from '@/lib/hooks/use-cart'
import { formatCurrency } from '@/lib/utils'
import { CATEGORIES, DEFAULT_PRODUCT_IMAGE_URL } from '@/lib/constants'
import { useToast } from '@/lib/hooks/use-toast'
import { Product } from '@/types'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('')
  const { data, isLoading } = useProducts({ search, category })
  const { addToCart, hasItem } = useCart()
  const { toast } = useToast()

  const products = data?.data?.items || []

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">
          Browse our collection of products from Alaba Market
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product: Product) => {
            const inCart = hasItem ? hasItem(product.id) : false
            
            return (
              <Card key={product.id} className="overflow-hidden">
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.imageUrl || DEFAULT_PRODUCT_IMAGE_URL}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <span className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {inCart && (
                      <div className="absolute right-2 top-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        In Cart
                      </div>
                    )}
                  </div>
                </Link>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(product.price)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    variant={inCart ? 'secondary' : 'default'}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock === 0
                      ? 'Out of Stock'
                      : inCart
                      ? 'Add More'
                      : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
