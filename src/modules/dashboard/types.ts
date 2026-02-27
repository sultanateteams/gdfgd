// Dashboard module type definitions

export interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  inactiveEmployees: number
  pendingApprovals: number
  todayAttendance: number
  thisMonthHires: number
  thisMonthLeaves: number
  payrollBudget: number
}

export interface AttendanceSummary {
  present: number
  absent: number
  late: number
  onLeave: number
  remote: number
}

export interface DepartmentStats {
  id: string
  name: string
  employeeCount: number
  averageTenure: number
  turnoverRate: number
}

export interface RecentActivity {
  id: string
  type: 'employee' | 'attendance' | 'payroll' | 'leave'
  title: string
  description: string
  timestamp: Date
  user?: {
    name: string
    avatar?: string
  }
}

export interface PayrollSummary {
  totalBudget: number
  processed: number
  pending: number
  averageSalary: number
  currency: string
}

export interface LeaveSummary {
  totalRequests: number
  approved: number
  pending: number
  rejected: number
  thisMonth: number
}