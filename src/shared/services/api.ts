import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiResponse } from '@/shared/types'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if exists
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(this.handleError(error))
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        if (!response.data.success) {
          return Promise.reject(new Error(response.data.error?.message || 'Request failed'))
        }
        return response
      },
      (error) => {
        return Promise.reject(this.handleError(error))
      }
    )
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const message = error.response.data?.error?.message || 'Server error'
      
      if (status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
      
      return new Error(`${status}: ${message}`)
    } else if (error.request) {
      // Network error
      return new Error('Network error: Please check your connection')
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred')
    }
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.request<ApiResponse<T>>(config)
      return response.data.data as T
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  // POST request
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  // PUT request
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  // DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }
}

export const apiService = new ApiService()