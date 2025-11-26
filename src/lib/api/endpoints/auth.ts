import { apiClient } from '../client'
import {
  LoginCredentials,
  RegisterData,
  User,
  AuthTokens,
  ApiResponse,
} from '@/types'

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/api/v1/auth/login',
      credentials
    ),

  register: (data: RegisterData) =>
    apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/api/v1/auth/register',
      data
    ),

  logout: () => 
    apiClient.post<ApiResponse<null>>('/api/v1/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<{ accessToken: string }>>('/api/v1/auth/refresh', {
      refreshToken,
    }),

  getCurrentUser: () => 
    apiClient.get<ApiResponse<User>>('/api/v1/auth/me'),
}
