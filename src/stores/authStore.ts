// ═══════════════════════════════════════════════════════════
// AUTH STORE - Pinia Options API Style
// Autentifikatsiya va authorization boshqaruvi
// ═══════════════════════════════════════════════════════════

import { defineStore } from 'pinia'
import type { AuthUser, UserRole, Permission } from '@/shared/types/auth'

// ═══════════════════════════════════════════════════════════
// STORAGE KEYS
// localStorage kalitlari
// ═══════════════════════════════════════════════════════════
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'hrm-access-token',
  REFRESH_TOKEN: 'hrm-refresh-token',
  USER: 'hrm-user'
} as const

// ═══════════════════════════════════════════════════════════
// STATE INTERFACE
// Store state tuzilishi
// ═══════════════════════════════════════════════════════════
export interface AuthState {
  /** Access token (JWT) */
  accessToken: string | null
  
  /** Refresh token */
  refreshToken: string | null
  
  /** Autentifikatsiya qilingan foydalanuvchi */
  user: AuthUser | null
  
  /** Yuklanish holati */
  isLoading: boolean
  
  /** Xatolik xabari */
  error: string | null
}

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// localStorage dan ma'lumot olish/qaytarish
// ═══════════════════════════════════════════════════════════
function getFromStorage<T>(key: string): T | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

function removeFromStorage(key: string): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to remove from localStorage:', error)
  }
}

// ═══════════════════════════════════════════════════════════
// AUTH STORE
// Pinia Options API style
// ═══════════════════════════════════════════════════════════
export const useAuthStore = defineStore('auth', {
  // ═══════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════
  state: (): AuthState => ({
    accessToken: getFromStorage<string>(STORAGE_KEYS.ACCESS_TOKEN),
    refreshToken: getFromStorage<string>(STORAGE_KEYS.REFRESH_TOKEN),
    user: getFromStorage<AuthUser>(STORAGE_KEYS.USER),
    isLoading: false,
    error: null
  }),

  // ═══════════════════════════════════════════════════════
  // GETTERS
  // ═══════════════════════════════════════════════════════
  getters: {
    /**
     * Foydalanuvchi autentifikatsiya qilinganmi?
     */
    isAuthenticated(): boolean {
      return !!this.accessToken && !!this.user
    },

    /**
     * Foydalanuvchining to'liq ismi
     */
    fullName(): string {
      if (!this.user) return ''
      return `${this.user.firstName} ${this.user.lastName}`
    },

    /**
     * Foydalanuvchi adminmi?
     */
    isAdmin(): boolean {
      return this.user?.role === 'admin'
    },

    /**
     * Foydalanuvchi HR menejer mi?
     */
    isHrManager(): boolean {
      return this.user?.role === 'hr_manager'
    },

    /**
     * Foydalanuvchi oddiy xodimmi?
     */
    isEmployee(): boolean {
      return this.user?.role === 'employee'
    },

    /**
     * Foydalanuvchida ma'lum ruxsatnoma bormi?
     * @param permission - Tekshiriladigan ruxsatnoma
     */
    hasPermission: (state) => (permission: Permission | string): boolean => {
      if (!state.user) return false
      return state.user.permissions.includes(permission as Permission)
    },

    /**
     * Foydalanuvchida biror ruxsatnomalar bormi?
     * @param permissions - Tekshiriladigan ruxsatnomalar ro'yxati
     */
    hasAnyPermission: (state) => (permissions: (Permission | string)[]): boolean => {
      if (!state.user) return false
      return permissions.some(p => state.user!.permissions.includes(p as Permission))
    },

    /**
     * Foydalanuvchida barcha ruxsatnomalar bormi?
     * @param permissions - Tekshiriladigan ruxsatnomalar ro'yxati
     */
    hasAllPermissions: (state) => (permissions: (Permission | string)[]): boolean => {
      if (!state.user) return false
      return permissions.every(p => state.user!.permissions.includes(p as Permission))
    },

    /**
     * Foydalanuvchi avatar URL
     */
    avatarUrl(): string | undefined {
      return this.user?.avatar
    },

    /**
     * Foydalanuvchi email
     */
    userEmail(): string {
      return this.user?.email || ''
    },

    /**
     * Foydalanuvchi roli
     */
    userRole(): UserRole | undefined {
      return this.user?.role
    }
  },

  // ═══════════════════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════════════════
  actions: {
    /**
     * Access va refresh tokenlarni set qilish va localStorage ga saqlash
     */
    setTokens(accessToken: string, refreshToken: string): void {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      
      saveToStorage(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
      saveToStorage(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    },

    /**
     * Foydalanuvchi ma'lumotlarini set qilish va localStorage ga saqlash
     */
    setUser(user: AuthUser): void {
      this.user = user
      saveToStorage(STORAGE_KEYS.USER, user)
    },

    /**
     * Loading holatini o'zgartirish
     */
    setLoading(isLoading: boolean): void {
      this.isLoading = isLoading
    },

    /**
     * Xatolikni set qilish
     */
    setError(error: string | null): void {
      this.error = error
    },

    /**
     * Barcha auth state va localStorage ni tozalash
     */
    clearAuth(): void {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      this.error = null
      this.isLoading = false
      
      removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN)
      removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN)
      removeFromStorage(STORAGE_KEYS.USER)
    },

    /**
     * Logout qilish va login sahifasiga yo'naltirish
     */
    logout(): void {
      this.clearAuth()
      window.location.href = '/login'
    },

    /**
     * Login (mock implementation - haqiqiy API integratsiyasi uchun)
     */
    async login(email: string, password: string): Promise<AuthUser | null> {
      this.setLoading(true)
      this.setError(null)
      
      try {
        // TODO: Haqiqiy API chaqiruvini shu yerga qo'shing
        // const response = await apiService.post<LoginResponse>('/auth/login', { email, password })
        // this.setTokens(response.accessToken, response.refreshToken)
        // this.setUser(response.user)
        // return response.user
        
        // Mock implementation
        console.log('Login attempt:', { email })
        
        // Mock user
        const mockUser: AuthUser = {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: email,
          role: 'admin',
          permissions: ['users:view', 'users:create', 'employees:view', 'reports:view'],
          departmentId: 'dept-1'
        }
        
        this.setTokens('mock-access-token', 'mock-refresh-token')
        this.setUser(mockUser)
        
        return mockUser
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed'
        this.setError(errorMessage)
        return null
      } finally {
        this.setLoading(false)
      }
    },

    /**
     * Tokenlarni yangilash
     */
    async refreshTokens(): Promise<boolean> {
      if (!this.refreshToken) {
        this.logout()
        return false
      }
      
      try {
        // TODO: Haqiqiy API chaqiruvini shu yerga qo'shing
        // const response = await apiService.post<RefreshTokenResponse>('/auth/refresh', {
        //   refreshToken: this.refreshToken
        // })
        // this.setTokens(response.accessToken, response.refreshToken)
        // return true
        
        console.log('Token refresh attempted')
        return true
      } catch (error) {
        console.error('Token refresh failed:', error)
        this.logout()
        return false
      }
    },

    /**
     * Initialize store from localStorage
     * Ilova yuklanganda chaqiriladi
     */
    initialize(): void {
      // Tokenlar va user ma'lumotlari allaqachon localStorage dan yuklangan
      // Bu metod qo'shimcha tekshiruvlar uchun ishlatilishi mumkin
      if (this.accessToken && !this.user) {
        // Token bor, lekin user yo'q - noto'g'ri holat
        console.warn('Auth state inconsistent: token exists but user is null')
        this.clearAuth()
      }
    },

    /**
     * Foydalanuvchi ma'lumotlarini yangilash
     */
    updateUserData(updates: Partial<AuthUser>): void {
      if (!this.user) return
      
      const updatedUser = { ...this.user, ...updates }
      this.setUser(updatedUser)
    }
  }
})

// ═══════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════
export default useAuthStore
