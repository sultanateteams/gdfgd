import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { appConfig } from '@/config/app'

/**
 * API Service - Markazlashtirilgan HTTP so'rovlar xizmati
 * 
 * Features:
 * - Config dan baseURL ni oladi
 * - Timeout: 10000ms
 * - Request interceptor: localStorage dan 'access_token' o'qib, Authorization header qo'shadi
 * - Response interceptor: 401 da token o'chirib, /login ga yo'naltiradi
 */
class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: appConfig.apiBaseUrl,
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
      (config: InternalAxiosRequestConfig) => {
        // localStorage dan access_token ni o'qish
        const token = localStorage.getItem('access_token')
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        return config
      },
      (error) => {
        console.error('API request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error) => {
        // 401 Unauthorized - token yaroqsiz yoki muddati tugagan
        if (error.response && error.response.status === 401) {
          // Token ni o'chirish
          localStorage.removeItem('access_token')
          
          // Login sahifasiga yo'naltirish
          // Hozircha console ga chiqaramiz, keyinchalik router orqali amalga oshiriladi
          console.warn('Unauthorized access detected. Redirecting to login...')
          
          // Agar router import qilingan bo'lsa:
          // import router from '@/app/router'
          // router.push('/login')
        }
        
        // Boshqa xatolar uchun console.error
        if (error.response) {
          // Server javob qaytardi, lekin error status bilan
          const status = error.response.status
          const message = error.response.data?.message || error.response.data?.error || 'Server error'
          console.error(`API Error ${status}:`, message)
        } else if (error.request) {
          // So'rov yuborildi, lekin javob kelmadi (tarmoq xatosi)
          console.error('API Network Error: No response received')
        } else {
          // Boshqa xatolar
          console.error('API Error:', error.message)
        }
        
        return Promise.reject(error)
      }
    )
  }

  /**
   * Generic request method
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.request<T>(config)
      return response.data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }

  /**
   * Axios instance ni o'zi (to'g'ridan-to'g'ri foydalanish uchun)
   */
  getInstance(): AxiosInstance {
    return this.api
  }
}

// Singleton instance
export const apiService = new ApiService()

// Default export
export default apiService