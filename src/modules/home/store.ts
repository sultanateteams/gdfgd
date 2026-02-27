import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { HomeStats, ActivityItem, QuickAction } from './types'
import { homeService } from './services'

export const useHomeStore = defineStore('home', () => {
  // State
  const stats = ref<HomeStats | null>(null)
  const activityFeed = ref<ActivityItem[]>([])
  const quickActions = ref<QuickAction[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasStats = computed(() => stats.value !== null)
  const recentActivity = computed(() => 
    activityFeed.value.slice(0, 5)
  )

  // Actions
  const loadStats = async (): Promise<void> => {
    if (stats.value) return

    try {
      isLoading.value = true
      error.value = null

      const data = await homeService.getStats()
      stats.value = data
    } catch (err) {
      console.error('Failed to load stats:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load stats'
    } finally {
      isLoading.value = false
    }
  }

  const loadActivityFeed = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const data = await homeService.getActivityFeed()
      activityFeed.value = data
    } catch (err) {
      console.error('Failed to load activity feed:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load activity feed'
    } finally {
      isLoading.value = false
    }
  }

  const loadQuickActions = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const data = await homeService.getQuickActions()
      quickActions.value = data
    } catch (err) {
      console.error('Failed to load quick actions:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load quick actions'
    } finally {
      isLoading.value = false
    }
  }

  const initialize = async (): Promise<void> => {
    await Promise.all([
      loadStats(),
      loadActivityFeed(),
      loadQuickActions()
    ])
  }

  const clearError = (): void => {
    error.value = null
  }

  const reset = (): void => {
    stats.value = null
    activityFeed.value = []
    quickActions.value = []
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    stats,
    activityFeed,
    quickActions,
    isLoading,
    error,
    
    // Getters
    hasStats,
    recentActivity,
    
    // Actions
    loadStats,
    loadActivityFeed,
    loadQuickActions,
    initialize,
    clearError,
    reset
  }
})