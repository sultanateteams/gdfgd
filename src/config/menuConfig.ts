// ═══════════════════════════════════════════════════════════
// MENU KONFIGURATSIYASI
// Barcha menu itemlarini shu yerda boshqaring
// ═══════════════════════════════════════════════════════════

export interface NavItem {
  id: string
  label: string
  to: string
  icon: string
  badge?: string | null
}

export interface AccordionItem {
  id: string
  label: string
  icon: string
  badge?: string | null
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
  analytics: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  workforce: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  employees: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  attendance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  leave: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  finance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  payroll: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  benefits: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>`,
  system: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  reports: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
  themes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0110 10 10 10 0 01-10 10 10 10 0 00-10-10 10 10 0 0010-10z"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>`,
}

export const menuConfig: MenuGroup[] = [
  {
    id: 'main',
    label: 'Main Menu',
    type: 'regular',
    items: [
      { id: 'dashboard', label: 'Dashboard', to: '/', icon: icons.dashboard, badge: null },
      { id: 'analytics', label: 'Analytics', to: '/analytics', icon: icons.analytics, badge: null },
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
        icon: icons.workforce,
        badge: '15',
        children: [
          { id: 'employees', label: 'Employees', to: '/employees', icon: icons.employees, badge: null },
          { id: 'attendance', label: 'Attendance', to: '/attendance', icon: icons.attendance, badge: '3' },
          { id: 'leave', label: 'Leave Management', to: '/leave', icon: icons.leave, badge: '12' },
        ],
      },
      {
        id: 'finance',
        label: 'Finance',
        icon: icons.finance,
        badge: null,
        children: [
          { id: 'payroll', label: 'Payroll', to: '/payroll', icon: icons.payroll, badge: null },
          { id: 'benefits', label: 'Benefits', to: '/benefits', icon: icons.benefits, badge: null },
        ],
      },
      {
        id: 'system',
        label: 'System',
        icon: icons.system,
        badge: null,
        children: [
          { id: 'reports', label: 'Reports', to: '/reports', icon: icons.reports, badge: null },
          { id: 'settings', label: 'Settings', to: '/settings', icon: icons.settings, badge: null },
          { id: 'themes', label: 'Theme Management', to: '/settings/themes', icon: icons.themes, badge: null },
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