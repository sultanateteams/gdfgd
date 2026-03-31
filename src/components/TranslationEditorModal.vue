<template>
  <div v-if="store.isModalOpen" class="t-modal-overlay" @click.self="store.closeModal()">
    <div class="t-modal">
      <div class="t-modal-header">
        <h3>Edit Translation</h3>
        <code class="t-modal-key">{{ store.activeKey }}</code>
        <button class="t-modal-close" @click="store.closeModal()" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div v-if="store.activeDefaultText" class="t-modal-default">
        <span class="t-default-label">Default Text:</span>
        <span class="t-default-value">{{ store.activeDefaultText }}</span>
      </div>

      <div class="t-modal-body">
        <div v-for="lang in languages" :key="lang.code" class="t-field">
          <label class="t-field-label">
            <span class="t-field-flag">{{ lang.flag }}</span>
            <span class="t-field-name">{{ lang.name }}</span>
            <span class="t-field-code">{{ lang.code }}</span>
          </label>
          <textarea
            v-model="values[lang.code]"
            class="t-field-input"
            :placeholder="lang.name + ' translation'"
            rows="2"
          />
        </div>
      </div>

      <div v-if="saving" class="t-saving-indicator">
        <span class="t-saving-spinner"></span>
        Saving...
      </div>

      <div class="t-modal-footer">
        <!-- Copy for AI — chap tomonda -->
        <button class="t-btn t-btn-copy" @click="copyForAI" :disabled="saving" title="Nusxalash">
          <svg v-if="!copied" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
          </svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {{ copied ? 'Nusxalandi!' : 'Nusxalash' }}
        </button>

        <div class="t-footer-right">
          <button class="t-btn t-btn-secondary" @click="store.closeModal()">
            Cancel
          </button>
          <button class="t-btn t-btn-primary" @click="submit" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTranslationEditorStore } from '@/stores/translationEditor'
import { apiService } from '@/services/api'

const store = useTranslationEditorStore()
const { getLocaleMessage, setLocaleMessage } = useI18n({ useScope: 'global' })

const languages = [
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

const values = reactive<Record<string, string>>({ uz: '', en: '', ru: '' })
const saving = ref(false)
const copied = ref(false)

// Pre-fill inputs when modal opens
watch(
  () => store.activeKey,
  (key) => {
    if (!key) return
    for (const lang of languages) {
      const messages = getLocaleMessage(lang.code) as Record<string, any>
      const parts = key.split('.')
      let val: any = messages
      for (const part of parts) {
        val = val?.[part]
      }
      values[lang.code] = typeof val === 'string' ? val : ''
    }
  },
  { immediate: true }
)

function copyForAI() {
  const payload: Record<string, string> = {
    key: store.activeKey ?? '',
    defaultText: store.activeDefaultText ?? '',
  }

  for (const lang of languages) {
    payload[lang.code] = values[lang.code] ?? ''
  }

  navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  })
}

function setNestedValue(obj: Record<string, any>, key: string, value: string) {
  const parts = key.split('.')
  let current: Record<string, any> = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]!
    if (!(part in current) || typeof current[part] !== 'object' || current[part] === null) {
      current[part] = {}
    }
    current = current[part]
  }
  const lastPart = parts[parts.length - 1]!
  current[lastPart] = value
}

async function submit() {
  const key = store.activeKey
  if (!key) return

  saving.value = true

  try {
    for (const lang of languages) {
      const newValue = values[lang.code]!

      const messages = JSON.parse(JSON.stringify(getLocaleMessage(lang.code)))
      setNestedValue(messages, key, newValue)
      setLocaleMessage(lang.code, messages)

      try {
        await apiService.post('/translations/update', {
          locale: lang.code,
          key,
          value: newValue,
        })
      } catch (apiError) {
        console.warn(`Failed to save translation to API for ${lang.code}:`, apiError)
      }
    }

    store.closeModal()
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.t-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: t-fade-in 0.2s ease;
}

@keyframes t-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.t-modal {
  background: var(--bg-primary, #ffffff);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  animation: t-slide-up 0.2s ease;
}

@keyframes t-slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.t-modal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  flex-wrap: wrap;
}

.t-modal-default {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 20px;
  background: var(--bg-secondary, #f9fafb);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.t-default-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  padding-top: 2px;
}

.t-default-value {
  font-size: 0.9375rem;
  color: var(--text-primary, #1f2937);
  font-style: italic;
  word-break: break-word;
}

.t-modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

.t-modal-key {
  background: var(--bg-secondary, #f9fafb);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
  font-family: monospace;
  word-break: break-all;
}

.t-modal-close {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: var(--text-secondary, #6b7280);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.t-modal-close:hover {
  background: var(--bg-tertiary, #f3f4f6);
  color: var(--text-primary, #1f2937);
}

.t-modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  max-height: 60vh;
}

.t-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.t-field-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary, #1f2937);
}

.t-field-flag { font-size: 1.25rem; }
.t-field-name { font-weight: 600; }

.t-field-code {
  background: var(--bg-secondary, #f9fafb);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--text-secondary, #6b7280);
  font-family: monospace;
}

.t-field-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  font-size: 0.9375rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  background: var(--bg-primary, #ffffff);
  color: var(--text-primary, #1f2937);
}

.t-field-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.t-field-input::placeholder {
  color: var(--text-muted, #9ca3af);
}

.t-saving-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
}

.t-saving-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-color, #e5e7eb);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: t-spin 0.6s linear infinite;
}

@keyframes t-spin {
  to { transform: rotate(360deg); }
}

.t-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-secondary, #f9fafb);
}

.t-footer-right {
  display: flex;
  gap: 8px;
}

.t-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  font-family: inherit;
}

.t-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.t-btn-secondary {
  background: var(--bg-tertiary, #f3f4f6);
  color: var(--text-primary, #1f2937);
}

.t-btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.t-btn-primary {
  background: #3b82f6;
  color: white;
}

.t-btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.t-btn-copy {
  background: var(--bg-tertiary, #f3f4f6);
  color: var(--text-secondary, #6b7280);
  border: 1px solid var(--border-color, #e5e7eb);
}

.t-btn-copy:hover:not(:disabled) {
  background: #e5e7eb;
  color: var(--text-primary, #1f2937);
}
</style>