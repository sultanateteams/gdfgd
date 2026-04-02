// ═══════════════════════════════════════════════════════════
// APP CONFIGURATION
// Global ilova konfiguratsiyasi - barcha muhit o'zgaruvchilari
// ═══════════════════════════════════════════════════════════

export interface AppConfig {
  /** API bazaviy URL manzili */
  apiBaseUrl: string
  
  /** Ilova nomi */
  appName: string
  
  /** Ilova versiyasi */
  appVersion: string
  
  /** Mock rejimi yoqilganmi? */
  useMock: boolean
}

/**
 * Muhit o'zgaruvchilaridan konfiguratsiyani yuklash
 * Barcha VITE_ oldidan boshlangan o'zgaruvchilar avtomatik ravishda
 * import.meta.env orqali mavjud bo'ladi
 */
const loadConfig = (): AppConfig => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
  const appName = import.meta.env.VITE_APP_NAME || 'HRM System'
  const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0'
  const useMockRaw = import.meta.env.VITE_USE_MOCK || 'false'
  
  // String qiymatni boolean ga aylantirish
  const useMock = useMockRaw.toLowerCase() === 'true'
  
  return {
    apiBaseUrl,
    appName,
    appVersion,
    useMock
  }
}

/**
 * Global konfiguratsiya obyekti
 * Ilovaning barcha joylarida ishlatish uchun
 */
export const appConfig: AppConfig = loadConfig()

/**
 * Konfiguratsiyani qayta yuklash (kerak bo'lganda)
 */
export function reloadConfig(): AppConfig {
  const newConfig = loadConfig()
  appConfig.apiBaseUrl = newConfig.apiBaseUrl
  appConfig.appName = newConfig.appName
  appConfig.appVersion = newConfig.appVersion
  appConfig.useMock = newConfig.useMock
  return appConfig
}

// Default export
export default appConfig