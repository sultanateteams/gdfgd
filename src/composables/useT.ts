import { useI18n } from 'vue-i18n'

export function useT() {
  const { t, locale } = useI18n()

  const l = (defaultText: string, key: string): string => {
    // Kalit mavjudmi tekshiradi
    const translated = t(key)
    
    // i18n kalit topilmasa o'zini qaytaradi, shu holatda default ishlatamiz
    if (translated === key) {
      return defaultText
    }
    
    return translated
  }

  return { l, locale }
}