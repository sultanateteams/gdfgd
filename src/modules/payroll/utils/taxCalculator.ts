// ═══════════════════════════════════════════════════════════
// TAX CALCULATOR
// Soliq va chegirmalarni hisoblash uchun yordamchi funksiyalar
// ═══════════════════════════════════════════════════════════

import type { Currency, TaxCalculationInput, TaxCalculationResult } from '../types'

/**
 * Valyuta kurslari (taxminiy)
 */
const EXCHANGE_RATES: Record<Currency, number> = {
  UZS: 1,
  USD: 12800,
  EUR: 13900
}

/**
 * Daromad solig'ini hisoblash (12%)
 * O'zbekiston soliq qonunchiligiga ko'ra
 *
 * @param grossSalary - Yalpi maosh
 * @returns Daromad solig'i summasi
 */
export function calculateIncomeTax(grossSalary: number): number {
  return Math.round(grossSalary * 0.12)
}

/**
 * Pensiya jamg'armasiga chegirma (1%)
 * Majburiy pensiya badallari
 *
 * @param grossSalary - Yalpi maosh
 * @returns Pensiya jamg'armasi summasi
 */
export function calculatePensionFund(grossSalary: number): number {
  return Math.round(grossSalary * 0.01)
}

/**
 * Ijtimoiy soliqni hisoblash (12%)
 * Ish beruvchi tomonidan to'lanadigan soliq
 *
 * @param grossSalary - Yalpi maosh
 * @returns Ijtimoiy soliq summasi
 */
export function calculateSocialTax(grossSalary: number): number {
  return Math.round(grossSalary * 0.12)
}

/**
 * To'liq soliq hisob-kitobini bajarish
 * Barcha chegirmalardan keyin qo'lga tegadigan summani hisoblaydi
 *
 * @param input - Soliq hisoblash uchun input ma'lumotlar
 * @returns To'liq soliq hisob-kitob natijasi
 */
export function calculateNetSalary(input: TaxCalculationInput): TaxCalculationResult {
  const { grossSalary } = input

  const incomeTax = calculateIncomeTax(grossSalary)
  const pensionFund = calculatePensionFund(grossSalary)
  const totalTax = incomeTax + pensionFund
  const netSalary = Math.max(0, grossSalary - totalTax)

  return {
    incomeTax,
    pensionFund,
    totalTax,
    netSalary
  }
}

/**
 * To'liq soliq hisob-kitobini bajarish (qisqa nomi)
 *
 * @param input - Soliq hisoblash uchun input ma'lumotlar
 * @returns To'liq soliq hisob-kitob natijasi
 */
export function calculateTax(input: TaxCalculationInput): TaxCalculationResult {
  return calculateNetSalary(input)
}

/**
 * Valyutani formatlash (ko'rsatish uchun)
 *
 * @param amount - Summa
 * @param currency - Valyuta kodi
 * @param locale - Lokalizatsiya (default: 'uz-UZ')
 * @returns Formatlangan string
 */
export function formatCurrency(
  amount: number,
  currency: Currency = 'UZS',
  locale: string = 'uz-UZ'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Valyutani konvertatsiya qilish
 *
 * @param amount - Summa
 * @param fromCurrency - Qaysi valyutadan
 * @param toCurrency - Qaysi valyutaga
 * @param rates - Valyuta kurslari (default: EXCHANGE_RATES)
 * @returns Konvertatsiya qilingan summa
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  rates: Record<Currency, number> = EXCHANGE_RATES
): number {
  if (fromCurrency === toCurrency) return amount

  // Avval UZS ga o'tkazamiz, keyin kerakli valyutaga
  const amountInUZS = amount * rates[fromCurrency]
  const convertedAmount = amountInUZS / rates[toCurrency]

  return Math.round(convertedAmount)
}

/**
 * Valyuta kursini olish
 *
 * @param currency - Valyuta kodi
 * @param targetCurrency - Qaysi valyutaga nisbatan (default: UZS)
 * @param rates - Valyuta kurslari (default: EXCHANGE_RATES)
 * @returns Valyuta kursi
 */
export function getExchangeRate(
  currency: Currency,
  targetCurrency: Currency = 'UZS',
  rates: Record<Currency, number> = EXCHANGE_RATES
): number {
  if (currency === targetCurrency) return 1

  return rates[currency] / rates[targetCurrency]
}