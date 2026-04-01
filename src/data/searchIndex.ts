/**
 * Command Palette Search Index
 * Barcha qidiriladigan itemlar ro'yxati
 */

export interface SearchItem {
  id: string
  label: string          // Ko'rsatiladigan nom
  description?: string   // Qo'shimcha ma'lumot
  path?: string          // Router path
  query?: Record<string, string>  // Router query params
  icon: string           // Emoji icon
  category: 'page' | 'tab' | 'action'
  keywords?: string[]    // Qo'shimcha qidiruv so'zlari
  handler?: () => void   // Action uchun handler
}

/**
 * Pages - Asosiy sahifalar
 */
export const pageItems: SearchItem[] = [
  {
    id: 'page-dashboard',
    label: 'Dashboard',
    description: 'Bosh sahifa',
    path: '/',
    icon: '📊',
    category: 'page',
    keywords: ['home', 'bosh', 'asosiy', 'statistika']
  },
  {
    id: 'page-analytics',
    label: 'Analytics',
    description: 'Tahlil va statistika',
    path: '/analytics',
    icon: '📈',
    category: 'page',
    keywords: ['tahlil', 'statistika', 'charts', 'grafik']
  },
  {
    id: 'page-workforce',
    label: 'Workforce',
    description: 'Xodimlar boshqaruvi',
    path: '/employees',
    icon: '👥',
    category: 'page',
    keywords: ['xodim', 'ishchi', 'jamo', 'team', 'employee']
  },
  {
    id: 'page-finance',
    label: 'Finance',
    description: 'Moliya boshqaruvi',
    path: '/payroll',
    icon: '💰',
    category: 'page',
    keywords: ['moliya', 'pul', 'hisob', 'salary', 'oylik']
  },
  {
    id: 'page-clearinghouse',
    label: 'Clearinghouse',
    description: 'Clearinghouse so\'rovlari',
    path: '/clearinghouse',
    icon: '🏛️',
    category: 'page',
    keywords: ['clearinghouse', 'fmcsa', 'dot', 'tekshiruv']
  },
  {
    id: 'page-drug-tests',
    label: 'Drug & Alcohol Tests',
    description: 'Dori va alkogol testlari',
    path: '/drug-tests',
    icon: '🧪',
    category: 'page',
    keywords: ['test', 'dori', 'alkogol', 'narkologik', 'screening']
  },
  {
    id: 'page-notifications',
    label: 'Notifications',
    description: 'Bildirishnomalar',
    path: '/notifications',
    icon: '🔔',
    category: 'page',
    keywords: ['bildirishnoma', 'xabar', 'alert', 'ogohlantirish']
  },
  {
    id: 'page-system-settings',
    label: 'System Settings',
    description: 'Tizim sozlamalari',
    path: '/settings',
    icon: '⚙️',
    category: 'page',
    keywords: ['sozlama', 'setting', 'konfiguratsiya', 'tizim']
  },
  {
    id: 'page-theme-management',
    label: 'Theme Management',
    description: 'Mavzu boshqaruvi',
    path: '/settings/themes',
    icon: '🎨',
    category: 'page',
    keywords: ['mavzu', 'theme', 'dizayn', 'rang', 'ko\'rinish']
  },
  {
    id: 'page-ui-showcase',
    label: 'UI Showcase',
    description: 'UI komponentlar ko\'rgazmasi',
    path: '/ui-showcase',
    icon: '🖼️',
    category: 'page',
    keywords: ['ui', 'komponent', 'showcase', 'demo']
  },
  {
    id: 'page-languages',
    label: 'Languages Management',
    description: 'Tillar boshqaruvi',
    path: '/admin/language/languages',
    icon: '🌐',
    category: 'page',
    keywords: ['til', 'language', 'tarjima', 'multilanguage']
  },
  {
    id: 'page-translate',
    label: 'Translate Words',
    description: 'So\'zlarni tarjima qilish',
    path: '/admin/language/translate',
    icon: '📝',
    category: 'page',
    keywords: ['tarjima', 'translate', 'so\'z', 'kalit']
  },
]

/**
 * Tabs - Sahifa ichidagi tablar
 */
export const tabItems: SearchItem[] = [
  {
    id: 'tab-workforce-employees',
    label: 'Workforce → Employees',
    description: 'Xodimlar ro\'yxati',
    path: '/employees',
    query: { tab: 'employees' },
    icon: '👤',
    category: 'tab',
    keywords: ['xodim', 'employee', 'ro\'yxat', 'ishchi']
  },
  {
    id: 'tab-workforce-documents',
    label: 'Workforce → Documents',
    description: 'Xodim hujjatlarini boshqarish',
    path: '/employees',
    query: { tab: 'documents' },
    icon: '📄',
    category: 'tab',
    keywords: ['hujjat', 'document', 'fayl', 'papka']
  },
  {
    id: 'tab-workforce-drug-tests',
    label: 'Workforce → Drug Tests',
    description: 'Xodimlarning dori testlari',
    path: '/employees',
    query: { tab: 'drug-tests' },
    icon: '🧪',
    category: 'tab',
    keywords: ['test', 'dori', 'narkologik', 'screening']
  },
  {
    id: 'tab-clearinghouse-requests',
    label: 'Clearinghouse → Requests',
    description: 'Clearinghouse so\'rovlari',
    path: '/clearinghouse',
    query: { tab: 'requests' },
    icon: '📋',
    category: 'tab',
    keywords: ['so\'rov', 'request', 'query', 'tekshiruv']
  },
  {
    id: 'tab-clearinghouse-history',
    label: 'Clearinghouse → History',
    description: 'Clearinghouse tarixi',
    path: '/clearinghouse',
    query: { tab: 'history' },
    icon: '📜',
    category: 'tab',
    keywords: ['tarix', 'history', 'arxiv', 'old']
  },
  {
    id: 'tab-finance-invoices',
    label: 'Finance → Invoices',
    description: 'Hisob-fakturalar',
    path: '/payroll',
    query: { tab: 'invoices' },
    icon: '🧾',
    category: 'tab',
    keywords: ['hisob', 'faktura', 'invoice', 'to\'lov']
  },
  {
    id: 'tab-finance-reports',
    label: 'Finance → Reports',
    description: 'Moliyaviy hisobotlar',
    path: '/payroll',
    query: { tab: 'reports' },
    icon: '📊',
    category: 'tab',
    keywords: ['hisobot', 'report', 'statistika', 'tahlil']
  },
]

/**
 * Actions - Tezkor amallar
 */
export const actionItems: SearchItem[] = [
  {
    id: 'action-add-employee',
    label: 'Add New Employee',
    description: 'Yangi xodim qo\'shish',
    path: '/employees',
    query: { action: 'create' },
    icon: '➕',
    category: 'action',
    keywords: ['qo\'shish', 'add', 'yangi', 'yaratish', 'create']
  },
  {
    id: 'action-run-clearinghouse',
    label: 'Run Clearinghouse Query',
    description: 'FMCSA Clearinghouse tekshiruvi',
    path: '/clearinghouse',
    query: { action: 'query' },
    icon: '🔍',
    category: 'action',
    keywords: ['tekshiruv', 'query', 'fmcsa', 'dot']
  },
  {
    id: 'action-schedule-drug-test',
    label: 'Schedule Drug Test',
    description: 'Dori testi uchun yozilish',
    path: '/drug-tests',
    query: { action: 'schedule' },
    icon: '📅',
    category: 'action',
    keywords: ['jadval', 'schedule', 'yozilish', 'test']
  },
  {
    id: 'action-export-table',
    label: 'Export Table Data',
    description: 'Jadval ma\'lumotlarini eksport qilish',
    icon: '📤',
    category: 'action',
    keywords: ['eksport', 'export', 'yuklab olish', 'download', 'csv', 'excel']
  },
  {
    id: 'action-toggle-dark-mode',
    label: 'Toggle Dark Mode',
    description: 'Tun/kun rejimini o\'zgartirish',
    icon: '🌙',
    category: 'action',
    keywords: ['dark', 'tun', 'kecha', 'rejim', 'theme', 'mavzu']
  },
  {
    id: 'action-change-language',
    label: 'Change Language',
    description: 'Tilni o\'zgartirish',
    icon: '🌐',
    category: 'action',
    keywords: ['til', 'language', 'uz', 'ru', 'en', 'o\'zbek', 'русский', 'english']
  },
  {
    id: 'action-refresh-page',
    label: 'Refresh Page',
    description: 'Sahifani yangilash',
    icon: '🔄',
    category: 'action',
    keywords: ['yangilash', 'refresh', 'reload', 'yangilash']
  },
  {
    id: 'action-go-top',
    label: 'Scroll to Top',
    description: 'Sahifa boshiga qaytish',
    icon: '⬆️',
    category: 'action',
    keywords: ['tepaga', 'boshiga', 'top', 'yukoriga']
  },
]

/**
 * Barcha search itemlarni birlashtirish
 */
export const allSearchItems: SearchItem[] = [
  ...pageItems,
  ...tabItems,
  ...actionItems,
]

/**
 * Category bo'yicha itemlarni olish
 */
export function getItemsByCategory(category: SearchItem['category']): SearchItem[] {
  return allSearchItems.filter(item => item.category === category)
}

/**
 * ID bo'yicha item topish
 */
export function getItemById(id: string): SearchItem | undefined {
  return allSearchItems.find(item => item.id === id)
}