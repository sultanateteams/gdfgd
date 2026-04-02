// ═══════════════════════════════════════════════════════════
// PAYROLL CALCULATOR
// Maosh hisob-kitoblari uchun yordamchi funksiyalar
// ═══════════════════════════════════════════════════════════

import type { SalaryComponent, PayrollEntry, CreatePayrollDto } from '../types'
import {
  calculateIncomeTax,
  calculatePensionFund,
  calculateNetSalary
} from './taxCalculator'

/**
 * Soatlik stavkani hisoblash
 * Bir soatlik ish haqi
 *
 * @param baseSalary - Asosiy maosh
 * @param totalWorkDays - Jami ish kunlari
 * @returns Soatlik stavka
 */
export function calculateHourlyRate(
  baseSalary: number,
  totalWorkDays: number
): number {
  if (totalWorkDays === 0) return 0
  // Bir kun 8 soat deb hisoblaymiz
  const dailyRate = baseSalary / totalWorkDays
  return dailyRate / 8
}

/**
 * Ish kuni maoshini hisoblash
 * Base salary dan ishlangan kunlarga proporsional miqdorni hisoblaydi
 *
 * @param baseSalary - Asosiy maosh
 * @param presentDays - Ishlangan kunlar soni
 * @param totalWorkDays - Jami ish kunlari
 * @returns Ish kuni uchun maosh
 */
export function calculateWorkDaysPay(
  baseSalary: number,
  presentDays: number,
  totalWorkDays: number
): number {
  if (totalWorkDays === 0) return 0
  if (presentDays > totalWorkDays) presentDays = totalWorkDays
  if (presentDays < 0) presentDays = 0

  return Math.round((baseSalary / totalWorkDays) * presentDays)
}

/**
 * Qo'shimcha ish soatlari uchun maoshni hisoblash
 *
 * @param hourlyRate - Soatlik stavka
 * @param overtimeHours - Qo'shimcha ish soatlari
 * @param multiplier - Koeffitsiyent (default: 1.5)
 * @returns Qo'shimcha ish soatlari uchun to'lov
 */
export function calculateOvertimePay(
  hourlyRate: number,
  overtimeHours: number,
  multiplier: number = 1.5
): number {
  if (overtimeHours <= 0 || hourlyRate <= 0) return 0
  return Math.round(hourlyRate * overtimeHours * multiplier)
}

/**
 * Yalpi maoshni hisoblash
 * Asosiy maosh + qo'shimcha to'lovlar + overtime
 *
 * @param baseSalary - Asosiy maosh
 * @param earnings - Qo'shimcha to'lovlar (bonus, transport va h.k.)
 * @param overtimePay - Qo'shimcha ish soatlari uchun to'lov
 * @returns Yalpi maosh
 */
export function calculateGrossSalary(
  baseSalary: number,
  earnings: SalaryComponent[] = [],
  overtimePay: number = 0
): number {
  const totalEarnings = calculateComponentsTotal(earnings, baseSalary)
  return baseSalary + totalEarnings + overtimePay
}

/**
 * Jami chegirmalarni hisoblash
 * taxCalculator dan foydalanib soliqlarni hisoblaydi
 *
 * @param grossSalary - Yalpi maosh
 * @param additionalDeductions - Qo'shimcha chegirmalar
 * @returns Jami chegirmalar
 */
export function calculateDeductions(
  grossSalary: number,
  additionalDeductions: SalaryComponent[] = []
): number {
  // taxCalculator dan foydalanib majburiy soliqlarni hisoblaymiz
  const taxResult = calculateNetSalary({ grossSalary, currency: 'UZS' })
  const mandatoryDeductions = taxResult.totalTax

  // Qo'shimcha chegirmalar
  const additionalTotal = calculateComponentsTotal(additionalDeductions, grossSalary)

  return mandatoryDeductions + additionalTotal
}

/**
 * Barcha komponentlar (earnings yoki deductions) summasini hisoblash
 *
 * @param components - Maosh komponentlari ro'yxati
 * @param baseSalary - Asosiy maosh (foizda hisoblash uchun)
 * @returns Komponentlar jami summasi
 */
export function calculateComponentsTotal(
  components: SalaryComponent[],
  baseSalary: number
): number {
  if (!components || components.length === 0) return 0

  let total = 0

  for (const component of components) {
    if (component.isPercentage && component.percentage !== undefined) {
      // Foizda hisoblash
      total += (baseSalary * component.percentage) / 100
    } else {
      // Aniq summa
      total += component.amount
    }
  }

  return Math.round(total)
}

/**
 * PayrollEntry yaratish uchun ma'lumotlarni hisoblash
 * AttendanceReport dan ma'lumotlarni oladi
 *
 * @param employeeId - Xodim ID si
 * @param period - Hisob-kitob davri
 * @param baseSalary - Asosiy maosh
 * @param attendanceReport - Davomat hisoboti
 * @param earnings - Qo'shimcha to'lovlar (ixtiyoriy)
 * @param deductions - Chegirmalar (ixtiyoriy)
 * @returns Partial<PayrollEntry> - Hisoblangan qiymatlar bilan
 */
export function buildPayrollEntry(
  employeeId: string,
  period: { month: number; year: number },
  baseSalary: number,
  attendanceReport: {
    totalWorkDays: number
    presentDays: number
    overtimeHours: number
  },
  earnings: SalaryComponent[] = [],
  deductions: SalaryComponent[] = []
): Partial<PayrollEntry> {
  const { totalWorkDays, presentDays, overtimeHours } = attendanceReport

  // Ish kuni maoshini hisoblash
  const workDaysPay = calculateWorkDaysPay(baseSalary, presentDays, totalWorkDays)

  // Soatlik stavka va overtime
  const hourlyRate = calculateHourlyRate(baseSalary, totalWorkDays)
  const overtimePay = calculateOvertimePay(hourlyRate, overtimeHours)

  // Kelmagan kunlar
  const absentDays = totalWorkDays - presentDays

  // Yalpi maosh
  const grossSalary = calculateGrossSalary(workDaysPay, earnings, overtimePay)

  // Jami chegirmalar (taxCalculator ishlatiladi)
  const totalDeductions = calculateDeductions(grossSalary, deductions)

  // Sof maosh
  const netSalary = grossSalary - totalDeductions

  // Tax deductions (taxCalculator dan foydalanib)
  const taxResult = calculateNetSalary({ grossSalary, currency: 'UZS' })

  const allDeductions = [
    ...deductions,
    {
      id: `deduction-tax-${Date.now()}-1`,
      name: 'Daromad solig\'i',
      type: 'deduction' as const,
      amount: taxResult.incomeTax,
      currency: 'UZS' as const,
      isPercentage: true,
      percentage: 12,
      isRequired: true,
      description: '12% daromad solig\'i'
    },
    {
      id: `deduction-pension-${Date.now()}`,
      name: 'Pensiya jamg\'armasi',
      type: 'deduction' as const,
      amount: taxResult.pensionFund,
      currency: 'UZS' as const,
      isPercentage: true,
      percentage: 1,
      isRequired: true,
      description: '1% pensiya badali'
    }
  ]

  return {
    employeeId,
    period,
    baseSalary: workDaysPay,
    workDays: totalWorkDays,
    presentDays,
    absentDays,
    overtimeHours,
    overtimePay,
    earnings,
    deductions: allDeductions,
    grossSalary,
    totalDeductions,
    netSalary,
    currency: 'UZS',
    status: 'draft'
  }
}

/**
 * PayrollEntry ni to'liq yangilash (earnings va deductions qo'shish)
 *
 * @param entry - Boshlang'ich PayrollEntry
 * @param earnings - Qo'shimcha to'lovlar
 * @param deductions - Chegirmalar
 * @returns Yangilangan PayrollEntry
 */
export function updatePayrollComponents(
  entry: Partial<PayrollEntry>,
  earnings: SalaryComponent[] = [],
  deductions: SalaryComponent[] = []
): Partial<PayrollEntry> {
  const baseSalary = entry.baseSalary || 0

  // Yalpi maosh
  const grossSalary = calculateGrossSalary(
    baseSalary,
    earnings,
    entry.overtimePay || 0
  )

  // Jami chegirmalar (taxCalculator ishlatiladi)
  const totalDeductions = calculateDeductions(grossSalary, deductions)

  // Sof maosh
  const netSalary = grossSalary - totalDeductions

  return {
    ...entry,
    earnings,
    deductions,
    grossSalary,
    totalDeductions,
    netSalary
  }
}