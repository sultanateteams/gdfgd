// ═══════════════════════════════════════════════════════════
// PAYROLL ROUTES
// Maosh hisob-kitoblari moduli marshrutlari
// ═══════════════════════════════════════════════════════════

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/payroll',
    name: 'PayrollList',
    component: () => import('./views/PayrollListView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'hr_manager'],
      title: 'Maosh hisob-kitoblari',
      icon: 'wallet'
    }
  },
  {
    path: '/payroll/:id/payslip',
    name: 'PaySlip',
    component: () => import('./views/PaySlipView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'hr_manager', 'employee'],
      title: 'Maosh varaqasi',
      hidden: true
    }
  }
]

export default routes