// Home module services

import type { HomeStats, ActivityItem, QuickAction } from '../types'

export class HomeService {
  private static instance: HomeService

  static getInstance(): HomeService {
    if (!HomeService.instance) {
      HomeService.instance = new HomeService()
    }
    return HomeService.instance
  }

  async getStats(): Promise<HomeStats> {
    // Mock data for now - will be replaced with actual API calls
    return {
      totalEmployees: 1234,
      activeConversations: 45,
      responseRate: 98,
      averageRating: 4.8
    }
  }

  async getActivityFeed(): Promise<ActivityItem[]> {
    // Mock data for now
    return [
      {
        id: '1',
        action: 'New Employee Onboarded',
        description: 'John Doe joined the Marketing department',
        timestamp: new Date(),
        user: {
          name: 'Sarah Wilson',
          avatar: ''
        }
      },
      {
        id: '2',
        action: 'Leave Request Approved',
        description: 'Annual leave request for Jane Smith approved',
        timestamp: new Date(Date.now() - 3600000),
        user: {
          name: 'Michael Chen',
          avatar: ''
        }
      },
      {
        id: '3',
        action: 'Payroll Processed',
        description: 'Monthly payroll for March completed successfully',
        timestamp: new Date(Date.now() - 7200000),
        user: {
          name: 'HR System',
          avatar: ''
        }
      }
    ]
  }

  async getQuickActions(): Promise<QuickAction[]> {
    // Mock data for now
    return [
      {
        id: '1',
        title: 'Add New Employee',
        description: 'Create employee profile and assign to department',
        icon: '👤'
      },
      {
        id: '2',
        title: 'Process Payroll',
        description: 'Generate and process monthly payroll',
        icon: '💰'
      },
      {
        id: '3',
        title: 'Review Leave Requests',
        description: 'Approve or reject pending leave applications',
        icon: '📅'
      },
      {
        id: '4',
        title: 'Generate Reports',
        description: 'Create custom HR reports and analytics',
        icon: '📊'
      }
    ]
  }
}

export const homeService = HomeService.getInstance()