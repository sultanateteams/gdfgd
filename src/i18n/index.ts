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
      },
      home: {
        title: 'HRM Tizim',
        subtitle: 'Korporativ Inson Resurslari Boshqaruv Platformasi',
        viewDashboard: 'Boshqaruv Panelini Ko\'rish',
        manageEmployees: 'Xodimlarni Boshqarish',
        hrmPlatform: 'HRM Platformasi',
        modules: {
          employeeManagement: 'Xodimlarni Boshqarish',
          employeeManagementDesc: 'Xodimlarning to\'liq ma\'lumotlari va profillari',
          attendanceTracking: 'Qatnovni Kuzatish',
          attendanceTrackingDesc: 'Haqiqiy vaqt rejimida qatnov va vaqt boshqaruvi',
          payrollProcessing: 'Ish Haqi Hisobi',
          payrollProcessingDesc: 'Avtomatlashtirilgan oylik va imtiyozlar boshqaruvi'
        },
        features: {
          title: 'Asosiy Imkoniyatlar',
          employeeManagement: 'Xodimlarni Boshqarish',
          employeeManagementDesc: 'Ishga qabul qilishdan ishdan bo\'shatishgacha bo\'lgan to\'liq xodim hayotiy sikli boshqaruvi',
          attendanceTime: 'Qatnov va Vaqt',
          attendanceTimeDesc: 'Biometrik va mobil ilova integratsiyasi bilan rivojlangan vaqt kuzatuvi',
          payrollBenefits: 'Ish Haqi va Imtiyozlar',
          payrollBenefitsDesc: 'Soliq mosligi va imtiyozlar boshqaruvi bilan avtomatik ish haqi hisobi',
          leaveManagement: 'Ta\'til Boshqaruvi',
          leaveManagementDesc: 'Soddalashtirilgan ta\'til so\'rovlari va tasdiqlash jarayonlari',
          performanceTracking: 'Samaradorlikni Kuzatish',
          performanceTrackingDesc: 'Maqsad qo\'yish, baholash va samaradorlik tahlili',
          aiAssistant: 'AI Yordamchi',
          aiAssistantDesc: 'HR qo\'llab-quvvatlash va xodimlarga yordam uchun aqlli chatbot'
        },
        techStack: {
          title: 'Texnologik Stek',
          frontend: 'Frontend',
          frontendItems: {
            vue3: 'Vue 3 Composition API bilan',
            typescript: 'Tip xavfsizligi uchun TypeScript',
            css: 'Responsive dizayn bilan Pure CSS',
            pinia: 'Holat boshqaruvi uchun Pinia'
          },
          architecture: 'Arxitektura',
          architectureItems: {
            featureBased: 'Feature-asosidagi papka tuzilishi',
            separation: 'Muammolarning aniq ajratilishi',
            modular: 'Modular marshrut tizimi',
            shared: 'Umumiy utilitalar va tiplar'
          },
          api: 'API va Xizmatlar',
          apiItems: {
            restful: 'RESTful API integratsiyasi',
            auth: 'Autentifikatsiya tayyor',
            websocket: 'Haqiqiy vaqt uchun WebSocket qo\'llab-quvvatlash',
            errorHandling: 'Keng qamrovli xatolarni boshqarish'
          }
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
      },
      home: {
        title: 'HRM System',
        subtitle: 'Enterprise-grade Human Resource Management Platform',
        viewDashboard: 'View Dashboard',
        manageEmployees: 'Manage Employees',
        hrmPlatform: 'HRM Platform',
        modules: {
          employeeManagement: 'Employee Management',
          employeeManagementDesc: 'Comprehensive employee records and profiles',
          attendanceTracking: 'Attendance Tracking',
          attendanceTrackingDesc: 'Real-time attendance and time management',
          payrollProcessing: 'Payroll Processing',
          payrollProcessingDesc: 'Automated salary and benefits management'
        },
        features: {
          title: 'Core Features',
          employeeManagement: 'Employee Management',
          employeeManagementDesc: 'Complete employee lifecycle management from onboarding to offboarding',
          attendanceTime: 'Attendance & Time',
          attendanceTimeDesc: 'Advanced time tracking with biometric and mobile app integration',
          payrollBenefits: 'Payroll & Benefits',
          payrollBenefitsDesc: 'Automated payroll processing with tax compliance and benefits management',
          leaveManagement: 'Leave Management',
          leaveManagementDesc: 'Streamlined leave requests and approval workflows',
          performanceTracking: 'Performance Tracking',
          performanceTrackingDesc: 'Goal setting, reviews, and performance analytics',
          aiAssistant: 'AI Assistant',
          aiAssistantDesc: 'Intelligent chatbot for HR support and employee assistance'
        },
        techStack: {
          title: 'Technology Stack',
          frontend: 'Frontend',
          frontendItems: {
            vue3: 'Vue 3 with Composition API',
            typescript: 'TypeScript for type safety',
            css: 'Pure CSS with responsive design',
            pinia: 'Pinia for state management'
          },
          architecture: 'Architecture',
          architectureItems: {
            featureBased: 'Feature-based folder structure',
            separation: 'Clean separation of concerns',
            modular: 'Modular route system',
            shared: 'Shared utilities and types'
          },
          api: 'API & Services',
          apiItems: {
            restful: 'RESTful API integration',
            auth: 'Authentication ready',
            websocket: 'WebSocket support for real-time',
            errorHandling: 'Comprehensive error handling'
          }
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
      },
      home: {
        title: 'HRM Система',
        subtitle: 'Корпоративная платформа управления человеческими ресурсами',
        viewDashboard: 'Просмотр панели управления',
        manageEmployees: 'Управление сотрудниками',
        hrmPlatform: 'HRM Платформа',
        modules: {
          employeeManagement: 'Управление сотрудниками',
          employeeManagementDesc: 'Полные записи и профили сотрудников',
          attendanceTracking: 'Отслеживание посещаемости',
          attendanceTrackingDesc: 'Учёт посещаемости и времени в реальном времени',
          payrollProcessing: 'Обработка зарплаты',
          payrollProcessingDesc: 'Автоматизированное управление зарплатой и льготами'
        },
        features: {
          title: 'Основные возможности',
          employeeManagement: 'Управление сотрудниками',
          employeeManagementDesc: 'Полное управление жизненным циклом сотрудника от приёма на работу до увольнения',
          attendanceTime: 'Посещаемость и время',
          attendanceTimeDesc: 'Продвинутое отслеживание времени с биометрической и мобильной интеграцией',
          payrollBenefits: 'Зарплата и льготы',
          payrollBenefitsDesc: 'Автоматическая обработка зарплаты с соблюдением налогов и управлением льготами',
          leaveManagement: 'Управление отпусками',
          leaveManagementDesc: 'Упрощённые запросы на отпуск и рабочие процессы утверждения',
          performanceTracking: 'Отслеживание производительности',
          performanceTrackingDesc: 'Постановка целей, обзоры и аналитика производительности',
          aiAssistant: 'AI Ассистент',
          aiAssistantDesc: 'Интеллектуальный чат-бот для HR поддержки и помощи сотрудникам'
        },
        techStack: {
          title: 'Технологический стек',
          frontend: 'Frontend',
          frontendItems: {
            vue3: 'Vue 3 с Composition API',
            typescript: 'TypeScript для типобезопасности',
            css: 'Pure CSS с адаптивным дизайном',
            pinia: 'Pinia для управления состоянием'
          },
          architecture: 'Архитектура',
          architectureItems: {
            featureBased: 'Структура папок на основе функций',
            separation: 'Чёткое разделение ответственности',
            modular: 'Модульная система маршрутов',
            shared: 'Общие утилиты и типы'
          },
          api: 'API и сервисы',
          apiItems: {
            restful: 'Интеграция RESTful API',
            auth: 'Готовая аутентификация',
            websocket: 'Поддержка WebSocket для реального времени',
            errorHandling: 'Комплексная обработка ошибок'
          }
        }
      }
    }
  }
})

export default i18n
