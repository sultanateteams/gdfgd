<template>
  <!-- Mobile overlay -->
  <div
    v-if="isMobileOpen"
    class="sidebar-overlay"
    @click="layout.closeMobileSidebar"
  />

  <aside
    class="sidebar"
    :class="{ 'mobile-open': isMobileOpen }"
  >
    <SidebarLogo
      :collapsed="isCollapsed"
      @toggle="layout.toggleSidebar"
    />
    <SidebarNav :collapsed="isCollapsed" />
  </aside>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/stores/layoutStore'
import SidebarLogo from './sidebar/SidebarLogo.vue'
import SidebarNav from './sidebar/SidebarNav.vue'

const layout = useLayoutStore()
const { isCollapsed, isMobileOpen } = storeToRefs(layout)
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 300ms var(--transition);
  position: relative;
  z-index: 100;
  border-right: 1px solid rgba(255, 255, 255, 0.04);
}

/* Mobile */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 90;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: var(--sidebar-width) !important;
    transform: translateX(-100%);
    transition: transform 300ms var(--transition);
    z-index: 110;
  }
  .sidebar.mobile-open {
    transform: translateX(0);
  }
}
</style>