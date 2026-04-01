<template>
  <!-- Command Palette Modal -->
  <Teleport to="body">
    <Transition name="command-palette">
      <div
        v-if="store.isOpen"
        class="command-palette-overlay"
        @click.self="store.close()"
      >
        <div class="command-palette-modal">
          <!-- Search Input -->
          <div class="command-palette-search">
            <svg
              class="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref="searchInput"
              v-model="store.query"
              type="text"
              class="search-input"
              placeholder="Search pages, actions..."
              data-command-input
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
            <kbd class="escape-hint">ESC</kbd>
          </div>

          <!-- Results -->
          <div class="command-palette-results">
            <!-- No Results -->
            <div v-if="showNoResults" class="no-results">
              <p>No results found for "{{ store.query }}"</p>
            </div>

            <!-- Recent Items -->
            <div v-if="groupedItems.recent.length > 0 && !store.query" class="results-group">
              <div class="group-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Recent
              </div>
              <div class="results-list">
                <button
                  v-for="(item, index) in groupedItems.recent"
                  :key="item.id"
                  class="result-item"
                  :class="{ active: getFlatIndex('recent', index) === store.activeIndex }"
                  @click="handleSelect(item)"
                  @mouseenter="store.activeIndex = getFlatIndex('recent', index)"
                >
                  <span class="item-icon">{{ item.icon }}</span>
                  <div class="item-content">
                    <span class="item-label">{{ item.label }}</span>
                    <span v-if="item.description" class="item-description">{{ item.description }}</span>
                  </div>
                  <span class="item-shortcut">↵</span>
                </button>
              </div>
            </div>

            <!-- Pages -->
            <div v-if="groupedItems.pages.length > 0" class="results-group">
              <div class="group-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Pages
              </div>
              <div class="results-list">
                <button
                  v-for="(item, index) in groupedItems.pages"
                  :key="item.id"
                  class="result-item"
                  :class="{ active: getFlatIndex('pages', index) === store.activeIndex }"
                  @click="handleSelect(item)"
                  @mouseenter="store.activeIndex = getFlatIndex('pages', index)"
                >
                  <span class="item-icon">{{ item.icon }}</span>
                  <div class="item-content">
                    <span class="item-label">{{ item.label }}</span>
                    <span v-if="item.description" class="item-description">{{ item.description }}</span>
                  </div>
                  <span class="item-shortcut">↵</span>
                </button>
              </div>
            </div>

            <!-- Tabs -->
            <div v-if="groupedItems.tabs.length > 0" class="results-group">
              <div class="group-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                </svg>
                Tabs
              </div>
              <div class="results-list">
                <button
                  v-for="(item, index) in groupedItems.tabs"
                  :key="item.id"
                  class="result-item"
                  :class="{ active: getFlatIndex('tabs', index) === store.activeIndex }"
                  @click="handleSelect(item)"
                  @mouseenter="store.activeIndex = getFlatIndex('tabs', index)"
                >
                  <span class="item-icon">{{ item.icon }}</span>
                  <div class="item-content">
                    <span class="item-label">{{ item.label }}</span>
                    <span v-if="item.description" class="item-description">{{ item.description }}</span>
                  </div>
                  <span class="item-shortcut">↵</span>
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="groupedItems.actions.length > 0" class="results-group">
              <div class="group-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Actions
              </div>
              <div class="results-list">
                <button
                  v-for="(item, index) in groupedItems.actions"
                  :key="item.id"
                  class="result-item"
                  :class="{ active: getFlatIndex('actions', index) === store.activeIndex }"
                  @click="handleSelect(item)"
                  @mouseenter="store.activeIndex = getFlatIndex('actions', index)"
                >
                  <span class="item-icon">{{ item.icon }}</span>
                  <div class="item-content">
                    <span class="item-label">{{ item.label }}</span>
                    <span v-if="item.description" class="item-description">{{ item.description }}</span>
                  </div>
                  <span class="item-shortcut">↵</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useCommandPaletteStore } from '@/stores/commandPaletteStore'
import type { SearchItem } from '@/data/searchIndex'

const store = useCommandPaletteStore()
const searchInput = ref<HTMLInputElement | null>(null)

// Destructure computed values for template access
const groupedItems = computed(() => store.groupedItems)

// Focus input when modal opens
watch(() => store.isOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    searchInput.value?.focus()
  }
})

// Show no results message
const showNoResults = computed(() => {
  return store.query.trim() && store.flatItems.length === 0
})

// Calculate flat index for a group item
function getFlatIndex(group: 'recent' | 'pages' | 'tabs' | 'actions', index: number): number {
  const { recent, pages, tabs } = groupedItems.value
  let offset = 0

  if (group === 'pages') {
    offset = recent.length
  } else if (group === 'tabs') {
    offset = recent.length + pages.length
  } else if (group === 'actions') {
    offset = recent.length + pages.length + tabs.length
  }

  return offset + index
}

// Handle item selection
function handleSelect(item: SearchItem) {
  store.selectItem(item)
}

// Keyboard navigation within component
function handleKeydown(event: KeyboardEvent) {
  if (!store.isOpen) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      store.navigateDown()
      break
    case 'ArrowUp':
      event.preventDefault()
      store.navigateUp()
      break
    case 'Enter':
      if (document.activeElement === searchInput.value) {
        event.preventDefault()
        store.selectActive()
      }
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Overlay */
.command-palette-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

/* Modal */
.command-palette-modal {
  width: 560px;
  max-width: calc(100vw - 48px);
  max-height: 60vh;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Search Input */
.command-palette-search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-primary);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: var(--text-primary);
  caret-color: var(--accent-primary);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.escape-hint {
  font-size: 11px;
  padding: 2px 6px;
  border: 1px solid var(--border-primary);
  border-radius: 4px;
  color: var(--text-muted);
  font-family: inherit;
  flex-shrink: 0;
}

/* Results */
.command-palette-results {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

/* No Results */
.no-results {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}

/* Results Group */
.results-group {
  padding: 8px 0;
}

.results-group:first-child {
  padding-top: 0;
}

.group-label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 20px 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
}

.group-label svg {
  opacity: 0.7;
}

/* Results List */
.results-list {
  display: flex;
  flex-direction: column;
}

/* Result Item */
.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background-color 0.15s ease;
}

.result-item:hover,
.result-item.active {
  background: var(--hover-bg);
}

.result-item.active {
  background: var(--accent-primary);
  background: color-mix(in srgb, var(--accent-primary) 15%, transparent);
}

.item-icon {
  font-size: 18px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-description {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-item.active .item-label {
  color: var(--accent-primary);
}

.result-item.active .item-description {
  color: var(--accent-primary);
  opacity: 0.7;
}

.item-shortcut {
  font-size: 14px;
  color: var(--text-muted);
  flex-shrink: 0;
  opacity: 0.5;
}

.result-item:hover .item-shortcut,
.result-item.active .item-shortcut {
  opacity: 1;
}

/* Transitions */
.command-palette-enter-active,
.command-palette-leave-active {
  transition: opacity 0.2s ease;
}

.command-palette-enter-active .command-palette-modal,
.command-palette-leave-active .command-palette-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.command-palette-enter-from,
.command-palette-leave-to {
  opacity: 0;
}

.command-palette-enter-from .command-palette-modal,
.command-palette-leave-to .command-palette-modal {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Scrollbar styling */
.command-palette-results::-webkit-scrollbar {
  width: 6px;
}

.command-palette-results::-webkit-scrollbar-track {
  background: transparent;
}

.command-palette-results::-webkit-scrollbar-thumb {
  background: var(--border-primary);
  border-radius: 3px;
}

.command-palette-results::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
</style>