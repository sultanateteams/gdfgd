// ═══════════════════════════════════════════════════════════
// DESIGN TOKENS - Centralized Design System Configuration
// ═══════════════════════════════════════════════════════════

/**
 * Border Radius Scale
 * Consistent rounding across all components
 */
export const borderRadius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const;

/**
 * Spacing Scale
 * Based on 4px grid system (4, 8, 12, 16, 24, 32, 48...)
 */
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
} as const;

/**
 * Typography Scale
 * Clear hierarchy for headings, body, and labels
 */
export const typography = {
  // Font sizes
  sizes: {
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '32px',
  },
  // Font weights
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  // Font families
  families: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },
} as const;

/**
 * Transitions
 * Consistent animation timings
 */
export const transitions = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '350ms ease',
} as const;

/**
 * Shadows
 * Elevation system for depth
 */
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
} as const;

/**
 * Z-Index Scale
 * Layering system for overlays and modals
 */
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

/**
 * Breakpoints
 * Responsive design breakpoints
 */
export const breakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  '2xl': '1400px',
} as const;

/**
 * Status Colors (using CSS variables for theme support)
 * These map to the theme store's color tokens
 */
export const statusColors = {
  primary: 'var(--accent-primary, #4f46e5)',
  success: 'var(--accent-success, #10b981)',
  warning: 'var(--accent-warning, #f59e0b)',
  error: 'var(--accent-error, #ef4444)',
  info: 'var(--accent-info, #3b82f6)',
} as const;

/**
 * Component-specific tokens
 */
export const componentTokens = {
  // Input
  input: {
    height: {
      sm: '28px',
      md: '36px',
      lg: '44px',
    },
    padding: {
      sm: '4px 8px',
      md: '6px 12px',
      lg: '10px 16px',
    },
  },
  // Button
  button: {
    height: {
      sm: '28px',
      md: '36px',
      lg: '44px',
    },
    padding: {
      sm: '4px 12px',
      md: '6px 16px',
      lg: '10px 24px',
    },
  },
} as const;

// Export type definitions
export type BorderRadius = typeof borderRadius;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type Transitions = typeof transitions;
export type Shadows = typeof shadows;
export type ZIndex = typeof zIndex;
export type StatusColors = typeof statusColors;
