// ═══════════════════════════════════════════════════════════
// MOCK ATTENDANCE DATA
// Development uchun mock davomat ma'lumotlari
// ═══════════════════════════════════════════════════════════

import type {
  AttendanceRecord,
  AttendanceStatus,
  LeaveRequest,
  LeaveType,
  LeaveStatus,
  LeaveBalance
} from '../types'

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)] as T
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatDateTime(dateStr: string, hour: number, minute: number): string {
  return `${dateStr}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`
}

function isWeekend(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day)
  const dayOfWeek = date.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6 // Yakshanba yoki Shanba
}

function getWorkDayStatus(): AttendanceStatus {
  const rand = Math.random()
  if (rand < 0.05) return 'absent'        // 5% absent
  if (rand < 0.10) return 'late'          // 5% late
  if (rand < 0.25) return 'remote'        // 15% remote
  if (rand < 0.28) return 'half_day'      // 3% half day
  return 'present'                         // 72% present
}

// ═══════════════════════════════════════════════════════════
// MOCK DATA GENERATORS
// ═══════════════════════════════════════════════════════════

const EMPLOYEE_IDS = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
]

export function generateAttendanceRecords(
  employeeIds: string[] = EMPLOYEE_IDS,
  monthsBack: number = 2
): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  const now = new Date()
  let recordId = 1

  for (let m = monthsBack; m >= 0; m--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - m, 1)
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth() + 1
    const daysInMonth = new Date(year, month, 0).getDate()

    // Faqat joriy oy uchun bugungi kungacha
    const maxDay = (m === 0) ? now.getDate() : daysInMonth

    for (let day = 1; day <= maxDay; day++) {
      const weekend = isWeekend(year, month, day)
      const dateStr = formatDate(year, month, day)

      for (const empId of employeeIds) {
        const id = `att-${recordId++}`

        if (weekend) {
          // Dam olish kuni
          records.push({
            id,
            employeeId: empId,
            date: dateStr,
            status: 'weekend',
            createdAt: dateStr + 'T00:00:00Z'
          })
        } else {
          // Ish kuni
          const status = getWorkDayStatus()
          let checkIn: string | undefined
          let checkOut: string | undefined
          let workHours: number | undefined
          let overtimeHours: number | undefined

          if (status === 'present' || status === 'late' || status === 'half_day') {
            const checkInHour = status === 'late'
              ? randomInt(9, 11)
              : randomInt(8, 9)
            const checkInMinute = randomInt(0, 59)
            checkIn = formatDateTime(dateStr, checkInHour, checkInMinute)

            if (status === 'present' || status === 'late' || status === 'half_day') {
              const checkOutHour = status === 'half_day'
                ? randomInt(12, 14)
                : randomInt(17, 19)
              const checkOutMinute = randomInt(0, 59)
              checkOut = formatDateTime(dateStr, checkOutHour, checkOutMinute)

              workHours = status === 'half_day'
                ? randomInt(3, 5)
                : randomInt(7, 10)

              if (workHours > 8) {
                overtimeHours = workHours - 8
              }
            }
          }

          const record: AttendanceRecord = {
            id,
            employeeId: empId,
            date: dateStr,
            status,
            createdAt: dateStr + 'T00:00:00Z'
          }

          if (checkIn) record.checkIn = checkIn
          if (checkOut) record.checkOut = checkOut
          if (workHours !== undefined) record.workHours = workHours
          if (overtimeHours !== undefined) record.overtimeHours = overtimeHours

          records.push(record)
        }
      }
    }
  }

  return records
}

export function generateLeaveRequests(
  employeeIds: string[] = EMPLOYEE_IDS
): LeaveRequest[] {
  const leaveTypes: LeaveType[] = ['annual', 'sick', 'emergency']
  const leaveStatuses: LeaveStatus[] = ['pending', 'approved', 'rejected', 'cancelled']
  const reasons = [
    "Shaxsiy sabablar",
    "Salomatlik holati",
    "Oilaviy tadbir",
    "Tibbiy ko'rik",
    "Uy ta'mirlash",
    "Bolalar bilan bo'lish",
    "Dam olish",
    "Safar"
  ]

  const requests: LeaveRequest[] = []
  let requestId = 1
  const now = new Date()

  // 5-6 pending, qolganlari approved/rejected/cancelled
  for (let i = 0; i < 15; i++) {
    const empId = randomChoice(employeeIds)
    const type = randomChoice(leaveTypes)
    let status: LeaveStatus

    if (i < 5) {
      status = 'pending'
    } else {
      status = randomChoice(['approved', 'approved', 'approved', 'rejected', 'cancelled'])
    }

    const startDateOffset = randomInt(-30, 60)
    const duration = randomInt(1, 5)
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() + startDateOffset)

    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + duration - 1)

    const totalDays = duration

    const request: LeaveRequest = {
      id: `leave-${requestId++}`,
      employeeId: empId,
      type,
      status,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalDays,
      reason: randomChoice(reasons),
      createdAt: startDate.toISOString(),
      updatedAt: now.toISOString()
    }

    if (status !== 'pending') {
      request.reviewedBy = '1' // admin
      request.reviewedAt = now.toISOString()
      if (status === 'rejected') {
        request.reviewNote = "Sabab noto'g'ri yoki muddat mos kelmadi"
      }
    }

    requests.push(request as LeaveRequest)
  }

  return requests
}

export function generateLeaveBalances(
  employeeIds: string[] = EMPLOYEE_IDS,
  year: number = new Date().getFullYear()
): LeaveBalance[] {
  return employeeIds.map(empId => ({
    employeeId: empId,
    year,
    annual: {
      total: 18,
      used: randomInt(0, 10),
      remaining: randomInt(5, 18)
    },
    sick: {
      total: 10,
      used: randomInt(0, 5),
      remaining: randomInt(3, 10)
    },
    emergency: {
      total: 5,
      used: randomInt(0, 3),
      remaining: randomInt(1, 5)
    }
  }))
}

// ═══════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════

export const mockAttendanceData = {
  generateAttendanceRecords,
  generateLeaveRequests,
  generateLeaveBalances
}

export default mockAttendanceData