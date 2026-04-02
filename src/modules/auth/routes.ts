// ═══════════════════════════════════════════════════════════
// AUTH MODULE ROUTES
// Autentifikatsiya bilan bog'liq route'lar
// ═══════════════════════════════════════════════════════════

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/LoginView.vue'),
    meta: {
      requiresAuth: false,
      public: true,
      title: 'Kirish'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/RegisterView.vue'),
    meta: {
      requiresAuth: false,
      public: true,
      title: 'Ro\'yxatdan o\'tish'
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('./views/ForgotPasswordView.vue'),
    meta: {
      requiresAuth: false,
      public: true,
      title: 'Parolni tiklash'
    }
  }
]

export default routes