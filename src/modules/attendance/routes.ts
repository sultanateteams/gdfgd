// ═══════════════════════════════════════════════════════════
// ATTENDANCE MODULE ROUTES
// Davomat va ta'til boshqaruv tizimi uchun route'lar
// ═══════════════════════════════════════════════════════════

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/attendance',
    name: 'Attendance',
    component: () => import('./views/AttendanceView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Davomat'
    }
  },
  {
    path: '/attendance/leaves',
    name: 'Leaves',
    component: () => import('./views/LeaveView.vue'),
    meta: {
      requiresAuth: true,
      title: "Ta'tillar"
    }
  }
]

export default routes