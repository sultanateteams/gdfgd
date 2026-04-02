/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/**
 * Vite environment variables type definitions
 * Barcha VITE_ prefixi bilan boshlangan o'zgaruvchilar
 */
interface ImportMetaEnv {
  /** API bazaviy URL manzili */
  readonly VITE_API_BASE_URL: string
  
  /** Ilova nomi */
  readonly VITE_APP_NAME: string
  
  /** Ilova versiyasi */
  readonly VITE_APP_VERSION: string
  
  /** Mock rejimi yoqilganmi? (true/false) */
  readonly VITE_USE_MOCK: string
  
  /** WebSocket URL (ixtiyoriy) */
  readonly VITE_WEBSOCKET_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}