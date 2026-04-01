<template>
  <div class="home-view">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">{{ l("HRM System", "home.title") }}</h1>
        <p class="hero-subtitle">
          {{ l("Enterprise-grade Human Resource Management Platform", "home.subtitle") }}
        </p>

        <div class="hero-actions">
          <AppButton type="primary" size="lg" as="router-link" to="/dashboard">
            {{ l("View Dashboard", "home.viewDashboard") }}
          </AppButton>
          <AppButton type="secondary" size="lg" as="router-link" to="/employees">
            {{ l("Manage Employees", "home.manageEmployees") }}
          </AppButton>
        </div>
      </div>

      <div class="hero-image">
        <div class="platform-preview">
          <div class="preview-card">
            <div class="preview-header">
              <div class="status-indicator"></div>
              <span>{{ l("HRM Platform", "home.hrmPlatform") }}</span>
            </div>
            <div class="preview-content">
              <div v-for="module in platformModules" :key="module.icon" class="module-preview">
                <div class="module-icon">{{ module.icon }}</div>
                <div class="module-info">
                  <h4>{{ module.title }}</h4>
                  <p>{{ module.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section">
      <h2 class="section-title" style="color: var(--text-primary);">
        {{ l("Core Features", "home.features.title") }}
      </h2>
      <div class="features-grid">
        <AppCard v-for="feature in features" :key="feature.icon" class="feature-card">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3 style="color: var(--text-primary);">{{ feature.title }}</h3>
          <p style="color: var(--text-secondary);">{{ feature.description }}</p>
        </AppCard>
      </div>
    </div>

    <div class="architecture-section">
      <h2 class="section-title" style="color: var(--text-primary);">
        {{ l("Technology Stack", "home.techStack.title") }}
      </h2>
      <div class="architecture-grid">
        <AppCard v-for="arch in architecture" :key="arch.title">
          <h3 style="color: var(--text-primary);">{{ arch.title }}</h3>
          <ul>
            <li v-for="item in arch.items" :key="item" style="color: var(--text-secondary);">
              {{ item }}
            </li>
          </ul>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useT } from '@/composables/useT'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppCard from '@/shared/components/ui/AppCard.vue'

const { l } = useT()

const platformModules = computed(() => [
  {
    icon: '👥',
    title: l('Employee Management', 'home.modules.employeeManagement'),
    description: l('Comprehensive employee records and profiles', 'home.modules.employeeManagementDesc'),
  },
  {
    icon: '⏰',
    title: l('Attendance Tracking', 'home.modules.attendanceTracking'),
    description: l('Real-time attendance and time management', 'home.modules.attendanceTrackingDesc'),
  },
  {
    icon: '💰',
    title: l('Payroll Processing', 'home.modules.payrollProcessing'),
    description: l('Automated salary and benefits management', 'home.modules.payrollProcessingDesc'),
  },
])

const features = computed(() => [
  {
    icon: '👥',
    title: l('Employee Management', 'home.features.employeeManagement'),
    description: l('Complete employee lifecycle management from onboarding to offboarding', 'home.features.employeeManagementDesc'),
  },
  {
    icon: '⏰',
    title: l('Attendance & Time', 'home.features.attendanceTime'),
    description: l('Advanced time tracking with biometric and mobile app integration', 'home.features.attendanceTimeDesc'),
  },
  {
    icon: '💰',
    title: l('Payroll & Benefits', 'home.features.payrollBenefits'),
    description: l('Automated payroll processing with tax compliance and benefits management', 'home.features.payrollBenefitsDesc'),
  },
  {
    icon: '📅',
    title: l('Leave Management', 'home.features.leaveManagement'),
    description: l('Streamlined leave requests and approval workflows', 'home.features.leaveManagementDesc'),
  },
  {
    icon: '📊',
    title: l('Performance Tracking', 'home.features.performanceTracking'),
    description: l('Goal setting, reviews, and performance analytics', 'home.features.performanceTrackingDesc'),
  },
  {
    icon: '🤖',
    title: l('AI Assistant', 'home.features.aiAssistant'),
    description: l('Intelligent chatbot for HR support and employee assistance', 'home.features.aiAssistantDesc'),
  },
])

const architecture = computed(() => [
  {
    title: l('Frontend', 'home.techStack.frontend'),
    items: [
      l('Vue 3 with Composition API', 'home.techStack.frontendItems.vue3'),
      l('TypeScript for type safety', 'home.techStack.frontendItems.typescript'),
      l('Pure CSS with responsive design', 'home.techStack.frontendItems.css'),
      l('Pinia for state management', 'home.techStack.frontendItems.pinia'),
    ],
  },
  {
    title: l('Architecture', 'home.techStack.architecture'),
    items: [
      l('Feature-based folder structure', 'home.techStack.architectureItems.featureBased'),
      l('Clean separation of concerns', 'home.techStack.architectureItems.separation'),
      l('Modular route system', 'home.techStack.architectureItems.modular'),
      l('Shared utilities and types', 'home.techStack.architectureItems.shared'),
    ],
  },
  {
    title: l('API & Services', 'home.techStack.api'),
    items: [
      l('RESTful API integration', 'home.techStack.apiItems.restful'),
      l('Authentication ready', 'home.techStack.apiItems.auth'),
      l('WebSocket support for real-time', 'home.techStack.apiItems.websocket'),
      l('Comprehensive error handling', 'home.techStack.apiItems.errorHandling'),
    ],
  },
])
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 40px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: 0 0 24px 24px;
  color: #fff;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 18px;
  line-height: 1.6;
  margin: 0 0 32px 0;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.platform-preview {
  width: 400px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.module-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: transform 0.2s;
}

.module-preview:hover {
  transform: translateX(4px);
}

.module-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light, #eff6ff);
  border-radius: 8px;
  color: var(--primary);
}

.module-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.module-info p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.features-section {
  padding: 80px 40px;
  background: var(--card-bg);
}

.section-title {
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 48px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.feature-card p {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.architecture-section {
  padding: 80px 40px;
  background: var(--body-bg);
}

.architecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.arch-item h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.arch-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.arch-item li {
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 14px;
}

.arch-item li:last-child {
  border-bottom: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-actions {
    justify-content: center;
  }

  .features-grid,
  .architecture-grid {
    grid-template-columns: 1fr;
  }

  .platform-preview {
    width: 100%;
    height: 250px;
  }
}
</style>