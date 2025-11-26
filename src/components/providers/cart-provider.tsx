


// src/components/providers/cart-provider.tsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product, CartItem, CartContextType } from '@/types'

export const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) setItems(JSON.parse(saved))
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) localStorage.setItem('cart', JSON.stringify(items))
  }, [items, isHydrated])

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...current, { product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setItems([])

  const getTotal = () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const getItemCount = () => items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}


// 'use client'

// import React, { createContext, useState, useEffect, useCallback } from 'react'
// import { Product, CartItem, CartContextType } from '@/types'
// import { STORAGE_KEYS } from '@/lib/constants'

// export const CartContext = createContext<CartContextType | undefined>(undefined)

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [items, setItems] = useState<CartItem[]>([])
//   const [isHydrated, setIsHydrated] = useState(false)

//   // Load cart from localStorage on mount
//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem(STORAGE_KEYS.CART)
//       if (saved) {
//         const parsed = JSON.parse(saved)
//         setItems(Array.isArray(parsed) ? parsed : [])
//       }
//     } catch (error) {
//       console.error('Failed to load cart from localStorage:', error)
//       localStorage.removeItem(STORAGE_KEYS.CART)
//     } finally {
//       setIsHydrated(true)
//     }
//   }, [])

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     if (isHydrated) {
//       try {
//         localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items))
//       } catch (error) {
//         console.error('Failed to save cart to localStorage:', error)
//       }
//     }
//   }, [items, isHydrated])

//   const addToCart = useCallback((product: Product, quantity: number = 1) => {
//     setItems((current) => {
//       const existing = current.find((item) => item.product.id === product.id)
      
//       if (existing) {
//         // Update quantity if item already exists
//         return current.map((item) =>
//           item.product.id === product.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         )
//       }
      
//       // Add new item
//       return [...current, { product, quantity }]
//     })
//   }, [])

//   const removeFromCart = useCallback((productId: string) => {
//     setItems((current) => current.filter((item) => item.product.id !== productId))
//   }, [])

//   const updateQuantity = useCallback((productId: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(productId)
//       return
//     }

//     setItems((current) =>
//       current.map((item) =>
//         item.product.id === productId ? { ...item, quantity } : item
//       )
//     )
//   }, [removeFromCart])

//   const clearCart = useCallback(() => {
//     setItems([])
//     try {
//       localStorage.removeItem(STORAGE_KEYS.CART)
//     } catch (error) {
//       console.error('Failed to clear cart from localStorage:', error)
//     }
//   }, [])

//   const getTotal = useCallback(() => {
//     return items.reduce(
//       (sum, item) => sum + item.product.price * item.quantity,
//       0
//     )
//   }, [items])

//   const getItemCount = useCallback(() => {
//     return items.reduce((sum, item) => sum + item.quantity, 0)
//   }, [items])

//   const getItem = useCallback((productId: string): CartItem | undefined => {
//     return items.find((item) => item.product.id === productId)
//   }, [items])

//   const hasItem = useCallback((productId: string): boolean => {
//     return items.some((item) => item.product.id === productId)
//   }, [items])

//   const value: CartContextType = {
//     items,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getTotal,
//     getItemCount,
//     getItem,
//     hasItem,
//   }

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   )
// }