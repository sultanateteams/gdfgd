// ═══════════════════════════════════════════════════════════
// PAYROLL MODULE - TYPE DEFINITIONS
// Maosh va hisob-kitob tizimi uchun TypeScript type va interface'lar
// ═══════════════════════════════════════════════════════════

import type { Employee } from '@/modules/employees/types'

// ═══════════════════════════════════════════════════════════
// ENUMS - Currency
// ═══════════════════════════════════════════════════════════

/**
 * Valyuta turlari
 */
export type Currency = 'UZS' | 'USD' | 'EUR'

// ═══════════════════════════════════════════════════════════
// ENUMS - Payment Status
// ═══════════════════════════════════════════════════════════

/**
 * To'lov holati
 */
export type PaymentStatus =
  | 'draft'       // Qoralama
  | 'calculated'  // Hisoblangan
  | 'approved'    // Tasdiqlangan
  | 'paid'        // To'langan
  | 'cancelled'   // Bekor qilingan

// ═══════════════════════════════════════════════════════════
// SALARY COMPONENT
// ═══════════════════════════════════════════════════════════

/**
 * Maosh komponenti - asosiy maosh, bonus, soliq va boshqa to'lovlar
 */
export interface SalaryComponent {
  /** Komponent unikal identifikatori */
  id: string
  
  /** Komponent nomi (masalan: "Asosiy maosh", "Bonus", "Transport", "Soliq") */
  name: string
  
  /** Komponent turi: earning (daromad) yoki deduction (chegirma) */
  type: 'earning' | 'deduction'
  
  /** Summa */
  amount: number
  
  /** Valyuta */
  currency: Currency
  
  /** Foizda hisoblanadimi? (true bo'lsa — base salary dan foizda) */
  isPercentage: boolean
  
  /** Foiz qiymati (0-100) */
  percentage?: number
  
  /** Majburiymi? */
  isRequired: boolean
  
  /** Tavsif */
  description?: string
}

// ═══════════════════════════════════════════════════════════
// PAYROLL ENTRY
// ═══════════════════════════════════════════════════════════

/**
 * Maosh yozuvi - xodimning oylik maosh hisob-kitobi
 */
export interface PayrollEntry {
  /** Yozuv unikal identifikatori */
  id: string
  
  /** Xodim ID si */
  employeeId: string
  
  /** Xodim ma'lumotlari (ixtiyoriy, expand qilinganda) */
  employee?: Pick<Employee, 'id' | 'fullName' | 'avatar' | 'departmentId'>
  
  /** Hisob-kitob davri */
  period: {
    /** Oy (1-12) */
    month: number
    /** Yil */
    year: number
  }
  
  // ═══════════════════════════════════════════════════════════
  // DAVOMAT MA'LUMOTLARI (attendance dan olinadi)
  // ═══════════════════════════════════════════════════════════
  
  /** Ish kunlari soni */
  workDays: number
  
  /** Kelingan kunlar */
  presentDays: number
  
  /** Kelmagan kunlar */
  absentDays: number
  
  /** Qo'shimcha ish soatlari */
  overtimeHours: number
  
  // ═══════════════════════════════════════════════════════════
  // HISOB-KITOB
  // ═══════════════════════════════════════════════════════════
  
  /** Asosiy maosh */
  baseSalary: number
  
  /** Qo'shimcha to'lovlar (bonus, transport, va h.k.) */
  earnings: SalaryComponent[]
  
  /** Chegirmalar (soliq, pensiya, va h.k.) */
  deductions: SalaryComponent[]
  
  /** Qo'shimcha ish soatlari uchun to'lov */
  overtimePay: number
  
  /** Yalpi maosh (baseSalary + earnings + overtimePay) */
  grossSalary: number
  
  /** Jami chegirmalar */
  totalDeductions: number
  
  /** Sof maosh (grossSalary - totalDeductions) */
  netSalary: number
  
  // ═══════════════════════════════════════════════════════════
  // QO'SHIMCHA MAYDONLAR
  // ═══════════════════════════════════════════════════════════
  
  /** Valyuta */
  currency: Currency
  
  /** Holat */
  status: PaymentStatus
  
  /** Tasdiqlagan xodim ID si */
  approvedBy?: string
  
  /** Tasdiqlangan sana */
  approvedAt?: string
  
  /** To'langan sana */
  paidAt?: string
  
  /** Izoh */
  note?: string
  
  /** Yaratilgan sana */
  createdAt: string
  
  /** Yangilangan sana */
  updatedAt: string
}

// ═══════════════════════════════════════════════════════════
// PAY SLIP
// ═══════════════════════════════════════════════════════════

/**
 * Maosh varaqasi - PayrollEntry + kompaniya va to'liq xodim ma'lumotlari
 */
export interface PaySlip extends PayrollEntry {
  /** Kompaniya nomi */
  companyName: string
  
  /** Kompaniya manzili */
  companyAddress: string
  
  /** To'liq xodim ma'lumotlari */
  employee: Employee
}

// ═══════════════════════════════════════════════════════════
// PAYROLL SUMMARY
// ═══════════════════════════════════════════════════════════

/**
 * Maosh xulosasi - oylik umumiy hisobot
 */
export interface PayrollSummary {
  /** Hisob-kitob davri */
  period: {
    /** Oy (1-12) */
    month: number
    /** Yil */
    year: number
  }
  
  /** Jami xodimlar soni */
  totalEmployees: number
  
  /** Jami yalpi maosh */
  totalGrossSalary: number
  
  /** Jami chegirmalar */
  totalDeductions: number
  
  /** Jami sof maosh */
  totalNetSalary: number
  
  /** To'langan xodimlar soni */
  paidCount: number
  
  /** Kutayotgan xodimlar soni */
  pendingCount: number
  
  /** Valyuta */
  currency: Currency
}

// ═══════════════════════════════════════════════════════════
// FILTER VA QIDIRUV TURLARI
// ═══════════════════════════════════════════════════════════

/**
 * Maoshni filtrlash parametrlari
 */
export interface PayrollFilters {
  /** Xodim ID si bo'yicha filtrlash */
  employeeId?: string
  
  /** Bo'lim ID si bo'yicha filtrlash */
  departmentId?: string
  
  /** Oy (1-12) */
  month?: number
  
  /** Yil */
  year?: number
  
  /** Holat bo'yicha filtrlash */
  status?: PaymentStatus
  
  /** Valyuta bo'yicha filtrlash */
  currency?: Currency
}

/**
 * Maosh yozuvini yaratish DTO
 */
export interface CreatePayrollDto {
  /** Xodim ID si */
  employeeId: string
  
  /** Hisob-kitob davri */
  period: {
    /** Oy (1-12) */
    month: number
    /** Yil */
    year: number
  }
  
  /** Asosiy maosh */
  baseSalary: number
  
  /** Qo'shimcha to'lovlar */
  earnings?: SalaryComponent[]
  
  /** Chegirmalar */
  deductions?: SalaryComponent[]
  
  /** Izoh */
  note?: string
}

/**
 * Maosh yozuvini yangilash DTO
 */
export type UpdatePayrollDto = Partial<CreatePayrollDto>

/**
 * Maoshni tasdiqlash DTO
 */
export interface ApprovePayrollDto {
  /** Tasdiqlash */
  approve: boolean
  
  /** Izoh */
  note?: string
}

// ═══════════════════════════════════════════════════════════
// TAX CALCULATION
// ═══════════════════════════════════════════════════════════

/**
 * Soliq hisoblash uchun input
 */
export interface TaxCalculationInput {
  /** Yalpi maosh */
  grossSalary: number
  
  /** Valyuta */
  currency: Currency
}

/**
 * Soliq hisoblash natijasi
 */
export interface TaxCalculationResult {
  /** Daromad solig'i (12%) */
  incomeTax: number
  
  /** Pensiya jamg'armasi (0%) */
  pensionFund: number
  
  /** Jami soliq */
  totalTax: number
  
  /** Sof maosh */
  netSalary: number
}

// ═══════════════════════════════════════════════════════════
// LIST PARAMS
// ═══════════════════════════════════════════════════════════

/**
 * Maosh yozuvlari ro'yxati parametrlari
 */
export interface PayrollListParams extends PayrollFilters {
  /** Sahifa raqami */
  page?: number
  
  /** Bir sahifadagi elementlar soni */
  pageSize?: number
  
  /** Saralash maydoni */
  sortBy?: keyof PayrollEntry
  
  /** Saralash tartibi */
  sortOrder?: 'asc' | 'desc'
}

// ═══════════════════════════════════════════════════════════
// BARREL EXPORTS
// ═══════════════════════════════════════════════════════════
// Barcha type va interface'lar yuqorida allaqachon export qilingan.
