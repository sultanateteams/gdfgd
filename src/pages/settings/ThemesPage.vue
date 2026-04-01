<!-- src/pages/settings/ThemesPage.vue -->
<template>
  <div class="themes-page p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2" style="color: var(--text-primary);">Theme Management</h1>
        <p class="text-muted" style="color: var(--text-secondary);">Create, customize, and manage your application themes</p>
      </div>

      <!-- Current Theme Preview -->
      <AppCard class="mb-8">
        <h2 class="text-lg font-semibold mb-4" style="color: var(--text-primary);">Current Theme</h2>
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-lg shadow-md"
            :style="{ background: currentThemePreview }"
          ></div>
          <div>
            <div class="font-medium" style="color: var(--text-primary);">
              {{ themeStore.currentTheme?.name ?? 'Unknown' }}
            </div>
            <div class="text-sm" style="color: var(--text-secondary);">
              {{ themeStore.currentTheme?.type === 'dark' ? 'Dark' : 'Light' }} mode
            </div>
            <div v-if="themeStore.currentTheme?.description" class="text-sm mt-1" style="color: var(--text-muted);">
              {{ themeStore.currentTheme.description }}
            </div>
          </div>
        </div>
      </AppCard>

      <!-- Theme Grid -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold" style="color: var(--text-primary);">Available Themes</h2>
          <div class="flex gap-2">
            <AppButton
              v-for="filterOption in ['all', 'light', 'dark', 'custom']"
              :key="filterOption"
              :type="filter === filterOption ? 'primary' : 'secondary'"
              size="sm"
              @click="filter = filterOption as any"
            >
              {{ filterOption.charAt(0).toUpperCase() + filterOption.slice(1) }}
            </AppButton>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AppCard
            v-for="theme in filteredThemes"
            :key="theme.id"
            class="theme-card"
            :class="{ 'ring-2 ring-primary': themeStore.currentThemeId === theme.id }"
          >
            <!-- Theme Preview -->
            <div class="h-24 relative" :style="{ background: getThemeGradient(theme) }">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="flex gap-2">
                  <div class="w-6 h-6 rounded" :style="{ background: theme.colors.accentPrimary }"></div>
                  <div class="w-6 h-6 rounded" :style="{ background: theme.colors.accentSecondary }"></div>
                  <div class="w-6 h-6 rounded" :style="{ background: theme.colors.accentSuccess }"></div>
                  <div class="w-6 h-6 rounded" :style="{ background: theme.colors.accentWarning }"></div>
                  <div class="w-6 h-6 rounded" :style="{ background: theme.colors.accentError }"></div>
                </div>
              </div>
              <AppStatusBadge
                v-if="theme.isCustom"
                class="absolute top-2 right-2"
                text="Custom"
                type="info"
              />
              <AppStatusBadge
                v-if="theme.isDefault"
                class="absolute top-2 right-2"
                text="Default"
                type="success"
              />
            </div>

            <!-- Theme Info -->
            <div class="p-4">
              <h3 class="font-medium mb-1" style="color: var(--text-primary);">{{ theme.name }}</h3>
              <p v-if="theme.description" class="text-sm mb-3 line-clamp-2" style="color: var(--text-secondary);">
                {{ theme.description }}
              </p>
              <div class="flex items-center justify-between">
                <AppStatusBadge
                  :text="theme.type === 'dark' ? 'Dark' : 'Light'"
                  :type="theme.type === 'dark' ? 'default' : 'warning'"
                />
                <div class="flex gap-1">
                  <AppButton
                    :type="themeStore.currentThemeId === theme.id ? 'secondary' : 'primary'"
                    size="sm"
                    @click="applyTheme(theme.id)"
                  >
                    {{ themeStore.currentThemeId === theme.id ? 'Active' : 'Apply' }}
                  </AppButton>
                  <AppIconButton
                    v-if="theme.isCustom"
                    icon="edit"
                    size="sm"
                    @click="editTheme(theme)"
                    title="Edit"
                  />
                  <AppIconButton
                    v-if="theme.isCustom"
                    icon="delete"
                    size="sm"
                    danger
                    @click="confirmDelete(theme)"
                    title="Delete"
                  />
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        <!-- Empty state -->
        <div v-if="filteredThemes.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-50" style="color: var(--text-muted);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
          <p class="text-muted" style="color: var(--text-secondary);">No themes found</p>
        </div>
      </div>

      <!-- Create New Theme Button -->
      <div class="flex justify-end">
        <AppButton type="primary" @click="createNewTheme">
          <template #icon>
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </template>
          Create New Theme
        </AppButton>
      </div>

      <!-- Theme Editor Modal -->
      <ThemeEditorModal
        v-if="showEditor"
        :theme="editingTheme"
        @close="closeEditor"
        @save="saveTheme"
      />

      <!-- Delete Confirmation Modal -->
      <AppConfirmModal
        v-if="showDeleteConfirm"
        :open="showDeleteConfirm"
        title="Delete Theme"
        :description="deleteConfirmDescription"
        ok-text="Delete"
        ok-type="danger"
        @confirm="deleteTheme"
        @cancel="showDeleteConfirm = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useThemeStore } from '@/stores/themeStore';
import type { Theme, ThemeMode, ThemeColors } from '@/types/theme';
import ThemeEditorModal from './components/ThemeEditorModal.vue';
import AppCard from '@/shared/components/ui/AppCard.vue';
import AppButton from '@/shared/components/ui/AppButton.vue';
import AppIconButton from '@/shared/components/ui/AppIconButton.vue';
import AppStatusBadge from '@/shared/components/ui/AppStatusBadge.vue';
import AppConfirmModal from '@/shared/components/ui/AppConfirmModal.vue';

const themeStore = useThemeStore();

// State
const filter = ref<'all' | 'light' | 'dark' | 'custom'>('all');
const showEditor = ref(false);
const editingTheme = ref<Theme | null>(null);
const showDeleteConfirm = ref(false);
const themeToDelete = ref<Theme | null>(null);

const deleteConfirmDescription = computed(() => {
  return themeToDelete.value ? `Are you sure you want to delete "${themeToDelete.value.name}"? This action cannot be undone.` : '';
});

// Computed
const filteredThemes = computed(() => {
  let themes = themeStore.allThemes;

  switch (filter.value) {
    case 'light':
      themes = themes.filter(t => t.type === 'light');
      break;
    case 'dark':
      themes = themes.filter(t => t.type === 'dark');
      break;
    case 'custom':
      themes = themes.filter(t => t.isCustom);
      break;
  }

  return themes;
});

const currentThemePreview = computed(() => {
  const theme = themeStore.currentTheme;
  if (!theme) return '#ccc';
  return `linear-gradient(135deg, ${theme.colors.bgPrimary} 0%, ${theme.colors.accentPrimary} 100%)`;
});

// Methods
function getThemeGradient(theme: Theme): string {
  return `linear-gradient(135deg, ${theme.colors.bgPrimary} 0%, ${theme.colors.bgSecondary} 50%, ${theme.colors.accentPrimary} 100%)`;
}

function applyTheme(themeId: string) {
  themeStore.setTheme(themeId);
}

function createNewTheme() {
  editingTheme.value = null;
  showEditor.value = true;
}

function editTheme(theme: Theme) {
  editingTheme.value = theme;
  showEditor.value = true;
}

function closeEditor() {
  showEditor.value = false;
  editingTheme.value = null;
}

function saveTheme(themeData: { name: string; type: ThemeMode; colors: ThemeColors; description?: string }) {
  if (editingTheme.value) {
    // Update existing theme
    themeStore.updateTheme(editingTheme.value.id, themeData);
  } else {
    // Create new theme
    if (themeData.description) {
      themeStore.createTheme(
        themeData.name,
        themeData.type,
        themeData.colors,
        themeData.description
      );
    } else {
      themeStore.createTheme(
        themeData.name,
        themeData.type,
        themeData.colors
      );
    }
  }
  closeEditor();
}

function confirmDelete(theme: Theme) {
  themeToDelete.value = theme;
  showDeleteConfirm.value = true;
}

function deleteTheme() {
  if (themeToDelete.value) {
    themeStore.deleteTheme(themeToDelete.value.id);
    themeToDelete.value = null;
    showDeleteConfirm.value = false;
  }
}

// Initialize theme store on mount
onMounted(() => {
  themeStore.initialize();
});
</script>

<style scoped>
.themes-page {
  min-height: 100vh;
}

.theme-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.theme-card:hover {
  transform: translateY(-2px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>