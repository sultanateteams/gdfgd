<template>
  <div class="languages-page">
    <div class="page-header">
      <h1 class="page-title" style="color: var(--text-primary);">Languages Management</h1>
      <p class="page-subtitle" style="color: var(--text-secondary);">Manage available languages for your application</p>
    </div>

    <!-- Add Language Form -->
    <AppCard class="add-language-card">
      <h2 class="card-title" style="color: var(--text-primary);">Add New Language</h2>
      <form @submit.prevent="handleAddLanguage" class="add-language-form">
        <div class="form-row">
          <AppInput
            v-model="newLang.code"
            label="Language Code *"
            placeholder="e.g., fr"
            :maxlength="5"
            required
            @update:model-value="newLang.code = $event.toLowerCase()"
          />
          <AppInput
            v-model="newLang.name"
            label="Language Name *"
            placeholder="e.g., Français"
            required
          />
          <AppInput
            v-model="newLang.flag"
            label="Flag Emoji *"
            placeholder="e.g., 🇫🇷"
            required
          />
        </div>
        <div v-if="formError" class="form-error" style="color: var(--danger);">
          {{ formError }}
        </div>
        <div class="form-actions">
          <AppButton type="primary" @click="handleAddLanguage" :loading="store.loading">
            {{ store.loading ? 'Adding...' : 'Add Language' }}
          </AppButton>
        </div>
      </form>
    </AppCard>

    <!-- Languages Table -->
    <AppCard class="languages-card">
      <h2 class="card-title" style="color: var(--text-primary);">Available Languages</h2>
      <div v-if="store.loading && store.languages.length === 0" class="loading-state">
        <span class="loading-spinner"></span>
        Loading languages...
      </div>
      <div v-else-if="store.languages.length === 0" class="empty-state" style="color: var(--text-secondary);">
        No languages found. Add your first language above.
      </div>
      <AppTable v-else :columns="tableColumns" :data-source="store.languages" :row-key="'code'">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'flag'">
            <span class="lang-flag">{{ record.flag }}</span>
          </template>
          <template v-else-if="column.key === 'name'">
            <span v-if="editingCode !== record.code" class="lang-name">{{ record.name }}</span>
            <AppInput
              v-else
              :model-value="editForm.name"
              @update:model-value="editForm.name = $event"
              size="sm"
              @blur="cancelEdit"
              @keyup.enter="saveEdit(record.code)"
            />
          </template>
          <template v-else-if="column.key === 'code'">
            <code class="lang-code">{{ record.code }}</code>
          </template>
          <template v-else-if="column.key === 'status'">
            <AppStatusBadge
              :text="record.isActive ? 'Active' : 'Inactive'"
              :type="record.isActive ? 'success' : 'default'"
            />
          </template>
          <template v-else-if="column.key === 'isDefault'">
            <AppStatusBadge
              v-if="record.isDefault"
              text="Default"
              type="info"
            />
            <span v-else style="color: var(--text-muted);">—</span>
          </template>
          <template v-else-if="column.key === 'actions'">
            <div class="action-buttons">
              <AppIconButton
                v-if="editingCode !== record.code"
                icon="edit"
                size="sm"
                @click="startEdit(record)"
                title="Edit"
              />
              <AppIconButton
                v-else
                icon="check"
                size="sm"
                type="primary"
                @click="saveEdit(record.code)"
                title="Save"
              />
              <AppIconButton
                v-if="!record.isDefault"
                icon="star"
                size="sm"
                @click="handleSetDefault(record.code)"
                title="Set as Default"
              />
              <AppIconButton
                :icon="record.isActive ? 'close' : 'check'"
                size="sm"
                :type="record.isActive ? 'danger' : 'secondary'"
                :title="record.isActive ? 'Deactivate' : 'Activate'"
                @click="handleToggleActive(record.code)"
              />
              <AppIconButton
                v-if="!record.isDefault"
                icon="delete"
                size="sm"
                danger
                @click="confirmDelete(record)"
                title="Delete"
              />
            </div>
          </template>
        </template>
      </AppTable>
    </AppCard>

    <!-- Delete Confirmation Modal -->
    <AppConfirmModal
      v-if="showDeleteModal"
      :open="showDeleteModal"
      title="Confirm Delete"
      :description="`Are you sure you want to delete the ${deletingLang?.name} language? This action cannot be undone.`"
      ok-text="Delete"
      ok-type="danger"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useLanguagesStore, type Language } from '@/stores/languages'
import AppCard from '@/shared/components/ui/AppCard.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppInput from '@/shared/components/ui/AppInput.vue'
import AppTable from '@/shared/components/ui/AppTable.vue'
import AppStatusBadge from '@/shared/components/ui/AppStatusBadge.vue'
import AppIconButton from '@/shared/components/ui/AppIconButton.vue'
import AppConfirmModal from '@/shared/components/ui/AppConfirmModal.vue'

const store = useLanguagesStore()

// Table columns
const tableColumns = computed(() => [
  { key: 'flag', title: 'Flag', width: 80 },
  { key: 'name', title: 'Name' },
  { key: 'code', title: 'Code', width: 100 },
  { key: 'status', title: 'Status', width: 100 },
  { key: 'isDefault', title: 'Default', width: 100 },
  { key: 'actions', title: 'Actions', width: 200 },
])

// New language form
const newLang = reactive({
  code: '',
  name: '',
  flag: ''
})

const formError = ref('')

// Edit state
const editingCode = ref<string | null>(null)
const editForm = reactive({
  name: '',
  flag: ''
})

// Delete state
const showDeleteModal = ref(false)
const deletingLang = ref<Language | null>(null)

// Add language
async function handleAddLanguage() {
  formError.value = ''

  if (!newLang.code || !newLang.name || !newLang.flag) {
    formError.value = 'All fields are required'
    return
  }

  try {
    await store.addLanguage({
      code: newLang.code.toLowerCase(),
      name: newLang.name,
      flag: newLang.flag,
      isActive: true
    })

    // Reset form
    newLang.code = ''
    newLang.name = ''
    newLang.flag = ''
  } catch (error: any) {
    formError.value = error.message || 'Failed to add language'
  }
}

// Start editing
function startEdit(lang: Language) {
  editingCode.value = lang.code
  editForm.name = lang.name
  editForm.flag = lang.flag
}

// Cancel editing
function cancelEdit() {
  editingCode.value = null
}

// Save edit
async function saveEdit(code: string) {
  if (!editForm.name || !editForm.flag) return

  try {
    await store.updateLanguage(code, {
      name: editForm.name,
      flag: editForm.flag
    })
  } catch (error: any) {
    console.error('Failed to update language:', error)
  }

  editingCode.value = null
}

// Set as default
async function handleSetDefault(code: string) {
  try {
    await store.setDefault(code)
  } catch (error: any) {
    console.error('Failed to set default language:', error)
  }
}

// Toggle active status
async function handleToggleActive(code: string) {
  try {
    await store.toggleActive(code)
  } catch (error: any) {
    console.error('Failed to toggle active status:', error)
  }
}

// Confirm delete
function confirmDelete(lang: Language) {
  deletingLang.value = lang
  showDeleteModal.value = true
}

// Handle delete
async function handleDelete() {
  if (!deletingLang.value) return

  try {
    await store.deleteLanguage(deletingLang.value.code)
  } catch (error: any) {
    console.error('Failed to delete language:', error)
  }

  showDeleteModal.value = false
  deletingLang.value = null
}
</script>

<style scoped>
.languages-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  margin: 0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.add-language-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.form-error {
  font-size: 13px;
  text-align: center;
}

.lang-flag {
  font-size: 24px;
}

.lang-name {
  font-weight: 500;
}

.lang-code {
  background: var(--code-bg);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-family: monospace;
  color: var(--text-secondary);
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.loading-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  font-size: 14px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>