// ═══════════════════════════════════════════════════════════
// EMPLOYEES MODULE ROUTES
// Xodimlar bo'limi uchun route'lar
// ═══════════════════════════════════════════════════════════

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('./views/EmployeeListView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'hr_manager'],
      title: 'Xodimlar'
    }
  },
  {
    path: '/employees/:id',
    name: 'EmployeeDetail',
    component: () => import('./views/EmployeeDetailView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'hr_manager'],
      title: 'Xodim ma\'lumotlari'
    }
  }
]

export default routes