// src/stores/themeStore.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeName = 'ocean' | 'forest' | 'sunset' | 'slate'
export type ThemeMode = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  // localStorage dan oldingi sozlamalarni yuklash
  const currentTheme = ref<ThemeName>(
    (localStorage.getItem('hrm-theme') as ThemeName) || 'ocean'
  )
  const mode = ref<ThemeMode>(
    (localStorage.getItem('hrm-mode') as ThemeMode) || 'dark'
  )

  // Har safar o'zgarganda DOM va localStorage yangilanadi
  function applyTheme() {
    const root = document.documentElement
    root.setAttribute('data-theme', currentTheme.value)
    root.setAttribute('data-mode', mode.value)
    localStorage.setItem('hrm-theme', currentTheme.value)
    localStorage.setItem('hrm-mode', mode.value)
  }

  function setTheme(theme: ThemeName) {
    currentTheme.value = theme
    applyTheme()
  }

  function toggleMode() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    applyTheme()
  }

  function setMode(m: ThemeMode) {
    mode.value = m
    applyTheme()
  }

  // App yuklanganida darhol qo'llash
  applyTheme()

  return { currentTheme, mode, setTheme, toggleMode, setMode, applyTheme }
})