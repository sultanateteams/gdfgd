<template>
  <header class="header">
    <!-- Chap: Breadcrumb -->
    <div class="header-left">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <span class="breadcrumb-home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        </span>
        <span class="breadcrumb-sep">›</span>
        <span class="breadcrumb-current">{{ currentPageName }}</span>
      </nav>
    </div>

    <!-- O'rta: Search -->
    <!-- <HeaderSearch v-model="searchQuery" /> -->

    <!-- O'ng: Amallar -->
    <div class="header-right">
      <!-- <ThemeSwitcher /> -->
      <!-- Dark mode toggle -->
      <button class="icon-btn" @click="toggleDarkMode" :title="isDarkMode ? 'Light mode' : 'Dark mode'">
        <svg v-if="isDarkMode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </button>

      <!-- Notifications -->
      <HeaderNotifications />

      <div class="header-divider"></div>

      <!-- User menu -->
      <HeaderUser />
    </div>
  </header>
</template>

<script setup lang="ts">
import HeaderSearch from './header/HeaderSearch.vue'
import HeaderNotifications from './header/HeaderNotifications.vue'
import HeaderUser from './header/HeaderUser.vue'
import { useLayout } from '@/composables/useLayout'
import ThemeSwitcher from './header/ThemeSwitcher.vue'

const { searchQuery, currentPageName, isDarkMode, toggleDarkMode } = useLayout()
</script>

<style scoped>
.header {
  height: var(--header-height);
  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  flex-shrink: 0;
  z-index: 50;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
.breadcrumb-home { color: var(--text-secondary); display: flex; align-items: center; }
.breadcrumb-sep { color: var(--border-color); font-size: 16px; }
.breadcrumb-current { font-weight: 600; color: var(--text-primary); }

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
}
.icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--text-secondary);
  transition: all 0.2s;
}
.icon-btn:hover { background: var(--sidebar-hover-bg); color: var(--text-primary); }
.icon-btn svg { width: 16px; height: 16px; }

.header-divider {
  width: 1px;
  height: 28px;
  background: var(--border-color);
  margin: 0 4px;
}
</style>