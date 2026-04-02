// ═══════════════════════════════════════════════════════════
// AUTH SERVICE - FACTORY
// USE_MOCK flag ga qarab mock yoki real service ni ishlatadi
// ═══════════════════════════════════════════════════════════

import type { AuthUser } from '@/shared/types/auth'
import { appConfig } from '@/config/app'
import { mockAuthService, type MockLoginPayload, type MockLoginResponse } from './mockAuthService'
import { realAuthService, type LoginPayload, type LoginResponse, type RefreshResponse } from './realAuthService'

// ═══════════════════════════════════════════════════════════
// UNIFIED TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════

/**
 * Login payload - both mock and real use the same structure
 */
export interface AuthLoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Login response - both mock and real return the same structure
 */
export interface AuthLoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

/**
 * Refresh token response
 */
export interface AuthRefreshResponse {
  accessToken: string
}

/**
 * Logout response
 */
export interface AuthLogoutResponse {
  success: boolean
  message?: string
}

// ═══════════════════════════════════════════════════════════
// AUTH SERVICE INTERFACE
// ═══════════════════════════════════════════════════════════

export interface IAuthService {
  /**
   * Login - foydalanuvchini autentifikatsiya qilish
   */
  login(payload: AuthLoginPayload): Promise<AuthLoginResponse>

  /**
   * Logout - foydalanuvchini tizimdan chiqarish
   */
  logout(): Promise<AuthLogoutResponse>

  /**
   * Token yangilash
   * @param refreshToken - Eski refresh token
   */
  refreshToken(refreshToken: string): Promise<AuthRefreshResponse>

  /**
   * Joriy foydalanuvchi ma'lumotlarini olish
   */
  getMe(accessToken?: string): Promise<AuthUser>
}

// ═══════════════════════════════════════════════════════════
// MOCK AUTH SERVICE ADAPTER
// ═══════════════════════════════════════════════════════════

const mockAuthAdapter: IAuthService = {
  async login(payload: AuthLoginPayload): Promise<AuthLoginResponse> {
    const mockPayload: MockLoginPayload = {
      email: payload.email,
      password: payload.password
    }
    const response = await mockAuthService.login(mockPayload)
    return response
  },

  async logout(): Promise<AuthLogoutResponse> {
    await mockAuthService.logout()
    return { success: true }
  },

  async refreshToken(refreshToken: string): Promise<AuthRefreshResponse> {
    return mockAuthService.refreshToken(refreshToken)
  },

  async getMe(accessToken?: string): Promise<AuthUser> {
    if (!accessToken) {
      accessToken = localStorage.getItem('hrm-access-token') || ''
    }
    return mockAuthService.getMe(accessToken)
  }
}

// ═══════════════════════════════════════════════════════════
// REAL AUTH SERVICE ADAPTER
// ═══════════════════════════════════════════════════════════

const realAuthAdapter: IAuthService = {
  async login(payload: AuthLoginPayload): Promise<AuthLoginResponse> {
    return realAuthService.login(payload)
  },

  async logout(): Promise<AuthLogoutResponse> {
    return realAuthService.logout()
  },

  async refreshToken(refreshToken: string): Promise<AuthRefreshResponse> {
    return realAuthService.refreshToken(refreshToken)
  },

  async getMe(): Promise<AuthUser> {
    return realAuthService.getMe()
  }
}

// ═══════════════════════════════════════════════════════════
// SERVICE FACTORY
// USE_MOCK flag ga qarab kerakli service ni qaytaradi
// ═══════════════════════════════════════════════════════════

/**
 * Joriy auth service ni olish
 * USE_MOCK=true bo'lsa mock, aks holda real service qaytariladi
 */
export function getAuthService(): IAuthService {
  if (appConfig.useMock) {
    console.log('[AuthService] Using MOCK auth service')
    return mockAuthAdapter
  }
  console.log('[AuthService] Using REAL auth service')
  return realAuthAdapter
}

/**
 * Global auth service instance
 * Ilovani barcha joylarida ishlatish uchun
 */
export const authService: IAuthService = getAuthService()

export default authService