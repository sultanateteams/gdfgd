<template>
  <div class="language-switcher" ref="wrapperRef">
    <button class="icon-btn" @click="toggle" :title="'Tilni o\'zgartirish'">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
      <span class="locale-label">{{ currentLocale.toUpperCase() }}</span>
      <svg
        class="chevron"
        :class="{ rotated: isOpen }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div class="dropdown language-dropdown" v-if="isOpen" @click.stop>
        <div v-if="languagesStore.loading && languagesStore.languages.length === 0" class="dropdown-loading">
          <span class="loading-spinner"></span>
          Loading...
        </div>
        <button
          v-else
          v-for="lang in languagesStore.activeLanguages"
          :key="lang.code"
          class="dropdown-item"
          :class="{ active: currentLocale === lang.code }"
          @click="changeLocale(lang.code)"
        >
          <span class="lang-flag">{{ lang.flag }}</span>
          <span class="lang-name">{{ lang.name }}</span>
          <svg v-if="currentLocale === lang.code" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useLanguagesStore } from '@/stores/languages'
import { loadTranslations } from '@/i18n'

const languagesStore = useLanguagesStore()
const { activeLanguages } = storeToRefs(languagesStore)

const { locale } = useI18n()

const isOpen = ref(false)
const wrapperRef = ref<HTMLElement>()

const currentLocale = computed(() => locale.value)

function toggle() {
  isOpen.value = !isOpen.value
}

async function changeLocale(code: string) {
  // Load translations if not already loaded
  await loadTranslations(code)
  locale.value = code
  isOpen.value = false
  // Save preference to localStorage
  localStorage.setItem('preferred-locale', code)
}

function handleClickOutside(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleEsc)
  // Restore preference from localStorage
  const saved = localStorage.getItem('preferred-locale')
  if (saved && languagesStore.codes.includes(saved)) {
    locale.value = saved
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
.language-switcher {
  position: relative;
}

.icon-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  color: var(--text-secondary);
  transition: all 0.2s;
  font-size: 12px;
  font-weight: 600;
}

.icon-btn:hover {
  background: var(--sidebar-hover-bg);
  color: var(--text-primary);
}

.icon-btn svg {
  width: 16px;
  height: 16px;
}

.locale-label {
  font-size: 11px;
  font-weight: 700;
  min-width: 20px;
}

.chevron {
  width: 12px;
  height: 12px;
  transition: transform 200ms var(--transition);
}

.chevron.rotated {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  z-index: 200;
  overflow: hidden;
}

.language-dropdown {
  width: 160px;
  padding: 6px;
}

.dropdown-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  color: var(--text-secondary);
  font-size: 13px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 7px;
  font-size: 13.5px;
  color: var(--text-primary);
  transition: background 150ms;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  font-family: inherit;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--body-bg);
}

.dropdown-item.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}

.lang-flag {
  font-size: 18px;
}

.lang-name {
  flex: 1;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: var(--primary);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 200ms,
    transform 200ms;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>