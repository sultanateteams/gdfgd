<template>
  <div class="sidebar-logo">
    <Transition name="fade">
      <div class="logo-icon" v-if="!collapsed">
        <svg viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#4F46E5" />
          <path d="M8 22L16 10L24 22" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="16" cy="10" r="2" fill="#06B6D4" />
        </svg>
      </div>
    </Transition>

    <Transition name="fade">
      <div class="logo-text" v-if="!collapsed">
        <span class="logo-name">HRM System</span>
        <span class="logo-version">v2.0</span>
      </div>
    </Transition>

    <button class="hamburger-btn" @click="$emit('toggle')" aria-label="Toggle sidebar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12h18M3 6h18M3 18h18" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<style scoped>
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  height: var(--header-height);
}
.logo-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}
.logo-icon svg {
  width: 100%;
  height: 100%;
}
.logo-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
}
.logo-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  line-height: 1.2;
}
.logo-version {
  font-size: 10px;
  font-weight: 600;
  color: var(--accent);
  background: rgba(6, 182, 212, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.2);
  padding: 1px 6px;
  border-radius: 20px;
  display: inline-block;
  width: fit-content;
  margin-top: 3px;
}
.hamburger-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.07);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  color: #94a3b8;
  transition: background 150ms, color 150ms;
  flex-shrink: 0;
  margin-left: auto;
}
.hamburger-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #f1f5f9;
}
.hamburger-btn svg {
  width: 16px;
  height: 16px;
}

/* Collapsed holatda markaz */
.sidebar-collapsed .sidebar-logo {
  justify-content: center;
}
.sidebar-collapsed .hamburger-btn {
  margin-left: 0;
}

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 200ms, width 200ms;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  width: 0;
}
</style>