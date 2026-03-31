<template>
  <div class="translate-words-page">
    <div class="page-header">
      <h1 class="page-title">Translate Words</h1>
      <p class="page-subtitle">Manage translations for all languages</p>
    </div>

    <div class="card">
      <TranslationEditorModal />
    </div>
  </div>
</template>

<script setup lang="ts">
import TranslationEditorModal from '@/components/TranslationEditorModal.vue'
</script>

<style scoped>
.translate-words-page {
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
}
</style>