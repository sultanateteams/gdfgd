<template>
  <div class="accordion-group">
    <!-- Accordion tugmasi -->
    <button
      class="accordion-header"
      :class="{ active: isOpen }"
      @click="$emit('toggle', accordion.id)"
      :title="collapsed ? accordion.label : ''"
    >
      <span class="accordion-icon" v-html="accordion.icon" />
      <span class="accordion-label" v-if="!collapsed">{{ accordion.label }}</span>
      <span v-if="accordion.badge && !collapsed" class="accordion-badge">{{ accordion.badge }}</span>
      <span class="accordion-chevron" :class="{ rotated: isOpen }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </button>

    <!-- Accordion kontenti -->
    <Transition name="accordion">
      <div class="accordion-content" v-show="isOpen && !collapsed">
        <NavItem
          v-for="item in accordion.children"
          :key="item.id"
          :item="item"
          :collapsed="collapsed"
          :is-child="true"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import NavItem from './NavItem.vue'
import type { AccordionItem } from '@/config/menuConfig'

defineProps<{
  accordion: AccordionItem
  isOpen: boolean
  collapsed?: boolean
}>()

defineEmits<{
  toggle: [id: string]
}>()
</script>

<style scoped>
.accordion-group {
  margin-bottom: 4px;
}

/* Header */
.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: var(--sidebar-text);
  transition: all 150ms var(--transition);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  border-left: 3px solid transparent;
}
.accordion-header:hover {
  background: var(--sidebar-hover-bg);
  color: var(--sidebar-text-hover);
}
.accordion-header.active {
  background: var(--sidebar-active-bg);
  color: var(--primary);
  border-left-color: var(--primary);
}

/* Icon */
.accordion-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.accordion-icon :deep(svg) {
  width: 18px;
  height: 18px;
  transition: stroke 150ms;
}
.accordion-header.active .accordion-icon :deep(svg) {
  stroke: var(--primary);
}

/* Label */
.accordion-label {
  font-size: 13.5px;
  font-weight: 500;
  flex: 1;
  text-align: left;
  transition: opacity 200ms var(--transition);
}

/* Badge */
.accordion-badge {
  background: var(--warning);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 20px;
  line-height: 1;
  flex-shrink: 0;
}

/* Chevron */
.accordion-chevron {
  width: 16px;
  height: 16px;
  color: var(--sidebar-text);
  transition: transform 200ms var(--transition);
  flex-shrink: 0;
}
.accordion-chevron.rotated {
  transform: rotate(180deg);
}
.accordion-header.active .accordion-chevron {
  color: var(--primary);
}

/* Content */
.accordion-content {
  padding-left: 12px;
  overflow: hidden;
}

/* Transition animatsiya */
.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>