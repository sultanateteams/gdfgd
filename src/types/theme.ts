// ═══════════════════════════════════════════════════════════
// THEME MANAGEMENT TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════

export type ThemeMode = 'light' | 'dark'

/**
 * Theme color palette structure
 * Contains all customizable color variables for the UI
 */
export interface ThemeColors {
  // Backgrounds
  bgPrimary: string      // Main background
  bgSecondary: string    // Cards, modals background
  bgTertiary: string     // Sidebar, footer background
  bgInverse: string      // Elements that need to stand out
  
  // Text colors
  textPrimary: string    // Main text
  textSecondary: string  // Secondary/muted text
  textMuted: string      // Placeholder, disabled text
  textInverse: string    // Text on dark backgrounds
  
  // Accent colors
  accentPrimary: string  // Primary buttons, links
  accentSecondary: string // Secondary buttons
  accentSuccess: string  // Success states
  accentWarning: string  // Warning states
  accentError: string    // Error states
  accentInfo: string     // Info states
  
  // Border colors
  borderPrimary: string  // Main borders
  borderSecondary: string // Subtle borders
  borderFocus: string    // Focus states
  
  // Interactive states
  hoverBg: string        // Hover background
  hoverText: string      // Hover text color
  activeBg: string       // Active/click state
  
  // Table colors
  tableHeaderBg: string
  tableRowEvenBg: string
  tableRowOddBg: string
  tableRowHoverBg: string
  
  // Form elements
  inputBg: string
  inputBorder: string
  inputFocusBorder: string
  inputText: string
  inputPlaceholder: string
  
  // Modal/Overlay
  modalBg: string
  modalOverlay: string
  
  // Shadows
  shadowSm: string
  shadowMd: string
  shadowLg: string
}

/**
 * Complete theme definition
 */
export interface Theme {
  id: string
  name: string
  description?: string
  type: ThemeMode
  isDefault: boolean
  isCustom: boolean
  colors: ThemeColors
  createdAt?: string
  updatedAt?: string
}

/**
 * Theme creation/edit form data
 */
export interface ThemeFormData {
  name: string
  description?: string
  type: ThemeMode
  colors: Partial<ThemeColors>
}

/**
 * Color category for UI grouping
 */
export interface ColorCategory {
  id: string
  label: string
  colors: Array<{
    key: keyof ThemeColors
    label: string
    description?: string
  }>
}

/**
 * Predefined default themes
 */
export const DEFAULT_THEMES: Theme[] = [
  {
    id: 'ocean-light',
    name: 'Ocean Light',
    description: 'Clean blue theme with light mode',
    type: 'light',
    isDefault: true,
    isCustom: false,
    colors: {
      bgPrimary: '#ffffff',
      bgSecondary: '#f8fafc',
      bgTertiary: '#f1f5f9',
      bgInverse: '#0f172a',
      textPrimary: '#0f172a',
      textSecondary: '#64748b',
      textMuted: '#94a3b8',
      textInverse: '#f1f5f9',
      accentPrimary: '#4f46e5',
      accentSecondary: '#06b6d4',
      accentSuccess: '#10b981',
      accentWarning: '#f59e0b',
      accentError: '#ef4444',
      accentInfo: '#3b82f6',
      borderPrimary: '#e2e8f0',
      borderSecondary: '#f1f5f9',
      borderFocus: '#4f46e5',
      hoverBg: '#f1f5f9',
      hoverText: '#4f46e5',
      activeBg: '#eef2ff',
      tableHeaderBg: '#f8fafc',
      tableRowEvenBg: '#ffffff',
      tableRowOddBg: '#f8fafc',
      tableRowHoverBg: '#f1f5f9',
      inputBg: '#ffffff',
      inputBorder: '#e2e8f0',
      inputFocusBorder: '#4f46e5',
      inputText: '#0f172a',
      inputPlaceholder: '#94a3b8',
      modalBg: '#ffffff',
      modalOverlay: 'rgba(0, 0, 0, 0.5)',
      shadowSm: 'rgba(0, 0, 0, 0.08)',
      shadowMd: 'rgba(0, 0, 0, 0.1)',
      shadowLg: 'rgba(0, 0, 0, 0.1)',
    }
  },
  {
    id: 'ocean-dark',
    name: 'Ocean Dark',
    description: 'Clean blue theme with dark mode',
    type: 'dark',
    isDefault: true,
    isCustom: false,
    colors: {
      bgPrimary: '#0f172a',
      bgSecondary: '#1e293b',
      bgTertiary: '#0f172a',
      bgInverse: '#ffffff',
      textPrimary: '#f1f5f9',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      textInverse: '#0f172a',
      accentPrimary: '#4f46e5',
      accentSecondary: '#06b6d4',
      accentSuccess: '#10b981',
      accentWarning: '#f59e0b',
      accentError: '#ef4444',
      accentInfo: '#3b82f6',
      borderPrimary: '#334155',
      borderSecondary: '#1e293b',
      borderFocus: '#4f46e5',
      hoverBg: 'rgba(255, 255, 255, 0.05)',
      hoverText: '#cbd5e1',
      activeBg: 'rgba(79, 70, 229, 0.15)',
      tableHeaderBg: '#1e293b',
      tableRowEvenBg: '#0f172a',
      tableRowOddBg: '#1e293b',
      tableRowHoverBg: 'rgba(255, 255, 255, 0.05)',
      inputBg: '#1e293b',
      inputBorder: '#334155',
      inputFocusBorder: '#4f46e5',
      inputText: '#f1f5f9',
      inputPlaceholder: '#64748b',
      modalBg: '#1e293b',
      modalOverlay: 'rgba(0, 0, 0, 0.5)',
      shadowSm: 'rgba(0, 0, 0, 0.3)',
      shadowMd: 'rgba(0, 0, 0, 0.3)',
      shadowLg: 'rgba(0, 0, 0, 0.3)',
    }
  },
  {
    id: 'forest-light',
    name: 'Forest Light',
    description: 'Natural green theme with light mode',
    type: 'light',
    isDefault: false,
    isCustom: false,
    colors: {
      bgPrimary: '#f0fdf4',
      bgSecondary: '#ffffff',
      bgTertiary: '#f0fdf4',
      bgInverse: '#052e16',
      textPrimary: '#052e16',
      textSecondary: '#166534',
      textMuted: '#4ade80',
      textInverse: '#f0fdf4',
      accentPrimary: '#16a34a',
      accentSecondary: '#16a34a',
      accentSuccess: '#10b981',
      accentWarning: '#f59e0b',
      accentError: '#ef4444',
      accentInfo: '#3b82f6',
      borderPrimary: '#bbf7d0',
      borderSecondary: '#dcfce7',
      borderFocus: '#16a34a',
      hoverBg: '#f0fdf4',
      hoverText: '#16a34a',
      activeBg: 'rgba(22, 163, 74, 0.1)',
      tableHeaderBg: '#ffffff',
      tableRowEvenBg: '#f0fdf4',
      tableRowOddBg: '#ffffff',
      tableRowHoverBg: '#dcfce7',
      inputBg: '#ffffff',
      inputBorder: '#bbf7d0',
      inputFocusBorder: '#16a34a',
      inputText: '#052e16',
      inputPlaceholder: '#86efac',
      modalBg: '#ffffff',
      modalOverlay: 'rgba(0, 0, 0, 0.5)',
      shadowSm: 'rgba(0, 0, 0, 0.08)',
      shadowMd: 'rgba(0, 0, 0, 0.1)',
      shadowLg: 'rgba(0, 0, 0, 0.1)',
    }
  },
  {
    id: 'forest-dark',
    name: 'Forest Dark',
    description: 'Natural green theme with dark mode',
    type: 'dark',
    isDefault: false,
    isCustom: false,
    colors: {
      bgPrimary: '#052e16',
      bgSecondary: '#14532d',
      bgTertiary: '#052e16',
      bgInverse: '#f0fdf4',
      textPrimary: '#f0fdf4',
      textSecondary: '#86efac',
      textMuted: '#4ade80',
      textInverse: '#052e16',
      accentPrimary: '#16a34a',
      accentSecondary: '#86efac',
      accentSuccess: '#10b981',
      accentWarning: '#f59e0b',
      accentError: '#ef4444',
      accentInfo: '#3b82f6',
      borderPrimary: '#166534',
      borderSecondary: '#052e16',
      borderFocus: '#16a34a',
      hoverBg: 'rgba(255, 255, 255, 0.05)',
      hoverText: '#bbf7d0',
      activeBg: 'rgba(22, 163, 74, 0.15)',
      tableHeaderBg: '#14532d',
      tableRowEvenBg: '#052e16',
      tableRowOddBg: '#14532d',
      tableRowHoverBg: 'rgba(255, 255, 255, 0.05)',
      inputBg: '#14532d',
      inputBorder: '#166534',
      inputFocusBorder: '#16a34a',
      inputText: '#f0fdf4',
      inputPlaceholder: '#4ade80',
      modalBg: '#14532d',
      modalOverlay: 'rgba(0, 0, 0, 0.5)',
      shadowSm: 'rgba(0, 0, 0, 0.3)',
      shadowMd: 'rgba(0, 0, 0, 0.3)',
      shadowLg: 'rgba(0, 0, 0, 0.3)',
    }
  },
  {
    id: 'sunset-light',
    name: 'Sunset Light',
    description: 'Warm orange theme with light mode',
    type: 'light',
    isDefault: false,
    isCustom: false,
    colors: {
      bgPrimary: '#fffbeb',
      bgSecondary: '#ffffff',
      bgTertiary: '#fffbeb',
      bgInverse: '#1c0a00',
      textPrimary: '#1c0a00',
      textSecondary: '#9a3412',
      textMuted: '#fdba74',
      textInverse: '#fffbeb',
      accentPrimary: '#f97316',
      accentSecondary: '#f59e0b',
      accentSuccess: '#10b981',
      accentWarning: '#f59e0b',
      accentError: '#ef4444',
      accentInfo: '#3b82f6',
      borderPrimary: '#fed7aa',
      borderSecondary: '#fff7ed',
      borderFocus: '#f97316',
      hoverBg: '#fff7ed',
      hoverText: '#f97316',
      activeBg: 'rgba(249, 115, 22, 0.1)',
      tableHeaderBg: '#ffffff',
      tableRowEvenBg: '#fffbeb',
      tableRowOddBg: '#ffffff',
      tableRowHoverBg: '#fff7ed',
      inputBg: '#ffffff',
      inputBorder: '#fed7aa',
      inputFocusBorder: '#f97316',
      inputText: '#1c0a00',
      inputPlaceholder: '#fdba74',
      modalBg: '#ffffff',
      modalOverlay: 'rgba(0, 0, 0, 0.5)',
      shadowSm: 'rgba(0, 0, 0, 0.08)',
      shadowMd: 'rgba(0, 0, 0, 0.1)',
      shadowLg: 'rgba(0, 0, 0, 0.1)',
    }
  },
  {
    id: 'sunset-dark',
    name: 'Sunset Dark',
    description: 'Warm orange theme with dark mode',
    type: 'dark',
    isDefault: false,
    isCustom: false,
    colors: {
      bgPrimary: '#1c0a00',
      bgSecondary: '#431407',
      bgTertiary: '#1c0a00',
      bgInverse: '#fff7ed',
      textPrimary: '#fff7ed',
      textSecondary: '#fed7aa',
      textMuted: '#fdba74',
      textInverse: '#1c0a00',
      accentPrimary: '#f97316',
      accentSecondary: '#fbbf24',
      accentSuccess: '#10b981',
      accentWarning: '#f59e0b',
      accentError: '#ef4444',
      accentInfo: '#3b82f6',
      borderPrimary: '#7c2d12',
      borderSecondary: '#1c0a00',
      borderFocus: '#f97316',
      hoverBg: 'rgba(255, 255, 255, 0.05)',
      hoverText: '#fdba74',
      activeBg: 'rgba(249, 115, 22, 0.15)',
      tableHeaderBg: '#431407',
      tableRowEvenBg: '#1c0a00',
      tableRowOddBg: '#431407',
      tableRowHoverBg: 'rgba(255, 255, 255, 0.05)',
      inputBg: '#431407',
      inputBorder: '#7c2d12',
      inputFocusBorder: '#f97316',
      inputText: '#fff7ed',
      inputPlaceholder: '#fdba74',
      modalBg: '#431407',
      modalOverlay: 'rgba(0, 0, 0, 0.5)',
      shadowSm: 'rgba(0, 0, 0, 0.3)',
      shadowMd: 'rgba(0, 0, 0, 0.3)',
      shadowLg: 'rgba(0, 0, 0, 0.3)',
    }
  },
  {
    id: 'slate-light',
    name: 'Slate Light',
    description: 'Purple theme with light mode',
    type: 'light',
    isDefault: false,
    isCustom: false,
    colors: {
      bgPrimary: '#faf5ff',
      bgSecondary: '#ffffff',
      bgTertiary: '#faf5ff',
      bgInverse: '#1e1b4b',
      textPrimary: '#1e1b4b',
      textSecondary: '#6d28d9',
      textMuted: '#c4b5fd',
      textInverse: '#faf5ff',
      accentPrimary: '#7c3aed',
      accentSecondary: '#8b5cf6',
      accentSuccess: '#10b981',
      accentWarning: '#f59e0b',
      accentError: '#ef4444',
      accentInfo: '#3b82f6',
      borderPrimary: '#ddd6fe',
      borderSecondary: '#f3e8ff',
      borderFocus: '#7c3aed',
      hoverBg: '#f5f3ff',
      hoverText: '#7c3aed',
      activeBg: 'rgba(139, 92, 246, 0.1)',
      tableHeaderBg: '#ffffff',
      tableRowEvenBg: '#faf5ff',
      tableRowOddBg: '#ffffff',
      tableRowHoverBg: '#f5f3ff',
      inputBg: '#ffffff',
      inputBorder: '#ddd6fe',
      inputFocusBorder: '#7c3aed',
      inputText: '#1e1b4b',
      inputPlaceholder: '#c4b5fd',
      modalBg: '#ffffff',
      modalOverlay: 'rgba(0, 0, 0, 0.5)',
      shadowSm: 'rgba(0, 0, 0, 0.08)',
      shadowMd: 'rgba(0, 0, 0, 0.1)',
      shadowLg: 'rgba(0, 0, 0, 0.1)',
    }
  },
  {
    id: 'slate-dark',
    name: 'Slate Dark',
    description: 'Purple theme with dark mode',
    type: 'dark',
    isDefault: false,
    isCustom: false,
    colors: {
      bgPrimary: '#0f0f23',
      bgSecondary: '#1a1a3e',
      bgTertiary: '#0f0f23',
      bgInverse: '#ede9fe',
      textPrimary: '#ede9fe',
      textSecondary: '#a78bfa',
      textMuted: '#c4b5fd',
      textInverse: '#0f0f23',
      accentPrimary: '#8b5cf6',
      accentSecondary: '#a78bfa',
      accentSuccess: '#10b981',
      accentWarning: '#f59e0b',
      accentError: '#ef4444',
      accentInfo: '#3b82f6',
      borderPrimary: '#312e81',
      borderSecondary: '#0f0f23',
      borderFocus: '#8b5cf6',
      hoverBg: 'rgba(255, 255, 255, 0.05)',
      hoverText: '#c4b5fd',
      activeBg: 'rgba(139, 92, 246, 0.15)',
      tableHeaderBg: '#1a1a3e',
      tableRowEvenBg: '#0f0f23',
      tableRowOddBg: '#1a1a3e',
      tableRowHoverBg: 'rgba(255, 255, 255, 0.05)',
      inputBg: '#1a1a3e',
      inputBorder: '#312e81',
      inputFocusBorder: '#8b5cf6',
      inputText: '#ede9fe',
      inputPlaceholder: '#c4b5fd',
      modalBg: '#1a1a3e',
      modalOverlay: 'rgba(0, 0, 0, 0.5)',
      shadowSm: 'rgba(0, 0, 0, 0.3)',
      shadowMd: 'rgba(0, 0, 0, 0.3)',
      shadowLg: 'rgba(0, 0, 0, 0.3)',
    }
  }
]

/**
 * Color categories for organizing the theme editor UI
 */
export const COLOR_CATEGORIES: ColorCategory[] = [
  {
    id: 'backgrounds',
    label: 'Backgrounds',
    colors: [
      { key: 'bgPrimary', label: 'Primary Background', description: 'Main page background' },
      { key: 'bgSecondary', label: 'Secondary Background', description: 'Cards, modals background' },
      { key: 'bgTertiary', label: 'Tertiary Background', description: 'Sidebar, footer background' },
      { key: 'bgInverse', label: 'Inverse Background', description: 'Elements that need to stand out' },
    ]
  },
  {
    id: 'text',
    label: 'Text Colors',
    colors: [
      { key: 'textPrimary', label: 'Primary Text', description: 'Main text color' },
      { key: 'textSecondary', label: 'Secondary Text', description: 'Secondary/muted text' },
      { key: 'textMuted', label: 'Muted Text', description: 'Placeholder, disabled text' },
      { key: 'textInverse', label: 'Inverse Text', description: 'Text on dark backgrounds' },
    ]
  },
  {
    id: 'accents',
    label: 'Accent Colors',
    colors: [
      { key: 'accentPrimary', label: 'Primary Accent', description: 'Primary buttons, links' },
      { key: 'accentSecondary', label: 'Secondary Accent', description: 'Secondary buttons' },
      { key: 'accentSuccess', label: 'Success', description: 'Success states' },
      { key: 'accentWarning', label: 'Warning', description: 'Warning states' },
      { key: 'accentError', label: 'Error', description: 'Error states' },
      { key: 'accentInfo', label: 'Info', description: 'Info states' },
    ]
  },
  {
    id: 'borders',
    label: 'Borders',
    colors: [
      { key: 'borderPrimary', label: 'Primary Border', description: 'Main borders' },
      { key: 'borderSecondary', label: 'Secondary Border', description: 'Subtle borders' },
      { key: 'borderFocus', label: 'Focus Border', description: 'Focus states' },
    ]
  },
  {
    id: 'interactive',
    label: 'Interactive States',
    colors: [
      { key: 'hoverBg', label: 'Hover Background', description: 'Hover background color' },
      { key: 'hoverText', label: 'Hover Text', description: 'Hover text color' },
      { key: 'activeBg', label: 'Active Background', description: 'Active/click state' },
    ]
  },
  {
    id: 'tables',
    label: 'Table Colors',
    colors: [
      { key: 'tableHeaderBg', label: 'Table Header BG', description: 'Table header background' },
      { key: 'tableRowEvenBg', label: 'Even Row BG', description: 'Even row background' },
      { key: 'tableRowOddBg', label: 'Odd Row BG', description: 'Odd row background' },
      { key: 'tableRowHoverBg', label: 'Row Hover BG', description: 'Row hover background' },
    ]
  },
  {
    id: 'forms',
    label: 'Form Elements',
    colors: [
      { key: 'inputBg', label: 'Input Background', description: 'Input field background' },
      { key: 'inputBorder', label: 'Input Border', description: 'Input border color' },
      { key: 'inputFocusBorder', label: 'Input Focus Border', description: 'Input focus border' },
      { key: 'inputText', label: 'Input Text', description: 'Input text color' },
      { key: 'inputPlaceholder', label: 'Input Placeholder', description: 'Placeholder text color' },
    ]
  },
  {
    id: 'modals',
    label: 'Modals & Overlays',
    colors: [
      { key: 'modalBg', label: 'Modal Background', description: 'Modal backdrop background' },
      { key: 'modalOverlay', label: 'Modal Overlay', description: 'Overlay/mask color' },
    ]
  },
  {
    id: 'shadows',
    label: 'Shadows',
    colors: [
      { key: 'shadowSm', label: 'Small Shadow', description: 'Small shadow color' },
      { key: 'shadowMd', label: 'Medium Shadow', description: 'Medium shadow color' },
      { key: 'shadowLg', label: 'Large Shadow', description: 'Large shadow color' },
    ]
  }
]