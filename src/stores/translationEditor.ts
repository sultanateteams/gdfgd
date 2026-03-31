import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTranslationEditorStore = defineStore('translationEditor', () => {
  const isEditMode = ref(false)
  const activeKey = ref<string | null>(null)
  const isModalOpen = ref(false)

  function openModal(key: string) {
    activeKey.value = key
    isModalOpen.value = true
  }

  function closeModal() {
    activeKey.value = null
    isModalOpen.value = false
  }

  function setEditMode(enabled: boolean) {
    isEditMode.value = enabled
  }

  return { isEditMode, activeKey, isModalOpen, openModal, closeModal, setEditMode }
})