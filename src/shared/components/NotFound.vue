<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">Page Not Found</h1>
      <p class="error-message">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div class="error-actions">
        <router-link to="/" class="btn btn-primary">
          Go Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 error page component
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  text-align: center;
}

.not-found-content {
  max-width: 600px;
  padding: 40px;
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  opacity: 0.8;
  margin-bottom: 16px;
  color: var(--text-secondary);
}

.error-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.error-message {
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 32px 0;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-normal);
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Responsive design */
@media (max-width: 768px) {
  .error-code {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 28px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>