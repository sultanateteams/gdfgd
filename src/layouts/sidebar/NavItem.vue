<template>
  <RouterLink
    :to="item.to"
    class="nav-item"
    :class="[{ active: isActive(item.to), 'child-item': isChild }, customClass]"
    :title="collapsed ? item.label : ''"
  >
    <span class="nav-icon" v-html="item.icon" />
    <span class="nav-label" v-if="!collapsed">{{ item.label }}</span>
    <span v-if="item.badge && !collapsed" class="nav-badge">{{ item.badge }}</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
import type { NavItem } from '@/config/menuConfig'

defineProps<{
  item: NavItem
  collapsed?: boolean
  isChild?: boolean
  customClass?: string
}>()

const { isActive } = useSidebar()
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px;
  border-radius: 8px;
  color: var(--sidebar-text);
  text-decoration: none;
  transition: all 150ms var(--transition);
  position: relative;
  cursor: pointer;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  border-left: 3px solid transparent;
}
.nav-item:hover {
  background: var(--sidebar-hover-bg);
  color: var(--sidebar-text-hover);
}
.nav-item.active {
  background: var(--sidebar-active-bg);
  color: #818cf8;
  border-left-color: var(--primary);
}
.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-icon :deep(svg) {
  width: 18px;
  height: 18px;
  transition: stroke 150ms;
}
.nav-item.active .nav-icon :deep(svg) {
  stroke: #818cf8;
}
.nav-label {
  font-size: 13.5px;
  font-weight: 500;
  transition: opacity 200ms var(--transition);
  flex: 1;
}
.nav-badge {
  background: var(--warning);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 20px;
  line-height: 1;
  flex-shrink: 0;
}

/* Collapsed holat */
.nav-item.collapsed {
  justify-content: center;
  padding: 12px 0;
  border-left: none;
  border-radius: 8px;
}
.nav-item.collapsed.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: var(--primary);
  border-radius: 0 2px 2px 0;
}

/* Child item */
.child-item {
  padding-left: 24px;
  font-size: 13px;
}
.child-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--sidebar-text-hover);
}
.child-item.active {
  background: rgba(79, 70, 229, 0.15);
  color: #818cf8;
  border-left-color: var(--primary);
}
</style>