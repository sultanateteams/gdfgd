// Dashboard module composables

import { onMounted } from 'vue'
import { useDashboardStore } from '../store'

export function useDashboard() {
  const dashboardStore = useDashboardStore()

  const initializeDashboard = async (): Promise<void> => {
    await dashboardStore.initialize()
  }

  const refreshDashboard = async (): Promise<void> => {
    await dashboardStore.refreshData()
  }

  onMounted(() => {
    initializeDashboard()
  })

  return {
    // State
    stats: dashboardStore.stats,
    attendanceSummary: dashboardStore.attendanceSummary,
    departmentStats: dashboardStore.departmentStats,
    recentActivity: dashboardStore.recentActivity,
    payrollSummary: dashboardStore.payrollSummary,
    leaveSummary: dashboardStore.leaveSummary,
    isLoading: dashboardStore.isLoading,
    error: dashboardStore.error,
    
    // Getters
    hasData: dashboardStore.hasData,
    activeEmployeeRate: dashboardStore.activeEmployeeRate,
    pendingApprovalRate: dashboardStore.pendingApprovalRate,
    payrollUtilization: dashboardStore.payrollUtilization,
    
    // Actions
    initializeDashboard,
    refreshDashboard,
    clearError: dashboardStore.clearError
  }
}