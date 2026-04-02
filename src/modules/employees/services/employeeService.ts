// ═══════════════════════════════════════════════════════════
// EMPLOYEE SERVICE
// Xodimlar bilan ishlash uchun service
// ═══════════════════════════════════════════════════════════

import { appConfig } from '@/config/app'
import { apiService } from '@/services/api'
import {
  mockEmployees,
  mockDepartments,
  mockPositions
} from './mockData'
import type {
  Employee,
  EmployeeListParams,
  EmployeeFilters,
  PaginatedResponse,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  Department,
  Position
} from '../types'

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

function artificialDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * 200) + 200
  return new Promise(resolve => setTimeout(resolve, delay))
}

function generateId(): string {
  return String(Date.now()) + Math.random().toString(36).substr(2, 9)
}

function generateEmployeeCode(): string {
  const num = mockEmployees.length + 1
  return `HRM-${String(num).padStart(3, '0')}`
}

function filterEmployees(
  employees: Employee[],
  filters: EmployeeFilters
): Employee[] {
  let result = [...employees]

  if (filters.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(
      e =>
        e.fullName.toLowerCase().includes(search) ||
        e.email.toLowerCase().includes(search)
    )
  }

  if (filters.departmentId) {
    result = result.filter(e => e.departmentId === filters.departmentId)
  }

  if (filters.status) {
    result = result.filter(e => e.status === filters.status)
  }

  if (filters.employmentType) {
    result = result.filter(e => e.employmentType === filters.employmentType)
  }

  if (filters.managerId) {
    result = result.filter(e => e.managerId === filters.managerId)
  }

  return result
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
  const paginatedData = data.slice(start, end)

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages
  }
}

// ═══════════════════════════════════════════════════════════
// MOCK IMPLEMENTATION
// ═══════════════════════════════════════════════════════════

const mockEmployeeService = {
  async getAll(params: EmployeeListParams): Promise<PaginatedResponse<Employee>> {
    await artificialDelay()

    const filtered = filterEmployees(mockEmployees, params)
    const page = params.page || 1
    const pageSize = params.pageSize || 10

    return paginate(filtered, page, pageSize)
  },

  async getById(id: string): Promise<Employee | null> {
    await artificialDelay()
    return mockEmployees.find(e => e.id === id) || null
  },

  async create(data: CreateEmployeeDto): Promise<Employee> {
    await artificialDelay()

    const newEmployee: Employee = {
      ...data,
      id: generateId(),
      employeeCode: generateEmployeeCode(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockEmployees.push(newEmployee)
    return newEmployee
  },

  async update(id: string, data: UpdateEmployeeDto): Promise<Employee | null> {
    await artificialDelay()

    const index = mockEmployees.findIndex(e => e.id === id)
    if (index === -1) return null

    const updated = {
      ...mockEmployees[index],
      ...data,
      updatedAt: new Date().toISOString()
    } as Employee

    mockEmployees[index] = updated
    return updated
  },

  async delete(id: string): Promise<boolean> {
    await artificialDelay()

    const index = mockEmployees.findIndex(e => e.id === id)
    if (index === -1) return false

    mockEmployees.splice(index, 1)
    return true
  },

  async getDepartments(): Promise<Department[]> {
    await artificialDelay()
    return mockDepartments
  },

  async getPositions(deptId?: string): Promise<Position[]> {
    await artificialDelay()

    if (deptId) {
      return mockPositions.filter(p => p.departmentId === deptId)
    }

    return mockPositions
  }
}

// ═══════════════════════════════════════════════════════════
// REAL IMPLEMENTATION
// ═══════════════════════════════════════════════════════════

const realEmployeeService = {
  async getAll(params: EmployeeListParams): Promise<PaginatedResponse<Employee>> {
    return apiService.get<PaginatedResponse<Employee>>('/employees', { params })
  },

  async getById(id: string): Promise<Employee> {
    return apiService.get<Employee>(`/employees/${id}`)
  },

  async create(data: CreateEmployeeDto): Promise<Employee> {
    return apiService.post<Employee>('/employees', data)
  },

  async update(id: string, data: UpdateEmployeeDto): Promise<Employee> {
    return apiService.put<Employee>(`/employees/${id}`, data)
  },

  async delete(id: string): Promise<void> {
    return apiService.delete(`/employees/${id}`)
  },

  async getDepartments(): Promise<Department[]> {
    return apiService.get<Department[]>('/departments')
  },

  async getPositions(deptId?: string): Promise<Position[]> {
    const params = deptId ? { departmentId: deptId } : undefined
    return apiService.get<Position[]>('/positions', { params })
  }
}

// ═══════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════

export const employeeService = appConfig.useMock
  ? mockEmployeeService
  : realEmployeeService

export default employeeService