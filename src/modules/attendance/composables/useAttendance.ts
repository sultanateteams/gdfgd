// ═══════════════════════════════════════════════════════════
// USE ATTENDANCE COMPOSABLE
// Davomatni boshqarish uchun composable
// ═══════════════════════════════════════════════════════════

import { ref, computed, watch, onMounted } from 'vue'
import { attendanceService } from '../services/attendanceService'
import type { AttendanceRecord, AttendanceMonthlyReport } from '../types'

export function useAttendance(employeeId?: string) {
  const selectedMonth = ref<number>(new Date().getMonth() + 1)
  const selectedYear = ref<number>(new Date().getFullYear())
  const selectedEmployeeId = ref<string | null>(employeeId || null)
  const monthlyReport = ref<AttendanceMonthlyReport | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ═══════════════════════════════════════════════════════════
  // COMPUTED
  // ═══════════════════════════════════════════════════════════

  const todayStr = computed(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })

  const todayRecord = computed<AttendanceRecord | null>(() => {
    if (!monthlyReport.value || !selectedEmployeeId.value) return null
    return monthlyReport.value.records.find(r => r.date === todayStr.value) || null
  })

  const canCheckIn = computed(() => {
    if (!todayRecord.value) return true
    return !todayRecord.value.checkIn
  })

  const canCheckOut = computed(() => {
    if (!todayRecord.value) return false
    return !!todayRecord.value.checkIn && !todayRecord.value.checkOut
  })

  // ═══════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════

  async function fetchMonthlyReport() {
    if (!selectedEmployeeId.value) return

    isLoading.value = true
    error.value = null

    try {
      monthlyReport.value = await attendanceService.getMonthlyAttendance(
        selectedEmployeeId.value,
        selectedYear.value,
        selectedMonth.value
      )
    } catch (err) {
      console.error('Fetch monthly report error:', err)
      error.value = err instanceof Error ? err.message : 'Hisobotni yuklashda xatolik'
    } finally {
      isLoading.value = false
    }
  }

  async function doCheckIn() {
    if (!selectedEmployeeId.value || !canCheckIn.value) return

    isLoading.value = true
    try {
      await attendanceService.checkIn(selectedEmployeeId.value)
      await fetchMonthlyReport()
    } catch (err) {
      console.error('Check-in error:', err)
      error.value = err instanceof Error ? err.message : 'Kirishda xatolik'
    } finally {
      isLoading.value = false
    }
  }

  async function doCheckOut() {
    if (!todayRecord.value || !canCheckOut.value) return

    isLoading.value = true
    try {
      await attendanceService.checkOut(todayRecord.value.id)
      await fetchMonthlyReport()
    } catch (err) {
      console.error('Check-out error:', err)
      error.value = err instanceof Error ? err.message : 'Chiqishda xatolik'
    } finally {
      isLoading.value = false
    }
  }

  function setMonth(month: number) {
    selectedMonth.value = month
  }

  function setYear(year: number) {
    selectedYear.value = year
  }

  function setEmployee(id: string | null) {
    selectedEmployeeId.value = id
  }

  // ═══════════════════════════════════════════════════════════
  // WATCH
  // ═══════════════════════════════════════════════════════════

  watch(
    [selectedMonth, selectedYear, selectedEmployeeId],
    () => {
      if (selectedEmployeeId.value) {
        fetchMonthlyReport()
      }
    },
    { immediate: false }
  )

  onMounted(() => {
    if (selectedEmployeeId.value) {
      fetchMonthlyReport()
    }
  })

  // ═══════════════════════════════════════════════════════════
  // EXPORT
  // ═══════════════════════════════════════════════════════════

  return {
    // State
    selectedMonth,
    selectedYear,
    selectedEmployeeId,
    monthlyReport,
    isLoading,
    error,

    // Computed
    todayRecord,
    canCheckIn,
    canCheckOut,

    // Methods
    fetchMonthlyReport,
    doCheckIn,
    doCheckOut,
    setMonth,
    setYear,
    setEmployee
  }
}

export default useAttendance