// ═══════════════════════════════════════════════════════════
// REAL AUTH SERVICE
// Haqiqiy API bilan ishlaydigan autentifikatsiya xizmati
// ═══════════════════════════════════════════════════════════

import type { AuthUser } from '@/shared/types/auth'
import { apiService } from '@/services/api'

// ═══════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════

export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface RefreshResponse {
  accessToken: string
  refreshToken?: string
}

export interface LogoutResponse {
  success: boolean
  message?: string
}

// ═══════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════

const ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me'
} as const

// ═══════════════════════════════════════════════════════════
// REAL AUTH SERVICE
// ═══════════════════════════════════════════════════════════

export const realAuthService = {
  /**
   * Login - foydalanuvchini autentifikatsiya qilish
   * POST /auth/login
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(ENDPOINTS.LOGIN, payload)
      return response
    } catch (error) {
      console.error('Real auth login error:', error)
      throw error
    }
  },

  /**
   * Logout - foydalanuvchini tizimdan chiqarish
   * POST /auth/logout
   */
  async logout(): Promise<LogoutResponse> {
    try {
      const response = await apiService.post<LogoutResponse>(ENDPOINTS.LOGOUT)
      return response
    } catch (error) {
      console.error('Real auth logout error:', error)
      throw error
    }
  },

  /**
   * Token yangilash
   * POST /auth/refresh
   * @param refreshToken - Eski refresh token
   */
  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    try {
      const response = await apiService.post<RefreshResponse>(ENDPOINTS.REFRESH, {
        refreshToken
      })
      return response
    } catch (error) {
      console.error('Real auth refresh error:', error)
      throw error
    }
  },

  /**
   * Joriy foydalanuvchi ma'lumotlarini olish
   * GET /auth/me
   */
  async getMe(): Promise<AuthUser> {
    try {
      const response = await apiService.get<AuthUser>(ENDPOINTS.ME)
      return response
    } catch (error) {
      console.error('Real auth getMe error:', error)
      throw error
    }
  }
}

export default realAuthService