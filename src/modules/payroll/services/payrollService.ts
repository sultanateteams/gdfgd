// ═══════════════════════════════════════════════════════════
// PAYROLL SERVICE
// Maosh hisob-kitoblari xizmati - mock va real API bilan ishlash
// ═══════════════════════════════════════════════════════════

import { appConfig } from '@/config/app'
import type {
  PayrollEntry,
  PaySlip,
  PayrollSummary,
  PayrollFilters,
  PayrollListParams,
  CreatePayrollDto
} from '../types'
import type { PaginatedResponse } from '@/modules/employees/types'
import { mockPayrollEntries } from './mockPayrollData'

/**
 * Mock ma'lumotlar bilan ishlash uchun yordamchi funksiya
 * 200-400ms delay bilan
 */
async function mockDelay<T>(data: T, minMs = 200, maxMs = 400): Promise<T> {
  const delay = minMs + Math.random() * (maxMs - minMs)
  await new Promise(resolve => setTimeout(resolve, delay))
  return data
}

/**
 * Filtrlarga mos keladigan payroll yozuvlarini filtrlash
 */
function filterPayrollEntries(
  entries: PayrollEntry[],
  filters: PayrollFilters
): PayrollEntry[] {
  return entries.filter(entry => {
    if (filters.employeeId && entry.employeeId !== filters.employeeId) return false
    if (filters.departmentId && entry.employee?.departmentId !== filters.departmentId) return false
    if (filters.month !== undefined && entry.period.month !== filters.month) return false
    if (filters.year !== undefined && entry.period.year !== filters.year) return false
    if (filters.status && entry.status !== filters.status) return false
    if (filters.currency && entry.currency !== filters.currency) return false
    return true
  })
}

/**
 * Sahifalash (pagination) funksiyasi
 */
function paginate<T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResponse<T> {
  const total = data.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedData = data.slice(start, end)

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages
  }
}

/**
 * Payroll xizmati interfeysi
 */
export interface PayrollService {
  /** Maosh yozuvlari ro'yxatini olish (filtrlar bilan, pagination params ichida) */
  getPayrollList(params: PayrollListParams): Promise<PaginatedResponse<PayrollEntry>>

  /** ID bo'yicha maosh yozuvini olish */
  getPayrollById(id: string): Promise<PayrollEntry>

  /** Maosh varaqasini olish (to'liq ma'lumotlar bilan) */
  getPaySlip(id: string): Promise<PaySlip>

  /** Yangi maosh yozuvini yaratish */
  createPayroll(data: CreatePayrollDto): Promise<PayrollEntry>

  /** Maosh yozuvini hisoblash (status: 'calculated') */
  calculatePayroll(id: string): Promise<PayrollEntry>

  /** Maosh yozuvini tasdiqlash (status: 'approved') */
  approvePayroll(id: string): Promise<PayrollEntry>

  /** Maosh yozuvini to'langan deb belgilash (status: 'paid') */
  markAsPaid(id: string): Promise<PayrollEntry>

  /** Oylik maosh xulosasini olish */
  getPayrollSummary(month: number, year: number): Promise<PayrollSummary>
}

/**
 * Mock Payroll Service
 * Mock ma'lumotlar bilan ishlaydi
 */
const mockPayrollService: PayrollService = {
  async getPayrollList(params: PayrollListParams): Promise<PaginatedResponse<PayrollEntry>> {
    const filtered = filterPayrollEntries(mockPayrollEntries, params)
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10
    const paginated = paginate(filtered, page, pageSize)
    return mockDelay(paginated)
  },

  async getPayrollById(id: string): Promise<PayrollEntry> {
    const entry = mockPayrollEntries.find(e => e.id === id)
    if (!entry) {
      throw new Error(`Payroll entry with id "${id}" not found`)
    }
    return mockDelay(Object.assign({}, entry))
  },

  async getPaySlip(id: string): Promise<PaySlip> {
    const entry = mockPayrollEntries.find(e => e.id === id)
    if (!entry) {
      throw new Error(`Payroll entry with id "${id}" not found`)
    }

    // PaySlip uchun to'liq ma'lumotlar
    const paySlip: PaySlip = {
      ...entry,
      companyName: 'HRM System LLC',
      companyAddress: 'Toshkent sh., Chilonzor tumani, 123-uy',
      employee: {
        id: entry.employeeId,
        employeeCode: `EMP-${entry.employeeId.split('-')[1]}`,
        firstName: entry.employee?.fullName.split(' ')[0] || 'Unknown',
        lastName: entry.employee?.fullName.split(' ').slice(1).join(' ') || '',
        fullName: entry.employee?.fullName || 'Unknown',
        email: `${entry.employeeId}@company.com`,
        departmentId: entry.employee?.departmentId || 'unknown',
        positionId: 'pos-001',
        employmentType: 'full_time',
        status: 'active',
        hireDate: '2023-01-15T00:00:00Z',
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: new Date().toISOString()
      }
    }

    return mockDelay(paySlip)
  },

  async createPayroll(data: CreatePayrollDto): Promise<PayrollEntry> {
    const now = new Date().toISOString()
    const newEntry: PayrollEntry = {
      id: `payroll-${Date.now()}`,
      employeeId: data.employeeId,
      period: data.period,
      workDays: 22,
      presentDays: 22,
      absentDays: 0,
      overtimeHours: 0,
      baseSalary: data.baseSalary,
      earnings: data.earnings || [],
      deductions: data.deductions || [],
      overtimePay: 0,
      grossSalary: data.baseSalary,
      totalDeductions: 0,
      netSalary: data.baseSalary,
      currency: 'UZS',
      status: 'draft',
      ...(data.note ? { note: data.note } : {}),
      createdAt: now,
      updatedAt: now
    }

    // Mock ro'yxatga qo'shish
    mockPayrollEntries.push(newEntry)

    return mockDelay(newEntry)
  },

  async calculatePayroll(id: string): Promise<PayrollEntry> {
    const index = mockPayrollEntries.findIndex(e => e.id === id)
    if (index === -1) {
      throw new Error(`Payroll entry with id "${id}" not found`)
    }

    const entry = mockPayrollEntries[index]
    const updatedEntry: PayrollEntry = Object.assign({}, entry, {
      status: 'calculated' as const,
      updatedAt: new Date().toISOString()
    })

    mockPayrollEntries[index] = updatedEntry

    return mockDelay(updatedEntry)
  },

  async approvePayroll(id: string): Promise<PayrollEntry> {
    const index = mockPayrollEntries.findIndex(e => e.id === id)
    if (index === -1) {
      throw new Error(`Payroll entry with id "${id}" not found`)
    }

    const entry = mockPayrollEntries[index]
    const updatedEntry: PayrollEntry = Object.assign({}, entry, {
      status: 'approved' as const,
      approvedBy: 'admin-001',
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    mockPayrollEntries[index] = updatedEntry

    return mockDelay(updatedEntry)
  },

  async markAsPaid(id: string): Promise<PayrollEntry> {
    const index = mockPayrollEntries.findIndex(e => e.id === id)
    if (index === -1) {
      throw new Error(`Payroll entry with id "${id}" not found`)
    }

    const entry = mockPayrollEntries[index]
    const updatedEntry: PayrollEntry = Object.assign({}, entry, {
      status: 'paid' as const,
      paidAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    mockPayrollEntries[index] = updatedEntry

    return mockDelay(updatedEntry)
  },

  async getPayrollSummary(month: number, year: number): Promise<PayrollSummary> {
    const filtered = mockPayrollEntries.filter(
      e => e.period.month === month && e.period.year === year
    )

    const totalEmployees = filtered.length
    const totalGrossSalary = filtered.reduce((sum, e) => sum + e.grossSalary, 0)
    const totalDeductions = filtered.reduce((sum, e) => sum + e.totalDeductions, 0)
    const totalNetSalary = filtered.reduce((sum, e) => sum + e.netSalary, 0)
    const paidCount = filtered.filter(e => e.status === 'paid').length
    const pendingCount = filtered.filter(e => e.status !== 'paid').length

    const summary: PayrollSummary = {
      period: { month, year },
      totalEmployees,
      totalGrossSalary,
      totalDeductions,
      totalNetSalary,
      paidCount,
      pendingCount,
      currency: 'UZS'
    }

    return mockDelay(summary)
  }
}

/**
 * Real API bilan ishlaydigan service (hozircha mock ishlatiladi)
 */
const realPayrollService: PayrollService = {
  // Hozircha mock service dan foydalanamiz
  // Kelajakda real API chaqiruvlari qo'shiladi
  ...mockPayrollService
}

/**
 * Export qilinadigan payroll service
 * appConfig.useMock ga qarab mock yoki real service tanlanadi
 */
export const payrollService: PayrollService = appConfig.useMock
  ? mockPayrollService
  : realPayrollService