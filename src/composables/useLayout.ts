// ═══════════════════════════════════════════════════════════
// useLayout composable
// Header va sahifa darajasidagi mantiq
// ═══════════════════════════════════════════════════════════
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getAllNavItems } from '@/config/menuConfig'
import { useLayoutStore } from '@/stores/layoutStore'

export function useLayout() {
  const route = useRoute()
  const layout = useLayoutStore()
  const searchQuery = ref('')

  const currentPageName = computed(() => {
    const allItems = getAllNavItems()
    const current = allItems.find(item =>
      item.to === '/' ? route.path === '/' : route.path.startsWith(item.to + '/')
    ) || allItems.find(item => item.to === route.path)
    return current?.label ?? 'Dashboard'
  })

  return {
    searchQuery,
    currentPageName,
    isDarkMode: computed(() => layout.isDarkMode),
    toggleDarkMode: layout.toggleDarkMode,
  }
}