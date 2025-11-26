// // src/lib/hooks/use-auth.ts
// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { User, LoginCredentials, RegisterData } from '@/types'
// import { authApi } from '@/lib/api/endpoints/auth'
// import { useMockData, mockUser } from '@/lib/api/mock-data'

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     checkAuth()
//   }, [])

//   const checkAuth = async () => {
//     try {
//       if (useMockData) {
//         const token = localStorage.getItem('accessToken')
//         if (token) {
//           setUser(mockUser)
//         }
//       } else {
//         const response = await authApi.getCurrentUser()
//         setUser(response.data)
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const login = async (credentials: LoginCredentials) => {
//     try {
//       if (useMockData) {
//         localStorage.setItem('accessToken', 'mock-token')
//         localStorage.setItem('refreshToken', 'mock-refresh-token')
//         setUser(mockUser)
//         return { success: true }
//       } else {
//         const response = await authApi.login(credentials)
//         const { user, tokens } = response.data
//         localStorage.setItem('accessToken', tokens.accessToken)
//         localStorage.setItem('refreshToken', tokens.refreshToken)
//         setUser(user)
//         return { success: true }
//       }
//     } catch (error: any) {
//       return {
//         success: false,
//         error: error.response?.data?.message || 'Login failed',
//       }
//     }
//   }

//   const register = async (data: RegisterData) => {
//     try {
//       if (useMockData) {
//         localStorage.setItem('accessToken', 'mock-token')
//         localStorage.setItem('refreshToken', 'mock-refresh-token')
//         const newUser: User = {
//           id: '1',
//           email: data.email,
//           name: data.name,
//           role: data.role,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         }
//         setUser(newUser)
//         return { success: true }
//       } else {
//         const response = await authApi.register(data)
//         const { user, tokens } = response.data
//         localStorage.setItem('accessToken', tokens.accessToken)
//         localStorage.setItem('refreshToken', tokens.refreshToken)
//         setUser(user)
//         return { success: true }
//       }
//     } catch (error: any) {
//       return {
//         success: false,
//         error: error.response?.data?.message || 'Registration failed',
//       }
//     }
//   }

//   const logout = async () => {
//     try {
//       if (!useMockData) {
//         await authApi.logout()
//       }
//     } catch (error) {
//       console.error('Logout error:', error)
//     } finally {
//       localStorage.removeItem('accessToken')
//       localStorage.removeItem('refreshToken')
//       setUser(null)
//       router.push('/login')
//     }
//   }

//   return {
//     user,
//     loading,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!user,
//     refetch: checkAuth,
//   }
// }


'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, LoginCredentials, RegisterData } from '@/types'
import { authApi } from '@/lib/api/endpoints/auth'
import { STORAGE_KEYS } from '@/lib/constants'
import { AxiosError } from 'axios'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      if (!token) {
        setLoading(false)
        return
      }

      const response = await authApi.getCurrentUser()
      setUser(response.data)
    } catch (error) {
      console.error('Auth check failed:', error)
      // Clear invalid tokens
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials)
      const { user, tokens } = response.data
      
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken)
      setUser(user)
      
      return { success: true }
    } catch (error) {
      if(error instanceof AxiosError) {

      console.error('Login failed:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials.',
      }
    }
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await authApi.register(data)
      const { user, tokens } = response.data
      
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken)
      setUser(user)
      
      return { success: true }
    } catch (error) {
      if(error instanceof AxiosError) {

        console.error('Registration failed:', error)
        return {
          success: false,
          error: error.response?.data?.message || 'Registration failed. Please try again.',
        }
      }
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      setUser(null)
      router.push('/login')
    }
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    refetch: checkAuth,
  }
}
