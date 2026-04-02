// ═══════════════════════════════════════════════════════════
// USE PERMISSION COMPOSABLE
// Ruxsatnomalar va rollarni tekshirish uchun composable
// ═══════════════════════════════════════════════════════════

import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/shared/types/auth'

/**
 * Permission va role tekshirish uchun composable
 */
export function usePermission() {
  const authStore = useAuthStore()

  // ═══════════════════════════════════════════════════════════
  // COMPUTED PROPERTIES
  // ═══════════════════════════════════════════════════════════

  /**
   * Foydalanuvchi adminmi?
   */
  const isAdmin = computed(() => authStore.isAdmin)

  /**
   * Foydalanuvchi HR manager mi?
   */
  const isHrManager = computed(() => authStore.isHrManager)

  /**
   * Foydalanuvchi employee mi?
   */
  const isEmployee = computed(() => authStore.isEmployee)

  /**
   * Foydalanuvchining roli
   */
  const userRole = computed(() => authStore.userRole)

  // ═══════════════════════════════════════════════════════════
  // PERMISSION CHECK FUNCTIONS
  // ═══════════════════════════════════════════════════════════

  /**
   * Foydalanuvchida ma'lum ruxsatnoma bormi?
   * Admin uchun '*' wildcard ishlaydi (hammasiga ruxsat)
   * 
   * @param permission - Tekshiriladigan ruxsatnoma
   */
  function canAccess(permission: string): boolean {
    // Admin har doim hamma narsaga ruxsatga ega
    if (isAdmin.value) {
      return true
    }

    // User yo'q bo'lsa
    if (!authStore.user) {
      return false
    }

    // User permissions ro'yxatida '*' wildcard bormi?
    if (authStore.user.permissions.some(p => (p as string) === '*')) {
      return true
    }

    // Aniq ruxsatnomani tekshirish
    return authStore.user.permissions.some(p => (p as string) === permission)
  }

  /**
   * Foydalanuvchida kamida bitta ruxsatnoma bormi?
   * 
   * @param permissions - Tekshiriladigan ruxsatnomalar ro'yxati
   */
  function canAccessAny(permissions: string[]): boolean {
    if (!permissions.length) {
      return true
    }

    // Admin har doim hamma narsaga ruxsatga ega
    if (isAdmin.value) {
      return true
    }

    if (!authStore.user) {
      return false
    }

    // Wildcard tekshirish
    if (authStore.user.permissions.some(p => (p as string) === '*')) {
      return true
    }

    // Kamida bittasi mavjudmi?
    return permissions.some(permission =>
      authStore.user.permissions.some(p => (p as string) === permission)
    )
  }

  /**
   * Foydalanuvchida barcha ruxsatnomalar bormi?
   * 
   * @param permissions - Tekshiriladigan ruxsatnomalar ro'yxati
   */
  function canAccessAll(permissions: string[]): boolean {
    if (!permissions.length) {
      return true
    }

    // Admin har doim hamma narsaga ruxsatga ega
    if (isAdmin.value) {
      return true
    }

    if (!authStore.user) {
      return false
    }

    // Wildcard tekshirish
    if (authStore.user.permissions.some(p => (p as string) === '*')) {
      return true
    }

    // Hammasi mavjudmi?
    return permissions.every(permission =>
      authStore.user.permissions.some(p => (p as string) === permission)
    )
  }

  // ═══════════════════════════════════════════════════════════
  // ROLE CHECK FUNCTIONS
  // ═══════════════════════════════════════════════════════════

  /**
   * Foydalanuvchining roli mos keladimi?
   * 
   * @param role - Tekshiriladigan rol yoki rollar ro'yxati
   */
  function hasRole(role: UserRole | UserRole[]): boolean {
    if (!authStore.user) {
      return false
    }

    const userRole = authStore.user.role

    if (Array.isArray(role)) {
      return role.includes(userRole)
    }

    return userRole === role
  }

  // ═══════════════════════════════════════════════════════════
  // EXPORTS
  // ═══════════════════════════════════════════════════════════

  return {
    // Computed
    isAdmin,
    isHrManager,
    isEmployee,
    userRole,

    // Permission functions
    canAccess,
    canAccessAny,
    canAccessAll,

    // Role functions
    hasRole
  }
}

export default usePermission