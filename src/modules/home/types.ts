// Home module type definitions

export interface HomeStats {
  totalEmployees: number
  activeConversations: number
  responseRate: number
  averageRating: number
}

export interface ActivityItem {
  id: string
  action: string
  description: string
  timestamp: Date
  user: {
    name: string
    avatar?: string
  }
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  route?: string
  onClick?: () => void
}