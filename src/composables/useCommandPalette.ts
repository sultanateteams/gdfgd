/**
 * useCommandPalette Composable
 * Global Ctrl+K keyboard shortcut va modal boshqaruvi
 */

import { onMounted, onUnmounted } from 'vue'
import { useCommandPaletteStore } from '@/stores/commandPaletteStore'

export function useCommandPalette() {
  const store = useCommandPaletteStore()

  // Keyboard event handler
  function handleKeyDown(event: KeyboardEvent) {
    // Ctrl+K / Cmd+K - modalni ochish/yopish
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      
      // Agar modal ochiq bo'lsa va input focusda bo'lsa - yopish
      if (store.isOpen && document.activeElement?.getAttribute('data-command-input')) {
        store.close()
        return
      }
      
      // Modalni toggle qilish (faqat yopiq paytda ochiladi)
      if (!store.isOpen) {
        store.open()
      }
    }

    // Faqat modal ochiq bo'lganda ishlaydigan qisqa yo'llar
    if (!store.isOpen) return

    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        store.close()
        break

      case 'ArrowDown':
        event.preventDefault()
        store.navigateDown()
        break

      case 'ArrowUp':
        event.preventDefault()
        store.navigateUp()
        break

      case 'Enter':
        // Input da bo'lsa, active item ni tanlash
        if (document.activeElement?.getAttribute('data-command-input')) {
          event.preventDefault()
          store.selectActive()
        }
        break
    }
  }

  // Keyboard listener ni o'rnatish
  function setupKeyboardListener() {
    document.addEventListener('keydown', handleKeyDown)
  }

  // Keyboard listener ni olib tashlash
  function removeKeyboardListener() {
    document.removeEventListener('keydown', handleKeyDown)
  }

  // Vue lifecycle hooks bilan avtomatik boshqarish
  onMounted(() => {
    setupKeyboardListener()
  })

  onUnmounted(() => {
    removeKeyboardListener()
  })

  // Manual setup/teardown uchun
  function init() {
    setupKeyboardListener()
  }

  function destroy() {
    removeKeyboardListener()
  }

  return {
    // Store reference
    store,

    // Manual setup/teardown
    init,
    destroy,

    // Methods
    open: store.open,
    close: store.close,
    toggle: store.toggle,
  }
}