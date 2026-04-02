<!-- ═══════════════════════════════════════════════════════════
     APP PERMISSION GUARD
     Ruxsatnoma va rol asosida contentni boshqaruvchi wrapper komponent
     ═══════════════════════════════════════════════════════════ -->

<template>
  <template v-if="shouldShow">
    <slot />
  </template>
  <template v-else>
    <slot name="fallback" />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePermission } from '@/composables/usePermission'
import type { UserRole } from '@/shared/types/auth'

interface Props {
  /**
   * Talab qilinadigan ruxsatnoma(lar)
   * String yoki string array qabul qiladi
   */
  permission?: string | string[]

  /**
   * Talab qilinadigan rol(lar)
   * UserRole yoki UserRole array qabul qiladi
   */
  role?: UserRole | UserRole[]

  /**
   * Barcha ruxsatnomalar talab qilinadimi?
   * true bo'lsa - canAccessAll ishlatiladi
   * false bo'lsa - canAccessAny ishlatiladi
   */
  all?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  all: false
})

const { canAccess, canAccessAny, canAccessAll, hasRole } = usePermission()

/**
 * Contentni ko'rsatish kerakmi?
 */
const shouldShow = computed(() => {
  // Agar permission ham, role ham belgilanmagan bo'lsa - hamisha ko'rsatish
  if (!props.permission && !props.role) {
    return true
  }

  // Role tekshirish
  if (props.role) {
    const hasRequiredRole = hasRole(props.role)
    if (!hasRequiredRole) {
      return false
    }
  }

  // Permission tekshirish
  if (props.permission) {
    const permissions = Array.isArray(props.permission) ? props.permission : [props.permission]

    if (props.all) {
      // Barcha ruxsatnomalar talab qilinadi
      return canAccessAll(permissions)
    } else {
      // Kamida bitta ruxsatnoma talab qilinadi
      return canAccessAny(permissions)
    }
  }

  return true
})
</script>