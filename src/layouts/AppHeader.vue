<template>
  <header class="header">
    <!-- Chap: Breadcrumb -->
    <div class="header-left">
      <AppBreadcrumb
        :items="breadcrumbItems"
        separator="›"
        show-home
      />
    </div>

    <!-- O'rta: Search -->
    <!-- <HeaderSearch v-model="searchQuery" /> -->

    <!-- O'ng: Amallar -->
    <div class="header-right">
      <!-- Command Palette Trigger -->
      <button
        class="search-trigger"
        @click="openCommandPalette"
        :title="'Search pages and actions (Ctrl+K)'"
      >
        <svg
          class="search-trigger-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <span class="search-trigger-text">Search...</span>
        <kbd class="search-trigger-kbd">
          <span v-if="isMac">⌘</span>
          <span v-else>Ctrl</span>K
        </kbd>
      </button>

      <!-- Language switcher -->
      <LanguageSwitcher />

      <div class="header-divider"></div>

      <!-- Dark mode toggle -->
      <!-- <button class="icon-btn" @click="toggleDarkMode" :title="isDarkMode ? 'Light mode' : 'Dark mode'">
        <svg v-if="isDarkMode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </button> -->

      <ThemeSwitcher />
      <!-- Notifications -->
      <HeaderNotifications />

      <!-- <div class="header-divider"></div> -->
      <div class="header-divider"></div>

      <!-- User menu -->
      <HeaderUser />
    </div>

    <!-- Command Palette Component -->
    <CommandPalette />
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HeaderNotifications from "./header/HeaderNotifications.vue"
import HeaderUser from "./header/HeaderUser.vue"
import LanguageSwitcher from "./header/LanguageSwitcher.vue"
import CommandPalette from "@/components/CommandPalette.vue"
import { useLayout } from "@/composables/useLayout"
import ThemeSwitcher from "./header/ThemeSwitcher.vue"
import { useCommandPaletteStore } from "@/stores/commandPaletteStore"
import AppBreadcrumb from '@/shared/components/ui/AppBreadcrumb.vue'

const { currentPageName } = useLayout()

const commandPaletteStore = useCommandPaletteStore()

const breadcrumbItems = computed(() => [
  { title: currentPageName.value }
])

// Detect if running on Mac
const isMac = computed(() => {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0
})

// Open command palette
function openCommandPalette() {
  commandPaletteStore.open()
}
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
.icon-btn:hover {
  background: var(--sidebar-hover-bg);
  color: var(--text-primary);
}
.icon-btn svg {
  width: 16px;
  height: 16px;
}

.header-divider {
  width: 1px;
  height: 28px;
  background: var(--border-color);
  margin: 0 4px;
}

/* Command Palette Search Trigger */
.search-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 200px;
  height: 34px;
}

.search-trigger:hover {
  border-color: var(--text-muted);
  background: var(--hover-bg);
}

.search-trigger:active {
  transform: scale(0.98);
}

.search-trigger-icon {
  width: 14px;
  height: 14px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-trigger-text {
  flex: 1;
  text-align: left;
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
}

.search-trigger-kbd {
  font-size: 11px;
  padding: 2px 5px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-muted);
  font-family: inherit;
  line-height: 1;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .search-trigger {
    width: 34px;
    padding: 6px;
  }

  .search-trigger-text,
  .search-trigger-kbd {
    display: none;
  }
}
</style>
