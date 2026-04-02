// ═══════════════════════════════════════════════════════════
// V-PERMISSION DIRECTIVE
// Elementni ruxsatnoma asosida boshqarish
// ═══════════════════════════════════════════════════════════

import type { Directive, DirectiveBinding, Ref } from 'vue'
import { usePermission } from '@/composables/usePermission'

export interface PermissionDirectiveOptions {
  /**
   * Disable mode - ruxsat yo'q bo'lsa elementni disabled qiladi
   * false bo'lsa - element DOM dan olib tashlanadi (v-if kabi)
   */
  disable?: boolean
}

/**
 * v-permission directive
 * 
 * Usage:
 * - v-permission="'employees.read'" - ruxsat yo'q bo'lsa DOM dan olib tashlanadi
 * - v-permission.disable="'employees.write'" - ruxsat yo'q bo'lsa disabled + opacity:0.5
 * - v-permission="['employees.read', 'employees.write']" - array ham qabul qiladi
 */
export const vPermission: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    applyPermission(el, binding)
  },

  updated(el, binding) {
    applyPermission(el, binding)
  }
}

/**
 * Permission ni qo'llash
 */
function applyPermission(
  el: HTMLElement,
  binding: DirectiveBinding<string | string[]>
): void {
  const permission = binding.value
  const modifiers = binding.modifiers
  const isDisableMode = modifiers.disable || binding.arg === 'disable'

  // Permission olish
  const permissions = Array.isArray(permission) ? permission : [permission]

  // Permission tekshirish
  const { canAccessAny } = usePermission()
  const hasAccess = canAccessAny(permissions)

  if (hasAccess) {
    // Ruxsat bor - elementni ko'rsatish
    el.style.display = ''
    el.removeAttribute('disabled')
    el.style.opacity = ''
    el.style.pointerEvents = ''
  } else {
    if (isDisableMode) {
      // Disable mode - elementni disabled qilish
      el.setAttribute('disabled', 'true')
      el.style.opacity = '0.5'
      el.style.pointerEvents = 'none'
    } else {
      // Hide mode - elementni DOM dan olib tashlash
      el.style.display = 'none'
    }
  }
}

/**
 * Directive ni plugin sifatida o'rnatish
 */
export function setupPermissionDirective(app: any): void {
  app.directive('permission', vPermission)
}

export default vPermission