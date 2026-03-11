<template>
  <div
    class="layout"
    :class="{
      'sidebar-collapsed': isCollapsed,
      'dark-mode': isDarkMode
    }"
  >
    <AppSidebar />

    <div class="main-area">
      <AppHeader />
      <main class="page-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterView } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useLayoutStore } from '@/stores/layoutStore'

const layout = useLayoutStore()
const { isCollapsed, isDarkMode } = storeToRefs(layout)

onMounted(() => window.addEventListener('resize', layout.handleResize))
onUnmounted(() => window.removeEventListener('resize', layout.handleResize))
</script>

<style>
/* ═══════════════════════════════════════
   GLOBAL CSS VARIABLES & RESET
   (scoped emas, chunki layout-level)
═══════════════════════════════════════ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: "DM Sans", "Segoe UI", system-ui, -apple-system, sans-serif;
}

.layout {
  --primary: #1677FF;
  --primary-dark: #0050b3;
  --primary-light: #e6f4ff;
  --accent: #1677ff;
  --success: #52c41a;
  --warning: #faad14;
  --danger: #ff4d4f;

  --sidebar-bg: #ffffff;
  --sidebar-text: rgba(0, 0, 0, 0.88);
  --sidebar-text-hover: #1677ff;
  --sidebar-active-bg: #e6f4ff;
  --sidebar-hover-bg: rgba(0, 0, 0, 0.04);
  --sidebar-group-label: rgba(0, 0, 0, 0.45);
  --sidebar-width: 256px;
  --sidebar-collapsed-width: 80px;

  --header-bg: #ffffff;
  --header-border: #f0f0f0;
  --header-height: 64px;

  --body-bg: #fafafa;
  --text-primary: rgba(0, 0, 0, 0.88);
  --text-secondary: rgba(0, 0, 0, 0.45);
  --border-color: #f0f0f0;
  --card-bg: #ffffff;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
  --radius: 8px;
  --transition: cubic-bezier(0.645, 0.045, 0.355, 1);

  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--body-bg);
}

/* Dark mode overrides */
.layout.dark-mode {
  --header-bg: #141414;
  --header-border: #303030;
  --body-bg: #000000;
  --text-primary: rgba(255, 255, 255, 0.85);
  --text-secondary: rgba(255, 255, 255, 0.45);
  --border-color: #303030;
  --card-bg: #141414;
  --sidebar-bg: #141414;
  --sidebar-group-label: rgba(255, 255, 255, 0.45);
}

/* Sidebar collapsed */
.layout.sidebar-collapsed .sidebar {
  width: var(--sidebar-collapsed-width);
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .page-content { padding: 16px; }
}
</style>