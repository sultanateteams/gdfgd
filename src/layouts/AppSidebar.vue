<template>
  <!-- Mobile overlay -->
  <div
    v-if="isMobileOpen"
    class="sidebar-overlay"
    @click="layout.closeMobileSidebar"
  />
  
  <!-- Sidebar wrapper - doimiy joy egallaydi -->
  <div 
    class="sidebar-wrapper"
    :class="{ 'is-collapsed': isCollapsed }"
  >
    <aside
      class="sidebar"
      :class="{
        'mobile-open': isMobileOpen,
        'is-hovered': isHovered && isCollapsed,
      }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <SidebarLogo
        :collapsed="isCollapsed && !isHovered"
        @toggle="layout.toggleSidebar"
      />
      <SidebarNav :collapsed="isCollapsed && !isHovered" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useLayoutStore } from "@/stores/layoutStore";
import SidebarLogo from "./sidebar/SidebarLogo.vue";
import SidebarNav from "./sidebar/SidebarNav.vue";

const layout = useLayoutStore();
const { isCollapsed, isMobileOpen } = storeToRefs(layout);

const isHovered = ref(false);
</script>

<style scoped>
:root {
  --sidebar-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Sidebar wrapper - doimiy joy egallaydi */
.sidebar-wrapper {
  width: var(--sidebar-width);
  flex-shrink: 0;
  transition: width 300ms var(--transition);
  position: relative;
}

.sidebar-wrapper.is-collapsed {
  width: 79px; /* collapsed holatdagi eni */
}

/* Asosiy sidebar */
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  border-right: 1px solid var(--border-color);
  z-index: 100;
  
  /* Smooth transitions */
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(0);
  opacity: 1;
}

/* Collapsed bo'lganda sidebar eni */
.sidebar-wrapper.is-collapsed .sidebar {
  width: 79px;
}

/* Hover holati - absolute bo'lib ochiladi */
.sidebar.is-hovered {
  position: absolute !important;
  width: var(--sidebar-width) !important;
  z-index: 120;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  background: var(--sidebar-bg);
  
  /* Silliq chiqish animatsiyasi */
  transform: translateX(0);
  opacity: 1;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hoverdan chiqqanda biroz sekinroq yopilish */
.sidebar:not(.is-hovered) {
  transition: all 350ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Wrapper o'zgarmaydi - hoverda ham 79pxligicha qoladi */
.sidebar-wrapper.is-collapsed .sidebar.is-hovered {
  position: absolute !important;
}

/* Sidebar ichidagi elementlar uchun transition */
.sidebar :deep(.logo),
.sidebar :deep(.nav-item),
.sidebar :deep(.nav-text) {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 90;
  
  /* Overlay uchun ham transition */
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 768px) {
  .sidebar-wrapper {
    width: 0 !important;
    transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: var(--sidebar-width) !important;
    transform: translateX(-100%);
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 110;
    box-shadow: none;
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
  }

  /* Mobilda hover effektini o'chiramiz */
  .sidebar.is-hovered {
    position: fixed !important;
    box-shadow: none;
    transform: translateX(0);
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* Hover effekti uchun qo'shimcha silliqlik */
@media (hover: hover) {
  .sidebar {
    will-change: transform, width, box-shadow;
  }
  
  .sidebar.is-hovered {
    will-change: transform, box-shadow;
  }
}
</style>