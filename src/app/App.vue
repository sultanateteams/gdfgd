<!-- App.vue -->
<template>
  <div id="app">
    <a-config-provider :theme="antTheme">
      <AppLayout>
        <router-view />
      </AppLayout>
    </a-config-provider>
    <TranslationEditorModal />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { theme as antdTheme } from "ant-design-vue";
import { useThemeStore } from "@/stores/themeStore";
import AppLayout from "@/layouts/AppLayout.vue";
import TranslationEditorModal from "@/components/TranslationEditorModal.vue";
import { useTranslationEditMode } from "@/composables/useTranslationEditMode";

const themeStore = useThemeStore();

// Initialize translation edit mode
useTranslationEditMode();

const primaryColors: Record<string, string> = {
  ocean: "#4f46e5",
  forest: "#16a34a",
  sunset: "#f97316",
  slate: "#8b5cf6",
};

const antTheme = computed(() => ({
  algorithm:
    themeStore.mode === "dark"
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: primaryColors[themeStore.currentTheme],
  },
}));
</script>
<style>
#app {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
}
</style>
