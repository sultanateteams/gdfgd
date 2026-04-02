<template>
  <div class="min-h-screen bg-[var(--body-bg)] p-6">
    <!-- Breadcrumb -->
    <div class="mb-6">
      <AppBreadcrumb :items="[
        { title: 'Xodimlar', to: '/employees' },
        { title: employee?.fullName || 'Yuklanmoqda...' }
      ]" />
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)]"></div>
    </div>

    <div v-else-if="employee" class="max-w-4xl mx-auto">
      <!-- Main Card -->
      <AppCard class="mb-6">
        <div class="flex items-start gap-6">
          <!-- Avatar -->
          <div class="w-24 h-24 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
            <img v-if="employee.avatar" :src="employee.avatar" :alt="employee.fullName" class="w-full h-full object-cover rounded-full" />
            <span v-else class="text-2xl font-bold text-[var(--accent-primary)]">
              {{ getInitials(employee.fullName) }}
            </span>
          </div>

          <!-- Info -->
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-[var(--text-primary)] mb-1">{{ employee.fullName }}</h1>
            <p class="text-sm text-[var(--text-secondary)] mb-3">{{ employee.position?.name }} • {{ employee.department?.name }}</p>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-[var(--text-muted)]">Email:</span>
                <span class="text-[var(--text-primary)] ml-2">{{ employee.email }}</span>
              </div>
              <div>
                <span class="text-[var(--text-muted)]">Telefon:</span>
                <span class="text-[var(--text-primary)] ml-2">{{ employee.phone || '-' }}</span>
              </div>
              <div>
                <span class="text-[var(--text-muted)]">Bo'lim:</span>
                <span class="text-[var(--text-primary)] ml-2">{{ employee.department?.name || '-' }}</span>
              </div>
              <div>
                <span class="text-[var(--text-muted)]">Lavozim:</span>
                <span class="text-[var(--text-primary)] ml-2">{{ employee.position?.name || '-' }}</span>
              </div>
              <div>
                <span class="text-[var(--text-muted)]">Menejer:</span>
                <span class="text-[var(--text-primary)] ml-2">{{ employee.manager?.fullName || '-' }}</span>
              </div>
              <div>
                <span class="text-[var(--text-muted)]">Yollash sanasi:</span>
                <span class="text-[var(--text-primary)] ml-2">{{ formatDate(employee.hireDate) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 mt-6">
              <AppPermissionGuard permission="employees:edit">
                <AppButton type="primary" @click="editEmployee">
                  <template #icon>
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </template>
                  Tahrirlash
                </AppButton>
              </AppPermissionGuard>
              <AppButton type="ghost" @click="goBack">Orqaga</AppButton>
            </div>
          </div>
        </div>
      </AppCard>

      <!-- Salary Card (Admin & HR Manager only) -->
      <AppPermissionGuard :permission="['payroll:view', 'employees:view_salary']">
        <AppCard v-if="employee.salary">
          <h2 class="text-lg font-semibold text-[var(--text-primary)] mb-4">Maosh ma'lumotlari</h2>
          <div class="grid grid-cols-3 gap-6">
            <div>
              <span class="text-sm text-[var(--text-muted)]">Bazaviy maosh</span>
              <p class="text-xl font-bold text-[var(--text-primary)]">
                {{ formatCurrency(employee.salary.base, employee.salary.currency) }}
              </p>
            </div>
            <div>
              <span class="text-sm text-[var(--text-muted)]">To'lov turi</span>
              <p class="text-lg text-[var(--text-primary)]">
                {{ employee.salary.paymentType === 'monthly' ? 'Oylik' : 'Soatlik' }}
              </p>
            </div>
            <div>
              <span class="text-sm text-[var(--text-muted)]">Valyuta</span>
              <p class="text-lg text-[var(--text-primary)]">{{ employee.salary.currency }}</p>
            </div>
          </div>
        </AppCard>
      </AppPermissionGuard>

      <!-- Additional Info Card -->
      <AppCard>
        <h2 class="text-lg font-semibold text-[var(--text-primary)] mb-4">Qo'shimcha ma'lumotlar</h2>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-[var(--text-muted)]">Ish turi:</span>
            <span class="text-[var(--text-primary)] ml-2">{{ getEmploymentTypeLabel(employee.employmentType) }}</span>
          </div>
          <div>
            <span class="text-[var(--text-muted)]">Holat:</span>
            <span class="text-[var(--text-primary)] ml-2">
              <AppStatusBadge :status="getStatusType(employee.status)" :label="getStatusLabel(employee.status)" />
            </span>
          </div>
          <div v-if="employee.birthDate">
            <span class="text-[var(--text-muted)]">Tug'ilgan sana:</span>
            <span class="text-[var(--text-primary)] ml-2">{{ formatDate(employee.birthDate) }}</span>
          </div>
          <div v-if="employee.gender">
            <span class="text-[var(--text-muted)]">Jinsi:</span>
            <span class="text-[var(--text-primary)] ml-2">{{ employee.gender === 'male' ? 'Erkak' : 'Ayol' }}</span>
          </div>
        </div>
      </AppCard>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-[var(--text-secondary)]">Xodim topilmadi</p>
      <AppButton type="primary" class="mt-4" @click="goBack">Orqaga qaytish</AppButton>
    </div>

    <!-- Edit Drawer -->
    <EmployeeFormDrawer v-model:open="drawerOpen" :employee="employee" @success="fetchEmployee" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Employee, EmployeeStatus, EmploymentType } from '../types'
import { useEmployee } from '../composables/useEmployee'
import EmployeeFormDrawer from '../components/EmployeeFormDrawer.vue'
import AppCard from '@/shared/components/ui/AppCard.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppStatusBadge from '@/shared/components/ui/AppStatusBadge.vue'
import AppBreadcrumb from '@/shared/components/ui/AppBreadcrumb.vue'
import AppPermissionGuard from '@/shared/components/ui/AppPermissionGuard.vue'

const router = useRouter()
const route = useRoute()
const { employee, isLoading, fetchEmployee } = useEmployee()

const drawerOpen = computed({
  get: () => !!employee.value,
  set: (val) => { if (!val) employee.value = null }
})

const getInitials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('uz-UZ')

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

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
    full_time: "To'liq stavka", part_time: "Qisqa stavka", contract: 'Shartnoma', intern: 'Amaliyot'
  }
  return map[type] || type
}

const editEmployee = () => { drawerOpen.value = true }
const goBack = () => { router.push('/employees') }

onMounted(() => {
  const id = route.params.id as string
  if (id) fetchEmployee(id)
})
</script>