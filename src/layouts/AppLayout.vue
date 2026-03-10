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
  --primary: #4f46e5;
  --primary-dark: #3730a3;
  --primary-light: #eef2ff;
  --accent: #06b6d4;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;

  --sidebar-bg: var(--sidebar-bg);
  --sidebar-text: #94a3b8;
  --sidebar-text-hover: #cbd5e1;
  --sidebar-active-bg: rgba(79, 70, 229, 0.15);
  --sidebar-hover-bg: rgba(255, 255, 255, 0.05);
  --sidebar-group-label: #475569;
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 72px;

  --header-bg: #ffffff;
  --header-border: #e2e8f0;
  --header-height: 74px;

  --body-bg: #f8fafc;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --card-bg: #ffffff;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  --radius: 10px;
  --transition: cubic-bezier(0.4, 0, 0.2, 1);

  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--body-bg);
}

/* Dark mode overrides */
.layout.dark-mode {
  --header-bg: #1e293b;
  --header-border: #334155;
  --body-bg: #0f172a;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #334155;
  --card-bg: #1e293b;
  --sidebar-bg: #020617;
  --sidebar-group-label: #334155;
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