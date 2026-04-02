<template>
  <AppDrawer v-model:open="isOpen" :title="isEditMode ? 'Xodimni tahrirlash' : 'Yangi xodim qo\'shish'" size="lg">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Ism -->
      <div>
        <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">Ism <span class="text-red-500">*</span></label>
        <AppInput v-model="form.firstName" :error="errors.firstName" placeholder="Ism" />
      </div>

      <!-- Familiya -->
      <div>
        <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">Familiya <span class="text-red-500">*</span></label>
        <AppInput v-model="form.lastName" :error="errors.lastName" placeholder="Familiya" />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">Email <span class="text-red-500">*</span></label>
        <AppInput v-model="form.email" type="email" :error="errors.email" placeholder="email@example.com" />
      </div>

      <!-- Telefon -->
      <div>
        <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">Telefon</label>
        <AppInput v-model="form.phone" placeholder="+998 90 123 45 67" />
      </div>

      <!-- Bo'lim -->
      <div>
        <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">Bo'lim <span class="text-red-500">*</span></label>
        <AppSelect v-model="form.departmentId" :options="departmentOptions" placeholder="Bo'limni tanlang" />
      </div>

      <!-- Lavozim -->
      <div>
        <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">Lavozim <span class="text-red-500">*</span></label>
        <AppSelect v-model="form.positionId" :options="positionOptions" placeholder="Lavozimni tanlang" />
      </div>

      <!-- Ish turi -->
      <div>
        <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">Ish turi <span class="text-red-500">*</span></label>
        <AppSelect v-model="form.employmentType" :options="employmentTypeOptions" placeholder="Ish turini tanlang" />
      </div>

      <!-- Holat -->
      <div>
        <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">Holat <span class="text-red-500">*</span></label>
        <AppSelect v-model="form.status" :options="statusOptions" placeholder="Holatni tanlang" />
      </div>

      <!-- Yollash sanasi -->
      <div>
        <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">Yollash sanasi <span class="text-red-500">*</span></label>
        <AppDatePicker v-model="form.hireDate" />
      </div>

      <!-- Maosh -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">Maosh (USD)</label>
          <AppInput v-model.number="form.salaryBase" type="number" placeholder="0" />
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-1">To'lov turi</label>
          <AppSelect v-model="form.salaryPaymentType" :options="paymentTypeOptions" placeholder="Tanlang" />
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-3 pt-4 border-t">
        <AppButton type="ghost" @click="closeDrawer">Bekor qilish</AppButton>
        <AppButton type="primary" html-type="submit" :loading="isSubmitting">
          {{ isEditMode ? 'Saqlash' : 'Qo\'shish' }}
        </AppButton>
      </div>
    </form>
  </AppDrawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Employee, CreateEmployeeDto, EmploymentType, EmployeeStatus } from '../types'
import { employeeService } from '../services/employeeService'
import AppInput from '@/shared/components/ui/AppInput.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppSelect from '@/shared/components/ui/AppSelect.vue'
import AppDrawer from '@/shared/components/ui/AppDrawer.vue'
import AppDatePicker from '@/shared/components/ui/AppDatePicker.vue'

const props = defineProps<{
  open: boolean
  employee?: Employee | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  success: []
}>()

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const isEditMode = computed(() => !!props.employee)
const isSubmitting = ref(false)

const form = ref<CreateEmployeeDto & { salaryBase?: number; salaryPaymentType?: string }>({
  firstName: '',
  lastName: '',
  fullName: '',
  email: '',
  phone: '',
  departmentId: '',
  positionId: '',
  employmentType: 'full_time',
  status: 'active',
  hireDate: new Date().toISOString().split('T')[0],
  salaryBase: undefined,
  salaryPaymentType: 'monthly'
})

const errors = ref<Record<string, string>>({})

const departmentOptions = [
  { label: 'IT', value: 'dept-it' },
  { label: 'HR', value: 'dept-hr' },
  { label: 'Moliya', value: 'dept-finance' },
  { label: 'Sotuv', value: 'dept-sales' }
]

const positionOptions = [
  { label: 'Senior Developer', value: 'pos-1' },
  { label: 'HR Manager', value: 'pos-2' },
  { label: 'Financial Analyst', value: 'pos-3' },
  { label: 'Sales Representative', value: 'pos-4' }
]

const employmentTypeOptions = [
  { label: "To'liq stavka", value: 'full_time' },
  { label: "Qisqa stavka", value: 'part_time' },
  { label: 'Shartnoma', value: 'contract' },
  { label: 'Amaliyot', value: 'intern' }
]

const statusOptions = [
  { label: 'Faol', value: 'active' },
  { label: 'Nofaol', value: 'inactive' },
  { label: "Ta'tilda", value: 'on_leave' },
  { label: "Bo'shatilgan", value: 'terminated' }
]

const paymentTypeOptions = [
  { label: 'Oylik', value: 'monthly' },
  { label: 'Soatlik', value: 'hourly' }
]

watch(() => props.employee, (emp) => {
  if (emp) {
    form.value = {
      firstName: emp.firstName,
      lastName: emp.lastName,
      fullName: emp.fullName,
      email: emp.email,
      phone: emp.phone || '',
      departmentId: emp.departmentId,
      positionId: emp.positionId,
      employmentType: emp.employmentType,
      status: emp.status,
      hireDate: emp.hireDate,
      salaryBase: emp.salary?.base,
      salaryPaymentType: emp.salary?.paymentType || 'monthly'
    }
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.value = {
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phone: '',
    departmentId: '',
    positionId: '',
    employmentType: 'full_time',
    status: 'active',
    hireDate: new Date().toISOString().split('T')[0],
    salaryBase: undefined,
    salaryPaymentType: 'monthly'
  }
  errors.value = {}
}

function validate(): boolean {
  errors.value = {}
  if (!form.value.firstName.trim()) errors.value.firstName = 'Ism kiritilishi shart'
  if (!form.value.lastName.trim()) errors.value.lastName = 'Familiya kiritilishi shart'
  if (!form.value.email.trim()) errors.value.email = 'Email kiritilishi shart'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = "To'g'ri email kiriting"
  if (!form.value.departmentId) errors.value.departmentId = "Bo'lim tanlanishi shart"
  if (!form.value.positionId) errors.value.positionId = 'Lavozim tanlanishi shart'
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  isSubmitting.value = true
  try {
    const payload: CreateEmployeeDto = {
      ...form.value,
      phone: form.value.phone || undefined,
      salary: form.value.salaryBase ? {
        base: form.value.salaryBase,
        currency: 'USD',
        paymentType: (form.value.salaryPaymentType as 'monthly' | 'hourly') || 'monthly'
      } : undefined
    }

    if (isEditMode.value && props.employee) {
      await employeeService.update(props.employee.id, payload)
    } else {
      await employeeService.create(payload)
    }

    closeDrawer()
    emit('success')
  } catch (error) {
    console.error('Form submit error:', error)
  } finally {
    isSubmitting.value = false
  }
}

function closeDrawer() {
  isOpen.value = false
  resetForm()
}
</script>