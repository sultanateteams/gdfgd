import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import module routes
import homeRoutes from '@/modules/home/routes'

const routes: RouteRecordRaw[] = [
  ...homeRoutes,
  // Language management routes
  {
    path: '/admin/language/languages',
    name: 'LanguagesManagement',
    component: () => import('@/pages/admin/languages/LanguagesPage.vue'),
    meta: {
      title: 'Languages Management'
    }
  },
  {
    path: '/admin/language/translate',
    name: 'TranslateWords',
    component: () => import('@/pages/admin/languages/TranslateWordsPage.vue'),
    meta: {
      title: 'Translate Words'
    }
  },
  // Theme management route
  {
    path: '/settings/themes',
    name: 'ThemeManagement',
    component: () => import('@/pages/settings/ThemesPage.vue'),
    meta: {
      title: 'Theme Management'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/shared/components/NotFound.vue'),
    meta: {
      title: 'Page Not Found'
    }
  }
]

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

// Global route guards
router.beforeEach((to, from, next) => {
  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  // Add authentication logic here if needed
  // For now, allow all routes
  next()
})

export default router