// Dashboard module services

import type { 
  DashboardStats, 
  AttendanceSummary, 
  DepartmentStats, 
  RecentActivity, 
  PayrollSummary, 
  LeaveSummary 
} from '../types'

export class DashboardService {
  private static instance: DashboardService

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService()
    }
    return DashboardService.instance
  }

  async getStats(): Promise<DashboardStats> {
    // Mock data for now - will be replaced with actual API calls
    return {
      totalEmployees: 1234,
      activeEmployees: 1189,
      inactiveEmployees: 45,
      pendingApprovals: 12,
      todayAttendance: 1156,
      thisMonthHires: 23,
      thisMonthLeaves: 156,
      payrollBudget: 850000
    }
  }

  async getAttendanceSummary(): Promise<AttendanceSummary> {
    // Mock data for now
    return {
      present: 1156,
      absent: 45,
      late: 23,
      onLeave: 32,
      remote: 18
    }
  }

  async getDepartmentStats(): Promise<DepartmentStats[]> {
    // Mock data for now
    return [
      {
        id: '1',
        name: 'Engineering',
        employeeCount: 342,
        averageTenure: 3.2,
        turnoverRate: 8.5
      },
      {
        id: '2',
        name: 'Sales',
        employeeCount: 289,
        averageTenure: 2.1,
        turnoverRate: 12.3
      },
      {
        id: '3',
        name: 'Marketing',
        employeeCount: 156,
        averageTenure: 4.1,
        turnoverRate: 6.7
      },
      {
        id: '4',
        name: 'HR',
        employeeCount: 45,
        averageTenure: 5.8,
        turnoverRate: 3.2
      },
      {
        id: '5',
        name: 'Finance',
        employeeCount: 89,
        averageTenure: 6.5,
        turnoverRate: 2.1
      }
    ]
  }

  async getRecentActivity(): Promise<RecentActivity[]> {
    // Mock data for now
    return [
      {
        id: '1',
        type: 'employee',
        title: 'New Hire',
        description: 'Sarah Johnson joined as Senior Developer',
        timestamp: new Date(),
        user: { name: 'Michael Chen' }
      },
      {
        id: '2',
        type: 'attendance',
        title: 'Late Arrival',
        description: 'John Smith marked late today',
        timestamp: new Date(Date.now() - 3600000),
        user: { name: 'System' }
      },
      {
        id: '3',
        type: 'payroll',
        title: 'Payroll Processed',
        description: 'Monthly payroll for March completed',
        timestamp: new Date(Date.now() - 7200000),
        user: { name: 'System' }
      },
      {
        id: '4',
        type: 'leave',
        title: 'Leave Approved',
        description: 'Annual leave for Emily Davis approved',
        timestamp: new Date(Date.now() - 10800000),
        user: { name: 'Sarah Wilson' }
      },
      {
        id: '5',
        type: 'employee',
        title: 'Promotion',
        description: 'David Kim promoted to Team Lead',
        timestamp: new Date(Date.now() - 14400000),
        user: { name: 'System' }
      }
    ]
  }

  async getPayrollSummary(): Promise<PayrollSummary> {
    // Mock data for now
    return {
      totalBudget: 850000,
      processed: 823000,
      pending: 27000,
      averageSalary: 4250,
      currency: 'USD'
    }
  }

  async getLeaveSummary(): Promise<LeaveSummary> {
    // Mock data for now
    return {
      totalRequests: 234,
      approved: 189,
      pending: 28,
      rejected: 17,
      thisMonth: 45
    }
  }
}

export const dashboardService = DashboardService.getInstance()