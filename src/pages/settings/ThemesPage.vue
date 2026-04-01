<!-- src/pages/settings/ThemesPage.vue -->
<template>
  <div class="themes-page p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Theme Management</h1>
        <p class="text-muted">Create, customize, and manage your application themes</p>
      </div>

      <!-- Current Theme Preview -->
      <div class="mb-8 p-6 rounded-lg border shadow-sm" style="background: var(--bg-secondary); border-color: var(--border-primary);">
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
      </div>

      <!-- Theme Grid -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold" style="color: var(--text-primary);">Available Themes</h2>
          <div class="flex gap-2">
            <button
              class="px-3 py-1.5 text-sm rounded-md transition-colors"
              :class="filter === 'all' ? 'btn-primary' : 'btn-secondary'"
              @click="filter = 'all'"
            >
              All
            </button>
            <button
              class="px-3 py-1.5 text-sm rounded-md transition-colors"
              :class="filter === 'light' ? 'btn-primary' : 'btn-secondary'"
              @click="filter = 'light'"
            >
              Light
            </button>
            <button
              class="px-3 py-1.5 text-sm rounded-md transition-colors"
              :class="filter === 'dark' ? 'btn-primary' : 'btn-secondary'"
              @click="filter = 'dark'"
            >
              Dark
            </button>
            <button
              class="px-3 py-1.5 text-sm rounded-md transition-colors"
              :class="filter === 'custom' ? 'btn-primary' : 'btn-secondary'"
              @click="filter = 'custom'"
            >
              Custom
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="theme in filteredThemes"
            :key="theme.id"
            class="theme-card rounded-lg border overflow-hidden transition-all hover:shadow-md"
            :class="{ 'ring-2 ring-primary': themeStore.currentThemeId === theme.id }"
            style="background: var(--bg-secondary); border-color: var(--border-primary);"
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
              <div
                v-if="theme.isCustom"
                class="absolute top-2 right-2 px-2 py-0.5 text-xs rounded-full"
                style="background: rgba(0,0,0,0.5); color: white;"
              >
                Custom
              </div>
              <div
                v-if="theme.isDefault"
                class="absolute top-2 right-2 px-2 py-0.5 text-xs rounded-full"
                style="background: rgba(0,0,0,0.5); color: white;"
              >
                Default
              </div>
            </div>

            <!-- Theme Info -->
            <div class="p-4">
              <h3 class="font-medium mb-1" style="color: var(--text-primary);">{{ theme.name }}</h3>
              <p v-if="theme.description" class="text-sm mb-3 line-clamp-2" style="color: var(--text-secondary);">
                {{ theme.description }}
              </p>
              <div class="flex items-center justify-between">
                <span
                  class="text-xs px-2 py-0.5 rounded"
                  :style="{
                    background: theme.type === 'dark' ? '#1e293b' : '#f1f5f9',
                    color: theme.type === 'dark' ? '#f1f5f9' : '#1e293b'
                  }"
                >
                  {{ theme.type === 'dark' ? 'Dark' : 'Light' }}
                </span>
                <div class="flex gap-1">
                  <button
                    class="px-3 py-1 text-sm rounded-md btn-primary"
                    @click="applyTheme(theme.id)"
                  >
                    {{ themeStore.currentThemeId === theme.id ? 'Active' : 'Apply' }}
                  </button>
                  <button
                    v-if="theme.isCustom"
                    class="p-1 rounded-md hover:bg-black/10 transition-colors"
                    @click="editTheme(theme)"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    v-if="theme.isCustom"
                    class="p-1 rounded-md hover:bg-red-500/10 transition-colors text-red-500"
                    @click="confirmDelete(theme)"
                    title="Delete"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredThemes.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
          <p class="text-muted">No themes found</p>
        </div>
      </div>

      <!-- Create New Theme Button -->
      <div class="flex justify-end">
        <button class="btn-primary flex items-center gap-2" @click="createNewTheme">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create New Theme
        </button>
      </div>

      <!-- Theme Editor Modal -->
      <ThemeEditorModal
        v-if="showEditor"
        :theme="editingTheme"
        @close="closeEditor"
        @save="saveTheme"
      />

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
        <div class="modal-content" @click.stop style="max-width: 400px;">
          <h3 class="text-lg font-semibold mb-4" style="color: var(--text-primary);">Delete Theme</h3>
          <p class="mb-6" style="color: var(--text-secondary);">
            Are you sure you want to delete "{{ themeToDelete?.name }}"? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button class="btn-secondary" @click="showDeleteConfirm = false">Cancel</button>
            <button class="btn-danger" @click="deleteTheme">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useThemeStore } from '@/stores/themeStore';
import type { Theme, ThemeMode, ThemeColors } from '@/types/theme';
import ThemeEditorModal from './components/ThemeEditorModal.vue';

const themeStore = useThemeStore();

// State
const filter = ref<'all' | 'light' | 'dark' | 'custom'>('all');
const showEditor = ref(false);
const editingTheme = ref<Theme | null>(null);
const showDeleteConfirm = ref(false);
const themeToDelete = ref<Theme | null>(null);

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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: var(--accent-primary, #4f46e5);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: var(--bg-tertiary, #f1f5f9);
  color: var(--text-primary, #0f172a);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: 1px solid var(--border-primary, #e2e8f0);
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: var(--hover-bg, #e2e8f0);
}

.btn-danger {
  background: var(--accent-error, #ef4444);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: opacity 0.2s;
}

.btn-danger:hover {
  opacity: 0.9;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>