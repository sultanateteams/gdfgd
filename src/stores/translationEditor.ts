import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTranslationEditorStore = defineStore('translationEditor', () => {
  const isEditMode = ref(false)
  const activeKey = ref<string | null>(null)
  const activeDefaultText = ref<string | null>(null)
  const isModalOpen = ref(false)

  function openModal(key: string, defaultText?: string) {
    activeKey.value = key
    activeDefaultText.value = defaultText ?? null
    isModalOpen.value = true
  }

  function closeModal() {
    activeKey.value = null
    activeDefaultText.value = null
    isModalOpen.value = false
  }

  function setEditMode(enabled: boolean) {
    isEditMode.value = enabled
  }

  return { isEditMode, activeKey, activeDefaultText, isModalOpen, openModal, closeModal, setEditMode }
})
