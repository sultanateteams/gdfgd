import { useI18n } from "vue-i18n";

const translationKeyCache = new Map<string, string>()
const translationTextCache = new Map<string, string>()

export function getTranslationKeyByText(text: string): string | null {
  return translationTextCache.get(text) ?? null
}

export function getAllTranslationKeys(): string[] {
  return [...translationKeyCache.keys()]
}

export function registerTranslationKey(key: string, text: string) {
  if (!key) return
  const normalized = text?.toString?.() ?? ''
  translationKeyCache.set(key, normalized)
  translationTextCache.set(normalized, key)
}

export function useT() {
  const { t, locale } = useI18n({ useScope: "global" })

  const l = (defaultText: string, key: string): string => {
    const translated = t(key)
    const value = translated === key ? defaultText : translated

    registerTranslationKey(key, value)
    return value
  }

  return { l, locale }
}
