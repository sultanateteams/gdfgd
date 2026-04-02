<!-- ═══════════════════════════════════════════════════════════
     LOGIN VIEW
     To'liq login sahifasi - validatsiya, loading, error handling
     ═══════════════════════════════════════════════════════════ -->

<template>
  <div class="min-h-screen flex items-center justify-center bg-[var(--body-bg)] px-4 py-12">
    <div class="w-full max-w-[400px]">
      <!-- Login Card -->
      <div class="bg-[var(--card-bg)] rounded-2xl shadow-lg p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent-primary)]/10 mb-4">
            <svg
              class="w-8 h-8 text-[var(--accent-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-[var(--text-primary)] mb-1">HRM System</h1>
          <p class="text-sm text-[var(--text-secondary)]">Tizimga kirish</p>
        </div>

        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-6">
          <AppAlert
            type="error"
            :message="errorMessage"
            :closable="true"
            @close="errorMessage = null"
          />
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Email manzil
            </label>
            <AppInput
              id="email"
              v-model="form.email"
              type="email"
              placeholder="email@example.com"
              :class="{ 'border-red-500': errors.email }"
              @blur="validateEmail"
            />
            <p v-if="errors.email" class="mt-1.5 text-sm text-red-500">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Parol
            </label>
            <AppPasswordInput
              id="password"
              v-model="form.password"
              placeholder="••••••••"
              :class="{ 'border-red-500': errors.password }"
              @blur="validatePassword"
            />
            <p v-if="errors.password" class="mt-1.5 text-sm text-red-500">
              {{ errors.password }}
            </p>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="form.rememberMe"
                class="w-4 h-4 rounded border-[var(--border-color)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
              />
              <span class="text-sm text-[var(--text-secondary)]">Eslab qolish</span>
            </label>
            <router-link
              to="/forgot-password"
              class="text-sm text-[var(--accent-primary)] hover:underline"
            >
              Parolni unutdingizmi?
            </router-link>
          </div>

          <!-- Submit Button -->
          <AppButton
            html-type="submit"
            type="primary"
            size="lg"
            :loading="isLoading"
            :disabled="isLoading"
            class="w-full"
          >
            <span v-if="!isLoading">Kirish</span>
            <span v-else>Kirilmoqda...</span>
          </AppButton>
        </form>

        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-[var(--text-secondary)]">
            Hisobingiz yo'qmi?
            <router-link
              to="/register"
              class="text-[var(--accent-primary)] font-medium hover:underline"
            >
              Ro'yxatdan o'tish
            </router-link>
          </p>
        </div>

        <!-- Dev Mode: Mock Credentials -->
        <div
          v-if="import.meta.env.DEV"
          class="mt-6 pt-6 border-t border-[var(--border-color)]"
        >
          <details class="group">
            <summary class="flex items-center justify-between text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)]">
              <span>Mock credentials (dev only)</span>
              <svg
                class="w-4 h-4 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="mt-3 space-y-2 text-xs font-mono">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">Admin</span>
                <span class="text-[var(--text-secondary)]">admin@hrm.uz</span>
                <span class="text-[var(--text-muted)]">/</span>
                <span class="text-[var(--text-secondary)]">admin123</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-[var(--accent-info)]/10 text-[var(--accent-info)]">HR</span>
                <span class="text-[var(--text-secondary)]">hr@hrm.uz</span>
                <span class="text-[var(--text-muted)]">/</span>
                <span class="text-[var(--text-secondary)]">hr123</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-[var(--accent-success)]/10 text-[var(--accent-success)]">Employee</span>
                <span class="text-[var(--text-secondary)]">employee@hrm.uz</span>
                <span class="text-[var(--text-muted)]">/</span>
                <span class="text-[var(--text-secondary)]">emp123</span>
              </div>
            </div>
          </details>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-xs text-[var(--text-muted)] mt-6">
        © {{ new Date().getFullYear() }} HRM System. Barcha huquqlar himoyalangan.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/modules/auth/services'
import AppInput from '@/shared/components/ui/AppInput.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppAlert from '@/shared/components/ui/AppAlert.vue'

// AppPasswordInput ni AppInput dan import qilamiz (agar alohida komponent bo'lmasa)
const AppPasswordInput = AppInput

const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

// Validation errors
const errors = reactive<Record<string, string>>({
  email: '',
  password: ''
})

// UI state
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

// ═══════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(): boolean {
  if (!form.email.trim()) {
    errors.email = 'Email kiritilishi shart'
    return false
  }
  if (!emailRegex.test(form.email)) {
    errors.email = "To'g'ri email kiriting"
    return false
  }
  errors.email = ''
  return true
}

function validatePassword(): boolean {
  if (!form.password) {
    errors.password = 'Parol kiritilishi shart'
    return false
  }
  if (form.password.length < 6) {
    errors.password = 'Parol kamida 6 belgi bo\'lishi kerak'
    return false
  }
  errors.password = ''
  return true
}

function validateForm(): boolean {
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  return isEmailValid && isPasswordValid
}

// ═══════════════════════════════════════════════════════════
// SUBMIT HANDLER
// ═══════════════════════════════════════════════════════════

async function handleSubmit() {
  // Clear previous errors
  errorMessage.value = null

  // Validate form
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    // Call auth service
    const response = await authService.login({
      email: form.email,
      password: form.password,
      rememberMe: form.rememberMe
    })

    // Update auth store
    authStore.setTokens(response.accessToken, response.refreshToken)
    authStore.setUser(response.user)

    // Redirect to dashboard
    router.push('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Kirishda xatolik yuz berdi'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Additional styles if needed */
details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}
</style>