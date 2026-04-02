// ═══════════════════════════════════════════════════════════
// USE EMPLOYEES COMPOSABLE
// Xodimlar ro'yxati uchun composable
// ═══════════════════════════════════════════════════════════

import { ref } from 'vue'
import type { Employee, EmployeeFilters, EmployeeListParams, PaginatedResponse } from '../types'

// Mock data
const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeCode: 'HRM-001',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+998 90 123 45 67',
    departmentId: 'dept-it',
    department: { id: 'dept-it', name: 'IT', createdAt: '2024-01-01' },
    positionId: 'pos-1',
    position: { id: 'pos-1', name: 'Senior Developer', departmentId: 'dept-it', level: 'senior' },
    employmentType: 'full_time',
    status: 'active',
    hireDate: '2024-01-15',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    employeeCode: 'HRM-002',
    firstName: 'Jane',
    lastName: 'Smith',
    fullName: 'Jane Smith',
    email: 'jane.smith@company.com',
    phone: '+998 90 234 56 78',
    departmentId: 'dept-hr',
    department: { id: 'dept-hr', name: 'HR', createdAt: '2024-01-01' },
    positionId: 'pos-2',
    position: { id: 'pos-2', name: 'HR Manager', departmentId: 'dept-hr', level: 'manager' },
    employmentType: 'full_time',
    status: 'active',
    hireDate: '2024-02-01',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  }
]

export function useEmployees() {
  const employees = ref<Employee[]>([])
  const loading = ref(false)
  const pagination = ref<PaginatedResponse<Employee>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  })

  async function fetchEmployees(params?: EmployeeListParams) {
    loading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Filter mock data
      let filtered = [...mockEmployees]
      
      if (params?.search) {
        const search = params.search.toLowerCase()
        filtered = filtered.filter(e => 
          e.fullName.toLowerCase().includes(search) ||
          e.email.toLowerCase().includes(search)
        )
      }
      
      if (params?.departmentId) {
        filtered = filtered.filter(e => e.departmentId === params.departmentId)
      }
      
      if (params?.status) {
        filtered = filtered.filter(e => e.status === params.status)
      }
      
      if (params?.employmentType) {
        filtered = filtered.filter(e => e.employmentType === params.employmentType)
      }
      
      const page = params?.page || 1
      const pageSize = params?.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginatedData = filtered.slice(start, end)
      
      employees.value = paginatedData
      pagination.value = {
        data: paginatedData,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      }
    } finally {
      loading.value = false
    }
  }

  async function deleteEmployee(id: string) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    employees.value = employees.value.filter(e => e.id !== id)
  }

  return {
    employees,
    loading,
    pagination,
    fetchEmployees,
    deleteEmployee
  }
}