import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  DashboardStats, 
  AttendanceSummary, 
  DepartmentStats, 
  RecentActivity, 
  PayrollSummary, 
  LeaveSummary 
} from './types'
import { dashboardService } from './services'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const stats = ref<DashboardStats | null>(null)
  const attendanceSummary = ref<AttendanceSummary | null>(null)
  const departmentStats = ref<DepartmentStats[]>([])
  const recentActivity = ref<RecentActivity[]>([])
  const payrollSummary = ref<PayrollSummary | null>(null)
  const leaveSummary = ref<LeaveSummary | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasData = computed(() => stats.value !== null)
  const activeEmployeeRate = computed(() => {
    if (!stats.value) return 0
    return Math.round((stats.value.activeEmployees / stats.value.totalEmployees) * 100)
  })
  
  const pendingApprovalRate = computed(() => {
    if (!stats.value) return 0
    return Math.round((stats.value.pendingApprovals / stats.value.totalEmployees) * 100)
  })
  
  const payrollUtilization = computed(() => {
    if (!payrollSummary.value) return 0
    return Math.round((payrollSummary.value.processed / payrollSummary.value.totalBudget) * 100)
  })

  // Actions
  const loadStats = async (): Promise<void> => {
    if (stats.value) return

    try {
      isLoading.value = true
      error.value = null

      const data = await dashboardService.getStats()
      stats.value = data
    } catch (err) {
      console.error('Failed to load dashboard stats:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load dashboard stats'
    } finally {
      isLoading.value = false
    }
  }

  const loadAttendanceSummary = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const data = await dashboardService.getAttendanceSummary()
      attendanceSummary.value = data
    } catch (err) {
      console.error('Failed to load attendance summary:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load attendance summary'
    } finally {
      isLoading.value = false
    }
  }

  const loadDepartmentStats = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const data = await dashboardService.getDepartmentStats()
      departmentStats.value = data
    } catch (err) {
      console.error('Failed to load department stats:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load department stats'
    } finally {
      isLoading.value = false
    }
  }

  const loadRecentActivity = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const data = await dashboardService.getRecentActivity()
      recentActivity.value = data
    } catch (err) {
      console.error('Failed to load recent activity:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load recent activity'
    } finally {
      isLoading.value = false
    }
  }

  const loadPayrollSummary = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const data = await dashboardService.getPayrollSummary()
      payrollSummary.value = data
    } catch (err) {
      console.error('Failed to load payroll summary:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load payroll summary'
    } finally {
      isLoading.value = false
    }
  }

  const loadLeaveSummary = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const data = await dashboardService.getLeaveSummary()
      leaveSummary.value = data
    } catch (err) {
      console.error('Failed to load leave summary:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load leave summary'
    } finally {
      isLoading.value = false
    }
  }

  const initialize = async (): Promise<void> => {
    await Promise.all([
      loadStats(),
      loadAttendanceSummary(),
      loadDepartmentStats(),
      loadRecentActivity(),
      loadPayrollSummary(),
      loadLeaveSummary()
    ])
  }

  const refreshData = async (): Promise<void> => {
    await Promise.all([
      loadStats(),
      loadAttendanceSummary(),
      loadDepartmentStats(),
      loadRecentActivity(),
      loadPayrollSummary(),
      loadLeaveSummary()
    ])
  }

  const clearError = (): void => {
    error.value = null
  }

  const reset = (): void => {
    stats.value = null
    attendanceSummary.value = null
    departmentStats.value = []
    recentActivity.value = []
    payrollSummary.value = null
    leaveSummary.value = null
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    stats,
    attendanceSummary,
    departmentStats,
    recentActivity,
    payrollSummary,
    leaveSummary,
    isLoading,
    error,
    
    // Getters
    hasData,
    activeEmployeeRate,
    pendingApprovalRate,
    payrollUtilization,
    
    // Actions
    loadStats,
    loadAttendanceSummary,
    loadDepartmentStats,
    loadRecentActivity,
    loadPayrollSummary,
    loadLeaveSummary,
    initialize,
    refreshData,
    clearError,
    reset
  }
})