// ═══════════════════════════════════════════════════════════
// AUTH SERVICES - BARREL EXPORT
// ═══════════════════════════════════════════════════════════

// Main auth service (factory pattern)
export { authService, getAuthService } from './authService'
export type {
  IAuthService,
  AuthLoginPayload,
  AuthLoginResponse,
  AuthRefreshResponse,
  AuthLogoutResponse
} from './authService'

// Mock auth service
export { mockAuthService } from './mockAuthService'
export { MOCK_USERS } from './mockAuthService'
export type {
  MockLoginPayload,
  MockLoginResponse,
  MockRefreshResponse
} from './mockAuthService'

// Real auth service
export { realAuthService } from './realAuthService'
export type {
  LoginPayload,
  LoginResponse,
  RefreshResponse,
  LogoutResponse
} from './realAuthService'

// Default export
export { authService as default } from './authService'