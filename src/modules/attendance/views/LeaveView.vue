<template>
  <div class="min-h-screen bg-[var(--body-bg)] p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-[var(--text-primary)]">Ta'til so'rovlari</h1>
    </div>

    <!-- Tabs -->
    <AppTabs v-model:active="activeTab" :items="tabItems">
      <!-- Tab 1: Mening so'rovlarim -->
      <template #my-requests>
        <div class="space-y-6">
          <!-- Balance Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Annual Leave -->
            <AppCard class="p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-[var(--text-muted)]">Yillik ta'til</span>
                <span class="text-sm font-medium text-green-500">
                  {{ leaveBalance?.annual?.remaining || 0 }} kun
                </span>
              </div>
              <div class="relative pt-1">
                <div class="flex mb-2 items-center justify-between">
                  <span class="text-xs font-semibold text-green-500">
                    {{ leaveBalance?.annual?.used || 0 }}/{{ leaveBalance?.annual?.total || 0 }}
                  </span>
                </div>
                <div class="overflow-hidden h-2 text-xs flex rounded bg-green-100">
                  <div
                    :style="{ width: getPercentage(leaveBalance?.annual) + '%' }"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                  ></div>
                </div>
              </div>
            </AppCard>

            <!-- Sick Leave -->
            <AppCard class="p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-[var(--text-muted)]">Kasallik</span>
                <span class="text-sm font-medium text-amber-500">
                  {{ leaveBalance?.sick?.remaining || 0 }} kun
                </span>
              </div>
              <div class="relative pt-1">
                <div class="flex mb-2 items-center justify-between">
                  <span class="text-xs font-semibold text-amber-500">
                    {{ leaveBalance?.sick?.used || 0 }}/{{ leaveBalance?.sick?.total || 0 }}
                  </span>
                </div>
                <div class="overflow-hidden h-2 text-xs flex rounded bg-amber-100">
                  <div
                    :style="{ width: getPercentage(leaveBalance?.sick) + '%' }"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500 transition-all duration-500"
                  ></div>
                </div>
              </div>
            </AppCard>

            <!-- Emergency Leave -->
            <AppCard class="p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-[var(--text-muted)]">Favqulodda</span>
                <span class="text-sm font-medium text-red-500">
                  {{ leaveBalance?.emergency?.remaining || 0 }} kun
                </span>
              </div>
              <div class="relative pt-1">
                <div class="flex mb-2 items-center justify-between">
                  <span class="text-xs font-semibold text-red-500">
                    {{ leaveBalance?.emergency?.used || 0 }}/{{ leaveBalance?.emergency?.total || 0 }}
                  </span>
                </div>
                <div class="overflow-hidden h-2 text-xs flex rounded bg-red-100">
                  <div
                    :style="{ width: getPercentage(leaveBalance?.emergency) + '%' }"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 transition-all duration-500"
                  ></div>
                </div>
              </div>
            </AppCard>
          </div>

          <!-- Request Button -->
          <div class="flex justify-end">
            <AppButton type="primary" @click="openRequestModal">
              <template #icon>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </template>
              Ta'til so'rovi yuborish
            </AppButton>
          </div>

          <!-- My Requests Table -->
          <div class="bg-[var(--card-bg)] rounded-xl shadow-sm overflow-hidden">
            <AppTable :columns="myRequestsColumns" :data="myLeaveRequests" :loading="isLoading">
              <template #type="{ row }">
                {{ getLeaveTypeLabel(row.type) }}
              </template>

              <template #dates="{ row }">
                <div>
                  <div>{{ formatDate(row.startDate) }}</div>
                  <div class="text-xs text-[var(--text-muted)]">— {{ formatDate(row.endDate) }}</div>
                </div>
              </template>

              <template #status="{ row }">
                <AppStatusBadge :status="getLeaveStatusType(row.status)" :label="getLeaveStatusLabel(row.status)" />
              </template>

              <template #actions="{ row }">
                <AppButton
                  v-if="row.status === 'pending'"
                  type="ghost"
                  size="sm"
                  class="text-red-500"
                  @click="cancelLeave(row.id)"
                >
                  Bekor qilish
                </AppButton>
                <span v-else class="text-xs text-[var(--text-muted)]">—</span>
              </template>

              <template #empty>
                <div class="py-12 text-center">
                  <p class="text-[var(--text-secondary)]">So'rovlar yo'q</p>
                </div>
              </template>
            </AppTable>
          </div>
        </div>
      </template>

      <!-- Tab 2: Jamoa so'rovlari (Admin/HR) -->
      <template #team-requests>
        <AppPermissionGuard :permission="['leave:manage', 'attendance:manage']">
          <div class="space-y-6">
            <!-- Filters -->
            <div class="bg-[var(--card-bg)] rounded-xl p-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-xs font-medium text-[var(--text-secondary)] mb-1">Xodim</label>
                  <AppInput v-model="teamFilters.employeeName" placeholder="Qidiruv..." />
                </div>
                <div>
                  <label class="block text-xs font-medium text-[var(--text-secondary)] mb-1">Tur</label>
                  <AppSelect v-model="teamFilters.type" :options="leaveTypeFilterOptions" placeholder="Barchasi" clearable />
                </div>
                <div>
                  <label class="block text-xs font-medium text-[var(--text-secondary)] mb-1">Holat</label>
                  <AppSelect v-model="teamFilters.status" :options="leaveStatusFilterOptions" placeholder="Barchasi" clearable />
                </div>
                <div class="flex items-end">
                  <AppButton type="primary" @click="fetchTeamRequests">Qidirish</AppButton>
                </div>
              </div>
            </div>

            <!-- Team Requests Table -->
            <div class="bg-[var(--card-bg)] rounded-xl shadow-sm overflow-hidden">
              <AppTable :columns="teamRequestsColumns" :data="teamLeaveRequests" :loading="isLoading">
                <template #employee="{ row }">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center">
                      <span class="text-xs font-medium text-[var(--accent-primary)]">
                        {{ row.employee?.fullName?.charAt(0) || 'X' }}
                      </span>
                    </div>
                    <span>{{ row.employee?.fullName || 'Xodim' }}</span>
                  </div>
                </template>

                <template #type="{ row }">
                  {{ getLeaveTypeLabel(row.type) }}
                </template>

                <template #dates="{ row }">
                  <div>
                    <div>{{ formatDate(row.startDate) }}</div>
                    <div class="text-xs text-[var(--text-muted)]">— {{ formatDate(row.endDate) }}</div>
                  </div>
                </template>

                <template #status="{ row }">
                  <AppStatusBadge :status="getLeaveStatusType(row.status)" :label="getLeaveStatusLabel(row.status)" />
                </template>

                <template #actions="{ row }">
                  <div v-if="row.status === 'pending'" class="flex items-center gap-2">
                    <AppButton type="success" size="sm" @click="approveLeave(row.id)">
                      Tasdiqlash
                    </AppButton>
                    <AppButton type="danger" size="sm" @click="openRejectModal(row.id)">
                      Rad etish
                    </AppButton>
                  </div>
                  <span v-else class="text-xs text-[var(--text-muted)]">—</span>
                </template>

                <template #empty>
                  <div class="py-12 text-center">
                    <p class="text-[var(--text-secondary)]">So'rovlar yo'q</p>
                  </div>
                </template>
              </AppTable>
            </div>
          </div>
        </AppPermissionGuard>
      </template>
    </AppTabs>

    <!-- Leave Request Modal -->
    <LeaveRequestFormModal
      v-model="showRequestModal"
      :employee-id="currentEmployeeId"
      @submitted="onRequestSubmitted"
    />

    <!-- Reject Modal -->
    <AppModal
      v-model:open="showRejectModal"
      title="So'rovni rad etish"
      size="md"
    >
      <div class="space-y-4">
        <p class="text-sm text-[var(--text-secondary)]">
          Ushbu so'rovni rad etish uchun sababni kiriting:
        </p>
        <AppTextArea
          v-model="rejectNote"
          placeholder="Rad etish sababi..."
          :rows="3"
        />
        <div class="flex justify-end gap-3">
          <AppButton type="ghost" @click="showRejectModal = false">Bekor qilish</AppButton>
          <AppButton type="danger" :loading="isLoading" @click="confirmReject">Rad etish</AppButton>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLeave } from '../composables/useLeave'
import type { LeaveRequest, LeaveType, LeaveStatus } from '../types'
import LeaveRequestFormModal from '../components/LeaveRequestFormModal.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppSelect from '@/shared/components/ui/AppSelect.vue'
import AppInput from '@/shared/components/ui/AppInput.vue'
import AppTextArea from '@/shared/components/ui/AppTextArea.vue'
import AppTable from '@/shared/components/ui/AppTable.vue'
import AppStatusBadge from '@/shared/components/ui/AppStatusBadge.vue'
import AppCard from '@/shared/components/ui/AppCard.vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppTabs from '@/shared/components/ui/AppTabs.vue'
import AppPermissionGuard from '@/shared/components/ui/AppPermissionGuard.vue'

const activeTab = ref('my-requests')
const currentEmployeeId = '1' // Mock employee ID
const showRequestModal = ref(false)
const showRejectModal = ref(false)
const rejectNote = ref('')
const rejectingId = ref<string | null>(null)

const {
  leaveRequests,
  leaveBalance,
  isLoading,
  fetchLeaveRequests,
  fetchLeaveBalance,
  approveLeave: approveLeaveApi,
  rejectLeave: rejectLeaveApi,
  cancelLeave: cancelLeaveApi
} = useLeave(currentEmployeeId)

// ═══════════════════════════════════════════════════════════
// TAB ITEMS
// ═══════════════════════════════════════════════════════════

const tabItems = [
  { key: 'my-requests', label: "Mening so'rovlarim" },
  { key: 'team-requests', label: 'Jamoa so'rovlari' }
]

// ═══════════════════════════════════════════════════════════
// MY REQUESTS COLUMNS
// ═══════════════════════════════════════════════════════════

const myRequestsColumns = [
  { title: 'Tur', key: 'type', width: '120px' },
  { title: 'Sana', key: 'dates', width: '200px' },
  { title: 'Kunlar', key: 'totalDays', width: '80px' },
  { title: 'Sabab', key: 'reason', width: '200px', accessor: (row: LeaveRequest) => row.reason.length > 30 ? row.reason.substring(0, 30) + '...' : row.reason },
  { title: 'Holat', key: 'status', width: '100px' },
  { title: 'Amallar', key: 'actions', width: '100px', align: 'center' }
]

const myLeaveRequests = computed(() => leaveRequests.value)

// ═══════════════════════════════════════════════════════════
// TEAM REQUESTS
// ═══════════════════════════════════════════════════════════

const teamLeaveRequests = ref<LeaveRequest[]>([])
const teamFilters = ref({
  employeeName: '',
  type: '',
  status: ''
})

const teamRequestsColumns = [
  { title: 'Xodim', key: 'employee', width: '180px' },
  { title: 'Tur', key: 'type', width: '120px' },
  { title: 'Sana', key: 'dates', width: '200px' },
  { title: 'Kunlar', key: 'totalDays', width: '80px' },
  { title: 'Sabab', key: 'reason', width: '180px', accessor: (row: LeaveRequest) => row.reason.length > 25 ? row.reason.substring(0, 25) + '...' : row.reason },
  { title: 'Holat', key: 'status', width: '100px' },
  { title: 'Amallar', key: 'actions', width: '160px', align: 'center' }
]

const leaveTypeFilterOptions = [
  { label: 'Yillik', value: 'annual' },
  { label: 'Kasallik', value: 'sick' },
  { label: 'Favqulodda', value: 'emergency' }
]

const leaveStatusFilterOptions = [
  { label: 'Kutishda', value: 'pending' },
  { label: 'Tasdiqlangan', value: 'approved' },
  { label: 'Rad etilgan', value: 'rejected' }
]

function fetchTeamRequests() {
  // Mock - haqiqiy loyihada API chaqiriladi
  teamLeaveRequests.value = leaveRequests.value
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function getPercentage(balance?: { total: number; used: number; remaining: number }): number {
  if (!balance || balance.total === 0) return 0
  return Math.round((balance.used / balance.total) * 100)
}

function getLeaveTypeLabel(type: LeaveType): string {
  const labels: Record<LeaveType, string> = {
    annual: "Yillik ta'til",
    sick: 'Kasallik',
    maternity: 'Homiladorlik',
    paternity: 'Otalik',
    unpaid: 'Maoshsiz',
    emergency: 'Favqulodda'
  }
  return labels[type] || type
}

function getLeaveStatusType(status: LeaveStatus): 'success' | 'warning' | 'error' | 'default' {
  const map: Record<LeaveStatus, 'success' | 'warning' | 'error' | 'default'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    cancelled: 'default'
  }
  return map[status] || 'default'
}

function getLeaveStatusLabel(status: LeaveStatus): string {
  const labels: Record<LeaveStatus, string> = {
    pending: 'Kutishda',
    approved: 'Tasdiqlangan',
    rejected: 'Rad etilgan',
    cancelled: 'Bekor qilingan'
  }
  return labels[status] || status
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'short'
  })
}

// ═══════════════════════════════════════════════════════════
// ACTIONS
// ═══════════════════════════════════════════════════════════

function openRequestModal() {
  showRequestModal.value = true
}

function onRequestSubmitted() {
  showRequestModal.value = false
  fetchLeaveRequests()
  fetchLeaveBalance(currentEmployeeId)
}

async function cancelLeave(id: string) {
  if (!confirm("So'rovni bekor qilmoqchimisiz?")) return
  await cancelLeaveApi(id)
  fetchLeaveRequests()
}

async function approveLeave(id: string) {
  await approveLeaveApi(id)
  fetchTeamRequests()
}

function openRejectModal(id: string) {
  rejectingId.value = id
  rejectNote.value = ''
  showRejectModal.value = true
}

async function confirmReject() {
  if (!rejectingId.value || !rejectNote.value.trim()) return
  await rejectLeaveApi(rejectingId.value, rejectNote.value)
  showRejectModal.value = false
  rejectingId.value = null
  fetchTeamRequests()
}

onMounted(() => {
  fetchLeaveRequests()
  fetchLeaveBalance(currentEmployeeId)
})
</script>