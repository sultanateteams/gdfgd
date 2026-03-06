// ═══════════════════════════════════════════════════════════
// LAYOUT STORE (Pinia)
// Sidebar, dark mode, va global UI holatini boshqaradi
// ═══════════════════════════════════════════════════════════
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  // ── State ────────────────────────────────────────────────
  const isCollapsed = ref(false)
  const isMobileOpen = ref(false)
  const isDarkMode = ref(false)
  const activeAccordion = ref<string | null>(null)

  // ── Dark mode persistence ────────────────────────────────
  const savedDark = localStorage.getItem('hrm-dark-mode')
  if (savedDark !== null) isDarkMode.value = savedDark === 'true'

  watch(isDarkMode, (val) => {
    localStorage.setItem('hrm-dark-mode', String(val))
    document.documentElement.classList.toggle('dark', val)
  }, { immediate: true })

  // ── Sidebar collapse persistence ─────────────────────────
  const savedCollapsed = localStorage.getItem('hrm-sidebar-collapsed')
  if (savedCollapsed !== null) isCollapsed.value = savedCollapsed === 'true'

  watch(isCollapsed, (val) => {
    localStorage.setItem('hrm-sidebar-collapsed', String(val))
  })

  // ── Actions ──────────────────────────────────────────────
  function toggleSidebar() {
    if (window.innerWidth < 768) {
      isMobileOpen.value = !isMobileOpen.value
    } else {
      isCollapsed.value = !isCollapsed.value
    }
  }

  function closeMobileSidebar() {
    isMobileOpen.value = false
  }

  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
  }

  function setActiveAccordion(id: string | null) {
    activeAccordion.value = activeAccordion.value === id ? null : id
  }

  function openAccordion(id: string) {
    activeAccordion.value = id
  }

  function handleResize() {
    if (window.innerWidth >= 768) {
      isMobileOpen.value = false
    }
  }

  return {
    // State
    isCollapsed,
    isMobileOpen,
    isDarkMode,
    activeAccordion,
    // Actions
    toggleSidebar,
    closeMobileSidebar,
    toggleDarkMode,
    setActiveAccordion,
    openAccordion,
    handleResize,
  }
})