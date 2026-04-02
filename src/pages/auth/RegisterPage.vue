<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">HRM System</h1>
          <p class="auth-subtitle">Hisob yaratish</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">Ism</label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                class="form-input"
                placeholder="Ism"
                required
              />
            </div>

            <div class="form-group">
              <label for="lastName" class="form-label">Familiya</label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                class="form-input"
                placeholder="Familiya"
                required
              />
            </div>
          </div>

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

          <div class="form-group">
            <label for="password" class="form-label">Parol</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="form-input"
              placeholder="••••••••"
              required
              minlength="8"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Parolni tasdiqlang</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              class="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="btn-primary" :disabled="isLoading">
            <span v-if="isLoading">Yuklanmoqda...</span>
            <span v-else>Ro'yxatdan o'tish</span>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const error = ref<string | null>(null)

const handleRegister = async () => {
  error.value = null

  // Validation
  if (form.password !== form.confirmPassword) {
    error.value = 'Parollar mos kelmaydi'
    return
  }

  if (form.password.length < 8) {
    error.value = 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak'
    return
  }

  isLoading.value = true

  try {
    // TODO: Implement registration API call
    // For now, just redirect to login
    console.log('Register attempt:', { 
      firstName: form.firstName, 
      lastName: form.lastName, 
      email: form.email 
    })
    
    // Mock success - redirect to login
    router.push('/login')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ro\'yxatdan o\'tishda xatolik yuz berdi'
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
  max-width: 480px;
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

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>