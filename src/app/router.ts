// ═══════════════════════════════════════════════════════════
// ROUTER CONFIGURATION
// Vue Router 4 - Authentication guards bilan
// ═══════════════════════════════════════════════════════════

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Import router types for TypeScript support
import '@/shared/types/router'

// ═══════════════════════════════════════════════════════════
// ERROR PAGES (Inline components)
// ═══════════════════════════════════════════════════════════

const NotFoundPage = {
  template: `
    <div class="error-page">
      <div class="error-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Page Not Found</h2>
        <p class="error-message">The page you are looking for does not exist or has been moved.</p>
        <router-link to="/" class="error-link">Return to Home</router-link>
      </div>
    </div>
  `,
  meta: {
    title: 'Page Not Found'
  }
}

const ForbiddenPage = {
  template: `
    <div class="error-page">
      <div class="error-content">
        <h1 class="error-code">403</h1>
        <h2 class="error-title">Access Forbidden</h2>
        <p class="error-message">You do not have permission to access this page.</p>
        <router-link to="/" class="error-link">Return to Home</router-link>
      </div>
    </div>
  `,
  meta: {
    title: 'Access Forbidden'
  }
}

// ═══════════════════════════════════════════════════════════
// ROUTE DEFINITIONS
// ═══════════════════════════════════════════════════════════

// Import module routes
import homeRoutes from '@/modules/home/routes'
import dashboardRoutes from '@/modules/dashboard/routes'
import employeeRoutes from '@/modules/employees/routes'
import attendanceRoutes from '@/modules/attendance/routes'
import payrollRoutes from '@/modules/payroll/routes'
import accountSettingsRoutes from '@/modules/account-settings/routes'

const routes: RouteRecordRaw[] = [
  // Home routes
  ...homeRoutes,
  
  // Dashboard routes
  ...dashboardRoutes,
  
  // Account Settings routes
  ...accountSettingsRoutes,
  
  // Employee routes
  ...employeeRoutes,
  
  // Attendance routes
  ...attendanceRoutes,
  
  // Payroll routes
  ...payrollRoutes,
  
  // ═══════════════════════════════════════════════════════
  // PUBLIC ROUTES (Autentifikatsiya talab qilmaydi)
  // ═══════════════════════════════════════════════════════
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: {
      requiresAuth: false,
      public: true,
      title: 'Login'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/auth/RegisterPage.vue'),
    meta: {
      requiresAuth: false,
      public: true,
      title: 'Register'
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
    meta: {
      requiresAuth: false,
      public: true,
      title: 'Forgot Password'
    }
  },

  // ═══════════════════════════════════════════════════════
  // PROTECTED ROUTES (Autentifikatsiya talab qiladi)
  // ═══════════════════════════════════════════════════════
  
  // Language management routes
  {
    path: '/admin/language/languages',
    name: 'LanguagesManagement',
    component: () => import('@/pages/admin/languages/LanguagesPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Languages Management'
    }
  },
  {
    path: '/admin/language/translate',
    name: 'TranslateWords',
    component: () => import('@/pages/admin/languages/TranslateWordsPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'hr_manager'],
      title: 'Translate Words'
    }
  },
  
  // Theme management route
  {
    path: '/settings/themes',
    name: 'ThemeManagement',
    component: () => import('@/pages/settings/ThemesPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Theme Management'
    }
  },
  
  // UI Showcase route
  {
    path: '/ui-showcase',
    name: 'UiShowcase',
    component: () => import('@/pages/ui-showcase/UiShowcasePage.vue'),
    meta: {
      requiresAuth: true,
      title: 'UI Components Showcase'
    }
  },

  // ═══════════════════════════════════════════════════════
  // ERROR ROUTES
  // ═══════════════════════════════════════════════════════
  {
    path: '/403',
    name: 'Forbidden',
    component: ForbiddenPage,
    meta: {
      public: true,
      title: 'Access Forbidden'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: {
      public: true,
      title: 'Page Not Found'
    }
  }
]

// ═══════════════════════════════════════════════════════════
// ROUTER INSTANCE
// ═══════════════════════════════════════════════════════════
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// ═══════════════════════════════════════════════════════════
// GLOBAL NAVIGATION GUARDS
// ═══════════════════════════════════════════════════════════

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // ═══════════════════════════════════════════════════════
  // 1. Set page title
  // ═══════════════════════════════════════════════════════
  if (to.meta.title) {
    document.title = `HRM | ${to.meta.title}`
  } else {
    document.title = 'HRM System'
  }

  // ═══════════════════════════════════════════════════════
  // 2. Check if route is public (no auth required)
  // ═══════════════════════════════════════════════════════
  const isPublicRoute = to.meta.public === true || to.meta.requiresAuth === false
  
  if (isPublicRoute) {
    // ═══════════════════════════════════════════════════════
    // 3. If user is authenticated and trying to access /login, 
    //    redirect to dashboard
    // ═══════════════════════════════════════════════════════
    if (authStore.isAuthenticated && to.name === 'Login') {
      next({ name: 'Dashboard', replace: true })
      return
    }
    
    next()
    return
  }

  // ═══════════════════════════════════════════════════════
  // 4. Protected route - check authentication
  // ═══════════════════════════════════════════════════════
  if (!authStore.isAuthenticated) {
    // Save the attempted URL for redirecting after login
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // ═══════════════════════════════════════════════════════
  // 5. Check role-based access
  // ═══════════════════════════════════════════════════════
  if (to.meta.roles && to.meta.roles.length > 0) {
    const userRole = authStore.user?.role
    
    if (!userRole || !to.meta.roles.includes(userRole)) {
      // User role doesn't match required roles
      next({ name: 'Forbidden', replace: true })
      return
    }
  }

  // ═══════════════════════════════════════════════════════
  // 6. Check permission-based access
  // ═══════════════════════════════════════════════════════
  if (to.meta.permissions && to.meta.permissions.length > 0) {
    const hasRequiredPermissions = to.meta.permissions.every(permission =>
      authStore.hasPermission(permission)
    )
    
    if (!hasRequiredPermissions) {
      // User doesn't have required permissions
      next({ name: 'Forbidden', replace: true })
      return
    }
  }

  // ═══════════════════════════════════════════════════════
  // All checks passed - allow navigation
  // ═══════════════════════════════════════════════════════
  next()
})

// ═══════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════

router.onError((error, to) => {
  console.error('Router error:', error)
  
  // Handle chunk load errors (e.g., after deployment)
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location.href = to.fullPath
  }
})

// ═══════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════
export default router