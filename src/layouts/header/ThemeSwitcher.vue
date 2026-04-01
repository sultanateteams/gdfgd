<!-- src/components/layout/header/ThemeSwitcher.vue -->
<template>
  <div class="theme-switcher flex items-center gap-2">
    <!-- Dark/Light toggle -->
    <button class="mode-btn w-[25px] h-[25px]" @click="themeStore.toggleMode()">
      <svg
        v-if="themeStore.mode === 'dark'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>

    <!-- Theme Dropdown -->
    <Dropdown :trigger="['click']" placement="bottomRight">
      <!-- Trigger button -->
      <button
        class="theme-trigger flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-black/10 transition-colors"
      >
        <span
          class="w-3.5 h-3.5 rounded-full inline-block"
          :style="{ background: activeTheme.color }"
        />
        <!-- <span class="text-sm font-medium">{{ activeTheme.label }}</span> -->
        <svg
          class="w-3 h-3 opacity-60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <!-- Dropdown menu -->
      <template #overlay>
        <div class="theme-dropdown">
          <div
            v-for="theme in themes"
            :key="theme.name"
            class="theme-option"
            :class="{ active: themeStore.currentTheme === theme.name }"
            @click="themeStore.setTheme(theme.name)"
          >
            <span class="theme-dot" :style="{ background: theme.color }" />
            <span class="theme-name">{{ theme.label }}</span>
            <!-- Active check icon -->
            <svg
              v-if="themeStore.currentTheme === theme.name"
              class="check-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Dropdown } from "ant-design-vue";
import { useThemeStore } from "@/stores/themeStore";

const themeStore = useThemeStore();

const themes = [
  { name: "ocean", label: "Ocean", color: "#4f46e5" },
  { name: "forest", label: "Forest", color: "#16a34a" },
  { name: "sunset", label: "Sunset", color: "#f97316" },
  { name: "slate", label: "Slate", color: "#8b5cf6" },
];

const activeTheme = computed(
  () => themes.find((t) => t.name === themeStore.currentTheme) ?? themes[0],
);
</script>

<style scoped>
.theme-dropdown {
  min-width: 140px;
  background: var(--dropdown-bg, #fff);
  border: 1px solid var(--dropdown-border, #e5e7eb);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.dark .theme-dropdown {
  --dropdown-bg: #1e293b;
  --dropdown-border: #334155;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.theme-option:hover {
  background: rgba(0, 0, 0, 0.06);
}

.dark .theme-option:hover {
  background: rgba(255, 255, 255, 0.08);
}

.theme-option.active {
  background: rgba(0, 0, 0, 0.05);
}

.theme-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.theme-name {
  font-size: 13px;
  font-weight: 500;
  flex: 1;
  color: var(--text-color, #374151);
}

.dark .theme-name {
  --text-color: #e2e8f0;
}

.check-icon {
  width: 14px;
  height: 14px;
  color: #22c55e;
  flex-shrink: 0;
}
</style>
