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
  /* Structural layout variables only — colors come from themes.css */
  --sidebar-width: 256px;
  --sidebar-collapsed-width: 80px;
  --header-height: 64px;
  --radius: 8px;
  --transition: cubic-bezier(0.645, 0.045, 0.355, 1);

  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--body-bg);
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