<!-- src/pages/settings/components/ThemeEditorModal.vue -->
<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold" style="color: var(--text-primary);">
          {{ isEditing ? 'Edit Theme' : 'Create New Theme' }}
        </h2>
        <button class="p-1 rounded-md hover:bg-black/10 transition-colors" @click="$emit('close')">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Basic Info -->
      <div class="mb-6">
        <h3 class="text-sm font-medium mb-3" style="color: var(--text-primary);">Basic Information</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1" style="color: var(--text-secondary);">Theme Name *</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
              :style="{
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--input-text)'
              }"
              placeholder="My Custom Theme"
            />
          </div>
          <div>
            <label class="block text-sm mb-1" style="color: var(--text-secondary);">Mode *</label>
            <select
              v-model="form.type"
              class="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
              :style="{
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--input-text)'
              }"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-sm mb-1" style="color: var(--text-secondary);">Description</label>
          <input
            v-model="form.description"
            type="text"
            class="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
            :style="{
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              color: 'var(--input-text)'
            }"
            placeholder="A brief description of your theme"
          />
        </div>
      </div>

      <!-- Color Picker Tabs -->
      <div class="mb-6">
        <h3 class="text-sm font-medium mb-3" style="color: var(--text-primary);">Color Palette</h3>
        
        <!-- Tab Headers -->
        <div class="flex flex-wrap gap-1 mb-4 border-b" style="border-color: var(--border-primary);">
          <button
            v-for="category in colorCategories"
            :key="category.id"
            class="px-3 py-2 text-sm rounded-t-md transition-colors"
            :class="activeTab === category.id ? 'btn-primary text-white' : 'text-secondary hover:bg-black/5'"
            :style="activeTab !== category.id ? { color: 'var(--text-secondary)' } : {}"
            @click="activeTab = category.id"
          >
            {{ category.label }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="color in currentCategoryColors" :key="color.key" class="color-picker-group">
            <label class="block text-xs mb-1 truncate" style="color: var(--text-secondary);" :title="color.label">
              {{ color.label }}
            </label>
            <div class="flex items-center gap-2">
              <div class="relative">
                <input
                  type="color"
                  :value="form.colors[color.key]"
                  @input="updateColor(color.key, ($event.target as HTMLInputElement).value)"
                  class="w-10 h-10 rounded-md cursor-pointer border-0 p-0"
                />
              </div>
              <input
                type="text"
                :value="form.colors[color.key]"
                @input="updateColor(color.key, ($event.target as HTMLInputElement).value)"
                class="flex-1 px-2 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                :style="{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  color: 'var(--input-text)'
                }"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Live Preview -->
      <div class="mb-6 p-4 rounded-lg border" style="background: var(--bg-tertiary); border-color: var(--border-primary);">
        <h3 class="text-sm font-medium mb-3" style="color: var(--text-primary);">Live Preview</h3>
        <div 
          class="preview-box rounded-lg p-4"
          :style="previewStyles"
        >
          <div class="preview-text-primary mb-2">Primary Text Sample</div>
          <div class="preview-text-secondary mb-2">Secondary Text Sample</div>
          <div class="preview-text-muted">Muted Text Sample</div>
          <div class="flex gap-2 mt-4">
            <button class="preview-btn-primary px-3 py-1.5 rounded text-sm text-white">Primary Button</button>
            <button class="preview-btn-secondary px-3 py-1.5 rounded text-sm">Secondary Button</button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <button class="btn-secondary" @click="$emit('close')">Cancel</button>
        <button class="btn-primary" @click="handleSave" :disabled="!isValid">
          {{ isEditing ? 'Save Changes' : 'Create Theme' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import type { Theme, ThemeColors, ThemeMode } from '@/types/theme';
import { COLOR_CATEGORIES } from '@/types/theme';

const props = defineProps<{
  theme: Theme | null;
}>();

const emit = defineEmits<{
  close: [];
  save: [data: { name: string; description?: string; type: ThemeMode; colors: ThemeColors }];
}>();

const isEditing = computed(() => props.theme !== null);

// Form state
const form = reactive({
  name: '',
  description: '' as string | undefined,
  type: 'light' as ThemeMode,
  colors: {} as ThemeColors,
});

const activeTab = ref(COLOR_CATEGORIES[0].id);

// Initialize form from theme or defaults
onMounted(() => {
  if (props.theme) {
    form.name = props.theme.name;
    form.description = props.theme.description;
    form.type = props.theme.type;
    form.colors = { ...props.theme.colors };
  } else {
    // Default light theme colors
    form.name = 'My Custom Theme';
    form.type = 'light';
    form.colors = {
      bgPrimary: '#ffffff',
      bgSecondary: '#f8fafc',
      bgTertiary: '#f1f5f9',
      bgInverse: '#0f172a',
      textPrimary: '#0f172a',
      textSecondary: '#64748b',
      textMuted: '#94a3b8',
      textInverse: '#f1f5f9',
      accentPrimary: '#4f46e5',
      accentSecondary: '#06b6d4',
      accentSuccess: '#10b981',
      accentWarning: '#f59e0b',
      accentError: '#ef4444',
      accentInfo: '#3b82f6',
      borderPrimary: '#e2e8f0',
      borderSecondary: '#f1f5f9',
      borderFocus: '#4f46e5',
      hoverBg: '#f1f5f9',
      hoverText: '#4f46e5',
      activeBg: '#eef2ff',
      tableHeaderBg: '#f8fafc',
      tableRowEvenBg: '#ffffff',
      tableRowOddBg: '#f8fafc',
      tableRowHoverBg: '#f1f5f9',
      inputBg: '#ffffff',
      inputBorder: '#e2e8f0',
      inputFocusBorder: '#4f46e5',
      inputText: '#0f172a',
      inputPlaceholder: '#94a3b8',
      modalBg: '#ffffff',
      modalOverlay: 'rgba(0, 0, 0, 0.5)',
      shadowSm: 'rgba(0, 0, 0, 0.08)',
      shadowMd: 'rgba(0, 0, 0, 0.1)',
      shadowLg: 'rgba(0, 0, 0, 0.1)',
    };
  }
});

// Computed
const colorCategories = computed(() => COLOR_CATEGORIES);

const currentCategoryColors = computed(() => {
  const category = COLOR_CATEGORIES.find(c => c.id === activeTab.value);
  return category?.colors ?? [];
});

const isValid = computed(() => {
  return form.name.trim().length > 0;
});

const previewStyles = computed(() => ({
  background: form.colors.bgPrimary,
  color: form.colors.textPrimary,
}));

// Methods
function updateColor(key: keyof ThemeColors, value: string) {
  form.colors[key] = value;
}

function handleSave() {
  if (!isValid.value) return;
  
  const data = {
    name: form.name,
    type: form.type,
    colors: { ...form.colors },
  } as { name: string; type: ThemeMode; colors: ThemeColors; description?: string };
  
  if (form.description) {
    data.description = form.description;
  }
  
  emit('save', data);
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;
}

.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: var(--accent-primary, #4f46e5);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: opacity 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-tertiary, #f1f5f9);
  color: var(--text-primary, #0f172a);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: 1px solid var(--border-primary, #e2e8f0);
  transition: background 0.2s;
  cursor: pointer;
}

.btn-secondary:hover {
  background: var(--hover-bg, #e2e8f0);
}

.text-secondary {
  color: var(--text-secondary);
}

.color-picker-group {
  min-width: 0;
}

.preview-box {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
}

.preview-text-primary {
  color: var(--text-primary);
  font-weight: 600;
}

.preview-text-secondary {
  color: var(--text-secondary);
}

.preview-text-muted {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.preview-btn-primary {
  background: var(--accent-primary);
}

.preview-btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}
</style>