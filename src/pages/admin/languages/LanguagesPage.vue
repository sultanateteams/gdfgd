<template>
  <div class="languages-page">
    <div class="page-header">
      <h1 class="page-title">Languages Management</h1>
      <p class="page-subtitle">Manage available languages for your application</p>
    </div>

    <!-- Add Language Form -->
    <div class="card add-language-card">
      <h2 class="card-title">Add New Language</h2>
      <form @submit.prevent="handleAddLanguage" class="add-language-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Language Code *</label>
            <input
              v-model="newLang.code"
              type="text"
              class="form-input"
              placeholder="e.g., fr"
              maxlength="5"
              required
              @input="newLang.code = newLang.code.toLowerCase()"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Language Name *</label>
            <input
              v-model="newLang.name"
              type="text"
              class="form-input"
              placeholder="e.g., Français"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label">Flag Emoji *</label>
            <input
              v-model="newLang.flag"
              type="text"
              class="form-input"
              placeholder="e.g., 🇫🇷"
              required
            />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="store.loading">
            {{ store.loading ? 'Adding...' : 'Add Language' }}
          </button>
        </div>
        <div v-if="formError" class="form-error">{{ formError }}</div>
      </form>
    </div>

    <!-- Languages Table -->
    <div class="card languages-card">
      <h2 class="card-title">Available Languages</h2>
      <div v-if="store.loading && store.languages.length === 0" class="loading-state">
        <span class="loading-spinner"></span>
        Loading languages...
      </div>
      <div v-else-if="store.languages.length === 0" class="empty-state">
        No languages found. Add your first language above.
      </div>
      <table v-else class="languages-table">
        <thead>
          <tr>
            <th>Flag</th>
            <th>Name</th>
            <th>Code</th>
            <th>Status</th>
            <th>Default</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lang in store.languages" :key="lang.code">
            <td class="flag-cell">
              <span class="lang-flag">{{ lang.flag }}</span>
            </td>
            <td>
              <span v-if="editingCode !== lang.code" class="lang-name">{{ lang.name }}</span>
              <input
                v-else
                v-model="editForm.name"
                type="text"
                class="form-input inline-input"
                @blur="cancelEdit"
                @keyup.enter="saveEdit(lang.code)"
              />
            </td>
            <td>
              <code class="lang-code">{{ lang.code }}</code>
            </td>
            <td>
              <span
                class="status-badge"
                :class="lang.isActive ? 'status-active' : 'status-inactive'"
              >
                {{ lang.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <span v-if="lang.isDefault" class="default-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Default
              </span>
              <span v-else class="not-default">—</span>
            </td>
            <td>
              <div class="action-buttons">
                <button
                  v-if="editingCode !== lang.code"
                  class="action-btn"
                  title="Edit"
                  @click="startEdit(lang)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button
                  v-else
                  class="action-btn action-save"
                  title="Save"
                  @click="saveEdit(lang.code)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
                <button
                  v-if="!lang.isDefault"
                  class="action-btn action-default"
                  title="Set as Default"
                  @click="handleSetDefault(lang.code)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </button>
                <button
                  class="action-btn"
                  :class="lang.isActive ? 'action-warning' : 'action-success'"
                  :title="lang.isActive ? 'Deactivate' : 'Activate'"
                  @click="handleToggleActive(lang.code)"
                >
                  <svg v-if="lang.isActive" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </button>
                <button
                  v-if="!lang.isDefault"
                  class="action-btn action-danger"
                  title="Delete"
                  @click="confirmDelete(lang)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>Confirm Delete</h3>
          <button class="modal-close" @click="showDeleteModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete the <strong>{{ deletingLang?.name }}</strong> language?</p>
          <p class="modal-warning">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
          <button class="btn btn-danger" @click="handleDelete" :disabled="store.loading">
            {{ store.loading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useLanguagesStore, type Language } from '@/stores/languages'

const store = useLanguagesStore()

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
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
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

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.inline-input {
  padding: 6px 10px;
  font-size: 14px;
  width: 200px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.form-error {
  color: var(--danger);
  font-size: 13px;
  text-align: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: inherit;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-secondary {
  background: var(--body-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--border-color);
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  opacity: 0.9;
}

.loading-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--text-secondary);
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

.languages-table {
  width: 100%;
  border-collapse: collapse;
}

.languages-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
}

.languages-table td {
  padding: 12px 16px;
  font-size: 14px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.languages-table tr:last-child td {
  border-bottom: none;
}

.flag-cell {
  font-size: 24px;
  width: 50px;
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

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: var(--success-light);
  color: var(--success);
}

.status-inactive {
  background: var(--danger-light);
  color: var(--danger);
}

.default-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: var(--primary-light);
  color: var(--primary);
}

.not-default {
  color: var(--text-muted);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--body-bg);
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

.action-save {
  background: var(--info-light);
  color: var(--info);
}

.action-save:hover {
  opacity: 0.8;
}

.action-default {
  background: var(--warning-light);
  color: var(--warning);
}

.action-default:hover {
  opacity: 0.8;
}

.action-warning {
  background: var(--danger-light);
  color: var(--danger);
}

.action-warning:hover {
  opacity: 0.8;
}

.action-success {
  background: var(--success-light);
  color: var(--success);
}

.action-success:hover {
  opacity: 0.8;
}

.action-danger {
  background: var(--danger-light);
  color: var(--danger);
}

.action-danger:hover {
  opacity: 0.8;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--card-bg);
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--text-secondary);
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-primary);
}

.modal-warning {
  font-size: 13px;
  color: var(--text-secondary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  background: var(--body-bg);
  border-radius: 0 0 12px 12px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .languages-table {
    display: block;
    overflow-x: auto;
  }
}
</style>