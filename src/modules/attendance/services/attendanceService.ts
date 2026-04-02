// ═══════════════════════════════════════════════════════════
// ATTENDANCE SERVICE
// Davomat va ta'til boshqaruv xizmati
// ═══════════════════════════════════════════════════════════

import { appConfig } from '@/config/app'
import { apiService } from '@/services/api'
import {
  generateAttendanceRecords,
  generateLeaveRequests,
  generateLeaveBalances
} from './mockAttendanceData'
import type {
  AttendanceRecord,
  AttendanceFilters,
  AttendanceListParams,
  AttendanceMonthlyReport,
  LeaveRequest,
  LeaveFilters,
  LeaveListParams,
  LeaveBalance,
  CreateLeaveRequestDto,
  ReviewLeaveRequestDto
} from '../types'

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ═══════════════════════════════════════════════════════════
// MOCK DATA CACHE
// ═══════════════════════════════════════════════════════════

let attendanceCache: AttendanceRecord[] | null = null
let leaveRequestsCache: LeaveRequest[] | null = null
let leaveBalancesCache: LeaveBalance[] | null = null

function getAttendanceData(): AttendanceRecord[] {
  if (!attendanceCache) {
    attendanceCache = generateAttendanceRecords()
  }
  return attendanceCache
}

function getLeaveRequestsData(): LeaveRequest[] {
  if (!leaveRequestsCache) {
    leaveRequestsCache = generateLeaveRequests()
  }
  return leaveRequestsCache
}

function getLeaveBalancesData(): LeaveBalance[] {
  if (!leaveBalancesCache) {
    leaveBalancesCache = generateLeaveBalances()
  }
  return leaveBalancesCache
}

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

function artificialDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * 200) + 200
  return new Promise(resolve => setTimeout(resolve, delay))
}

function paginate<T>(
  data: T[],
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  const total = data.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    data: data.slice(start, end),
    total,
    page,
    pageSize,
    totalPages
  }
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// ═══════════════════════════════════════════════════════════
// MOCK IMPLEMENTATION
// ═══════════════════════════════════════════════════════════

const mockAttendanceService = {
  async getMonthlyAttendance(
    employeeId: string,
    year: number,
    month: number
  ): Promise<AttendanceMonthlyReport> {
    await artificialDelay()

    const records = getAttendanceData()
    const monthRecords = records.filter(r => {
      if (r.employeeId !== employeeId) return false
      const [rYear, rMonth] = r.date.split('-').map(Number)
      return rYear === year && rMonth === month
    })

    const summary = {
      presentDays: monthRecords.filter(r => r.status === 'present').length,
      absentDays: monthRecords.filter(r => r.status === 'absent').length,
      lateDays: monthRecords.filter(r => r.status === 'late').length,
      totalWorkHours: monthRecords.reduce((sum, r) => sum + (r.workHours || 0), 0),
      overtimeHours: monthRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0)
    }

    return {
      employeeId,
      month,
      year,
      records: monthRecords,
      summary
    }
  },

  async getAllAttendance(
    params: AttendanceListParams
  ): Promise<PaginatedResponse<AttendanceRecord>> {
    await artificialDelay()

    let records = getAttendanceData()

    if (params.employeeId) {
      records = records.filter(r => r.employeeId === params.employeeId)
    }

    if (params.departmentId) {
      // Filter by department (mock - would need employee data)
    }

    if (params.dateFrom) {
      records = records.filter(r => r.date >= params.dateFrom!)
    }

    if (params.dateTo) {
      records = records.filter(r => r.date <= params.dateTo!)
    }

    if (params.status) {
      records = records.filter(r => r.status === params.status)
    }

    const page = params.page || 1
    const pageSize = params.pageSize || 20

    return paginate(records, page, pageSize)
  },

  async checkIn(employeeId: string): Promise<AttendanceRecord> {
    await artificialDelay()

    const today = new Date()
    const dateStr = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
    const nowStr = today.toISOString()

    const records = getAttendanceData()
    const existing = records.find(r => r.employeeId === employeeId && r.date === dateStr)

    if (existing) {
      existing.checkIn = nowStr
      if (existing.status === 'weekend' || existing.status === 'holiday') {
        existing.status = 'present'
      }
      return existing
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId,
      date: dateStr,
      checkIn: nowStr,
      status: 'present',
      createdAt: nowStr
    }

    records.push(newRecord)
    return newRecord
  },

  async checkOut(attendanceId: string): Promise<AttendanceRecord> {
    await artificialDelay()

    const records = getAttendanceData()
    const record = records.find(r => r.id === attendanceId)

    if (!record) {
      throw new Error('Attendance record not found')
    }

    const now = new Date()
    record.checkOut = now.toISOString()

    // Calculate work hours
    if (record.checkIn) {
      const checkIn = new Date(record.checkIn)
      const checkOut = new Date(record.checkOut)
      const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
      record.workHours = Math.round(hours * 100) / 100

      if (record.workHours > 8) {
        record.overtimeHours = Math.round((record.workHours - 8) * 100) / 100
      }
    }

    return record
  },

  async getLeaveRequests(
    params: LeaveListParams
  ): Promise<PaginatedResponse<LeaveRequest>> {
    await artificialDelay()

    let requests = getLeaveRequestsData()

    if (params.employeeId) {
      requests = requests.filter(r => r.employeeId === params.employeeId)
    }

    if (params.type) {
      requests = requests.filter(r => r.type === params.type)
    }

    if (params.status) {
      requests = requests.filter(r => r.status === params.status)
    }

    if (params.dateFrom) {
      requests = requests.filter(r => r.startDate >= params.dateFrom!)
    }

    if (params.dateTo) {
      requests = requests.filter(r => r.endDate <= params.dateTo!)
    }

    const page = params.page || 1
    const pageSize = params.pageSize || 20

    return paginate(requests, page, pageSize)
  },

  async createLeaveRequest(
    data: CreateLeaveRequestDto
  ): Promise<LeaveRequest> {
    await artificialDelay()

    const requests = getLeaveRequestsData()

    // Calculate total days
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const newRequest: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: data.employeeId,
      type: data.type,
      status: 'pending',
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays,
      reason: data.reason,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as LeaveRequest

    if (data.attachmentUrl) newRequest.attachmentUrl = data.attachmentUrl

    requests.push(newRequest)
    return newRequest
  },

  async approveLeave(
    id: string,
    note?: string
  ): Promise<LeaveRequest> {
    await artificialDelay()

    const requests = getLeaveRequestsData()
    const request = requests.find(r => r.id === id)

    if (!request) {
      throw new Error('Leave request not found')
    }

    request.status = 'approved'
    request.reviewedBy = '1' // admin
    request.reviewedAt = new Date().toISOString()
    if (note) request.reviewNote = note
    request.updatedAt = new Date().toISOString()

    return request
  },

  async rejectLeave(
    id: string,
    note: string
  ): Promise<LeaveRequest> {
    await artificialDelay()

    const requests = getLeaveRequestsData()
    const request = requests.find(r => r.id === id)

    if (!request) {
      throw new Error('Leave request not found')
    }

    request.status = 'rejected'
    request.reviewedBy = '1' // admin
    request.reviewedAt = new Date().toISOString()
    request.reviewNote = note
    request.updatedAt = new Date().toISOString()

    return request
  },

  async getLeaveBalance(employeeId: string): Promise<LeaveBalance> {
    await artificialDelay()

    const balances = getLeaveBalancesData()
    const balance = balances.find(b => b.employeeId === employeeId)

    if (!balance) {
      // Return default balance
      return {
        employeeId,
        year: new Date().getFullYear(),
        annual: { total: 18, used: 0, remaining: 18 },
        sick: { total: 10, used: 0, remaining: 10 },
        emergency: { total: 5, used: 0, remaining: 5 }
      }
    }

    return balance
  }
}

// ═══════════════════════════════════════════════════════════
// REAL IMPLEMENTATION
// ═══════════════════════════════════════════════════════════

const realAttendanceService = {
  async getMonthlyAttendance(
    employeeId: string,
    year: number,
    month: number
  ): Promise<AttendanceMonthlyReport> {
    return apiService.get<AttendanceMonthlyReport>(
      `/attendance/monthly?employeeId=${employeeId}&year=${year}&month=${month}`
    )
  },

  async getAllAttendance(
    params: AttendanceListParams
  ): Promise<PaginatedResponse<AttendanceRecord>> {
    return apiService.get<PaginatedResponse<AttendanceRecord>>('/attendance', { params })
  },

  async checkIn(employeeId: string): Promise<AttendanceRecord> {
    return apiService.post<AttendanceRecord>('/attendance/check-in', { employeeId })
  },

  async checkOut(attendanceId: string): Promise<AttendanceRecord> {
    return apiService.post<AttendanceRecord>('/attendance/check-out', { attendanceId })
  },

  async getLeaveRequests(
    params: LeaveListParams
  ): Promise<PaginatedResponse<LeaveRequest>> {
    return apiService.get<PaginatedResponse<LeaveRequest>>('/attendance/leaves', { params })
  },

  async createLeaveRequest(
    data: CreateLeaveRequestDto
  ): Promise<LeaveRequest> {
    return apiService.post<LeaveRequest>('/attendance/leaves', data)
  },

  async approveLeave(
    id: string,
    note?: string
  ): Promise<LeaveRequest> {
    return apiService.post<LeaveRequest>(`/attendance/leaves/${id}/approve`, { note })
  },

  async rejectLeave(
    id: string,
    note: string
  ): Promise<LeaveRequest> {
    return apiService.post<LeaveRequest>(`/attendance/leaves/${id}/reject`, { note })
  },

  async getLeaveBalance(employeeId: string): Promise<LeaveBalance> {
    return apiService.get<LeaveBalance>(`/attendance/leaves/balance?employeeId=${employeeId}`)
  }
}

// ═══════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════

export const attendanceService = appConfig.useMock
  ? mockAttendanceService
  : realAttendanceService

export default attendanceService