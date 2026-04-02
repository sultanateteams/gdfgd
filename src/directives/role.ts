// ═══════════════════════════════════════════════════════════
// V-ROLE DIRECTIVE
// Elementni rol asosida boshqarish
// ═══════════════════════════════════════════════════════════

import type { Directive, DirectiveBinding } from 'vue'
import { usePermission } from '@/composables/usePermission'
import type { UserRole } from '@/shared/types/auth'

/**
 * v-role directive
 * 
 * Usage:
 * - v-role="'admin'" - admin role bo'lmasa DOM dan olib tashlanadi
 * - v-role="['admin', 'hr_manager']" - array ham qabul qiladi
 */
export const vRole: Directive<HTMLElement, UserRole | UserRole[]> = {
  mounted(el, binding) {
    applyRole(el, binding)
  },

  updated(el, binding) {
    applyRole(el, binding)
  }
}

/**
 * Role ni qo'llash
 */
function applyRole(
  el: HTMLElement,
  binding: DirectiveBinding<UserRole | UserRole[]>
): void {
  const role = binding.value
  const roles = Array.isArray(role) ? role : [role]

  // Role tekshirish
  const { hasRole } = usePermission()
  const hasAccess = hasRole(roles)

  if (hasAccess) {
    // Role mos - elementni ko'rsatish
    el.style.display = ''
  } else {
    // Role mos emas - elementni DOM dan olib tashlash
    el.style.display = 'none'
  }
}

/**
 * Directive ni plugin sifatida o'rnatish
 */
export function setupRoleDirective(app: any): void {
  app.directive('role', vRole)
}

export default vRole