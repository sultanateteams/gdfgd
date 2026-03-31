import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'uz',
  fallbackLocale: 'en',
  messages: {
    uz: {
      dashboard: {
        title: 'Boshqaruv paneli',
        subtitle: 'HR boshqaruv tizimingizning umumiy ko\'rinishi',
        refreshData: 'Ma\'lumotlarni yangilash',
        exportReport: 'Hisobotni eksport qilish',
        metrics: {
          totalEmployees: 'Jami xodimlar',
          activeEmployees: 'Faol xodimlar',
          todayAttendance: 'Bugungi qatnov',
          payrollBudget: 'Ish haqi byudjeti'
        },
        attendance: {
          title: 'Bugungi qatnov',
          present: 'Hozir',
          absent: 'Yo\'q',
          late: 'Kechikdi',
          onLeave: 'Ta\'tilda',
          remote: 'Masofaviy'
        },
        department: {
          title: 'Bo\'limlar',
          employees: 'xodimlar',
          avgTenure: 'O\'rtacha staj',
          turnover: 'Aylanma'
        },
        payroll: {
          title: 'Ish haqi xulosasi',
          totalBudget: 'Jami byudjet',
          processed: 'Bajarilgan',
          pending: 'Kutilmoqda',
          utilization: 'Foydalanish'
        },
        leave: {
          title: 'Ta\'til xulosasi',
          totalRequests: 'Jami so\'rovlar',
          approved: 'Tasdiqlangan',
          pending: 'Kutilmoqda',
          rejected: 'Rad etilgan'
        },
        activity: {
          title: 'So\'nggi faollik'
        }
      }
    },
    en: {
      dashboard: {
        title: 'Dashboard',
        subtitle: 'Overview of your HR management system',
        refreshData: 'Refresh Data',
        exportReport: 'Export Report',
        metrics: {
          totalEmployees: 'Total Employees',
          activeEmployees: 'Active Employees',
          todayAttendance: 'Today\'s Attendance',
          payrollBudget: 'Payroll Budget'
        },
        attendance: {
          title: 'Today\'s Attendance',
          present: 'Present',
          absent: 'Absent',
          late: 'Late',
          onLeave: 'On Leave',
          remote: 'Remote'
        },
        department: {
          title: 'Department Overview',
          employees: 'employees',
          avgTenure: 'Avg Tenure',
          turnover: 'Turnover'
        },
        payroll: {
          title: 'Payroll Summary',
          totalBudget: 'Total Budget',
          processed: 'Processed',
          pending: 'Pending',
          utilization: 'Utilization'
        },
        leave: {
          title: 'Leave Summary',
          totalRequests: 'Total Requests',
          approved: 'Approved',
          pending: 'Pending',
          rejected: 'Rejected'
        },
        activity: {
          title: 'Recent Activity'
        }
      }
    },
    ru: {
      dashboard: {
        title: 'Панель управления',
        subtitle: 'Обзор вашей системы управления персоналом',
        refreshData: 'Обновить данные',
        exportReport: 'Экспорт отчета',
        metrics: {
          totalEmployees: 'Всего сотрудников',
          activeEmployees: 'Активные сотрудники',
          todayAttendance: 'Посещаемость сегодня',
          payrollBudget: 'Бюджет на зарплату'
        },
        attendance: {
          title: 'Посещаемость сегодня',
          present: 'Присутствуют',
          absent: 'Отсутствуют',
          late: 'Опоздали',
          onLeave: 'В отпуске',
          remote: 'Удаленно'
        },
        department: {
          title: 'Обзор отделов',
          employees: 'сотрудников',
          avgTenure: 'Ср. стаж',
          turnover: 'Текучесть'
        },
        payroll: {
          title: 'Сводка по зарплате',
          totalBudget: 'Общий бюджет',
          processed: 'Обработано',
          pending: 'В ожидании',
          utilization: 'Использование'
        },
        leave: {
          title: 'Сводка по отпускам',
          totalRequests: 'Всего запросов',
          approved: 'Утверждено',
          pending: 'В ожидании',
          rejected: 'Отклонено'
        },
        activity: {
          title: 'Последняя активность'
        }
      }
    }
  }
})

export default i18n
