import { createI18n } from 'vue-i18n'
import uz from './locales/uz.json'
import en from './locales/en.json'
import ru from './locales/ru.json'

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

export default i18n