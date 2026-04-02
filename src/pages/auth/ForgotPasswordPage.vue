<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">HRM System</h1>
          <p class="auth-subtitle">Parolni tiklash</p>
        </div>

        <form @submit.prevent="handleForgotPassword" class="auth-form">
          <p class="form-description">
            Email manzilingizni kiriting. Biz sizga parolni tiklash bo'yicha ko'rsatmalarni yuboramiz.
          </p>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="email@example.com"
              required
            />
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div v-if="success" class="success-message">
            {{ success }}
          </div>

          <button type="submit" class="btn-primary" :disabled="isLoading">
            <span v-if="isLoading">Yuborilmoqda...</span>
            <span v-else>Parolni tiklash</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Hisobingiz bormi?
            <router-link to="/login" class="auth-link">Kirish</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const form = reactive({
  email: ''
})

const isLoading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const handleForgotPassword = async () => {
  error.value = null
  success.value = null
  isLoading.value = true

  try {
    // TODO: Implement forgot password API call
    console.log('Forgot password request:', form.email)
    
    // Mock success
    success.value = 'Parolni tiklash bo\'yicha ko\'rsatmalar email manzilingizga yuborildi.'
    form.email = ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--body-bg);
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.auth-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.form-description {
  font-size: 14px;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.5;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input {
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.btn-primary {
  padding: 14px 24px;
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  color: var(--accent-error);
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.success-message {
  padding: 12px;
  background: rgba(16, 185, 129, 0.1);
  color: var(--accent-success);
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}

.auth-link {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>