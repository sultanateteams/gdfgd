<template>
  <div class="min-h-screen bg-[var(--body-bg)] p-6">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <AppButton variant="ghost" size="sm" @click="prevMonth">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </AppButton>
        <h1 class="text-2xl font-bold text-[var(--text-primary)] min-w-[180px] text-center">
          {{ monthNames[selectedMonth - 1] }} {{ selectedYear }}
        </h1>
        <AppButton variant="ghost" size="sm" @click="nextMonth">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </AppButton>
      </div>

      <AppPermissionGuard :permission="['employees:view', 'attendance:view']">
        <div class="w-64">
          <AppSelect
            v-model="selectedEmployeeId"
            :options="employeeOptions"
            placeholder="Xodimni tanlang"
            @change="onEmployeeChange"
          />
        </div>
      </AppPermissionGuard>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-24">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]"></div>
    </div>

    <div v-else>
      <!-- Calendar Grid -->
      <div class="bg-[var(--card-bg)] rounded-xl shadow-sm overflow-hidden mb-6">
        <!-- Weekday Headers -->
        <div class="grid grid-cols-7 border-b border-[var(--border-color)]">
          <div v-for="day in weekdays" :key="day" class="py-3 text-center text-sm font-medium text-[var(--text-secondary)]">
            {{ day }}
          </div>
        </div>

        <!-- Calendar Days -->
        <div class="grid grid-cols-7">
          <!-- Empty cells for first day offset -->
          <div
            v-for="n in firstDayOffset"
            :key="`empty-${n}`"
            class="min-h-[100px] p-2 bg-[var(--body-bg)]"
          ></div>

          <!-- Day cells -->
          <div
            v-for="day in daysInMonth"
            :key="day"
            :class="[
              'min-h-[100px] p-2 cursor-pointer transition-colors relative',
              isToday(day) ? 'ring-2 ring-[var(--accent-primary)] ring-inset' : '',
              isWeekend(day) ? 'bg-[var(--body-bg)] opacity-70' : 'hover:bg-[var(--accent-primary)]/5',
              getDayRecord(day) ? '' : 'bg-[var(--body-bg)]/30'
            ]"
            @click="openDayDetail(day)"
          >
            <!-- Date Number -->
            <div class="text-sm font-medium text-[var(--text-primary)] mb-1">
              {{ day }}
            </div>

            <!-- Status Dot -->
            <div v-if="getDayRecord(day)" class="flex items-center gap-1">
              <span
                :class="[
                  'w-2 h-2 rounded-full',
                  getStatusColor(getDayRecord(day)?.status || 'absent')
                ]"
              ></span>
              <span class="text-xs text-[var(--text-muted)]">
                {{ getStatusLabel(getDayRecord(day)?.status || 'absent') }}
              </span>
            </div>

            <!-- Check-in Time -->
            <div v-if="getDayRecord(day)?.checkIn" class="mt-1 text-[10px] text-[var(--text-muted)]">
              In: {{ formatTime(getDayRecord(day)!.checkIn!) }}
            </div>

            <!-- Check-out Time -->
            <div v-if="getDayRecord(day)?.checkOut" class="text-[10px] text-[var(--text-muted)]">
              Out: {{ formatTime(getDayRecord(day)!.checkOut!) }}
            </div>

            <!-- Work Hours -->
            <div v-if="getDayRecord(day)?.workHours" class="text-[10px] text-[var(--text-secondary)]">
              {{ getDayRecord(day)?.workHours }}h
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <AppCard class="p-4 text-center">
          <div class="text-2xl font-bold text-[var(--text-primary)]">
            {{ summary.workDays }}
          </div>
          <div class="text-sm text-[var(--text-muted)]">Ish kunlari</div>
        </AppCard>

        <AppCard class="p-4 text-center">
          <div class="text-2xl font-bold text-green-500">
            {{ summary.presentDays }}
          </div>
          <div class="text-sm text-[var(--text-muted)]">Keldi</div>
        </AppCard>

        <AppCard class="p-4 text-center">
          <div class="text-2xl font-bold text-red-500">
            {{ summary.absentDays }}
          </div>
          <div class="text-sm text-[var(--text-muted)]">Kelmadi</div>
        </AppCard>

        <AppCard class="p-4 text-center">
          <div class="text-2xl font-bold text-amber-500">
            {{ summary.lateDays }}
          </div>
          <div class="text-sm text-[var(--text-muted)]">Kech keldi</div>
        </AppCard>

        <AppCard class="p-4 text-center">
          <div class="text-2xl font-bold text-[var(--text-primary)]">
            {{ summary.totalWorkHours }}s
          </div>
          <div class="text-sm text-[var(--text-muted)]">Ish soatlari</div>
        </AppCard>

        <AppCard class="p-4 text-center">
          <div class="text-2xl font-bold text-blue-500">
            {{ summary.overtimeHours }}s
          </div>
          <div class="text-sm text-[var(--text-muted)]">Qo'shimcha</div>
        </AppCard>
      </div>

      <!-- Check-in/Out Panel (Employee only) -->
      <AppPermissionGuard role="employee">
        <AppCard class="p-6">
          <h2 class="text-lg font-semibold text-[var(--text-primary)] mb-4">Ish vaqti nazorati</h2>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-[var(--text-muted)] mb-1">Bugungi holat</div>
              <div v-if="todayRecord" class="text-lg font-medium text-[var(--text-primary)]">
                <span v-if="todayRecord.checkIn && todayRecord.checkOut">
                  ✅ Ishda bo'ldi — {{ todayRecord.workHours }} soat
                </span>
                <span v-else-if="todayRecord.checkIn">
                  🟡 Ishda — {{ formatTime(todayRecord.checkIn) }} da kirgan
                </span>
                <span v-else>
                  ⭕ Hali kelmagan
                </span>
              </div>
              <div v-else class="text-lg text-[var(--text-muted)]">Dam olish kuni</div>
            </div>

            <div class="flex items-center gap-4">
              <div class="text-right">
                <div class="text-sm text-[var(--text-muted)]">Hozirgi vaqt</div>
                <div class="text-2xl font-mono text-[var(--text-primary)]">
                  {{ currentTime }}
                </div>
              </div>

              <AppButton
                v-if="canCheckIn"
                type="primary"
                size="lg"
                :loading="isLoading"
                @click="doCheckIn"
              >
                Ishga kirish
              </AppButton>

              <AppButton
                v-if="canCheckOut"
                type="secondary"
                size="lg"
                :loading="isLoading"
                @click="doCheckOut"
              >
                Ishdan chiqish
              </AppButton>
            </div>
          </div>
        </AppCard>
      </AppPermissionGuard>
    </div>

    <!-- Day Detail Modal -->
    <AppModal
      v-model:open="dayDetailModalOpen"
      title="Kun tafsilotlari"
      size="md"
    >
      <div v-if="selectedDayRecord" class="space-y-4">
        <div class="flex items-center gap-3">
          <span
            :class="[
              'w-3 h-3 rounded-full',
              getStatusColor(selectedDayRecord.status)
            ]"
          ></span>
          <span class="text-lg font-medium">{{ getStatusLabel(selectedDayRecord.status) }}</span>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-[var(--text-muted)]">Sana</div>
            <div class="text-lg text-[var(--text-primary)]">
              {{ formatDate(selectedDayRecord.date) }}
            </div>
          </div>
          <div>
            <div class="text-sm text-[var(--text-muted)]">Ish soatlari</div>
            <div class="text-lg text-[var(--text-primary)]">
              {{ selectedDayRecord.workHours || 0 }} soat
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-[var(--text-muted)]">Kirish vaqti</div>
            <div class="text-lg text-[var(--text-primary)]">
              {{ selectedDayRecord.checkIn ? formatTime(selectedDayRecord.checkIn) : '-' }}
            </div>
          </div>
          <div>
            <div class="text-sm text-[var(--text-muted)]">Chiqish vaqti</div>
            <div class="text-lg text-[var(--text-primary)]">
              {{ selectedDayRecord.checkOut ? formatTime(selectedDayRecord.checkOut) : '-' }}
            </div>
          </div>
        </div>

        <div v-if="selectedDayRecord.overtimeHours">
          <div class="text-sm text-[var(--text-muted)]">Qo'shimcha soatlar</div>
          <div class="text-lg text-blue-500">
            +{{ selectedDayRecord.overtimeHours }} soat
          </div>
        </div>

        <div v-if="selectedDayRecord.note">
          <div class="text-sm text-[var(--text-muted)]">Izoh</div>
          <div class="text-[var(--text-primary)]">
            {{ selectedDayRecord.note }}
          </div>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAttendance } from '../composables/useAttendance'
import { usePermission } from '@/composables/usePermission'
import type { AttendanceRecord, AttendanceStatus } from '../types'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppSelect from '@/shared/components/ui/AppSelect.vue'
import AppCard from '@/shared/components/ui/AppCard.vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppPermissionGuard from '@/shared/components/ui/AppPermissionGuard.vue'

const router = useRouter()
const { isAdmin } = usePermission()

// Mock employee options
const employeeOptions = [
  { label: 'Aziz Abdullayev', value: '1' },
  { label: 'Malika Karimova', value: '2' },
  { label: 'Javohir Sobirov', value: '3' }
]

// Default to first employee if admin, otherwise own ID
const defaultEmployeeId = isAdmin.value ? '1' : '1'

const {
  selectedMonth,
  selectedYear,
  selectedEmployeeId,
  monthlyReport,
  isLoading,
  todayRecord,
  canCheckIn,
  canCheckOut,
  fetchMonthlyReport,
  doCheckIn,
  doCheckOut,
  setMonth,
  setYear,
  setEmployee
} = useAttendance(defaultEmployeeId)

// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════

const monthNames = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
]

const weekdays = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

// ═══════════════════════════════════════════════════════════
// CALENDAR COMPUTED
// ═══════════════════════════════════════════════════════════

const daysInMonth = computed(() => {
  return new Date(selectedYear.value, selectedMonth.value, 0).getDate()
})

const firstDayOffset = computed(() => {
  // Get first day of month (0=Sunday, 1=Monday, ...)
  const firstDay = new Date(selectedYear.value, selectedMonth.value - 1, 1).getDay()
  // Convert to Monday=0, Sunday=6
  return firstDay === 0 ? 6 : firstDay - 1
})

// ═══════════════════════════════════════════════════════════
// REAL-TIME CLOCK
// ═══════════════════════════════════════════════════════════

const currentTime = ref('')
let clockInterval: ReturnType<typeof setInterval>

const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  clearInterval(clockInterval)
})

// ═══════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════

const summary = computed(() => {
  if (!monthlyReport.value) {
    return {
      workDays: 0,
      presentDays: 0,
      absentDays: 0,
      lateDays: 0,
      totalWorkHours: 0,
      overtimeHours: 0
    }
  }

  const records = monthlyReport.value.records

  return {
    workDays: records.filter(r => r.status !== 'weekend' && r.status !== 'holiday').length,
    presentDays: records.filter(r => r.status === 'present').length,
    absentDays: records.filter(r => r.status === 'absent').length,
    lateDays: records.filter(r => r.status === 'late').length,
    totalWorkHours: records.reduce((sum, r) => sum + (r.workHours || 0), 0),
    overtimeHours: records.reduce((sum, r) => sum + (r.overtimeHours || 0), 0)
  }
})

// ═══════════════════════════════════════════════════════════
// DAY HELPERS
// ═══════════════════════════════════════════════════════════

function isToday(day: number): boolean {
  const today = new Date()
  return (
    day === today.getDate() &&
    selectedMonth.value === today.getMonth() + 1 &&
    selectedYear.value === today.getFullYear()
  )
}

function isWeekend(day: number): boolean {
  const date = new Date(selectedYear.value, selectedMonth.value - 1, day)
  const dayOfWeek = date.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

function getDayRecord(day: number): AttendanceRecord | undefined {
  if (!monthlyReport.value) return undefined
  const dateStr = `${selectedYear.value}-${String(selectedMonth.value).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return monthlyReport.value.records.find(r => r.date === dateStr)
}

function getStatusColor(status: AttendanceStatus): string {
  const colors: Record<AttendanceStatus, string> = {
    present: 'bg-green-500',
    absent: 'bg-red-500',
    late: 'bg-amber-500',
    half_day: 'bg-orange-500',
    remote: 'bg-blue-500',
    holiday: 'bg-purple-500',
    weekend: 'bg-gray-400'
  }
  return colors[status] || 'bg-gray-400'
}

function getStatusLabel(status: AttendanceStatus): string {
  const labels: Record<AttendanceStatus, string> = {
    present: 'Keldi',
    absent: 'Kelmadi',
    late: 'Kechikdi',
    half_day: 'Yarim kun',
    remote: 'Masofaviy',
    holiday: 'Bayram',
    weekend: 'Dam olish'
  }
  return labels[status] || status
}

function formatTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('uz-UZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// ═══════════════════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════════════════

const dayDetailModalOpen = ref(false)
const selectedDayRecord = ref<AttendanceRecord | null>(null)

function openDayDetail(day: number) {
  const record = getDayRecord(day)
  if (record) {
    selectedDayRecord.value = record
    dayDetailModalOpen.value = true
  }
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════

function prevMonth() {
  if (selectedMonth.value === 1) {
    setMonth(12)
    setYear(selectedYear.value - 1)
  } else {
    setMonth(selectedMonth.value - 1)
  }
}

function nextMonth() {
  if (selectedMonth.value === 12) {
    setMonth(1)
    setYear(selectedYear.value + 1)
  } else {
    setMonth(selectedMonth.value + 1)
  }
}

function onEmployeeChange(employeeId: string) {
  setEmployee(employeeId)
}
</script>