<!-- src/pages/settings/components/ThemeEditorModal.vue -->
<template>
  <AppModal
    :open="true"
    :title="isEditing ? 'Edit Theme' : 'Create New Theme'"
    :width="900"
    :closable="true"
    :mask-closable="false"
    :show-ok-btn="false"
    :show-cancel-btn="false"
    @cancel="$emit('close')"
  >
    <!-- Basic Info -->
    <div class="mb-6">
      <h3 class="text-sm font-medium mb-3" style="color: var(--text-primary);">Basic Information</h3>
      <div class="grid grid-cols-2 gap-4">
        <AppInput
          :model-value="form.name"
          @update:model-value="form.name = $event"
          label="Theme Name *"
          placeholder="My Custom Theme"
          required
        />
        <AppSelect
          :value="form.type"
          @update:value="form.type = $event as ThemeMode"
          label="Mode *"
          :options="[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' }
          ]"
          required
        />
      </div>
      <div class="mt-4">
        <AppInput
          :model-value="form.description ?? ''"
          @update:model-value="form.description = $event"
          label="Description"
          placeholder="A brief description of your theme"
        />
      </div>
    </div>

    <!-- Color Picker Tabs -->
    <div class="mb-6">
      <h3 class="text-sm font-medium mb-3" style="color: var(--text-primary);">Color Palette</h3>
      
      <!-- Tab Headers -->
      <AppTabs v-model:active-key="activeTab" :items="tabItems" />

      <!-- Tab Content -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
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
            <AppInput
              :model-value="colorValue(color.key)"
              @update:model-value="updateColor(color.key, $event)"
              placeholder="#000000"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Live Preview -->
    <AppCard class="mb-6">
      <h3 class="text-sm font-medium mb-3" style="color: var(--text-primary);">Live Preview</h3>
      <div 
        class="preview-box rounded-lg p-4"
        :style="previewStyles"
      >
        <div class="preview-text-primary mb-2">Primary Text Sample</div>
        <div class="preview-text-secondary mb-2">Secondary Text Sample</div>
        <div class="preview-text-muted">Muted Text Sample</div>
        <div class="flex gap-2 mt-4">
          <AppButton type="primary" size="sm">Primary Button</AppButton>
          <AppButton type="secondary" size="sm">Secondary Button</AppButton>
        </div>
      </div>
    </AppCard>

    <!-- Actions -->
    <template #footer>
      <div class="flex justify-end gap-3">
        <AppButton type="secondary" @click="$emit('close')">Cancel</AppButton>
        <AppButton type="primary" @click="handleSave" :disabled="!isValid">
          {{ isEditing ? 'Save Changes' : 'Create Theme' }}
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import type { Theme, ThemeColors, ThemeMode } from '@/types/theme';
import { COLOR_CATEGORIES } from '@/types/theme';
import AppModal from '@/shared/components/ui/AppModal.vue';
import AppButton from '@/shared/components/ui/AppButton.vue';
import AppInput from '@/shared/components/ui/AppInput.vue';
import AppSelect from '@/shared/components/ui/AppSelect.vue';
import AppTabs from '@/shared/components/ui/AppTabs.vue';
import AppCard from '@/shared/components/ui/AppCard.vue';

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

const colorValue = (key: keyof ThemeColors) => form.colors[key] ?? '';

const tabItems = computed(() => colorCategories.value.map(c => ({ key: c.id, label: c.label })));

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
</style>