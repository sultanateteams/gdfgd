// ═══════════════════════════════════════════════════════════
// USE LEAVE COMPOSABLE
// Ta'til so'rovlarini boshqarish uchun composable
// ═══════════════════════════════════════════════════════════

import { ref, onMounted } from 'vue'
import { attendanceService } from '../services/attendanceService'
import type {
  LeaveRequest,
  LeaveBalance,
  LeaveFilters,
  CreateLeaveRequestDto
} from '../types'

export function useLeave(employeeId?: string) {
  const leaveRequests = ref<LeaveRequest[]>([])
  const leaveBalance = ref<LeaveBalance | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<LeaveFilters>({})

  // ═══════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════

  async function fetchLeaveRequests() {
    isLoading.value = true
    error.value = null

    try {
      const response = await attendanceService.getLeaveRequests({
        ...filters.value,
        page: 1,
        pageSize: 100
      })
      leaveRequests.value = response.data
    } catch (err) {
      console.error('Fetch leave requests error:', err)
      error.value = err instanceof Error ? err.message : 'Leave requests yuklashda xatolik'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchLeaveBalance(empId: string) {
    isLoading.value = true
    error.value = null

    try {
      leaveBalance.value = await attendanceService.getLeaveBalance(empId)
    } catch (err) {
      console.error('Fetch leave balance error:', err)
      error.value = err instanceof Error ? err.message : 'Balansni yuklashda xatolik'
    } finally {
      isLoading.value = false
    }
  }

  async function submitLeaveRequest(data: CreateLeaveRequestDto) {
    isLoading.value = true
    error.value = null

    try {
      const newRequest = await attendanceService.createLeaveRequest(data)
      leaveRequests.value.unshift(newRequest)
      await fetchLeaveBalance(data.employeeId)
      return newRequest
    } catch (err) {
      console.error('Submit leave request error:', err)
      error.value = err instanceof Error ? err.message : "So'rov yuborishda xatolik"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function approveLeave(id: string, note?: string) {
    isLoading.value = true
    error.value = null

    try {
      await attendanceService.approveLeave(id, note)
      const index = leaveRequests.value.findIndex(r => r.id === id)
      if (index !== -1 && leaveRequests.value[index]) {
        leaveRequests.value[index].status = 'approved'
        leaveRequests.value[index].reviewedBy = '1'
        leaveRequests.value[index].reviewedAt = new Date().toISOString()
        if (note) leaveRequests.value[index].reviewNote = note
      }
    } catch (err) {
      console.error('Approve leave error:', err)
      error.value = err instanceof Error ? err.message : "So'rovni tasdiqlashda xatolik"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function rejectLeave(id: string, note: string) {
    isLoading.value = true
    error.value = null

    try {
      await attendanceService.rejectLeave(id, note)
      const index = leaveRequests.value.findIndex(r => r.id === id)
      if (index !== -1 && leaveRequests.value[index]) {
        leaveRequests.value[index].status = 'rejected'
        leaveRequests.value[index].reviewedBy = '1'
        leaveRequests.value[index].reviewedAt = new Date().toISOString()
        leaveRequests.value[index].reviewNote = note
      }
    } catch (err) {
      console.error('Reject leave error:', err)
      error.value = err instanceof Error ? err.message : "So'rovni rad etishda xatolik"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function cancelLeave(id: string) {
    isLoading.value = true
    error.value = null

    try {
      // Mock - cancel funksiyasi service da yo'q, shuning uchun local update
      const index = leaveRequests.value.findIndex(r => r.id === id)
      if (index !== -1 && leaveRequests.value[index] && leaveRequests.value[index].status === 'pending') {
        leaveRequests.value[index].status = 'cancelled'
      }
    } catch (err) {
      console.error('Cancel leave error:', err)
      error.value = err instanceof Error ? err.message : "So'rovni bekor qilishda xatolik"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function setFilters(newFilters: LeaveFilters) {
    filters.value = { ...filters.value, ...newFilters }
    fetchLeaveRequests()
  }

  // ═══════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════

  onMounted(() => {
    if (filters.value.employeeId) {
      fetchLeaveRequests()
      fetchLeaveBalance(filters.value.employeeId)
    }
  })

  // ═══════════════════════════════════════════════════════════
  // EXPORT
  // ═══════════════════════════════════════════════════════════

  return {
    // State
    leaveRequests,
    leaveBalance,
    isLoading,
    error,
    filters,

    // Methods
    fetchLeaveRequests,
    fetchLeaveBalance,
    submitLeaveRequest,
    approveLeave,
    rejectLeave,
    cancelLeave,
    setFilters
  }
}

export default useLeave