// ═══════════════════════════════════════════════════════════
// ROUTER TYPE DEFINITIONS
// Vue Router uchun TypeScript type kengaytmalari
// ═══════════════════════════════════════════════════════════

import 'vue-router'
import type { UserRole } from './auth'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Route autentifikatsiya talab qiladimi?
     * true bo'lsa, foydalanuvchi login qilishi kerak
     */
    requiresAuth?: boolean

    /**
     * Route uchun ruxsat etilgan rollar
     * Agar belgilangan bo'lsa, faqat shu rollardagi foydalanuvchilar kirishi mumkin
     */
    roles?: UserRole[]

    /**
     * Route uchun talab qilinadigan ruxsatnomalar
     * Agar belgilangan bo'lsa, foydalanuvchida shu ruxsatnomalar bo'lishi kerak
     */
    permissions?: string[]

    /**
     * Sahifa sarlavhasi
     * document.title = `HRM | ${title}` formatida set qilinadi
     */
    title?: string

    /**
     * Public route (autentifikatsiya talab qilmaydi)
     * requiresAuth: false o'rniga ishlatiladi
     */
    public?: boolean
  }
}