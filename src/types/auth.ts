export interface User {
  id: string
  email: string
  firstName: string
  lastName?: string
  role: 'buyer' | 'seller' | 'driver' | 'company'
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName?: string
  role: 'buyer' | 'seller' | 'driver' | 'company'
}
