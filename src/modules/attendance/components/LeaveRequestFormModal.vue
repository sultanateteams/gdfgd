<template>
  <AppModal
    v-model:open="isOpen"
    :title="t('leave_request')"
    size="lg"
    :loading="isSubmitting"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Leave Type -->
      <div>
        <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">
          {{ t('leave_type') }} <span class="text-red-500">*</span>
        </label>
        <AppSelect
          v-model="form.type"
          :options="leaveTypeOptions"
          :placeholder="t('select_leave_type')"
          @change="updateBalanceInfo"
        />
      </div>

      <!-- Date Range -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">
            {{ t('start_date') }} <span class="text-red-500">*</span>
          </label>
          <AppDatePicker v-model="form.startDate" @change="calculateDays" />
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">
            {{ t('end_date') }} <span class="text-red-500">*</span>
          </label>
          <AppDatePicker v-model="form.endDate" @change="calculateDays" />
        </div>
      </div>

      <!-- Days Info -->
      <div v-if="totalDays > 0" class="p-3 bg-[var(--accent-primary)]/5 rounded-lg">
        <div class="flex items-center justify-between text-sm">
          <span class="text-[var(--text-muted)]">{{ t('total_days') }}:</span>
          <span class="font-semibold text-[var(--text-primary)]">{{ totalDays }} {{ t('days') }}</span>
        </div>
        <div v-if="remainingDays !== null" class="flex items-center justify-between text-sm mt-1">
          <span class="text-[var(--text-muted)]">{{ balanceInfo }}:</span>
          <span :class="remainingDays >= totalDays ? 'text-green-500' : 'text-red-500'" class="font-medium">
            {{ remainingDays }} {{ t('days_remaining') }}
          </span>
        </div>
      </div>

      <!-- Reason -->
      <div>
        <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">
          {{ t('reason') }} <span class="text-red-500">*</span>
        </label>
        <AppTextArea
          v-model="form.reason"
          :placeholder="t('reason_placeholder')"
          :rows="3"
          :maxlength="200"
        />
        <div class="flex items-center justify-between mt-1">
          <span v-if="form.reason.length < 20" class="text-xs text-red-500">
            {{ t('min_20_chars') }}
          </span>
          <span class="text-xs text-[var(--text-muted)]">
            {{ form.reason.length }}/200
          </span>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-3 pt-4 border-t">
        <AppButton type="ghost" @click="closeModal">{{ t('cancel') }}</AppButton>
        <AppButton
          type="primary"
          html-type="submit"
          :loading="isSubmitting"
          :disabled="!isValid"
        >
          {{ t('submit') }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { LeaveType, CreateLeaveRequestDto, LeaveBalance } from '../types'
import { attendanceService } from '../services/attendanceService'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppSelect from '@/shared/components/ui/AppSelect.vue'
import AppTextArea from '@/shared/components/ui/AppTextArea.vue'
import AppDatePicker from '@/shared/components/ui/AppDatePicker.vue'
import AppModal from '@/shared/components/ui/AppModal.vue'

const props = defineProps<{
  modelValue: boolean
  employeeId: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submitted: []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isSubmitting = ref(false)
const totalDays = ref(0)
const remainingDays = ref<number | null>(null)
const balanceInfo = ref('')
const leaveBalance = ref<LeaveBalance | null>(null)

const form = ref({
  type: '' as LeaveType | '',
  startDate: '',
  endDate: '',
  reason: ''
})

// ═══════════════════════════════════════════════════════════
// LEAVE TYPE OPTIONS (O'zbekcha)
// ═══════════════════════════════════════════════════════════

const leaveTypeOptions = [
  { label: 'Yillik ta\'til', value: 'annual' },
  { label: 'Kasallik', value: 'sick' },
  { label: 'Homiladorlik', value: 'maternity' },
  { label: 'Otalik', value: 'paternity' },
  { label: 'Maoshsiz', value: 'unpaid' },
  { label: 'Favqulodda', value: 'emergency' }
]

// ═══════════════════════════════════════════════════════════
// TRANSLATION HELPER
// ═══════════════════════════════════════════════════════════

const translations: Record<string, string> = {
  leave_request: "Ta'til so'rovi",
  leave_type: "Ta'til turi",
  select_leave_type: "Tanlang...",
  start_date: 'Boshlanish sanasi',
  end_date: 'Tugash sanasi',
  total_days: 'Jami kunlar',
  days: 'kun',
  days_remaining: 'kun qolgan',
  reason: 'Sabab',
  reason_placeholder: "Ta'tilga sababni kiriting (kamida 20 belgi)...",
  min_20_chars: 'Kamida 20 belgi kiriting',
  cancel: 'Bekor qilish',
  submit: "Yuborish"
}

function t(key: string): string {
  return translations[key] || key
}

// ═══════════════════════════════════════════════════════════
// COMPUTED
// ═══════════════════════════════════════════════════════════

const isValid = computed(() => {
  return (
    form.value.type !== '' &&
    form.value.startDate !== '' &&
    form.value.endDate !== '' &&
    form.value.reason.length >= 20 &&
    totalDays.value > 0
  )
})

// ═══════════════════════════════════════════════════════════
// METHODS
// ═══════════════════════════════════════════════════════════

function calculateDays() {
  if (!form.value.startDate || !form.value.endDate) {
    totalDays.value = 0
    return
  }

  const start = new Date(form.value.startDate)
  const end = new Date(form.value.endDate)

  if (end < start) {
    totalDays.value = 0
    return
  }

  // Faqat ish kunlarini hisoblash (Dush-Juma)
  let days = 0
  const current = new Date(start)

  while (current <= end) {
    const dayOfWeek = current.getDay()
    // 0 = Yakshanba, 6 = Shanba
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      days++
    }
    current.setDate(current.getDate() + 1)
  }

  totalDays.value = days
}

async function updateBalanceInfo() {
  if (!form.value.type || !props.employeeId) {
    remainingDays.value = null
    balanceInfo.value = ''
    return
  }

  try {
    leaveBalance.value = await attendanceService.getLeaveBalance(props.employeeId)

    const typeMap: Record<LeaveType, 'annual' | 'sick' | 'emergency'> = {
      annual: 'annual',
      sick: 'sick',
      maternity: 'annual', // fallback
      paternity: 'annual', // fallback
      unpaid: 'emergency', // fallback
      emergency: 'emergency'
    }

    const balanceKey = typeMap[form.value.type]
    if (balanceKey && leaveBalance.value) {
      const balance = leaveBalance.value[balanceKey]
      remainingDays.value = balance.remaining
      balanceInfo.value = leaveTypeOptions.find(o => o.value === form.value.type)?.label || ''
    }
  } catch (err) {
    console.error('Fetch balance error:', err)
  }
}

function closeModal() {
  isOpen.value = false
  resetForm()
}

function resetForm() {
  form.value = {
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  }
  totalDays.value = 0
  remainingDays.value = null
  balanceInfo.value = ''
}

async function handleSubmit() {
  if (!isValid.value) return

  isSubmitting.value = true
  try {
    const payload: CreateLeaveRequestDto = {
      employeeId: props.employeeId,
      type: form.value.type as LeaveType,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      totalDays: totalDays.value,
      reason: form.value.reason
    }

    await attendanceService.createLeaveRequest(payload)

    closeModal()
    emit('submitted')
  } catch (err) {
    console.error('Submit leave request error:', err)
  } finally {
    isSubmitting.value = false
  }
}

// ═══════════════════════════════════════════════════════════
// WATCH
// ═══════════════════════════════════════════════════════════

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      updateBalanceInfo()
    }
  }
)
</script>