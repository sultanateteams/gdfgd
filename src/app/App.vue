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
import { computed, onMounted } from "vue"; // ← onMounted qo'shildi
import { theme as antdTheme } from "ant-design-vue";
import { useThemeStore } from "@/stores/themeStore";
import AppLayout from "@/layouts/AppLayout.vue";
import TranslationEditorModal from "@/components/TranslationEditorModal.vue";
import { useTranslationEditMode } from "@/composables/useTranslationEditMode";

const themeStore = useThemeStore();

// localStorage dan yuklash — ENG MUHIM
themeStore.initialize(); // ← bu qo'shildi (onMounted emas, darhol)

useTranslationEditMode();

const antTheme = computed(() => ({
  algorithm:
    themeStore.currentMode === "dark"
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: themeStore.currentTheme?.colors.accentPrimary ?? "#4f46e5",
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
