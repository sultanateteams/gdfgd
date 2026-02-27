// Shared type definitions for the HRM system

export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'admin' | 'manager' | 'employee' | 'hr'

export interface Department {
  id: string
  name: string
  description?: string
  managerId?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FileUpload {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedBy: string
  createdAt: Date
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type ApiResponseData<T> = T extends ApiResponse<infer D> ? D : never