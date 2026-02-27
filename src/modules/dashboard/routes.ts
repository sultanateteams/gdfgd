import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/DashboardView.vue'),
    meta: {
      title: 'Dashboard - HRM System',
      requiresAuth: true
    }
  }
]

export default routes