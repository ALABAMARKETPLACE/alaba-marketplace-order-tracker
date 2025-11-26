// import axios, { AxiosInstance, AxiosError } from 'axios'
// import { API_BASE_URL } from '@/lib/constants'

// class ApiClient {
//   private client: AxiosInstance

//   constructor() {
//     this.client = axios.create({
//       baseURL: API_BASE_URL,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       timeout: 30000,
//     })

//     this.setupInterceptors()
//   }

//   private setupInterceptors() {
//     this.client.interceptors.request.use(
//       (config) => {
//         if (typeof window !== 'undefined') {
//           const token = localStorage.getItem('accessToken')
//           if (token) {
//             config.headers.Authorization = `Bearer ${token}`
//           }
//         }
//         return config
//       },
//       (error) => Promise.reject(error)
//     )

//     this.client.interceptors.response.use(
//       (response) => response.data,
//       async (error: AxiosError) => {
//         const originalRequest = error.config as any

//         if (error.response?.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true

//           try {
//             if (typeof window !== 'undefined') {
//               const refreshToken = localStorage.getItem('refreshToken')
//               if (!refreshToken) {
//                 throw new Error('No refresh token')
//               }

//               const response = await this.post<{ data: { accessToken: string } }>(
//                 '/auth/refresh',
//                 { refreshToken }
//               )
//               const { accessToken } = response.data

//               localStorage.setItem('accessToken', accessToken)
//               originalRequest.headers.Authorization = `Bearer ${accessToken}`

//               return this.client(originalRequest)
//             }
//           } catch (refreshError) {
//             if (typeof window !== 'undefined') {
//               localStorage.removeItem('accessToken')
//               localStorage.removeItem('refreshToken')
//               window.location.href = '/login'
//             }
//             return Promise.reject(refreshError)
//           }
//         }

//         return Promise.reject(error)
//       }
//     )
//   }

//   async get<T>(url: string, params?: any): Promise<T> {
//     return this.client.get(url, { params })
//   }

//   async post<T>(url: string, data?: any): Promise<T> {
//     return this.client.post(url, data)
//   }

//   async put<T>(url: string, data?: any): Promise<T> {
//     return this.client.put(url, data)
//   }

//   async patch<T>(url: string, data?: any): Promise<T> {
//     return this.client.patch(url, data)
//   }

//   async delete<T>(url: string): Promise<T> {
//     return this.client.delete(url)
//   }

//   async uploadFile<T>(url: string, formData: FormData): Promise<T> {
//     return this.client.post(url, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     })
//   }
// }
// export const apiClient = new ApiClient()

// src/lib/api/client.ts - FINAL API CLIENT (NO MOCK)
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { STORAGE_KEYS } from "@/lib/constants";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },

      timeout: 30000,
      withCredentials: false,

      validateStatus: (status) => status < 400,
    });

    this.setupInterceptors();
  }
  private refreshClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
  });

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            if (typeof window !== "undefined") {
              const refreshToken = localStorage.getItem(
                STORAGE_KEYS.REFRESH_TOKEN
              );
              if (!refreshToken) throw new Error("No refresh token available");

              // Use refreshClient instead of this.post()
              const refreshResponse = await this.refreshClient.post(
                "/api/v1/auth/refresh",
                { refreshToken }
              );

              const accessToken = refreshResponse.data?.data?.accessToken;
              localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

              // Retry original request with new token
              if (!originalRequest.headers) {
                originalRequest.headers = {};
              }
              (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed → clear tokens and redirect
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return this.client.get(url, { params });
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    return this.client.post(url, data);
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    return this.client.put(url, data);
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    return this.client.patch(url, data);
  }

  async delete<T>(url: string): Promise<T> {
    return this.client.delete(url);
  }

  async uploadFile<T>(url: string, formData: FormData): Promise<T> {
    return this.client.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export const apiClient = new ApiClient();
