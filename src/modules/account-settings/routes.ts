import type { RouteRecordRaw } from 'vue-router'
import AccountSettingsLayout from './layouts/AccountSettingsLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/settings/account',
    component: AccountSettingsLayout,
    redirect: '/settings/account/company-information',
    meta: {
      requiresAuth: true,
      hideMainLayout: true, // This flag hides AppSidebar & AppHeader from global AppLayout
      title: 'Account Settings'
    },
    children: [
      {
        path: 'company-information',
        name: 'AccountSettingsCompanyInfo',
        component: () => import('./views/CompanyInformation.vue'),
        meta: { title: 'Company Information' }
      },
      {
        path: 'security-users',
        name: 'AccountSettingsSecurity',
        component: () => import('./views/SecurityUsers.vue'),
        meta: { title: 'Security & Users' }
      },
      {
        path: 'der-information',
        name: 'AccountSettingsDERInfo',
        component: () => import('./views/DERInformation.vue'),
        meta: { title: 'DER Information' }
      },
      {
        path: 'notifications',
        name: 'AccountSettingsNotifications',
        component: () => import('./views/NotificationSettings.vue'),
        meta: { title: 'Notification Settings' }
      },
      {
        path: 'billing',
        name: 'AccountSettingsBilling',
        component: () => import('./views/Billing.vue'),
        meta: { title: 'Billing' }
      },
      {
        path: 'general',
        name: 'AccountSettingsGeneral',
        component: () => import('./views/GeneralSettings.vue'),
        meta: { title: 'General Settings' }
      },
      {
        path: 'applications',
        name: 'AccountSettingsApplications',
        component: () => import('./views/Applications.vue'),
        meta: { title: 'Applications' }
      }
    ]
  }
]

export default routes
