// ═══════════════════════════════════════════════════════════
// ATTENDANCE MODULE - TYPE DEFINITIONS
// Davomat va ta'til boshqaruv tizimi uchun TypeScript type va interface'lar
// ═══════════════════════════════════════════════════════════

import type { Employee } from '@/modules/employees/types'

// ═══════════════════════════════════════════════════════════
// ENUMS - Attendance Status
// ═══════════════════════════════════════════════════════════

/**
 * Davomat holati
 */
export type AttendanceStatus =
  | 'present'    // Ishda hozir
  | 'absent'     // Yo'q
  | 'late'       // Kechikdi
  | 'half_day'   // Yarim kun
  | 'remote'     // Masofaviy ish
  | 'holiday'    // Bayram
  | 'weekend'    // Dam olish kuni

// ═══════════════════════════════════════════════════════════
// ENUMS - Leave Types
// ═══════════════════════════════════════════════════════════

/**
 * Ta'til turlari
 */
export type LeaveType =
  | 'annual'     // Yillik ta'til
  | 'sick'       // Kasallik
  | 'maternity'  // Homiladorlik va tug'ruq
  | 'paternity'  // Otalik
  | 'unpaid'     // Maoshsiz ta'til
  | 'emergency'  // Favqulodda holat

/**
 * Ta'til so'rovi holati
 */
export type LeaveStatus =
  | 'pending'    // Kutishda
  | 'approved'   // Tasdiqlangan
  | 'rejected'   // Rad etilgan
  | 'cancelled'  // Bekor qilingan

// ═══════════════════════════════════════════════════════════
// ATTENDANCE RECORD
// ═══════════════════════════════════════════════════════════

/**
 * Davomat yozuvi - xodimning kunlik davomat ma'lumotlari
 */
export interface AttendanceRecord {
  /** Yozuv unikal identifikatori */
  id: string
  
  /** Xodim ID si */
  employeeId: string
  
  /** Xodim ma'lumotlari (ixtiyoriy, expand qilinganda) */
  employee?: Pick<Employee, 'id' | 'fullName' | 'avatar' | 'departmentId'>
  
  /** Sana (ISO date: "2024-01-15") */
  date: string
  
  /** Ishga kirish vaqti (ISO datetime) */
  checkIn?: string
  
  /** Ishdan chiqish vaqti (ISO datetime) */
  checkOut?: string
  
  /** Davomat holati */
  status: AttendanceStatus
  
  /** Ish soatlari (hisoblangan) */
  workHours?: number
  
  /** Qo'shimcha ish soatlari */
  overtimeHours?: number
  
  /** Izoh */
  note?: string
  
  /** Tasdiqlagan xodim ID si */
  approvedBy?: string
  
  /** Yaratilgan sana */
  createdAt: string
}

// ═══════════════════════════════════════════════════════════
// LEAVE REQUEST
// ═══════════════════════════════════════════════════════════

/**
 * Ta'til so'rovi - xodim tomonidan yuborilgan ta'til arizasi
 */
export interface LeaveRequest {
  /** So'rov unikal identifikatori */
  id: string
  
  /** Xodim ID si */
  employeeId: string
  
  /** Xodim ma'lumotlari (ixtiyoriy, expand qilinganda) */
  employee?: Pick<Employee, 'id' | 'fullName' | 'avatar'>
  
  /** Ta'til turi */
  type: LeaveType
  
  /** So'rov holati */
  status: LeaveStatus
  
  /** Boshlanish sanasi */
  startDate: string
  
  /** Tugash sanasi */
  endDate: string
  
  /** Kunlar soni */
  totalDays: number
  
  /** Sabab */
  reason: string
  
  /** Ilova URL (masalan, kasallik varaqasi) */
  attachmentUrl?: string
  
  /** Ko'rib chiqqan xodim ID si */
  reviewedBy?: string
  
  /** Ko'rib chiqilgan sana */
  reviewedAt?: string
  
  /** Ko'rib chiqish izohi */
  reviewNote?: string
  
  /** Yaratilgan sana */
  createdAt: string
  
  /** Yangilangan sana */
  updatedAt: string
}

// ═══════════════════════════════════════════════════════════
// LEAVE BALANCE
// ═══════════════════════════════════════════════════════════

/**
 * Ta'til balansi - xodimning yillik ta'til qoldig'i
 */
export interface LeaveBalance {
  /** Xodim ID si */
  employeeId: string
  
  /** Yil */
  year: number
  
  /** Yillik ta'til */
  annual: {
    /** Jami kunlar */
    total: number
    /** Ishlatilgan kunlar */
    used: number
    /** Qolgan kunlar */
    remaining: number
  }
  
  /** Kasallik ta'tili */
  sick: {
    /** Jami kunlar */
    total: number
    /** Ishlatilgan kunlar */
    used: number
    /** Qolgan kunlar */
    remaining: number
  }
  
  /** Favqulodda ta'til */
  emergency: {
    /** Jami kunlar */
    total: number
    /** Ishlatilgan kunlar */
    used: number
    /** Qolgan kunlar */
    remaining: number
  }
}

// ═══════════════════════════════════════════════════════════
// FILTER VA QIDIRUV TURLARI
// ═══════════════════════════════════════════════════════════

/**
 * Davomatni filtrlash parametrlari
 */
export interface AttendanceFilters {
  /** Xodim ID si bo'yicha filtrlash */
  employeeId?: string
  
  /** Bo'lim ID si bo'yicha filtrlash */
  departmentId?: string
  
  /** Boshlang'ich sana */
  dateFrom?: string
  
  /** Tugash sanasi */
  dateTo?: string
  
  /** Holat bo'yicha filtrlash */
  status?: AttendanceStatus
}

/**
 * Ta'til so'rovlarini filtrlash parametrlari
 */
export interface LeaveFilters {
  /** Xodim ID si bo'yicha filtrlash */
  employeeId?: string
  
  /** Ta'til turi bo'yicha filtrlash */
  type?: LeaveType
  
  /** Holat bo'yicha filtrlash */
  status?: LeaveStatus
  
  /** Boshlang'ich sana */
  dateFrom?: string
  
  /** Tugash sanasi */
  dateTo?: string
}

// ═══════════════════════════════════════════════════════════
// REPORT TURLARI
// ═══════════════════════════════════════════════════════════

/**
 * Oylik davomat hisoboti
 */
export interface AttendanceMonthlyReport {
  /** Xodim ID si */
  employeeId: string
  
  /** Oy (1-12) */
  month: number
  
  /** Yil */
  year: number
  
  /** Davomat yozuvlari */
  records: AttendanceRecord[]
  
  /** Xulosa */
  summary: {
    /** Ishlagan kunlar */
    presentDays: number
    /** Yo'q kunlar */
    absentDays: number
    /** Kechikkan kunlar */
    lateDays: number
    /** Jami ish soatlari */
    totalWorkHours: number
    /** Jami qo'shimcha soatlar */
    overtimeHours: number
  }
}

// ═══════════════════════════════════════════════════════════
// LIST PARAMS
// ═══════════════════════════════════════════════════════════

/**
 * Davomat yozuvlari ro'yxati parametrlari
 */
export interface AttendanceListParams extends AttendanceFilters {
  /** Sahifa raqami */
  page?: number
  
  /** Bir sahifadagi elementlar soni */
  pageSize?: number
  
  /** Saralash maydoni */
  sortBy?: keyof AttendanceRecord
  
  /** Saralash tartibi */
  sortOrder?: 'asc' | 'desc'
}

/**
 * Ta'til so'rovlari ro'yxati parametrlari
 */
export interface LeaveListParams extends LeaveFilters {
  /** Sahifa raqami */
  page?: number
  
  /** Bir sahifadagi elementlar soni */
  pageSize?: number
  
  /** Saralash maydoni */
  sortBy?: keyof LeaveRequest
  
  /** Saralash tartibi */
  sortOrder?: 'asc' | 'desc'
}

// ═══════════════════════════════════════════════════════════
// FORM TYPES
// ═══════════════════════════════════════════════════════════

/**
 * Davomat yozuvini yaratish/yangilash DTO
 */
export type CreateAttendanceDto = Omit<
  AttendanceRecord,
  'id' | 'employee' | 'createdAt'
>

/**
 * Davomat yozuvini yangilash DTO
 */
export type UpdateAttendanceDto = Partial<CreateAttendanceDto>

/**
 * Ta'til so'rovi yaratish DTO
 */
export type CreateLeaveRequestDto = Omit<
  LeaveRequest,
  'id' | 'employee' | 'status' | 'reviewedBy' | 'reviewedAt' | 'reviewNote' | 'createdAt' | 'updatedAt'
>

/**
 * Ta'til so'rovini yangilash DTO
 */
export type UpdateLeaveRequestDto = Partial<CreateLeaveRequestDto>

/**
 * Ta'til so'rovini ko'rib chiqish DTO
 */
export interface ReviewLeaveRequestDto {
  status: 'approved' | 'rejected'
  reviewNote?: string
}

// ═══════════════════════════════════════════════════════════
// BARREL EXPORTS
// ═══════════════════════════════════════════════════════════
// Barcha type va interface'lar yuqorida allaqachon export qilingan.
