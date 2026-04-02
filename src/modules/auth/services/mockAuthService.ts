// ═══════════════════════════════════════════════════════════
// MOCK AUTH SERVICE
// Development va testing uchun mock autentifikatsiya xizmati
// ═══════════════════════════════════════════════════════════

import type { AuthUser, UserRole, Permission } from '@/shared/types/auth'

// ═══════════════════════════════════════════════════════════
// MOCK USERS
// Test uchun mock foydalanuvchilar ro'yxati
// ═══════════════════════════════════════════════════════════

interface MockUser extends AuthUser {
  password: string
}

export const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    email: 'admin@hrm.uz',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    permissions: ['users:view', 'users:create', 'users:edit', 'users:delete', 'employees:view', 'employees:create', 'employees:edit', 'employees:delete', 'attendance:view', 'attendance:edit', 'leave:manage', 'payroll:view', 'payroll:edit', 'reports:view', 'settings:manage', 'themes:manage', 'languages:manage'],
    departmentId: 'dept-admin'
  },
  {
    id: '2',
    email: 'hr@hrm.uz',
    password: 'hr123',
    firstName: 'HR',
    lastName: 'Manager',
    role: 'hr_manager',
    permissions: [
      'employees:view',
      'employees:create',
      'employees:edit',
      'attendance:view',
      'attendance:edit',
      'leave:manage',
      'payroll:view',
      'reports:view'
    ],
    departmentId: 'dept-hr'
  },
  {
    id: '3',
    email: 'employee@hrm.uz',
    password: 'emp123',
    firstName: 'John',
    lastName: 'Employee',
    role: 'employee',
    permissions: [
      'employees:view',
      'attendance:view',
      'leave:manage'
    ],
    departmentId: 'dept-dev'
  }
]

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Oddiy base64 token yaratish (JWT simulatsiyasi)
 * Real JWT emas, faqat development uchun
 */
function createMockToken(payload: object): string {
  const tokenPayload = {
    ...payload,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 soat amal qilish muddati
  }
  return btoa(JSON.stringify(tokenPayload))
}

/**
 * Token'dan payload'ni decode qilish
 */
function decodeMockToken(token: string): object | null {
  try {
    const decoded = JSON.parse(atob(token))
    // Token muddati tugaganmi?
    if (decoded.exp && decoded.exp < Date.now()) {
      return null
    }
    return decoded
  } catch {
    return null
  }
}

/**
 * Artificial delay - real API hissiyoti uchun
 * 300-600ms orasida tasodifiy kechikish
 */
function artificialDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * 300) + 300 // 300-600ms
  return new Promise(resolve => setTimeout(resolve, delay))
}

// ═══════════════════════════════════════════════════════════
// MOCK AUTH SERVICE
// ═══════════════════════════════════════════════════════════

export interface MockLoginPayload {
  email: string
  password: string
}

export interface MockLoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface MockRefreshResponse {
  accessToken: string
}

/**
 * Mock Auth Service
 * Barcha metodlar async va Promise qaytaradi
 */
export const mockAuthService = {
  /**
   * Login - foydalanuvchini autentifikatsiya qilish
   * @throws Error('Invalid credentials') - noto'g'ri email yoki parol
   */
  async login(payload: MockLoginPayload): Promise<MockLoginResponse> {
    await artificialDelay()

    const { email, password } = payload
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())

    if (!user || user.password !== password) {
      throw new Error('Invalid credentials')
    }

    // Tokenlarni yaratish
    const accessToken = createMockToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      type: 'access'
    })

    const refreshToken = createMockToken({
      userId: user.id,
      email: user.email,
      type: 'refresh'
    })

    // User ma'lumotlaridan parolni olib tashlash
    const { password: _, ...userWithoutPassword } = user

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword
    }
  },

  /**
   * Logout - mock logout (hozircha hech narsa qilmaydi)
   */
  async logout(): Promise<void> {
    await artificialDelay()
    // Mock logout - hech narsa qilmaydi
    return Promise.resolve()
  },

  /**
   * Token yangilash
   * Eski refresh token asosida yangi access token beradi
   */
  async refreshToken(refreshToken: string): Promise<MockRefreshResponse> {
    await artificialDelay()

    const decoded = decodeMockToken(refreshToken) as { userId?: string; email?: string; type?: string } | null

    if (!decoded || decoded.type !== 'refresh' || !decoded.userId) {
      throw new Error('Invalid refresh token')
    }

    // Yangi access token yaratish
    const newAccessToken = createMockToken({
      userId: decoded.userId,
      email: decoded.email,
      role: MOCK_USERS.find(u => u.id === decoded.userId)?.role,
      type: 'access'
    })

    return {
      accessToken: newAccessToken
    }
  },

  /**
   * Joriy foydalanuvchi ma'lumotlarini olish
   * Access token'dan user ma'lumotlarini decode qiladi
   */
  async getMe(accessToken: string): Promise<AuthUser> {
    await artificialDelay()

    const decoded = decodeMockToken(accessToken) as { userId?: string; type?: string } | null

    if (!decoded || decoded.type !== 'access' || !decoded.userId) {
      throw new Error('Invalid access token')
    }

    const user = MOCK_USERS.find(u => u.id === decoded.userId)

    if (!user) {
      throw new Error('User not found')
    }

    // User ma'lumotlaridan parolni olib tashlash
    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  },

  /**
   * Mock foydalanuvchilarni olish (testing uchun)
   */
  getMockUsers(): Omit<MockUser, 'password'>[] {
    return MOCK_USERS.map(({ password, ...user }) => user)
  }
}

export default mockAuthService