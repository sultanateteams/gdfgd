// ═══════════════════════════════════════════════════════════
// USE PAYROLL COMPOSABLE
// Maosh hisob-kitoblari bilan ishlash uchun Vue 3 composable
// ═══════════════════════════════════════════════════════════

import { ref, computed, watch, onMounted } from 'vue'
import type { Ref } from 'vue'
import type {
  PayrollEntry,
  PayrollSummary,
  PayrollListParams,
  CreatePayrollDto
} from '../types'
import { payrollService } from '../services/payrollService'

/**
 * Payroll composable interfeysi
 */
export interface UsePayrollReturn {
  // Ma'lumotlar
  payrollList: Ref<PayrollEntry[]>
  summary: Ref<PayrollSummary | null>

  // Holat
  isLoading: Ref<boolean>
  error: Ref<string | null>
  filters: Ref<PayrollListParams>

  // Sahifalash
  currentPage: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
  totalPages: Ref<number>

  // Tanlangan oy/yil
  selectedMonth: Ref<number>
  selectedYear: Ref<number>

  // Amallar
  fetchPayroll: () => Promise<void>
  fetchSummary: () => Promise<void>
  createPayroll: (data: CreatePayrollDto) => Promise<PayrollEntry | null>
  calculatePayroll: (id: string) => Promise<PayrollEntry | null>
  approvePayroll: (id: string) => Promise<PayrollEntry | null>
  markAsPaid: (id: string) => Promise<PayrollEntry | null>
  clearError: () => void
  setFilters: (newFilters: Partial<PayrollListParams>) => void
}

/**
 * Payroll composable funksiyasi
 * Maosh hisob-kitoblari bilan ishlash uchun barcha kerakli
 * ma'lumotlar va funksiyalarni taqdim etadi
 */
export function usePayroll(): UsePayrollReturn {
  // ═══════════════════════════════════════════════════════════
  // MA'LUMOTLAR REFS
  // ═══════════════════════════════════════════════════════════

  /** Maosh yozuvlari ro'yxati */
  const payrollList = ref<PayrollEntry[]>([]) as Ref<PayrollEntry[]>

  /** Maosh xulosasi */
  const summary = ref<PayrollSummary | null>(null) as Ref<PayrollSummary | null>

  // ═══════════════════════════════════════════════════════════
  // HOLAT REFS
  // ═══════════════════════════════════════════════════════════

  /** Yuklanayotgan holat */
  const isLoading = ref(false)

  /** Xatolik xabari */
  const error = ref<string | null>(null)

  // ═══════════════════════════════════════════════════════════
  // SAHIFALASH REFS
  // ═══════════════════════════════════════════════════════════

  /** Joriy sahifa */
  const currentPage = ref(1)

  /** Bir sahifadagi elementlar soni */
  const pageSize = ref(10)

  /** Jami elementlar soni */
  const total = ref(0)

  /** Jami sahifalar soni */
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  // ═══════════════════════════════════════════════════════════
  // TANLANGAN OY/YIL
  // ═══════════════════════════════════════════════════════════

  const now = new Date()
  const currentMonth = now.getMonth() + 1 // 1-12
  const currentYear = now.getFullYear()

  /** Tanlangan oy */
  const selectedMonth = ref(currentMonth)

  /** Tanlangan yil */
  const selectedYear = ref(currentYear)

  // ═══════════════════════════════════════════════════════════
  // FILTERS (selectedMonth/selectedYear bilan sync)
  // ═══════════════════════════════════════════════════════════

  /** Filtrlar - selectedMonth/selectedYear va pagination bilan */
  const filters = computed<PayrollListParams>(() => ({
    month: selectedMonth.value,
    year: selectedYear.value,
    page: currentPage.value,
    pageSize: pageSize.value
  }))

  // ═══════════════════════════════════════════════════════════
  // FUNKSIYALAR
  // ═══════════════════════════════════════════════════════════

  /**
   * Xatolikni tozalash
   */
  function clearError(): void {
    error.value = null
  }

  /**
   * Filtrlarni yangilash
   */
  function setFilters(newFilters: Partial<PayrollListParams>): void {
    if (newFilters.month !== undefined) selectedMonth.value = newFilters.month
    if (newFilters.year !== undefined) selectedYear.value = newFilters.year
    if (newFilters.page !== undefined) currentPage.value = newFilters.page
    if (newFilters.pageSize !== undefined) {
      pageSize.value = newFilters.pageSize
      currentPage.value = 1 // pageSize o'zgarganda birinchi sahifaga qaytish
    }
  }

  /**
   * Maosh yozuvlari ro'yxatini yuklash
   */
  async function fetchPayroll(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await payrollService.getPayrollList(filters.value)

      payrollList.value = response.data
      total.value = response.total
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ma\'lumotlarni yuklashda xatolik'
      console.error('fetchPayroll error:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Maosh xulosasini yuklash
   */
  async function fetchSummary(): Promise<void> {
    try {
      const result = await payrollService.getPayrollSummary(
        selectedMonth.value,
        selectedYear.value
      )
      summary.value = result
    } catch (err) {
      console.error('fetchSummary error:', err)
    }
  }

  /**
   * Yangi maosh yozuvini yaratish
   */
  async function createPayroll(data: CreatePayrollDto): Promise<PayrollEntry | null> {
    try {
      const entry = await payrollService.createPayroll(data)
      // Ro'yxatni yangilash
      await fetchPayroll()
      await fetchSummary()
      return entry
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Yaratishda xatolik'
      console.error('createPayroll error:', err)
      return null
    }
  }

  /**
   * Maosh yozuvini hisoblash (status: 'calculated')
   */
  async function calculatePayroll(id: string): Promise<PayrollEntry | null> {
    try {
      const entry = await payrollService.calculatePayroll(id)
      // Ro'yxatni yangilash
      await fetchPayroll()
      await fetchSummary()
      return entry
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Hisoblashda xatolik'
      console.error('calculatePayroll error:', err)
      return null
    }
  }

  /**
   * Maosh yozuvini tasdiqlash (status: 'approved')
   */
  async function approvePayroll(id: string): Promise<PayrollEntry | null> {
    try {
      const entry = await payrollService.approvePayroll(id)
      // Ro'yxatni yangilash
      await fetchPayroll()
      await fetchSummary()
      return entry
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Tasdiqlashda xatolik'
      console.error('approvePayroll error:', err)
      return null
    }
  }

  /**
   * Maosh yozuvini to'langan deb belgilash (status: 'paid')
   */
  async function markAsPaid(id: string): Promise<PayrollEntry | null> {
    try {
      const entry = await payrollService.markAsPaid(id)
      // Ro'yxatni yangilash
      await fetchPayroll()
      await fetchSummary()
      return entry
    } catch (err) {
      error.value = err instanceof Error ? err.message : "To'lashda xatolik"
      console.error('markAsPaid error:', err)
      return null
    }
  }

  // ═══════════════════════════════════════════════════════════
  // WATCHERS
  // ═══════════════════════════════════════════════════════════

  /**
   * Oy/yil o'zgarganda ma'lumotlarni qayta yuklash
   */
  watch([selectedMonth, selectedYear], () => {
    fetchPayroll()
    fetchSummary()
  })

  // ═══════════════════════════════════════════════════════════
  // MOUNTED
  // ═══════════════════════════════════════════════════════════

  /**
   * Komponent yuklanganda ma'lumotlarni olish
   */
  onMounted(() => {
    fetchPayroll()
    fetchSummary()
  })

  // ═══════════════════════════════════════════════════════════
  // QAYTARISH
  // ═══════════════════════════════════════════════════════════

  return {
    // Ma'lumotlar
    payrollList,
    summary,

    // Holat
    isLoading,
    error,
    filters,

    // Sahifalash
    currentPage,
    pageSize,
    total,
    totalPages,

    // Tanlangan oy/yil
    selectedMonth,
    selectedYear,

    // Amallar
    fetchPayroll,
    fetchSummary,
    createPayroll,
    calculatePayroll,
    approvePayroll,
    markAsPaid,
    clearError,
    setFilters
  }
}