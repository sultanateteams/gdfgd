import { createI18n } from 'vue-i18n'
import uz from './locales/uz.json'
import en from './locales/en.json'
import ru from './locales/ru.json'
import { apiService } from '@/services/api'

const messages = {
  uz,
  en,
  ru
}

type Locale = keyof typeof messages

// Get saved locale from localStorage or default to 'uz'
const getSavedLocale = (): Locale => {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('preferred-locale')
    if (saved && (saved in messages)) {
      return saved as Locale
    }
  }
  return 'uz'
}

const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'en',
  messages
})

/**
 * Load translations for a specific locale from the API
 * If the locale already has translations loaded, this is a no-op
 * Falls back gracefully if API fails
 */
export async function loadTranslations(locale: string): Promise<void> {
  // Check if translations already loaded for this locale
  const availableLocales = i18n.global.availableLocales as string[]
  const messages = i18n.global.messages as Record<string, any>

  if (availableLocales.includes(locale) && messages[locale]) {
    i18n.global.locale.value = locale as Locale
    return
  }

  try {
    const data = await apiService.get<Record<string, string>>(`/translations/${locale}`)
    if (data && typeof data === 'object') {
      i18n.global.setLocaleMessage(locale as Locale, data as any)
    }
  } catch (error) {
    console.warn(`Failed to load translations for locale '${locale}':`, error)
  }

  i18n.global.locale.value = locale as Locale
}

export { i18n as default }