// Home module composables

import { onMounted } from 'vue'
import { useHomeStore } from '../store'

export function useHome() {
  const homeStore = useHomeStore()

  const initializeHome = async (): Promise<void> => {
    await homeStore.initialize()
  }

  const refreshData = async (): Promise<void> => {
    await Promise.all([
      homeStore.loadStats(),
      homeStore.loadActivityFeed(),
      homeStore.loadQuickActions()
    ])
  }

  onMounted(() => {
    initializeHome()
  })

  return {
    // State
    stats: homeStore.stats,
    activityFeed: homeStore.activityFeed,
    quickActions: homeStore.quickActions,
    isLoading: homeStore.isLoading,
    error: homeStore.error,
    
    // Getters
    hasStats: homeStore.hasStats,
    recentActivity: homeStore.recentActivity,
    
    // Actions
    initializeHome,
    refreshData,
    clearError: homeStore.clearError
  }
}