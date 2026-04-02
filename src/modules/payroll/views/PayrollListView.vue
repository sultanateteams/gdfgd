<!-- ═══════════════════════════════════════════════════════════
     PAYROLL LIST VIEW
     Maosh hisob-kitoblari ro'yxati sahifasi
     ═══════════════════════════════════════════════════════════ -->
<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { usePermission } from '@/composables/usePermission'
import { usePayroll } from '../composables/usePayroll'
import { formatCurrency } from '../utils/taxCalculator'
import type { PaymentStatus } from '../types'
import type { TableColumn } from '@/shared/components/ui/AppTable.vue'
import AppStatusBadge from '@/shared/components/ui/AppStatusBadge.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppCard from '@/shared/components/ui/AppCard.vue'
import AppStatisticCard from '@/shared/components/ui/AppStatisticCard.vue'
import AppTable from '@/shared/components/ui/AppTable.vue'
import AppSelect from '@/shared/components/ui/AppSelect.vue'

const router = useRouter()
const { canAccess, isAdmin, isHrManager } = usePermission()
const {
  payrollList,
  summary,
  isLoading,
  currentPage,
  pageSize,
  total,
  totalPages,
  selectedMonth,
  selectedYear,
  calculatePayroll,
  approvePayroll,
  markAsPaid,
  setFilters
} = usePayroll()

const canManage = computed(() =>
  isAdmin.value || isHrManager.value || canAccess('payroll:manage')
)

// ═══════════════════════════════════════════════════════════
// OY TANLOVI
// ═══════════════════════════════════════════════════════════

const monthOptions = [
  { label: 'Yanvar', value: 1 },
  { label: 'Fevral', value: 2 },
  { label: 'Mart', value: 3 },
  { label: 'Aprel', value: 4 },
  { label: 'May', value: 5 },
  { label: 'Iyun', value: 6 },
  { label: 'Iyul', value: 7 },
  { label: 'Avgust', value: 8 },
  { label: 'Sentyabr', value: 9 },
  { label: 'Oktyabr', value: 10 },
  { label: 'Noyabr', value: 11 },
  { label: 'Dekabr', value: 12 }
]

const yearOptions = Array.from({ length: 5 }, (_, i) => {
  const year = new Date().getFullYear() - 2 + i
  return { label: String(year), value: year }
})

function handleMonthChange(value: string | number | string[] | number[]) {
  const month = Array.isArray(value) ? value[0] : value
  if (typeof month === 'number') {
    setFilters({ month })
  }
}

function handleYearChange(value: string | number | string[] | number[]) {
  const year = Array.isArray(value) ? value[0] : value
  if (typeof year === 'number') {
    setFilters({ year })
  }
}

// ═══════════════════════════════════════════════════════════
// STATUS BADGE
// ═══════════════════════════════════════════════════════════

function getStatusProps(status: PaymentStatus) {
  const statusMap: Record<PaymentStatus, { color: string; text: string }> = {
    draft: { color: 'gray', text: 'Qoralama' },
    calculated: { color: 'blue', text: 'Hisoblangan' },
    approved: { color: 'green', text: 'Tasdiqlangan' },
    paid: { color: 'teal', text: 'To\'langan' },
    cancelled: { color: 'red', text: 'Bekor qilingan' }
  }
  return statusMap[status] || { color: 'gray', text: status }
}

// ═══════════════════════════════════════════════════════════
// JADVAL USTUNLARI
// ═══════════════════════════════════════════════════════════

const columns: TableColumn[] = [
  { title: 'Xodim', key: 'employee', width: 200 },
  { title: 'Bo\'lim', key: 'department', width: 120 },
  { title: 'Ish kunlari', key: 'workDays', width: 100, align: 'center' },
  { title: 'Brutto', key: 'grossSalary', width: 120, align: 'right' },
  { title: 'Chegirmalar', key: 'totalDeductions', width: 120, align: 'right' },
  { title: 'Netto', key: 'netSalary', width: 120, align: 'right' },
  { title: 'Status', key: 'status', width: 120, align: 'center' },
  { title: 'Amallar', key: 'actions', width: 200, align: 'center' }
]

function getDepartmentName(departmentId?: string): string {
  const names: Record<string, string> = {
    'dept-it': 'IT',
    'dept-marketing': 'Marketing',
    'dept-sales': 'Sotuv',
    'dept-hr': 'HR',
    'dept-finance': 'Moliya',
    'dept-support': 'Qo\'llab-quvvatlash',
    'dept-product': 'Mahsulot',
    'dept-operations': 'Operatsiyalar',
    'dept-design': 'Dizayn'
  }
  return departmentId ? (names[departmentId] || departmentId) : '—'
}

// ═══════════════════════════════════════════════════════════
// AMALLAR
// ═══════════════════════════════════════════════════════════

function viewPaySlip(id: string) {
  router.push(`/payroll/${id}/payslip`)
}

async function handleCalculate(id: string) {
  await calculatePayroll(id)
}

async function handleApprove(id: string) {
  await approvePayroll(id)
}

async function handleMarkAsPaid(id: string) {
  await markAsPaid(id)
}

function handleExport() {
  // TODO: Excel export implementatsiyasi
  console.log('Export payroll data to Excel:', {
    month: selectedMonth.value,
    year: selectedYear.value,
    entries: payrollList.value
  })
  alert('Excel export funksiyasi tez orada qo\'shiladi.')
}

function handlePageChange(pagination: { current: number; pageSize: number }) {
  setFilters({ page: pagination.current })
}

function handlePageSizeChange(size: number) {
  setFilters({ pageSize: size, page: 1 })
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">
        Maosh hisob-kitoblari
      </h1>

      <div class="flex items-center gap-3">
        <AppSelect
          :model-value="selectedMonth"
          :options="monthOptions"
          placeholder="Oy"
          class="w-32"
          @update:model-value="handleMonthChange"
        />
        <AppSelect
          :model-value="selectedYear"
          :options="yearOptions"
          placeholder="Yil"
          class="w-24"
          @update:model-value="handleYearChange"
        />

        <AppButton
          v-if="canManage"
          variant="primary"
          icon="plus"
        >
          Yangi maosh hisoblash
        </AppButton>

        <AppButton
          variant="outline"
          icon="download"
          @click="handleExport"
        >
          Export
        </AppButton>
      </div>
    </div>

    <!-- SUMMARY KARTALAR -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <AppStatisticCard
        label="Jami xodimlar"
        :value="summary?.totalEmployees ?? 0"
        icon="users"
      />
      <AppStatisticCard
        label="Jami brutto"
        :value="summary?.totalGrossSalary ?? 0"
        :format-value="(v: number) => formatCurrency(v)"
        icon="trending-up"
        color="blue"
      />
      <AppStatisticCard
        label="Jami chegirmalar"
        :value="summary?.totalDeductions ?? 0"
        :format-value="(v: number) => formatCurrency(v)"
        icon="arrow-down"
        color="orange"
      />
      <AppStatisticCard
        label="Jami netto"
        :value="summary?.totalNetSalary ?? 0"
        :format-value="(v: number) => formatCurrency(v)"
        icon="wallet"
        color="green"
      />
      <AppStatisticCard
        label="To'langan"
        :value="summary?.paidCount ?? 0"
        icon="check-circle"
        color="teal"
      />
      <AppStatisticCard
        label="Kutilayotgan"
        :value="summary?.pendingCount ?? 0"
        icon="clock"
        color="yellow"
      />
    </div>

    <!-- JADVAL -->
    <AppCard>
      <AppTable
        :columns="columns"
        :data-source="payrollList.map(entry => ({
          key: entry.id,
          employee: entry.employee?.fullName || entry.employeeId,
          department: getDepartmentName(entry.employee?.departmentId),
          workDays: `${entry.presentDays}/${entry.workDays}`,
          grossSalary: formatCurrency(entry.grossSalary, entry.currency),
          totalDeductions: formatCurrency(entry.totalDeductions, entry.currency),
          netSalary: formatCurrency(entry.netSalary, entry.currency),
          status: h(AppStatusBadge, {
            color: getStatusProps(entry.status).color,
            text: getStatusProps(entry.status).text,
            size: 'sm'
          }),
          actions: h('div', { class: 'flex items-center justify-center gap-1' }, [
            h(AppButton, {
              size: 'sm',
              variant: 'ghost',
              icon: 'eye',
              onClick: () => viewPaySlip(entry.id),
              title: 'Maosh varaqasini ko\'rish'
            }),
            canManage && entry.status === 'draft'
              ? h(AppButton, {
                  size: 'sm',
                  variant: 'ghost',
                  icon: 'calculator',
                  onClick: () => handleCalculate(entry.id),
                  title: 'Hisoblash'
                })
              : null,
            canManage && entry.status === 'calculated'
              ? h(AppButton, {
                  size: 'sm',
                  variant: 'ghost',
                  icon: 'check',
                  onClick: () => handleApprove(entry.id),
                  title: 'Tasdiqlash'
                })
              : null,
            canManage && entry.status === 'approved'
              ? h(AppButton, {
                  size: 'sm',
                  variant: 'ghost',
                  icon: 'dollar',
                  onClick: () => handleMarkAsPaid(entry.id),
                  title: 'To\'landi deb belgilash'
                })
              : null
          ].filter(Boolean)),
          raw: entry
        }))"
        :loading="isLoading"
        :pagination="{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50']
        }"
        :row-key="'id'"
        @update:pagination="handlePageChange"
      />
    </AppCard>
  </div>
</template>