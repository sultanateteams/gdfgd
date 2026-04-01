<template>
  <div class="dashboard-view">
    <div class="dashboard-header">
      <div>
        <h1 class="dashboard-title" style="color: var(--text-primary);">{{ l('Asosiy oyna', 'dashboard.titlecbxvx') }}</h1>
        <p class="dashboard-subtitle" style="color: var(--text-secondary);">{{ l('Overview of your HR management system', 'dashboard.subtitle') }}</p>
      </div>
      
      <div class="dashboard-actions">
        <AppButton type="primary" @click="refreshDashboard">
          <template #icon>🔄</template>
          {{ l('Refresh Data', 'dashboard.refreshData') }}
        </AppButton>
        <AppButton type="secondary" @click="exportReport">
          <template #icon>📊</template>
          {{ l('Export Report', 'dashboard.exportReport') }}
        </AppButton>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Key Metrics -->
      <div class="metrics-grid">
        <AppStatisticCard
          v-for="(metric, index) in metrics"
          :key="index"
          :value="metric.value"
          :label="metric.label"
          :icon="metric.icon"
        />
      </div>

      <!-- Charts and Analytics -->
      <div class="analytics-grid">
        <!-- Attendance Summary -->
        <AppCard>
          <h3 class="chart-title" style="color: var(--text-primary);">{{ l('Today\'s Attendance', 'dashboard.attendance.title') }}</h3>
          <div class="attendance-summary">
            <div 
              v-for="item in attendanceItems" 
              :key="item.label"
              class="attendance-item"
            >
              <span class="status-dot" :class="item.class"></span>
              <span class="status-label" style="color: var(--text-secondary);">{{ item.label }}</span>
              <span class="status-value" style="color: var(--text-primary);">{{ item.value }}</span>
            </div>
          </div>
        </AppCard>

        <!-- Department Overview -->
        <AppCard>
          <h3 class="chart-title" style="color: var(--text-primary);">{{ l('Department Overview', 'dashboard.department.title') }}</h3>
          <div class="department-list">
            <div 
              v-for="dept in departmentStats" 
              :key="dept.id" 
              class="department-item"
            >
              <div class="department-info">
                <span class="department-name" style="color: var(--text-primary);">{{ dept.name }}</span>
                <span class="department-count" style="color: var(--text-secondary);">{{ dept.employeeCount }} {{ l('employees', 'dashboard.department.employees') }}</span>
              </div>
              <div class="department-stats">
                <AppStatusBadge :text="`${l('Avg Tenure', 'dashboard.department.avgTenure')}: ${dept.averageTenure}y`" type="info" size="sm" />
                <AppStatusBadge :text="`${l('Turnover', 'dashboard.department.turnover')}: ${dept.turnoverRate}%`" type="warning" size="sm" />
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Payroll Summary -->
        <AppCard>
          <h3 class="chart-title" style="color: var(--text-primary);">{{ l('Payroll Summary', 'dashboard.payroll.title') }}</h3>
          <div class="payroll-summary">
            <div class="payroll-item">
              <span class="payroll-label" style="color: var(--text-secondary);">{{ l('Total Budget', 'dashboard.payroll.totalBudget') }}</span>
              <span class="payroll-value" style="color: var(--text-primary);">{{ formatCurrency(payrollSummary?.totalBudget || 0) }}</span>
            </div>
            <div class="payroll-item">
              <span class="payroll-label" style="color: var(--text-secondary);">{{ l('Processed', 'dashboard.payroll.processed') }}</span>
              <span class="payroll-value" style="color: var(--text-primary);">{{ formatCurrency(payrollSummary?.processed || 0) }}</span>
            </div>
            <div class="payroll-item">
              <span class="payroll-label" style="color: var(--text-secondary);">{{ l('Pending', 'dashboard.payroll.pending') }}</span>
              <span class="payroll-value" style="color: var(--text-primary);">{{ formatCurrency(payrollSummary?.pending || 0) }}</span>
            </div>
            <div class="payroll-item">
              <span class="payroll-label" style="color: var(--text-secondary);">{{ l('Utilization', 'dashboard.payroll.utilization') }}</span>
              <span class="payroll-value" style="color: var(--text-primary);">{{ payrollUtilization }}%</span>
            </div>
          </div>
        </AppCard>

        <!-- Leave Summary -->
        <AppCard>
          <h3 class="chart-title" style="color: var(--text-primary);">{{ l('Leave Summary', 'dashboard.leave.title') }}</h3>
          <div class="leave-summary">
            <div class="leave-item">
              <span class="leave-label" style="color: var(--text-secondary);">{{ l('Total Requests', 'dashboard.leave.totalRequests') }}</span>
              <span class="leave-value" style="color: var(--text-primary);">{{ leaveSummary?.totalRequests || 0 }}</span>
            </div>
            <div class="leave-item">
              <span class="leave-label" style="color: var(--text-secondary);">{{ l('Approved', 'dashboard.leave.approved') }}</span>
              <span class="leave-value" style="color: var(--success);">{{ leaveSummary?.approved || 0 }}</span>
            </div>
            <div class="leave-item">
              <span class="leave-label" style="color: var(--text-secondary);">{{ l('Pending', 'dashboard.leave.pending') }}</span>
              <span class="leave-value" style="color: var(--warning);">{{ leaveSummary?.pending || 0 }}</span>
            </div>
            <div class="leave-item">
              <span class="leave-label" style="color: var(--text-secondary);">{{ l('Rejected', 'dashboard.leave.rejected') }}</span>
              <span class="leave-value" style="color: var(--danger);">{{ leaveSummary?.rejected || 0 }}</span>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Recent Activity -->
      <div class="activity-section">
        <h3 class="section-title" style="color: var(--text-primary);">{{ l('Recent Activity', 'dashboard.activity.title') }}</h3>
        <div class="activity-list">
          <AppCard v-for="activity in recentActivity" :key="activity.id" class="activity-item">
            <div class="activity-icon">{{ getActivityIcon(activity.type) }}</div>
            <div class="activity-content">
              <h4 class="activity-title" style="color: var(--text-primary);">{{ activity.title }}</h4>
              <p class="activity-description" style="color: var(--text-secondary);">{{ activity.description }}</p>
              <span class="activity-time" style="color: var(--text-muted);">{{ formatDate(activity.timestamp) }}</span>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboard } from '../composables'
import { formatDate, formatCurrency } from '@/shared/utils'
import { useT } from '@/composables/useT'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppCard from '@/shared/components/ui/AppCard.vue'
import AppStatusBadge from '@/shared/components/ui/AppStatusBadge.vue'
import AppStatisticCard from '@/shared/components/ui/AppStatisticCard.vue'

const { l } = useT()

const {
  stats,
  attendanceSummary,
  departmentStats,
  recentActivity,
  payrollSummary,
  leaveSummary,
  payrollUtilization,
  isLoading,
  error,
  refreshDashboard,
  clearError
} = useDashboard()

// Computed metrics for AppStatisticCard
const metrics = computed(() => [
  {
    value: stats?.totalEmployees || 0,
    label: l('Total Employees', 'dashboard.metrics.totalEmployees'),
    icon: '👥'
  },
  {
    value: stats?.activeEmployees || 0,
    label: l('Active Employees', 'dashboard.metrics.activeEmployees'),
    icon: '✅'
  },
  {
    value: stats?.todayAttendance || 0,
    label: l('Today\'s Attendance', 'dashboard.metrics.todayAttendance'),
    icon: '⏰'
  },
  {
    value: formatCurrency(stats?.payrollBudget || 0),
    label: l('Payroll Budget', 'dashboard.metrics.payrollBudget'),
    icon: '💰'
  }
])

// Computed attendance items
const attendanceItems = computed(() => [
  { label: l('Present', 'dashboard.attendance.present'), value: attendanceSummary?.present || 0, class: 'present' },
  { label: l('Absent', 'dashboard.attendance.absent'), value: attendanceSummary?.absent || 0, class: 'absent' },
  { label: l('Late', 'dashboard.attendance.late'), value: attendanceSummary?.late || 0, class: 'late' },
  { label: l('On Leave', 'dashboard.attendance.onLeave'), value: attendanceSummary?.onLeave || 0, class: 'on-leave' },
  { label: l('Remote', 'dashboard.attendance.remote'), value: attendanceSummary?.remote || 0, class: 'remote' }
])

const exportReport = (): void => {
  // TODO: Implement export functionality
  alert('Export functionality will be implemented soon!')
}

const getActivityIcon = (type: string): string => {
  switch (type) {
    case 'employee': return '👤'
    case 'attendance': return '⏰'
    case 'payroll': return '💰'
    case 'leave': return '📅'
    default: return 'ℹ️'
  }
}
</script>

<style scoped>
.dashboard-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px 20px;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
}

.dashboard-subtitle {
  font-size: 16px;
  margin: 4px 0 0 0;
}

.dashboard-actions {
  display: flex;
  gap: 12px;
}

.dashboard-grid {
  display: grid;
  gap: 24px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.attendance-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attendance-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.present { background: var(--success); }
.status-dot.absent { background: var(--danger); }
.status-dot.late { background: var(--warning); }
.status-dot.on-leave { background: var(--info); }
.status-dot.remote { background: var(--accent); }

.status-label {
  flex: 1;
  font-size: 14px;
}

.status-value {
  font-weight: 600;
}

.department-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.department-item {
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.department-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.department-stats {
  display: flex;
  gap: 8px;
}

.payroll-summary,
.leave-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payroll-item,
.leave-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.activity-section {
  margin-top: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  transition: transform var(--transition-normal);
}

.activity-item:hover {
  transform: translateX(4px);
}

.activity-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.activity-description {
  font-size: 14px;
  margin: 0;
}

.activity-time {
  font-size: 12px;
}

/* Responsive design */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .analytics-grid {
    grid-template-columns: 1fr;
  }
}
</style>