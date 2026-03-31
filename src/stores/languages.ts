import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { apiService } from '@/services/api'

export interface Language {
  code: string
  name: string
  flag: string
  isDefault: boolean
  isActive: boolean
}

const STORAGE_KEY = 'app_languages'

export const useLanguagesStore = defineStore('languages', () => {
  const languages = ref<Language[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  // Load from localStorage immediately on store initialization
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          languages.value = parsed
        }
      } else {
        // Default languages if nothing in localStorage
        languages.value = [
          { code: 'uz', name: "O'zbek", flag: '🇺🇿', isDefault: true, isActive: true },
          { code: 'en', name: 'English', flag: '🇬🇧', isDefault: false, isActive: true },
          { code: 'ru', name: 'Русский', flag: '🇷🇺', isDefault: false, isActive: true }
        ]
        saveToStorage()
      }
    } catch (e) {
      console.error('Failed to load languages from localStorage:', e)
      languages.value = [
        { code: 'uz', name: "O'zbek", flag: '🇺🇿', isDefault: true, isActive: true },
        { code: 'en', name: 'English', flag: '🇬🇧', isDefault: false, isActive: true },
        { code: 'ru', name: 'Русский', flag: '🇷🇺', isDefault: false, isActive: true }
      ]
    }
  }

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(languages.value))
    } catch (e) {
      console.error('Failed to save languages to localStorage:', e)
    }
  }

  // Auto-save to localStorage on every change
  watch(
    languages,
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  // Computed: array of language codes
  const codes = computed(() => languages.value.map((lang) => lang.code))

  // Computed: only active languages
  const activeLanguages = computed(() => languages.value.filter((lang) => lang.isActive))

  // Computed: default locale code
  const defaultLocale = computed(() => {
    const defaultLang = languages.value.find((lang) => lang.isDefault)
    if (defaultLang) return defaultLang.code
    if (languages.value.length > 0) return languages.value[0]!.code
    return 'uz'
  })

  // Fetch languages from API
  const fetchLanguages = async () => {
    loading.value = true
    try {
      const data = await apiService.get<Language[]>('/languages')
      if (Array.isArray(data) && data.length > 0) {
        languages.value = data
        loaded.value = true
      }
    } catch (error) {
      console.warn('Failed to fetch languages from API, using localStorage data:', error)
      // Keep localStorage data, just mark as loaded
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  // Add a new language
  const addLanguage = async (lang: Omit<Language, 'isDefault'>) => {
    // Check for duplicate code
    const exists = languages.value.some((l) => l.code === lang.code)
    if (exists) {
      throw new Error('Language with this code already exists')
    }

    const newLang: Language = {
      ...lang,
      isDefault: languages.value.length === 0
    }

    try {
      await apiService.post<Language>('/languages', newLang)
    } catch (error) {
      console.warn('Failed to add language to API:', error)
    }

    languages.value.push(newLang)
  }

  // Update a language
  const updateLanguage = async (code: string, updates: Partial<Omit<Language, 'code'>>) => {
    const index = languages.value.findIndex((l) => l.code === code)
    if (index === -1) {
      throw new Error('Language not found')
    }

    try {
      await apiService.put<Language>(`/languages/${code}`, updates)
    } catch (error) {
      console.warn(`Failed to update language ${code} in API:`, error)
    }

    languages.value[index] = { ...languages.value[index]!, ...updates }
  }

  // Delete a language
  const deleteLanguage = async (code: string) => {
    const lang = languages.value.find((l) => l.code === code)
    if (!lang) {
      throw new Error('Language not found')
    }

    if (lang.isDefault) {
      throw new Error('Cannot delete the default language. Set another language as default first.')
    }

    try {
      await apiService.delete(`/languages/${code}`)
    } catch (error) {
      console.warn(`Failed to delete language ${code} from API:`, error)
    }

    const index = languages.value.findIndex((l) => l.code === code)
    if (index !== -1) {
      languages.value.splice(index, 1)
    }
  }

  // Set a language as default
  const setDefault = async (code: string) => {
    const lang = languages.value.find((l) => l.code === code)
    if (!lang) {
      throw new Error('Language not found')
    }

    try {
      await apiService.patch<Language>(`/languages/${code}`, { isDefault: true })
    } catch (error) {
      console.warn(`Failed to set default language in API:`, error)
    }

    languages.value.forEach((l) => {
      l.isDefault = l.code === code
    })
  }

  // Toggle active status
  const toggleActive = async (code: string) => {
    const lang = languages.value.find((l) => l.code === code)
    if (!lang) {
      throw new Error('Language not found')
    }

    const newStatus = !lang.isActive

    try {
      await apiService.patch<Language>(`/languages/${code}`, { isActive: newStatus })
    } catch (error) {
      console.warn(`Failed to toggle active status in API:`, error)
    }

    lang.isActive = newStatus
  }

  // Initialize from localStorage
  loadFromStorage()

  return {
    languages,
    loading,
    loaded,
    codes,
    activeLanguages,
    defaultLocale,
    fetchLanguages,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    setDefault,
    toggleActive
  }
})