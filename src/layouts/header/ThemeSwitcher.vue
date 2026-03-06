<!-- src/components/layout/header/ThemeSwitcher.vue -->
<template>
  <div class="theme-switcher">
    <!-- Dark/Light toggle -->
    <button class="mode-btn" @click="themeStore.toggleMode()">
      <SunIcon v-if="themeStore.mode === 'dark'" />
      <MoonIcon v-else />
    </button>

    <!-- Theme tanlov -->
    <div class="theme-dots">
      <button
        v-for="theme in themes"
        :key="theme.name"
        class="theme-dot"
        :class="{ active: themeStore.currentTheme === theme.name }"
        :style="{ background: theme.color }"
        :title="theme.label"
        @click="themeStore.setTheme(theme.name)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()

const themes = [
  { name: 'ocean',  label: 'Ocean',  color: '#4f46e5' },
  { name: 'forest', label: 'Forest', color: '#16a34a' },
  { name: 'sunset', label: 'Sunset', color: '#f97316' },
  { name: 'slate',  label: 'Slate',  color: '#8b5cf6' },
]
</script>