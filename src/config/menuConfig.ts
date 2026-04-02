// ═══════════════════════════════════════════════════════════
// MENU KONFIGURATSIYASI
// Barcha menu itemlarini shu yerda boshqaring
// ═══════════════════════════════════════════════════════════

import type { UserRole } from '@/shared/types/auth'

export interface NavItem {
  id: string
  label: string
  to: string
  icon: string
  badge?: string | null
  requiredRole?: UserRole[]
  requiredPermission?: string
}

export interface AccordionItem {
  id: string
  label: string
  icon: string
  badge?: string | null
  requiredRole?: UserRole[]
  children: NavItem[]
}

export interface MenuGroup {
  id: string
  label: string | null
  type: 'regular' | 'accordion'
  items: NavItem[] | AccordionItem[]
}

// SVG iconlar uchun helper
const icons = {
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  employees: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  attendance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  leave: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  payroll: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
  themes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0110 10 10 10 0 01-10 10 10 10 0 00-10-10 10 10 0 0010-10z"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>`,
}

export const menuConfig: MenuGroup[] = [
  {
    id: 'main',
    label: 'Main Menu',
    type: 'regular',
    items: [
      { id: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: icons.dashboard, badge: null, requiredRole: ['admin', 'hr_manager', 'employee'] },
    ] as NavItem[],
  },
  {
    id: 'accordionGroups',
    label: null,
    type: 'accordion',
    items: [
      {
        id: 'workforce',
        label: 'Workforce',
        icon: icons.employees,
        badge: null,
        requiredRole: ['admin', 'hr_manager'],
        children: [
          { id: 'employees', label: 'Xodimlar', to: '/employees', icon: icons.employees, badge: null, requiredRole: ['admin', 'hr_manager'] },
          { id: 'attendance', label: 'Davomat', to: '/attendance', icon: icons.attendance, badge: null, requiredRole: ['admin', 'hr_manager', 'employee'] },
          { id: 'leave', label: "Ta'til so'rovlari", to: '/attendance/leaves', icon: icons.leave, badge: null, requiredRole: ['admin', 'hr_manager', 'employee'] },
        ],
      },
      {
        id: 'finance',
        label: 'Finance',
        icon: icons.payroll,
        badge: null,
        requiredRole: ['admin', 'hr_manager'],
        children: [
          { id: 'payroll', label: 'Maosh', to: '/payroll', icon: icons.payroll, badge: null, requiredRole: ['admin', 'hr_manager'] },
        ],
      },
      {
        id: 'system',
        label: 'System',
        icon: icons.settings,
        badge: null,
        requiredRole: ['admin'],
        children: [
          { id: 'settings', label: 'Sozlamalar', to: '/settings/themes', icon: icons.settings, badge: null, requiredRole: ['admin'] },
          { id: 'themes', label: 'Mavzu', to: '/settings/themes', icon: icons.themes, badge: null, requiredRole: ['admin'] },
        ],
      },
    ] as AccordionItem[],
  },
]

// Barcha nav itemlarni tekis ro'yxat sifatida olish (breadcrumb uchun)
export function getAllNavItems(): NavItem[] {
  const items: NavItem[] = []
  for (const group of menuConfig) {
    if (group.type === 'regular') {
      items.push(...(group.items as NavItem[]))
    } else if (group.type === 'accordion') {
      for (const accordion of group.items as AccordionItem[]) {
        items.push(...accordion.children)
      }
    }
  }
  return items
}