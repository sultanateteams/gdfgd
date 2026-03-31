<template>
  <div class="dashboard-view">
    <div class="dashboard-header">
      <h1 class="dashboard-title">{{ l('Asosiy oyna', 'dashboard.titlecbxvx') }}</h1>
      <p class="dashboard-subtitle">{{ l('Overview of your HR management system', 'dashboard.subtitle') }}</p>
      
      <div class="dashboard-actions">
        <button class="btn btn-primary" @click="refreshDashboard">
          <span class="icon">🔄</span>
          {{ l('Refresh Data', 'dashboard.refreshData') }}
        </button>
        <button class="btn btn-secondary" @click="exportReport">
          <span class="icon">📊</span>
          {{ l('Export Report', 'dashboard.exportReport') }}
        </button>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Key Metrics -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">👥</div>
          <div class="metric-content">
            <div class="metric-value">{{ stats?.totalEmployees || 0 }}</div>
            <div class="metric-label">{{ l('Total Employees', 'dashboard.metrics.totalEmployees') }}</div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">✅</div>
          <div class="metric-content">
            <div class="metric-value">{{ stats?.activeEmployees || 0 }}</div>
            <div class="metric-label">{{ l('Active Employees', 'dashboard.metrics.activeEmployees') }}</div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">⏰</div>
          <div class="metric-content">
            <div class="metric-value">{{ stats?.todayAttendance || 0 }}</div>
            <div class="metric-label">{{ l('Today\'s Attendance', 'dashboard.metrics.todayAttendance') }}</div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">💰</div>
          <div class="metric-content">
            <div class="metric-value">{{ formatCurrency(stats?.payrollBudget || 0) }}</div>
            <div class="metric-label">{{ l('Payroll Budget', 'dashboard.metrics.payrollBudget') }}</div>
          </div>
        </div>
      </div>

      <!-- Charts and Analytics -->
      <div class="analytics-grid">
        <!-- Attendance Summary -->
        <div class="chart-card">
          <h3 class="chart-title">{{ l('Today\'s Attendance', 'dashboard.attendance.title') }}</h3>
          <div class="attendance-summary">
            <div class="attendance-item">
              <span class="status-dot present"></span>
              <span class="status-label">{{ l('Present', 'dashboard.attendance.present') }}</span>
              <span class="status-value">{{ attendanceSummary?.present || 0 }}</span>
            </div>
            <div class="attendance-item">
              <span class="status-dot absent"></span>
              <span class="status-label">{{ l('Absent', 'dashboard.attendance.absent') }}</span>
              <span class="status-value">{{ attendanceSummary?.absent || 0 }}</span>
            </div>
            <div class="attendance-item">
              <span class="status-dot late"></span>
              <span class="status-label">{{ l('Late', 'dashboard.attendance.late') }}</span>
              <span class="status-value">{{ attendanceSummary?.late || 0 }}</span>
            </div>
            <div class="attendance-item">
              <span class="status-dot on-leave"></span>
              <span class="status-label">{{ l('On Leave', 'dashboard.attendance.onLeave') }}</span>
              <span class="status-value">{{ attendanceSummary?.onLeave || 0 }}</span>
            </div>
            <div class="attendance-item">
              <span class="status-dot remote"></span>
              <span class="status-label">{{ l('Remote', 'dashboard.attendance.remote') }}</span>
              <span class="status-value">{{ attendanceSummary?.remote || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Department Overview -->
        <div class="chart-card">
          <h3 class="chart-title">{{ l('Department Overview', 'dashboard.department.title') }}</h3>
          <div class="department-list">
            <div 
              v-for="dept in departmentStats" 
              :key="dept.id" 
              class="department-item"
            >
              <div class="department-info">
                <span class="department-name">{{ dept.name }}</span>
                <span class="department-count">{{ dept.employeeCount }} {{ l('employees', 'dashboard.department.employees') }}</span>
              </div>
              <div class="department-stats">
                <span class="stat-item">{{ l('Avg Tenure', 'dashboard.department.avgTenure') }}: {{ dept.averageTenure }}y</span>
                <span class="stat-item">{{ l('Turnover', 'dashboard.department.turnover') }}: {{ dept.turnoverRate }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payroll Summary -->
        <div class="chart-card">
          <h3 class="chart-title">{{ l('Payroll Summary', 'dashboard.payroll.title') }}</h3>
          <div class="payroll-summary">
            <div class="payroll-item">
              <span class="payroll-label">{{ l('Total Budget', 'dashboard.payroll.totalBudget') }}</span>
              <span class="payroll-value">{{ formatCurrency(payrollSummary?.totalBudget || 0) }}</span>
            </div>
            <div class="payroll-item">
              <span class="payroll-label">{{ l('Processed', 'dashboard.payroll.processed') }}</span>
              <span class="payroll-value">{{ formatCurrency(payrollSummary?.processed || 0) }}</span>
            </div>
            <div class="payroll-item">
              <span class="payroll-label">{{ l('Pending', 'dashboard.payroll.pending') }}</span>
              <span class="payroll-value">{{ formatCurrency(payrollSummary?.pending || 0) }}</span>
            </div>
            <div class="payroll-item">
              <span class="payroll-label">{{ l('Utilization', 'dashboard.payroll.utilization') }}</span>
              <span class="payroll-value">{{ payrollUtilization }}%</span>
            </div>
          </div>
        </div>

        <!-- Leave Summary -->
        <div class="chart-card">
          <h3 class="chart-title">{{ l('Leave Summary', 'dashboard.leave.title') }}</h3>
          <div class="leave-summary">
            <div class="leave-item">
              <span class="leave-label">{{ l('Total Requests', 'dashboard.leave.totalRequests') }}</span>
              <span class="leave-value">{{ leaveSummary?.totalRequests || 0 }}</span>
            </div>
            <div class="leave-item">
              <span class="leave-label">{{ l('Approved', 'dashboard.leave.approved') }}</span>
              <span class="leave-value approved">{{ leaveSummary?.approved || 0 }}</span>
            </div>
            <div class="leave-item">
              <span class="leave-label">{{ l('Pending', 'dashboard.leave.pending') }}</span>
              <span class="leave-value pending">{{ leaveSummary?.pending || 0 }}</span>
            </div>
            <div class="leave-item">
              <span class="leave-label">{{ l('Rejected', 'dashboard.leave.rejected') }}</span>
              <span class="leave-value rejected">{{ leaveSummary?.rejected || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="activity-section">
        <h3 class="section-title">{{ l('Recent Activity', 'dashboard.activity.title') }}</h3>
        <div class="activity-list">
          <div 
            v-for="activity in recentActivity" 
            :key="activity.id" 
            class="activity-item"
          >
            <div class="activity-icon">{{ getActivityIcon(activity.type) }}</div>
            <div class="activity-content">
              <h4 class="activity-title">{{ activity.title }}</h4>
              <p class="activity-description">{{ activity.description }}</p>
              <span class="activity-time">{{ formatDate(activity.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboard } from '../composables'
import { formatDate, formatCurrency } from '@/shared/utils'
import { useT } from '@/composables/useT'

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
  color: var(--text-primary);
}

.dashboard-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
}

.dashboard-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-normal);
  border: 1px solid var(--border-color);
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}

.btn-secondary {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
}

.icon {
  font-size: 16px;
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

.metric-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform var(--transition-normal);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.metric-icon {
  font-size: 32px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.metric-label {
  font-size: 14px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.chart-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-primary);
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
  color: var(--text-secondary);
}

.status-value {
  font-weight: 600;
  color: var(--text-primary);
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

.department-name {
  font-weight: 600;
  color: var(--text-primary);
}

.department-count {
  font-size: 12px;
  color: var(--text-secondary);
}

.department-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-secondary);
}

.stat-item {
  background: var(--bg-primary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
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

.payroll-label,
.leave-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.payroll-value,
.leave-value {
  font-weight: 600;
  color: var(--text-primary);
}

.leave-value.approved { color: var(--success); }
.leave-value.pending { color: var(--warning); }
.leave-value.rejected { color: var(--danger); }

.activity-section {
  margin-top: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-primary);
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
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
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
  color: var(--text-primary);
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
  color: var(--text-primary);
}

.activity-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.activity-time {
  font-size: 12px;
  color: var(--text-muted);
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
  
  .activity-item {
    padding: 12px;
  }
  
  .activity-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>