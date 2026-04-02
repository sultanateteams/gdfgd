<template>
  <div class="min-h-screen bg-[var(--body-bg)] p-6">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[var(--text-primary)]">Xodimlar</h1>
        <p class="text-sm text-[var(--text-secondary)] mt-1">Barcha xodimlarni ko'rish va boshqarish</p>
      </div>
      <AppPermissionGuard permission="employees:create">
        <AppButton type="primary" @click="openCreateDrawer">
          <template #icon>
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </template>
          Xodim qo'shish
        </AppButton>
      </AppPermissionGuard>
    </div>

    <!-- Filter Panel -->
    <div class="bg-[var(--card-bg)] rounded-xl p-4 mb-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-[var(--text-primary)]">Filtrlar</h2>
        <button @click="toggleFilters" class="text-sm text-[var(--accent-primary)] hover:underline">
          {{ showFilters ? 'Yashirish' : 'Ko\'rsatish' }}
        </button>
      </div>

      <div v-if="showFilters" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-medium text-[var(--text-secondary)] mb-1">Qidiruv</label>
          <AppInput v-model="searchQuery" placeholder="Ism yoki email..." @input="debouncedSearch" />
        </div>
        <div>
          <label class="block text-xs font-medium text-[var(--text-secondary)] mb-1">Bo'lim</label>
          <AppSelect v-model="departmentFilter" :options="departmentOptions" placeholder="Barchasi" clearable @change="applyFilters" />
        </div>
        <div>
          <label class="block text-xs font-medium text-[var(--text-secondary)] mb-1">Holat</label>
          <AppSelect v-model="statusFilter" :options="statusOptions" placeholder="Barchasi" clearable @change="applyFilters" />
        </div>
        <div>
          <label class="block text-xs font-medium text-[var(--text-secondary)] mb-1">Ish turi</label>
          <AppSelect v-model="employmentTypeFilter" :options="employmentTypeOptions" placeholder="Barchasi" clearable @change="applyFilters" />
        </div>
      </div>

      <div v-if="showFilters" class="mt-4 flex justify-end">
        <AppButton type="ghost" size="sm" @click="clearFilters">Filtrlarni tozalash</AppButton>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-[var(--card-bg)] rounded-xl shadow-sm overflow-hidden">
      <AppTable
        :columns="columns"
        :data="employees"
        :loading="isLoading"
        :pagination="pagination"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #name="{ row }">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center overflow-hidden">
              <img v-if="row.avatar" :src="row.avatar" :alt="row.fullName" class="w-full h-full object-cover" />
              <span v-else class="text-sm font-semibold text-[var(--accent-primary)]">{{ getInitials(row.fullName) }}</span>
            </div>
            <div>
              <div class="font-medium text-[var(--text-primary)]">{{ row.fullName }}</div>
              <div class="text-xs text-[var(--text-muted)]">{{ row.email }}</div>
            </div>
          </div>
        </template>

        <template #status="{ row }">
          <AppStatusBadge :status="getStatusType(row.status)" :label="getStatusLabel(row.status)" />
        </template>

        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <AppIconButton icon="eye" size="sm" variant="ghost" @click="viewEmployee(row)" title="Ko'rish" />
            <AppPermissionGuard permission="employees:edit">
              <AppIconButton icon="edit" size="sm" variant="ghost" @click="editEmployee(row)" title="Tahrirlash" />
            </AppPermissionGuard>
            <AppPermissionGuard permission="employees:delete">
              <AppIconButton icon="trash" size="sm" variant="ghost" class="text-red-500 hover:text-red-600" @click="confirmDelete(row)" title="O'chirish" />
            </AppPermissionGuard>
          </div>
        </template>

        <template #empty>
          <div class="py-12 text-center">
            <svg class="w-16 h-16 mx-auto text-[var(--text-muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-[var(--text-secondary)]">Xodimlar topilmadi</p>
          </div>
        </template>
      </AppTable>
    </div>

    <!-- Form Drawer -->
    <EmployeeFormDrawer v-model:open="drawerOpen" :employee="selectedEmployee" @success="fetchEmployees" />

    <!-- Delete Confirmation Modal -->
    <AppConfirmModal
      v-model:open="deleteModalOpen"
      title="Xodimni o'chirish"
      :description="`Haqiqatan ham ${selectedEmployee?.fullName} ni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.`"
      confirm-text="Ha, o'chirish"
      cancel-text="Bekor qilish"
      type="danger"
      :loading="isDeleting"
      @confirm="deleteEmployee"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Employee, EmployeeStatus, EmploymentType } from '../types'
import { useEmployees } from '../composables/useEmployees'
import EmployeeFormDrawer from '../components/EmployeeFormDrawer.vue'
import AppInput from '@/shared/components/ui/AppInput.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppSelect from '@/shared/components/ui/AppSelect.vue'
import AppTable from '@/shared/components/ui/AppTable.vue'
import AppIconButton from '@/shared/components/ui/AppIconButton.vue'
import AppStatusBadge from '@/shared/components/ui/AppStatusBadge.vue'
import AppConfirmModal from '@/shared/components/ui/AppConfirmModal.vue'
import AppPermissionGuard from '@/shared/components/ui/AppPermissionGuard.vue'

const router = useRouter()
const showFilters = ref(true)
const drawerOpen = ref(false)
const deleteModalOpen = ref(false)
const selectedEmployee = ref<Employee | null>(null)
const isDeleting = ref(false)
const searchQuery = ref('')
const departmentFilter = ref('')
const statusFilter = ref('')
const employmentTypeFilter = ref('')

const { employees, loading, pagination, fetchEmployees, deleteEmployee: deleteEmployeeApi } = useEmployees()
const isLoading = computed(() => loading.value)

let searchTimeout: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => applyFilters(), 300)
}

const toggleFilters = () => { showFilters.value = !showFilters.value }

const clearFilters = () => {
  searchQuery.value = ''
  departmentFilter.value = ''
  statusFilter.value = ''
  employmentTypeFilter.value = ''
  fetchEmployees()
}

const applyFilters = () => {
  fetchEmployees({
    search: searchQuery.value || undefined,
    departmentId: departmentFilter.value || undefined,
    status: (statusFilter.value as EmployeeStatus) || undefined,
    employmentType: (employmentTypeFilter.value as EmploymentType) || undefined,
    page: 1
  })
}

const handlePageChange = (page: number) => {
  fetchEmployees({
    search: searchQuery.value || undefined,
    departmentId: departmentFilter.value || undefined,
    status: (statusFilter.value as EmployeeStatus) || undefined,
    employmentType: (employmentTypeFilter.value as EmploymentType) || undefined,
    page
  })
}

const handlePageSizeChange = (pageSize: number) => {
  fetchEmployees({
    search: searchQuery.value || undefined,
    departmentId: departmentFilter.value || undefined,
    status: (statusFilter.value as EmployeeStatus) || undefined,
    employmentType: (employmentTypeFilter.value as EmploymentType) || undefined,
    page: 1,
    pageSize
  })
}

const columns = [
  { title: 'Xodim', key: 'name', width: '280px' },
  { title: 'Kod', key: 'employeeCode', width: '100px' },
  { title: "Bo'lim", key: 'department', width: '150px', accessor: (row: Employee) => row.department?.name || '-' },
  { title: 'Lavozim', key: 'position', width: '150px', accessor: (row: Employee) => row.position?.name || '-' },
  { title: 'Ish turi', key: 'employmentType', width: '120px', accessor: (row: Employee) => getEmploymentTypeLabel(row.employmentType) },
  { title: 'Holat', key: 'status', width: '100px' },
  { title: 'Kirish sanasi', key: 'hireDate', width: '120px', accessor: (row: Employee) => new Date(row.hireDate).toLocaleDateString('uz-UZ') },
  { title: 'Amallar', key: 'actions', width: '120px', align: 'center' }
]

const departmentOptions = [
  { label: 'IT', value: 'dept-it' },
  { label: 'HR', value: 'dept-hr' },
  { label: 'Moliya', value: 'dept-finance' },
  { label: 'Sotuv', value: 'dept-sales' }
]

const statusOptions = [
  { label: 'Faol', value: 'active' },
  { label: 'Nofaol', value: 'inactive' },
  { label: "Ta'tilda", value: 'on_leave' },
  { label: "Bo'shatilgan", value: 'terminated' }
]

const employmentTypeOptions = [
  { label: "To'liq stavka", value: 'full_time' },
  { label: "Qisqa stavka", value: 'part_time' },
  { label: 'Shartnoma', value: 'contract' },
  { label: 'Amaliyot', value: 'intern' }
]

const getInitials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

const getStatusType = (status: EmployeeStatus) => {
  const map: Record<EmployeeStatus, 'success' | 'default' | 'warning' | 'error'> = {
    active: 'success', inactive: 'default', on_leave: 'warning', terminated: 'error'
  }
  return map[status] || 'default'
}

const getStatusLabel = (status: EmployeeStatus) => {
  const map: Record<EmployeeStatus, string> = {
    active: 'Faol', inactive: 'Nofaol', on_leave: "Ta'tilda", terminated: "Bo'shatilgan"
  }
  return map[status] || status
}

const getEmploymentTypeLabel = (type: EmploymentType) => {
  const map: Record<EmploymentType, string> = {
    full_time: "To'liq", part_time: "Qisqa", contract: 'Shartnoma', intern: 'Amaliyot'
  }
  return map[type] || type
}

const viewEmployee = (employee: Employee) => { router.push(`/employees/${employee.id}`) }
const editEmployee = (employee: Employee) => { selectedEmployee.value = employee; drawerOpen.value = true }
const openCreateDrawer = () => { selectedEmployee.value = null; drawerOpen.value = true }
const confirmDelete = (employee: Employee) => { selectedEmployee.value = employee; deleteModalOpen.value = true }

const deleteEmployee = async () => {
  if (!selectedEmployee.value) return
  isDeleting.value = true
  try {
    await deleteEmployeeApi(selectedEmployee.value.id)
    deleteModalOpen.value = false
    selectedEmployee.value = null
    fetchEmployees()
  } catch (error) {
    console.error('Delete error:', error)
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => { fetchEmployees() })
</script>