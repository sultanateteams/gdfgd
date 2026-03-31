import { useI18n } from "vue-i18n";

const translationKeyCache = new Map<string, { text: string; defaultText: string }>()
const translationTextCache = new Map<string, string>()

export function getTranslationKeyByText(text: string): string | null {
  return translationTextCache.get(text) ?? null
}

export function getTranslationDefaultText(key: string): string | null {
  return translationKeyCache.get(key)?.defaultText ?? null
}

export function getAllTranslationKeys(): string[] {
  return [...translationKeyCache.keys()].map(k => k)
}

export function registerTranslationKey(key: string, text: string, defaultText?: string) {
  if (!key) return
  const normalized = text?.toString?.() ?? ''
  translationKeyCache.set(key, { text: normalized, defaultText: defaultText ?? normalized })
  translationTextCache.set(normalized, key)
}

export function useT() {
  const { t, locale } = useI18n({ useScope: "global" })

  const l = (defaultText: string, key: string): string => {
    const translated = t(key)
    const value = translated === key ? defaultText : translated

    registerTranslationKey(key, value, defaultText)
    return value
  }

  return { l, locale }
}
