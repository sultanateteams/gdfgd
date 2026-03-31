import { onMounted, onUnmounted, watch } from 'vue'
import { useTranslationEditorStore } from '@/stores/translationEditor'
import { getTranslationKeyByText } from '@/composables/useT'

// Check if we're in development mode or if user is admin
const isDev = import.meta.env.DEV
const checkIsAdmin = (): boolean => {
  // You can customize this logic based on your auth system
  const userRole = localStorage.getItem('user_role')
  return userRole === 'admin'
}

const shouldEnableEditor = (): boolean => {
  return isDev || checkIsAdmin()
}

export function useTranslationEditMode() {
  const store = useTranslationEditorStore()
  const pressedKeys = new Set<string>()

  // Guard: only enable in dev mode or for admin users
  if (!shouldEnableEditor()) {
    return
  }

  function onKeyDown(e: KeyboardEvent) {
    pressedKeys.add(e.key.toLowerCase())
    if (pressedKeys.has('l') && pressedKeys.has('k')) {
      store.setEditMode(true)
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    pressedKeys.delete(e.key.toLowerCase())
    if (!pressedKeys.has('l') || !pressedKeys.has('k')) {
      store.setEditMode(false)
    }
  }

  function annotateTranslationElements() {
    const allElements = Array.from(document.body.querySelectorAll<HTMLElement>('*'))
    allElements.forEach((el) => {
      if (el.hasAttribute('data-t-key')) return
      if (el.children.length > 0) return

      const text = el.textContent?.trim()
      if (!text) return

      const key = getTranslationKeyByText(text)
      if (key) {
        el.setAttribute('data-t-key', key)
      }
    })
  }

  function onClick(e: MouseEvent) {
    if (!store.isEditMode || e.button !== 0) return

    const clickedElement = (e.target as HTMLElement) as HTMLElement
    const el = clickedElement.closest('[data-t-key]') as HTMLElement | null

    let key = el?.getAttribute('data-t-key') ?? null

    if (!key) {
      const text = clickedElement.textContent?.trim() ?? ''
      key = getTranslationKeyByText(text)
    }

    if (key) {
      e.preventDefault()
      e.stopPropagation()
      store.openModal(key)
    }
  }

  // Watch for edit mode changes and toggle visual feedback
  watch(() => store.isEditMode, (val) => {
    document.body.classList.toggle('t-edit-mode', val)
    if (val) {
      annotateTranslationElements()
    }
  })

  onMounted(() => {
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    // Use capture phase to intercept clicks before they reach other handlers
    document.addEventListener('click', onClick, true)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('keyup', onKeyUp)
    document.removeEventListener('click', onClick, true)
  })
}