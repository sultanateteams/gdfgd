// ═══════════════════════════════════════════════════════════
// AUTH TYPE DEFINITIONS
// Authentication va authorization uchun type'lar
// ═══════════════════════════════════════════════════════════

/**
 * Foydalanuvchi rollari
 */
export type UserRole = 'admin' | 'hr_manager' | 'employee'

/**
 * Ruxsatnomalar ro'yxati (permissions)
 */
export type Permission = 
  | 'users:view'
  | 'users:create'
  | 'users:edit'
  | 'users:delete'
  | 'employees:view'
  | 'employees:create'
  | 'employees:edit'
  | 'employees:delete'
  | 'attendance:view'
  | 'attendance:edit'
  | 'leave:manage'
  | 'payroll:view'
  | 'payroll:edit'
  | 'reports:view'
  | 'settings:manage'
  | 'themes:manage'
  | 'languages:manage'

/**
 * AuthUser - autentifikatsiya qilingan foydalanuvchi ma'lumotlari
 */
export interface AuthUser {
  /** Foydalanuvchi unikal identifikatori */
  id: string
  
  /** Ism */
  firstName: string
  
  /** Familiya */
  lastName: string
  
  /** Email manzil */
  email: string
  
  /** Foydalanuvchi roli */
  role: UserRole
  
  /** Ruxsatnomalar ro'yxati */
  permissions: Permission[]
  
  /** Avatar rasmi URL (ixtiyoriy) */
  avatar?: string
  
  /** Bo'lim identifikatori (ixtiyoriy) */
  departmentId?: string
  
  /** Telefon raqami (ixtiyoriy) */
  phone?: string
  
  /** Faol holati */
  isActive?: boolean
  
  /** Oxirgi kirish vaqti (ixtiyoriy) */
  lastLoginAt?: string
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Login response
 */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  role?: UserRole
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

/**
 * Rol bo'yicha default ruxsatnomalar
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'users:view', 'users:create', 'users:edit', 'users:delete',
    'employees:view', 'employees:create', 'employees:edit', 'employees:delete',
    'attendance:view', 'attendance:edit',
    'leave:manage',
    'payroll:view', 'payroll:edit',
    'reports:view',
    'settings:manage',
    'themes:manage',
    'languages:manage'
  ],
  hr_manager: [
    'users:view',
    'employees:view', 'employees:create', 'employees:edit',
    'attendance:view', 'attendance:edit',
    'leave:manage',
    'payroll:view',
    'reports:view'
  ],
  employee: [
    'employees:view',
    'attendance:view',
    'leave:manage'
  ]
}

/**
 * Foydalanuvchining to'liq ismi
 */
export function getFullName(user: Pick<AuthUser, 'firstName' | 'lastName'>): string {
  return `${user.firstName} ${user.lastName}`
}

/**
 * Foydalanuvchining roli admin ekanligini tekshirish
 */
export function isAdmin(user: Pick<AuthUser, 'role'>): boolean {
  return user.role === 'admin'
}

/**
 * Foydalanuvchining roli hr_manager ekanligini tekshirish
 */
export function isHrManager(user: Pick<AuthUser, 'role'>): boolean {
  return user.role === 'hr_manager'
}

/**
 * Foydalanuvchida ma'lum ruxsatnoma borligini tekshirish
 */
export function hasPermission(user: AuthUser, permission: Permission): boolean {
  return user.permissions.includes(permission)
}