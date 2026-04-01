<template>
  <div class="header-search">
    <div class="search-wrapper">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        class="search-input"
        placeholder="Search employees, reports..."
        v-model="query"
        @keydown.meta.k.prevent="focusSearch"
        ref="inputRef"
      />
      <kbd class="search-kbd">⌘K</kbd>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const query = defineModel<string>()
const inputRef = ref<HTMLInputElement>()

function focusSearch() {
  inputRef.value?.focus()
}

// ⌘K global shortcut
function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    focusSearch()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.header-search {
  flex: 1;
  max-width: 480px;
}
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
  pointer-events: none;
}
.search-input {
  width: 100%;
  height: 38px;
  background: var(--body-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0 80px 0 38px;
  font-size: 13.5px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 150ms, box-shadow 150ms;
  font-family: inherit;
}
.search-input::placeholder {
  color: var(--text-secondary);
}
.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}
.search-kbd {
  position: absolute;
  right: 10px;
  font-size: 11px;
  color: var(--text-secondary);
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 2px 6px;
  border-radius: 5px;
  font-family: inherit;
}

@media (max-width: 768px) {
  .header-search {
    display: none;
  }
}
</style>