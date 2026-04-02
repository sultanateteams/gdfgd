// ═══════════════════════════════════════════════════════════
// USE EMPLOYEE COMPOSABLE
// Bitta xodim bilan ishlash uchun composable
// ═══════════════════════════════════════════════════════════

import { ref } from 'vue'
import { employeeService } from '../services/employeeService'
import type { Employee, UpdateEmployeeDto } from '../types'

export function useEmployee() {
  const employee = ref<Employee | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchEmployee(id: string) {
    isLoading.value = true
    error.value = null

    try {
      employee.value = await employeeService.getById(id)
      if (!employee.value) {
        error.value = 'Xodim topilmadi'
      }
    } catch (err) {
      console.error('Fetch employee error:', err)
      error.value = err instanceof Error ? err.message : 'Xodimni yuklashda xatolik'
    } finally {
      isLoading.value = false
    }
  }

  async function updateEmployee(data: UpdateEmployeeDto) {
    if (!employee.value) {
      throw new Error('Xodim ma\'lumotlari yuklanmagan')
    }

    isLoading.value = true
    error.value = null

    try {
      const updated = await employeeService.update(employee.value.id, data)
      if (updated) {
        employee.value = updated
      } else {
        error.value = 'Xodimni yangilashda xatolik'
      }
    } catch (err) {
      console.error('Update employee error:', err)
      error.value = err instanceof Error ? err.message : 'Xodimni yangilashda xatolik'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function reset() {
    employee.value = null
    isLoading.value = false
    error.value = null
  }

  return {
    employee,
    isLoading,
    error,
    fetchEmployee,
    updateEmployee,
    reset
  }
}

export default useEmployee