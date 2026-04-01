<template>
  <AppModal
    :open="store.isModalOpen"
    :title="'Edit Translation'"
    :width="520"
    :closable="true"
    :mask-closable="true"
    :confirm-loading="saving"
    :ok-text="saving ? 'Saving...' : 'Save'"
    cancel-text="Cancel"
    :show-ok-btn="false"
    @cancel="store.closeModal()"
  >
    <!-- Header with key badge -->
    <div class="translation-modal-header">
      <code class="translation-key-badge">{{ store.activeKey }}</code>
    </div>

    <!-- Default text display -->
    <div v-if="store.activeDefaultText" class="translation-default-section">
      <span class="translation-default-label">Default Text:</span>
      <span class="translation-default-value">{{ store.activeDefaultText }}</span>
    </div>

    <!-- Language fields -->
    <div class="translation-fields">
      <div v-for="lang in languagesStore.languages" :key="lang.code" class="translation-field">
        <div class="translation-field-header">
          <span class="translation-field-flag">{{ lang.flag }}</span>
          <span class="translation-field-name">{{ lang.name }}</span>
          <span class="translation-field-code">{{ lang.code }}</span>
        </div>
        <AppTextArea
          :model-value="values[lang.code] ?? ''"
          :placeholder="lang.name + ' translation'"
          :rows="2"
          size="sm"
          @update:model-value="(val) => values[lang.code] = val"
        />
      </div>
    </div>

    <!-- Footer with buttons -->
    <template #footer>
      <div class="translation-modal-footer">
        <!-- Copy for AI button -->
        <AppButton
          type="secondary"
          size="sm"
          @click="copyForAI"
          :disabled="saving"
          :title="'Nusxalash'"
        >
          <template #icon>
            <svg v-if="!copied" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
            </svg>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </template>
          {{ copied ? 'Nusxalandi!' : 'Nusxalash' }}
        </AppButton>

        <div class="translation-footer-actions">
          <AppButton type="secondary" size="sm" @click="store.closeModal()">
            Cancel
          </AppButton>
          <AppButton
            type="primary"
            size="sm"
            @click="submit"
            :loading="saving"
            :disabled="saving"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </AppButton>
        </div>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useTranslationEditorStore } from '@/stores/translationEditor'
import { useLanguagesStore } from '@/stores/languages'
import { apiService } from '@/services/api'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppTextArea from '@/shared/components/ui/AppTextArea.vue'

const store = useTranslationEditorStore()
const languagesStore = useLanguagesStore()
const { languages } = storeToRefs(languagesStore)

const { getLocaleMessage, setLocaleMessage } = useI18n({ useScope: 'global' })

const values = reactive<Record<string, string>>({})
const saving = ref(false)
const copied = ref(false)

// Pre-fill inputs when modal opens
watch(
  () => store.activeKey,
  (key) => {
    if (!key) return

    // Clear previous values
    for (const code in values) {
      delete values[code]
    }

    // Fill values for all languages in the store
    for (const lang of languages.value) {
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

  for (const lang of languages.value) {
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
    for (const lang of languages.value) {
      const newValue = values[lang.code] ?? ''

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
.translation-modal-header {
  margin-bottom: 12px;
}

.translation-key-badge {
  background: var(--code-bg);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-family: monospace;
  word-break: break-all;
  display: inline-block;
}

.translation-default-section {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  background: var(--body-bg);
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
}

.translation-default-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  padding-top: 2px;
}

.translation-default-value {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-style: italic;
  word-break: break-word;
}

.translation-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.translation-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.translation-field-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.translation-field-flag {
  font-size: 1.125rem;
}

.translation-field-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.translation-field-code {
  background: var(--code-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.6875rem;
  color: var(--text-secondary);
  font-family: monospace;
}

.translation-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
}

.translation-footer-actions {
  display: flex;
  gap: 8px;
}
</style>