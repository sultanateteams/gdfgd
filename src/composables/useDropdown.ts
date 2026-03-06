// ═══════════════════════════════════════════════════════════
// useDropdown composable
// Dropdown (user menu, notifications) holatini boshqaradi
// ═══════════════════════════════════════════════════════════
import { ref } from 'vue'

export function useDropdown() {
  const showUserDropdown = ref(false)
  const showNotifDropdown = ref(false)

  function toggleUserDropdown() {
    showUserDropdown.value = !showUserDropdown.value
    if (showUserDropdown.value) showNotifDropdown.value = false
  }

  function toggleNotifDropdown() {
    showNotifDropdown.value = !showNotifDropdown.value
    if (showNotifDropdown.value) showUserDropdown.value = false
  }

  function closeAllDropdowns() {
    showUserDropdown.value = false
    showNotifDropdown.value = false
  }

  return {
    showUserDropdown,
    showNotifDropdown,
    toggleUserDropdown,
    toggleNotifDropdown,
    closeAllDropdowns,
  }
}