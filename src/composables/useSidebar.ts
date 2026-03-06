// ═══════════════════════════════════════════════════════════
// useSidebar composable
// Sidebar-ga oid barcha mantiq shu yerda
// ═══════════════════════════════════════════════════════════
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { useLayoutStore } from '@/stores/layoutStore'
import { menuConfig, type AccordionItem } from '@/config/menuConfig'

export function useSidebar() {
  const layout = useLayoutStore()
  const route = useRoute()

  // Joriy route bo'yicha accordion avtomatik ochiladi
  function syncAccordionWithRoute(path: string) {
    const accordionGroups = menuConfig.find(g => g.type === 'accordion')?.items as AccordionItem[] || []
    for (const accordion of accordionGroups) {
      const hasActive = accordion.children.some(item =>
        item.to === '/' ? path === '/' : path.startsWith(item.to)
      )
      if (hasActive) {
        layout.openAccordion(accordion.id)
        return
      }
    }
    // Hech qaysi accordion ichida emas
    layout.setActiveAccordion(null)
  }

  // Route o'zgarganda accordion sinxronlanadi
  watch(() => route.path, syncAccordionWithRoute, { immediate: true })

  function isActive(path: string): boolean {
    if (path === '/') return route.path === '/'
    return route.path.startsWith(path)
  }

  return {
    isCollapsed: layout.isCollapsed,
    isMobileOpen: layout.isMobileOpen,
    activeAccordion: layout.activeAccordion,
    isActive,
    toggleSidebar: layout.toggleSidebar,
    closeMobileSidebar: layout.closeMobileSidebar,
    toggleAccordion: layout.setActiveAccordion,
  }
}