<template>
  <div class="home-view">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">HRM System</h1>
        <p class="hero-subtitle">Enterprise-grade Human Resource Management Platform</p>
        
        <div class="hero-actions">
          <router-link to="/dashboard" class="btn btn-primary">
            View Dashboard
          </router-link>
          <router-link to="/employees" class="btn btn-secondary">
            Manage Employees
          </router-link>
        </div>
      </div>
      
      <div class="hero-image">
        <div class="platform-preview">
          <div class="preview-card">
            <div class="preview-header">
              <div class="status-indicator"></div>
              <span>HRM Platform</span>
            </div>
            <div class="preview-content">
              <div class="module-preview">
                <div class="module-icon">👥</div>
                <div class="module-info">
                  <h4>Employee Management</h4>
                  <p>Comprehensive employee records and profiles</p>
                </div>
              </div>
              <div class="module-preview">
                <div class="module-icon">⏰</div>
                <div class="module-info">
                  <h4>Attendance Tracking</h4>
                  <p>Real-time attendance and time management</p>
                </div>
              </div>
              <div class="module-preview">
                <div class="module-icon">💰</div>
                <div class="module-info">
                  <h4>Payroll Processing</h4>
                  <p>Automated salary and benefits management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section">
      <h2 class="section-title">Core Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3>Employee Management</h3>
          <p>Complete employee lifecycle management from onboarding to offboarding</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">⏰</div>
          <h3>Attendance & Time</h3>
          <p>Advanced time tracking with biometric and mobile app integration</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">💰</div>
          <h3>Payroll & Benefits</h3>
          <p>Automated payroll processing with tax compliance and benefits management</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📅</div>
          <h3>Leave Management</h3>
          <p>Streamlined leave requests and approval workflows</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Performance Tracking</h3>
          <p>Goal setting, reviews, and performance analytics</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🤖</div>
          <h3>AI Assistant</h3>
          <p>Intelligent chatbot for HR support and employee assistance</p>
        </div>
      </div>
    </div>

    <div class="architecture-section">
      <h2 class="section-title">Technology Stack</h2>
      <div class="architecture-grid">
        <div class="arch-item">
          <h3>Frontend</h3>
          <ul>
            <li>Vue 3 with Composition API</li>
            <li>TypeScript for type safety</li>
            <li>Pure CSS with responsive design</li>
            <li>Pinia for state management</li>
          </ul>
        </div>
        
        <div class="arch-item">
          <h3>Architecture</h3>
          <ul>
            <li>Feature-based folder structure</li>
            <li>Clean separation of concerns</li>
            <li>Modular route system</li>
            <li>Shared utilities and types</li>
          </ul>
        </div>
        
        <div class="arch-item">
          <h3>API & Services</h3>
          <ul>
            <li>RESTful API integration</li>
            <li>Authentication ready</li>
            <li>WebSocket support for real-time</li>
            <li>Comprehensive error handling</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home view component
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 40px;
  max-width: 1200px;
  margin: 0 auto;
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

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.btn-secondary:hover {
  background: white;
  color: #667eea;
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
  position: relative;
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
  background: #eff6ff;
  border-radius: 8px;
  color: #3b82f6;
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
  background: white;
  color: #333;
}

.section-title {
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 48px;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: #f8fafc;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s ease;
  border: 1px solid #e2e8f0;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #1e293b;
}

.feature-card p {
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
  margin: 0;
}

.architecture-section {
  padding: 80px 40px;
  background: #1e293b;
  color: white;
}

.architecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.arch-item {
  background: #334155;
  padding: 32px;
  border-radius: 12px;
  border: 1px solid #475569;
}

.arch-item h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #f1f5f9;
}

.arch-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.arch-item li {
  padding: 8px 0;
  border-bottom: 1px solid #475569;
  font-size: 14px;
  color: #cbd5e1;
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