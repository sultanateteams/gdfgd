<template>
  <div class="account-settings-wrapper flex h-screen overflow-hidden bg-body-bg text-primary">
    
    <!-- Mobile Drawer for Sidebar (hidden on md and up) -->
    <AppDrawer v-model:open="isMobileMenuOpen" placement="left" title="Settings Menu">
      <nav class="flex-1 overflow-y-auto py-2">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="flex items-center px-4 py-3 text-sm font-medium transition-colors border-l-4"
          :class="isActive(item.path) 
            ? 'border-primary bg-primary-light text-primary' 
            : 'border-transparent text-text-secondary hover:bg-hover-bg hover:text-text-primary'"
          @click="isMobileMenuOpen = false"
        >
          <component :is="item.icon" class="text-lg mr-3" :class="isActive(item.path) ? 'text-primary' : 'text-text-muted'" />
          {{ item.name }}
        </router-link>
      </nav>
    </AppDrawer>

    <!-- Left Sidebar (Desktop only) -->
    <div class="settings-sidebar hidden md:flex w-[240px] flex-shrink-0 bg-sidebar-bg border-r border-border-color flex-col">
      <!-- Back to Workspace -->
      <div class="h-[64px] px-6 border-b border-border-color flex items-center">
        <router-link to="/dashboard" class="flex items-center text-text-secondary hover:text-text-primary transition-colors font-medium text-sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Workspace
        </router-link>
      </div>
      
      <!-- Nav Menu -->
      <nav class="flex-1 overflow-y-auto py-4" >
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          style="padding-bottom:10px !important;padding-top:10px !important; text-decoration: none;"
          class="flex items-center px-6 py-10 text-sm font-medium transition-colors border-l-4" 
          :class="isActive(item.path) 
            ? 'border-primary bg-primary-light text-primary' 
            : 'border-transparent text-text-secondary hover:bg-sidebar-hover-bg hover:text-sidebar-text-hover'"
        >
          <component :is="item.icon" class="text-lg mr-3" :class="isActive(item.path) ? 'text-primary' : 'text-text-muted'" />
          {{ item.name }}
        </router-link>
      </nav>
    </div>

    <!-- Right Content Area -->
    <div class="flex-1 flex flex-col min-w-0 bg-body-bg">
      
      <!-- Header Bar -->
      <header class="h-[64px] border-b border-border-color bg-card-bg px-4 md:px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-10 w-full">
        <div class="flex items-center gap-3">
          <button class="md:hidden p-2 text-text-secondary hover:text-text-primary" @click="isMobileMenuOpen = true">
            <MenuOutlined class="text-xl" />
          </button>
          <h1 class="text-xl font-semibold text-text-primary">{{ currentTitle }}</h1>
        </div>
        <div class="flex items-center gap-2 md:gap-3">
          <AppButton type="default" @click="discardChanges">Discard</AppButton>
          <AppButton type="primary" :loading="isSaving" @click="saveChanges">Save Changes</AppButton>
        </div>
      </header>

      <!-- Scrollable Main Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-8">
        <div class="max-w-[800px] mx-auto space-y-6">
          <router-view />
        </div>
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AppButton, AppDrawer } from '@/shared/components/ui'
import { useAccountSettings } from '../composables/useAccountSettings'
import {
  BankOutlined,
  LockOutlined,
  InfoCircleOutlined,
  BellOutlined,
  DollarCircleOutlined,
  SettingOutlined,
  AppstoreOutlined,
  MenuOutlined
} from '@ant-design/icons-vue'

const { isSaving, saveChanges, discardChanges } = useAccountSettings()
const route = useRoute()
const isMobileMenuOpen = ref(false)

const navItems = [
  { name: 'Company Information', path: '/settings/account/company-information', icon: BankOutlined },
  { name: 'Security & Users', path: '/settings/account/security-users', icon: LockOutlined },
  { name: 'DER Information', path: '/settings/account/der-information', icon: InfoCircleOutlined },
  { name: 'Notification Settings', path: '/settings/account/notifications', icon: BellOutlined },
  { name: 'Billing', path: '/settings/account/billing', icon: DollarCircleOutlined },
  { name: 'General Settings', path: '/settings/account/general', icon: SettingOutlined },
  { name: 'Applications', path: '/settings/account/applications', icon: AppstoreOutlined }
]

const isActive = (path: string) => {
  return route.path.includes(path)
}

const currentTitle = computed(() => {
  const item = navItems.find(n => isActive(n.path))
  return item ? item.name : 'Settings'
})
</script>

<style scoped>
/* Optional specific overrides */
</style>
