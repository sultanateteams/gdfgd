// ═══════════════════════════════════════════════════════════
// MOCK PAYROLL DATA
// Maosh hisob-kitoblari uchun namuna ma'lumotlar (10+ entry)
// ═══════════════════════════════════════════════════════════

import type { PayrollEntry, SalaryComponent } from '../types'

/**
 * Namuna earnings (daromad) komponentlari
 */
const sampleEarningsUZS: SalaryComponent[] = [
  {
    id: 'earning-bonus-1',
    name: 'Oylik bonus',
    type: 'earning',
    amount: 500000,
    currency: 'UZS',
    isPercentage: false,
    isRequired: false,
    description: 'Oylik natijadorlik bonusi'
  },
  {
    id: 'earning-transport-1',
    name: 'Transport',
    type: 'earning',
    amount: 200000,
    currency: 'UZS',
    isPercentage: false,
    isRequired: false,
    description: 'Transport xarajatlari kompensatsiyasi'
  }
]

const sampleEarningsUSD: SalaryComponent[] = [
  {
    id: 'earning-bonus-usd-1',
    name: 'Performance Bonus',
    type: 'earning',
    amount: 200,
    currency: 'USD',
    isPercentage: false,
    isRequired: false,
    description: 'Monthly performance bonus'
  }
]

/**
 * Namuna deductions (chegirma) komponentlari
 */
const sampleDeductions: SalaryComponent[] = [
  {
    id: 'deduction-tax-1',
    name: 'Daromad solig\'i',
    type: 'deduction',
    amount: 0,
    currency: 'UZS',
    isPercentage: true,
    percentage: 12,
    isRequired: true,
    description: '12% daromad solig\'i'
  },
  {
    id: 'deduction-pension-1',
    name: 'Pensiya jamg\'armasi',
    type: 'deduction',
    amount: 0,
    currency: 'UZS',
    isPercentage: true,
    percentage: 1,
    isRequired: true,
    description: '1% pensiya badali'
  }
]

/**
 * Namuna PayrollEntry yozuvlari (10 ta)
 * Turli statuslar va valyutalar bilan
 */
export const mockPayrollEntries: PayrollEntry[] = [
  // 1. paid - UZS - IT Manager
  {
    id: 'payroll-001',
    employeeId: 'emp-001',
    employee: {
      id: 'emp-001',
      fullName: 'Ali Valiyev',
      departmentId: 'dept-it'
    },
    period: { month: 3, year: 2025 },
    workDays: 22,
    presentDays: 22,
    absentDays: 0,
    overtimeHours: 8,
    baseSalary: 8000000,
    earnings: sampleEarningsUZS,
    deductions: [
      ...sampleDeductions.map(d => ({ ...d, amount: 0 })),
    ],
    overtimePay: 363636,
    grossSalary: 9063636,
    totalDeductions: 1178273,
    netSalary: 7885363,
    currency: 'UZS',
    status: 'paid',
    approvedBy: 'admin-001',
    approvedAt: '2025-03-28T10:00:00Z',
    paidAt: '2025-03-30T14:30:00Z',
    note: 'Muntazam to\'lov',
    createdAt: '2025-03-01T09:00:00Z',
    updatedAt: '2025-03-30T14:30:00Z'
  },

  // 2. paid - USD - Marketing Manager
  {
    id: 'payroll-002',
    employeeId: 'emp-002',
    employee: {
      id: 'emp-002',
      fullName: 'Zarina Karimova',
      departmentId: 'dept-marketing'
    },
    period: { month: 3, year: 2025 },
    workDays: 22,
    presentDays: 22,
    absentDays: 0,
    overtimeHours: 4,
    baseSalary: 4500,
    earnings: sampleEarningsUSD,
    deductions: [],
    overtimePay: 136,
    grossSalary: 4836,
    totalDeductions: 630,
    netSalary: 4206,
    currency: 'USD',
    status: 'paid',
    approvedBy: 'admin-001',
    approvedAt: '2025-03-28T11:00:00Z',
    paidAt: '2025-03-30T15:00:00Z',
    note: 'USD da hisoblangan',
    createdAt: '2025-03-01T09:00:00Z',
    updatedAt: '2025-03-30T15:00:00Z'
  },

  // 3. approved - UZS - Sales Manager
  {
    id: 'payroll-003',
    employeeId: 'emp-003',
    employee: {
      id: 'emp-003',
      fullName: 'Rustam Tursunov',
      departmentId: 'dept-sales'
    },
    period: { month: 3, year: 2025 },
    workDays: 22,
    presentDays: 21,
    absentDays: 1,
    overtimeHours: 12,
    baseSalary: 6000000,
    earnings: [
      {
        id: 'earning-bonus-3',
        name: 'Sotuv bonusi',
        type: 'earning',
        amount: 1000000,
        currency: 'UZS',
        isPercentage: false,
        isRequired: false,
        description: 'Oylik sotuv rejasi bajarganligi uchun'
      },
      {
        id: 'earning-transport-3',
        name: 'Transport',
        type: 'earning',
        amount: 150000,
        currency: 'UZS',
        isPercentage: false,
        isRequired: false,
        description: 'Transport xarajatlari'
      }
    ],
    deductions: [],
    overtimePay: 409091,
    grossSalary: 7831818,
    totalDeductions: 1018136,
    netSalary: 6813682,
    currency: 'UZS',
    status: 'approved',
    approvedBy: 'admin-001',
    approvedAt: '2025-03-28T12:00:00Z',
    note: 'Sotuv bo\'limi xodimi',
    createdAt: '2025-03-01T09:00:00Z',
    updatedAt: '2025-03-28T12:00:00Z'
  },

  // 4. calculated - UZS - HR Specialist
  {
    id: 'payroll-004',
    employeeId: 'emp-004',
    employee: {
      id: 'emp-004',
      fullName: 'Malika Ahmedova',
      departmentId: 'dept-hr'
    },
    period: { month: 3, year: 2025 },
    workDays: 22,
    presentDays: 22,
    absentDays: 0,
    overtimeHours: 0,
    baseSalary: 5500000,
    earnings: [
      {
        id: 'earning-bonus-4',
        name: 'Bonus',
        type: 'earning',
        amount: 300000,
        currency: 'UZS',
        isPercentage: false,
        isRequired: false,
        description: 'Muntazam bonus'
      }
    ],
    deductions: [],
    overtimePay: 0,
    grossSalary: 5800000,
    totalDeductions: 754000,
    netSalary: 5046000,
    currency: 'UZS',
    status: 'calculated',
    note: 'Hisoblangan, tasdiq kutilmoqda',
    createdAt: '2025-03-01T09:00:00Z',
    updatedAt: '2025-03-25T16:00:00Z'
  },

  // 5. calculated - USD - Senior Developer
  {
    id: 'payroll-005',
    employeeId: 'emp-005',
    employee: {
      id: 'emp-005',
      fullName: 'Jasur Bekmurodov',
      departmentId: 'dept-it'
    },
    period: { month: 3, year: 2025 },
    workDays: 22,
    presentDays: 20,
    absentDays: 2,
    overtimeHours: 15,
    baseSalary: 5500,
    earnings: [
      {
        id: 'earning-bonus-5',
        name: 'Project Bonus',
        type: 'earning',
        amount: 800,
        currency: 'USD',
        isPercentage: false,
        isRequired: false,
        description: 'Project completion bonus'
      }
    ],
    deductions: [],
    overtimePay: 559,
    grossSalary: 6359,
    totalDeductions: 827,
    netSalary: 5532,
    currency: 'USD',
    status: 'calculated',
    note: 'Project yakunlangan',
    createdAt: '2025-03-01T09:00:00Z',
    updatedAt: '2025-03-26T10:00:00Z'
  },

  // 6. draft - UZS - Accountant
  {
    id: 'payroll-006',
    employeeId: 'emp-006',
    employee: {
      id: 'emp-006',
      fullName: 'Nargiza Umarova',
      departmentId: 'dept-finance'
    },
    period: { month: 3, year: 2025 },
    workDays: 22,
    presentDays: 22,
    absentDays: 0,
    overtimeHours: 6,
    baseSalary: 4800000,
    earnings: [],
    deductions: [],
    overtimePay: 163636,
    grossSalary: 4963636,
    totalDeductions: 645273,
    netSalary: 4318363,
    currency: 'UZS',
    status: 'draft',
    note: 'Qoralama, hali hisoblanmagan',
    createdAt: '2025-03-01T09:00:00Z',
    updatedAt: '2025-03-20T12:00:00Z'
  },

  // 7. draft - UZS - Customer Support
  {
    id: 'payroll-007',
    employeeId: 'emp-007',
    employee: {
      id: 'emp-007',
      fullName: 'Shohruh Abdullayev',
      departmentId: 'dept-support'
    },
    period: { month: 3, year: 2025 },
    workDays: 22,
    presentDays: 19,
    absentDays: 3,
    overtimeHours: 10,
    baseSalary: 3500000,
    earnings: [
      {
        id: 'earning-bonus-7',
        name: 'Performance bonus',
        type: 'earning',
        amount: 250000,
        currency: 'UZS',
        isPercentage: false,
        isRequired: false,
        description: 'Mijozlar mamnunligi bonusi'
      }
    ],
    deductions: [],
    overtimePay: 297727,
    grossSalary: 4097727,
    totalDeductions: 532705,
    netSalary: 3565022,
    currency: 'UZS',
    status: 'draft',
    note: '3 kun yo\'qligi bor',
    createdAt: '2025-03-01T09:00:00Z',
    updatedAt: '2025-03-22T15:00:00Z'
  },

  // 8. draft - USD - Product Manager
  {
    id: 'payroll-008',
    employeeId: 'emp-008',
    employee: {
      id: 'emp-008',
      fullName: 'Dilshod Rahimov',
      departmentId: 'dept-product'
    },
    period: { month: 3, year: 2025 },
    workDays: 22,
    presentDays: 22,
    absentDays: 0,
    overtimeHours: 20,
    baseSalary: 5000,
    earnings: [
      {
        id: 'earning-bonus-8',
        name: 'Product Launch Bonus',
        type: 'earning',
        amount: 1000,
        currency: 'USD',
        isPercentage: false,
        isRequired: false,
        description: 'Yangi mahsulot chiqarilgani uchun'
      }
    ],
    deductions: [],
    overtimePay: 1136,
    grossSalary: 7136,
    totalDeductions: 928,
    netSalary: 6208,
    currency: 'USD',
    status: 'draft',
    note: 'Product launch bonus qo\'shilgan',
    createdAt: '2025-03-01T09:00:00Z',
    updatedAt: '2025-03-24T11:00:00Z'
  },

  // 9. draft - UZS - Junior Developer
  {
    id: 'payroll-009',
    employeeId: 'emp-009',
    employee: {
      id: 'emp-009',
      fullName: 'Aziza Saidova',
      departmentId: 'dept-it'
    },
    period: { month: 3, year: 2025 },
    workDays: 22,
    presentDays: 21,
    absentDays: 1,
    overtimeHours: 5,
    baseSalary: 3000000,
    earnings: [],
    deductions: [],
    overtimePay: 106818,
    grossSalary: 3243182,
    totalDeductions: 421614,
    netSalary: 2821568,
    currency: 'UZS',
    status: 'draft',
    note: 'Junior dasturchi',
    createdAt: '2025-03-01T09:00:00Z',
    updatedAt: '2025-03-23T14:00:00Z'
  },

  // 10. draft - UZS - Operations Manager
  {
    id: 'payroll-010',
    employeeId: 'emp-010',
    employee: {
      id: 'emp-010',
      fullName: 'Botir Qodirov',
      departmentId: 'dept-operations'
    },
    period: { month: 3, year: 2025 },
    workDays: 22,
    presentDays: 22,
    absentDays: 0,
    overtimeHours: 8,
    baseSalary: 6500000,
    earnings: [
      {
        id: 'earning-bonus-10',
        name: 'Operations Bonus',
        type: 'earning',
        amount: 400000,
        currency: 'UZS',
        isPercentage: false,
        isRequired: false,
        description: 'Operatsion samaradorlik bonusi'
      },
      {
        id: 'earning-transport-10',
        name: 'Transport',
        type: 'earning',
        amount: 250000,
        currency: 'UZS',
        isPercentage: false,
        isRequired: false,
        description: 'Xizmat safari uchun'
      }
    ],
    deductions: [],
    overtimePay: 236364,
    grossSalary: 7386364,
    totalDeductions: 960227,
    netSalary: 6426137,
    currency: 'UZS',
    status: 'draft',
    note: 'Operatsion bo\'lim rahbari',
    createdAt: '2025-03-01T09:00:00Z',
    updatedAt: '2025-03-25T09:00:00Z'
  },

  // 11. paid - UZS - Finance Director (fevral oyi)
  {
    id: 'payroll-011',
    employeeId: 'emp-011',
    employee: {
      id: 'emp-011',
      fullName: 'Farhod Mahmudov',
      departmentId: 'dept-finance'
    },
    period: { month: 2, year: 2025 },
    workDays: 20,
    presentDays: 20,
    absentDays: 0,
    overtimeHours: 4,
    baseSalary: 10000000,
    earnings: [],
    deductions: [],
    overtimePay: 250000,
    grossSalary: 10250000,
    totalDeductions: 1332500,
    netSalary: 8917500,
    currency: 'UZS',
    status: 'paid',
    approvedBy: 'admin-001',
    approvedAt: '2025-02-28T10:00:00Z',
    paidAt: '2025-02-28T16:00:00Z',
    note: 'Fevral oyi maoshi',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-28T16:00:00Z'
  },

  // 12. approved - USD - UX Designer (fevral oyi)
  {
    id: 'payroll-012',
    employeeId: 'emp-012',
    employee: {
      id: 'emp-012',
      fullName: 'Laylo Aliyeva',
      departmentId: 'dept-design'
    },
    period: { month: 2, year: 2025 },
    workDays: 20,
    presentDays: 19,
    absentDays: 1,
    overtimeHours: 8,
    baseSalary: 3800,
    earnings: [],
    deductions: [],
    overtimePay: 228,
    grossSalary: 4028,
    totalDeductions: 524,
    netSalary: 3504,
    currency: 'USD',
    status: 'approved',
    approvedBy: 'admin-001',
    approvedAt: '2025-02-28T11:00:00Z',
    note: 'Fevral oyi, 1 kun yo\'qligi bor',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-28T11:00:00Z'
  }
]