// ═══════════════════════════════════════════════════════════
// EMPLOYEES MODULE - TYPE DEFINITIONS
// Xodimlar bo'limi uchun TypeScript type va interface'lar
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════

/**
 * Xodimning lavozim darajasi
 */
export type PositionLevel = 'junior' | 'mid' | 'senior' | 'lead' | 'manager'

/**
 * Ishga qabul qilish turi
 */
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern'

/**
 * Xodimning holati
 */
export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'terminated'

/**
 * Jinsi
 */
export type Gender = 'male' | 'female'

/**
 * Valyuta kodlari
 */
export type Currency = 'UZS' | 'USD' | 'EUR'

/**
 * To'lov turi
 */
export type PaymentType = 'monthly' | 'hourly'

// ═══════════════════════════════════════════════════════════
// BO'LIM (DEPARTMENT)
// ═══════════════════════════════════════════════════════════

/**
 * Bo'lim ma'lumotlari
 */
export interface Department {
  /** Bo'lim unikal identifikatori */
  id: string
  
  /** Bo'lim nomi */
  name: string
  
  /** Bo'lim tavsifi */
  description?: string
  
  /** Bo'lim mudiri ID si */
  managerId?: string
  
  /** Bo'limdagi xodimlar soni */
  employeeCount?: number
  
  /** Yaratilgan sana */
  createdAt: string
}

// ═══════════════════════════════════════════════════════════
// LAVOZIM (POSITION)
// ═══════════════════════════════════════════════════════════

/**
 * Maosh ma'lumotlari
 */
export interface SalaryRange {
  /** Minimal maosh */
  min: number
  
  /** Maksimal maosh */
  max: number
  
  /** Valyuta */
  currency: Currency
}

/**
 * Lavozim ma'lumotlari
 */
export interface Position {
  /** Lavozim unikal identifikatori */
  id: string
  
  /** Lavozim nomi */
  name: string
  
  /** Bo'lim ID si */
  departmentId: string
  
  /** Lavozim darajasi */
  level: PositionLevel
  
  /** Maosh oralig'i (ixtiyoriy) */
  salary?: SalaryRange
}

// ═══════════════════════════════════════════════════════════
// Manzil
// ═══════════════════════════════════════════════════════════

/**
 * Xodim manzili
 */
export interface EmployeeAddress {
  /** Shahar */
  city: string
  
  /** Tuman */
  district: string
  
  /** Ko'cha */
  street: string
  
  /** Pochta indeksi */
  zipCode?: string
}

// ═══════════════════════════════════════════════════════════
// Favqulodda aloqa
// ═══════════════════════════════════════════════════════════

/**
 * Favqulodda holatda aloqa ma'lumotlari
 */
export interface EmergencyContact {
  /** Ism Familiya */
  name: string
  
  /** Telefon raqami */
  phone: string
  
  /** Qarindoshlik darajasi */
  relation: string
}

// ═══════════════════════════════════════════════════════════
// Maosh ma'lumotlari
// ═══════════════════════════════════════════════════════════

/**
 * Xodim maoshi
 */
export interface EmployeeSalary {
  /** Bazaviy maosh */
  base: number
  
  /** Valyuta */
  currency: Currency
  
  /** To'lov turi */
  paymentType: PaymentType
}

// ═══════════════════════════════════════════════════════════
// XODIM (EMPLOYEE)
// ═══════════════════════════════════════════════════════════

/**
 * Xodim to'liq ma'lumotlari
 */
export interface Employee {
  /** Xodim unikal identifikatori */
  id: string
  
  /** Xodim kodi (HRM-001 formatida) */
  employeeCode: string
  
  /** Ism */
  firstName: string
  
  /** Familiya */
  lastName: string
  
  /** Otasining ismi (ixtiyoriy) */
  middleName?: string
  
  /** To'liq ism (computed emas, oddiy field) */
  fullName: string
  
  /** Email manzil */
  email: string
  
  /** Telefon raqami */
  phone?: string
  
  /** Avatar rasmi URL */
  avatar?: string
  
  /** Tug'ilgan sana (ISO date string) */
  birthDate?: string
  
  /** Jinsi */
  gender?: Gender
  
  /** Bo'lim ID si */
  departmentId: string
  
  /** Bo'lim ma'lumotlari (ixtiyoriy, expand qilinganda) */
  department?: Department
  
  /** Lavozim ID si */
  positionId: string
  
  /** Lavozim ma'lumotlari (ixtiyoriy, expand qilinganda) */
  position?: Position
  
  /** Boshliq ID si */
  managerId?: string
  
  /** Boshliq ma'lumotlari (ixtiyoriy) */
  manager?: Pick<Employee, 'id' | 'fullName' | 'avatar'>
  
  /** Ishga qabul qilish turi */
  employmentType: EmploymentType
  
  /** Xodim holati */
  status: EmployeeStatus
  
  /** Ishga qabul qilingan sana */
  hireDate: string
  
  /** Ishdan bo'shatilgan sana (ixtiyoriy) */
  terminationDate?: string
  
  /** Maosh ma'lumotlari (ixtiyoriy) */
  salary?: EmployeeSalary
  
  /** Manzil (ixtiyoriy) */
  address?: EmployeeAddress
  
  /** Favqulodda aloqa (ixtiyoriy) */
  emergencyContact?: EmergencyContact
  
  /** Yaratilgan sana */
  createdAt: string
  
  /** Yangilangan sana */
  updatedAt: string
}

// ═══════════════════════════════════════════════════════════
// FILTER VA QIDIRUV TURLARI
// ═══════════════════════════════════════════════════════════

/**
 * Xodimlarni filtrlash parametrlari
 */
export interface EmployeeFilters {
  /** Qidiruv so'zi (ism, familiya, email bo'yicha) */
  search?: string
  
  /** Bo'lim ID si bo'yicha filtrlash */
  departmentId?: string
  
  /** Lavozim ID si bo'yicha filtrlash */
  positionId?: string
  
  /** Holat bo'yicha filtrlash */
  status?: EmployeeStatus
  
  /** Ishga qabul qilish turi bo'yicha filtrlash */
  employmentType?: EmploymentType
  
  /** Boshliq ID si bo'yicha filtrlash */
  managerId?: string
  
  /** Ishga qabul qilingan sana (boshlang'ich) */
  hireDateFrom?: string
  
  /** Ishga qabul qilingan sana (tugash) */
  hireDateTo?: string
}

/**
 * Xodimlar ro'yxati parametrlari (pagination va sorting bilan)
 */
export interface EmployeeListParams extends EmployeeFilters {
  /** Sahifa raqami (1 dan boshlanadi) */
  page?: number
  
  /** Bir sahifadagi elementlar soni */
  pageSize?: number
  
  /** Qaysi maydon bo'yicha saralash */
  sortBy?: keyof Employee
  
  /** Saralash tartibi */
  sortOrder?: 'asc' | 'desc'
}

// ═══════════════════════════════════════════════════════════
// PAGINATION
// ═══════════════════════════════════════════════════════════

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Ma'lumotlar ro'yxati */
  data: T[]
  
  /** Jami elementlar soni */
  total: number
  
  /** Joriy sahifa raqami */
  page: number
  
  /** Bir sahifadagi elementlar soni */
  pageSize: number
  
  /** Jami sahifalar soni */
  totalPages: number
}

// ═══════════════════════════════════════════════════════════
// FORM TURLARI
// ═══════════════════════════════════════════════════════════

/**
 * Xodim yaratish uchun DTO
 * id, employeeCode, createdAt, updatedAt va expanded maydonlar kirmaydi
 */
export type CreateEmployeeDto = Omit<
  Employee,
  | 'id'
  | 'employeeCode'
  | 'createdAt'
  | 'updatedAt'
  | 'department'
  | 'position'
  | 'manager'
>

/**
 * Xodim ma'lumotlarini yangilash uchun DTO
 * Barcha maydonlar ixtiyoriy
 */
export type UpdateEmployeeDto = Partial<CreateEmployeeDto>

// ═══════════════════════════════════════════════════════════
// BARREL EXPORTS
// ═══════════════════════════════════════════════════════════
// Barcha type va interface'lar yuqorida allaqachon export qilingan.
// Bu qism faqat qulaylik uchun qoldirilgan.
