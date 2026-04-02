<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { payrollService } from '../services/payrollService'
import { formatCurrency } from '../utils/taxCalculator'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppCard from '@/shared/components/ui/AppCard.vue'
import type { PaySlip } from '../types'

const route = useRoute()
const router = useRouter()

const paySlip = ref<PaySlip | null>(null)
const isLoading = ref(false)

const payrollId = computed(() => route.params.id as string)

function numberToWordsUZS(amount: number): string {
  // TODO: To'liq raqamni so'zga aylantirish
  return `${amount.toLocaleString('uz-UZ')} so'm`
}

async function handlePrint() {
  window.print()
}

function goBack() {
  router.push('/payroll')
}

onMounted(async () => {
  paySlip.value = await payrollService.getPaySlip(payrollId.value)
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Print button (hidden when printing) -->
    <div class="max-w-4xl mx-auto mb-4 flex justify-between no-print">
      <AppButton variant="outline" icon="arrow-left" @click="goBack">
        Orqaga qaytish
      </AppButton>
      <AppButton variant="primary" icon="printer" @click="handlePrint">
        Chop etish
      </AppButton>
    </div>

    <!-- Pay Slip Document -->
    <div class="max-w-4xl mx-auto bg-white shadow-lg p-8 print:shadow-none">
      <!-- Header -->
      <div class="border-b-2 border-gray-800 pb-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
              HR
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">HRM System LLC</h1>
              <p class="text-gray-600">Toshkent sh., Chilonzor tumani, 123-uy</p>
            </div>
          </div>
          <div class="text-right">
            <h2 class="text-xl font-bold text-gray-900">MAOSH VARAQASI</h2>
            <p class="text-gray-600">Pay Slip</p>
          </div>
        </div>
      </div>

      <!-- Employee Info -->
      <div class="grid grid-cols-2 gap-6 mb-6">
        <div class="space-y-2">
          <h3 class="font-semibold text-gray-700 border-b pb-1">Xodim ma'lumotlari</h3>
          <p><span class="text-gray-500">Ism familiya:</span> {{ paySlip?.employee?.fullName }}</p>
          <p><span class="text-gray-500">Xodim kodi:</span> {{ paySlip?.employee?.employeeCode }}</p>
          <p><span class="text-gray-500">Bo'lim:</span> {{ paySlip?.employee?.department?.name || paySlip?.employee?.departmentId }}</p>
          <p><span class="text-gray-500">Lavozim:</span> {{ paySlip?.employee?.position?.name || paySlip?.employee?.positionId }}</p>
        </div>
        <div class="space-y-2">
          <h3 class="font-semibold text-gray-700 border-b pb-1">To'lov ma'lumotlari</h3>
          <p><span class="text-gray-500">Davri:</span> {{ paySlip?.period?.month }}/{{ paySlip?.period?.year }}</p>
          <p><span class="text-gray-500">To'lov sanasi:</span> {{ paySlip?.paidAt ? new Date(paySlip.paidAt).toLocaleDateString('uz-UZ') : '—' }}</p>
          <p><span class="text-gray-500">Hisob raqami:</span> UZ{{ paySlip?.id?.slice(-8).toUpperCase() }}</p>
          <p><span class="text-gray-500">Holat:</span> {{ paySlip?.status }}</p>
        </div>
      </div>

      <!-- Attendance Table -->
      <div class="mb-6">
        <h3 class="font-semibold text-gray-700 border-b pb-2 mb-3">Davomat ma'lumotlari</h3>
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-50">
              <th class="border border-gray-300 px-4 py-2 text-left">Ish kunlari</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Keldi</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Kelmadi</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Qo'shimcha soatlar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 px-4 py-2">{{ paySlip?.workDays }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ paySlip?.presentDays }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ paySlip?.absentDays }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ paySlip?.overtimeHours }} soat</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Earnings Table -->
      <div class="mb-6">
        <h3 class="font-semibold text-gray-700 border-b pb-2 mb-3">Daromadlar</h3>
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-50">
              <th class="border border-gray-300 px-4 py-2 text-left">Turi</th>
              <th class="border border-gray-300 px-4 py-2 text-right">Summa</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 px-4 py-2">Asosiy maosh</td>
              <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(paySlip?.baseSalary || 0, paySlip?.currency) }}</td>
            </tr>
            <tr v-for="earning in paySlip?.earnings" :key="earning.id">
              <td class="border border-gray-300 px-4 py-2">{{ earning.name }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(earning.amount, earning.currency) }}</td>
            </tr>
            <tr v-if="paySlip?.overtimePay">
              <td class="border border-gray-300 px-4 py-2">Qo'shimcha ish soatlari</td>
              <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(paySlip.overtimePay, paySlip?.currency) }}</td>
            </tr>
            <tr class="bg-gray-50 font-semibold">
              <td class="border border-gray-300 px-4 py-2">Jami brutto</td>
              <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(paySlip?.grossSalary || 0, paySlip?.currency) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Deductions Table -->
      <div class="mb-6">
        <h3 class="font-semibold text-gray-700 border-b pb-2 mb-3">Chegirmalar</h3>
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-50">
              <th class="border border-gray-300 px-4 py-2 text-left">Turi</th>
              <th class="border border-gray-300 px-4 py-2 text-right">Summa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="deduction in paySlip?.deductions" :key="deduction.id">
              <td class="border border-gray-300 px-4 py-2">{{ deduction.name }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(deduction.amount, deduction.currency) }}</td>
            </tr>
            <tr class="bg-gray-50 font-semibold">
              <td class="border border-gray-300 px-4 py-2">Jami chegirmalar</td>
              <td class="border border-gray-300 px-4 py-2 text-right">{{ formatCurrency(paySlip?.totalDeductions || 0, paySlip?.currency) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Net Salary Footer -->
      <div class="border-t-2 border-gray-800 pt-6 mt-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600">Sof maosh (qo'lga tegadigan):</p>
          </div>
          <div class="text-right">
            <p class="text-3xl font-bold text-green-600">{{ formatCurrency(paySlip?.netSalary || 0, paySlip?.currency) }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ numberToWordsUZS(paySlip?.netSalary || 0) }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 pt-6 border-t border-gray-300 text-center text-gray-500 text-sm">
        <p>Hujjat elektron tarzda imzolangan. Chiqarilgan sana: {{ new Date().toLocaleDateString('uz-UZ') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  body {
    background: white !important;
  }
}
</style>