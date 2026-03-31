<template>
  <div class="translate-words-page">
    <div class="page-header">
      <h1 class="page-title">Translate Words</h1>
      <p class="page-subtitle">Manage translations for all languages</p>
    </div>

    <div class="card">
      <!-- Toolbar -->
      <div class="toolbar">
        <button class="btn-scan" :disabled="scanning" @click="scanAllKeys">
          <span v-if="scanning">⏳ Scanning...</span>
          <span v-else>🔍 Get All Keys</span>
        </button>

        <div v-if="scannedKeys.length" class="toolbar-right">
          <span class="scan-info">
            {{ scannedKeys.length }} keys · {{ languages.length }} languages ·
            <span class="missing-count">{{ missingCount }} missing</span>
          </span>

          <!-- Search -->
          <input
            v-model="search"
            class="search-input"
            placeholder="Search key or value..."
          />

          <!-- Copy for AI -->
          <button
            class="btn-copy-ai"
            :class="{ copied: aiCopied }"
            @click="copyForAI"
          >
            <span v-if="aiCopied">✓ Copied!</span>
            <span v-else>🤖 Copy for AI</span>
          </button>
        </div>
      </div>

      <!-- Missing filter checkboxes -->
      <div v-if="scannedKeys.length" class="filter-bar">
        <span class="filter-label">Show missing in:</span>
        <label
          v-for="lang in languages"
          :key="lang"
          class="filter-checkbox"
          :class="{ active: missingFilter.includes(lang) }"
        >
          <input
            type="checkbox"
            :value="lang"
            :checked="missingFilter.includes(lang)"
            @change="toggleMissingFilter(lang)"
          />
          {{ lang.toUpperCase() }}
          <span class="filter-count">({{ missingCountByLang(lang) }})</span>
        </label>
        <button
          v-if="missingFilter.length"
          class="btn-clear-filter"
          @click="missingFilter = []"
        >
          Clear filter
        </button>
      </div>

      <!-- Table -->
      <div v-if="filteredKeys.length" class="table-wrapper">
        <table class="keys-table">
          <thead>
            <tr>
              <th class="col-key">Key</th>
              <th class="col-default">Default Value</th>
              <th class="col-context">Context / Source</th>
              <th v-for="lang in languages" :key="lang" class="col-lang">
                {{ lang.toUpperCase() }}
              </th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in filteredKeys" :key="item.key">
              <tr
                :class="{
                  'row-missing': item.hasMissing,
                  'row-editing': editingKey === item.key,
                }"
              >
                <td class="col-key">
                  <code>{{ item.key }}</code>
                </td>
                <td class="col-default">{{ item.defaultValue }}</td>

                <!-- Context: file sources -->
                <td class="col-context">
                  <div class="source-list">
                    <span
                      v-for="src in item.sources"
                      :key="src"
                      class="source-badge"
                    >
                      {{ src }}
                    </span>
                  </div>
                </td>

                <!-- Lang cells -->
                <td
                  v-for="lang in languages"
                  :key="lang"
                  class="col-lang"
                  :class="
                    editingKey === item.key
                      ? 'cell-editing'
                      : item.translations[lang]
                        ? 'cell-ok'
                        : 'cell-missing'
                  "
                >
                  <template v-if="editingKey === item.key">
                    <input
                      v-model="editDraft[lang]"
                      class="inline-input"
                      :placeholder="`${lang} translation...`"
                    />
                  </template>
                  <template v-else>
                    <span v-if="item.translations[lang]">{{
                      item.translations[lang]
                    }}</span>
                    <span v-else class="missing-badge">✕ missing</span>
                  </template>
                </td>

                <!-- Row actions -->
                <td class="col-actions">
                  <template v-if="editingKey === item.key">
                    <button
                      class="btn-action btn-save"
                      :disabled="saving"
                      @click="saveInline(item)"
                    >
                      {{ saving ? "..." : "✓ Save" }}
                    </button>
                    <button class="btn-action btn-cancel" @click="cancelEdit">
                      ✕
                    </button>
                  </template>
                  <template v-else>
                    <button
                      class="btn-action btn-edit"
                      @click="startInlineEdit(item)"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      class="btn-action btn-modal"
                      @click="openModal(item)"
                    >
                      ⊞
                    </button>
                  </template>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div
        v-else-if="scannedKeys.length && !filteredKeys.length"
        class="empty-search"
      >
        <template v-if="missingFilter.length">
          No missing translations for selected languages 🎉
        </template>
        <template v-else>
          No keys match "<strong>{{ search }}</strong
          >"
        </template>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="modalItem" class="modal-backdrop" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Edit Translation</h2>
              <code class="modal-key">{{ modalItem.key }}</code>
            </div>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>

          <div class="modal-body">
            <!-- Default value as context -->
            <div class="modal-field">
              <label class="field-label">Default Value (context)</label>
              <div class="field-default">{{ modalItem.defaultValue }}</div>
            </div>

            <!-- Source files as context -->
            <div v-if="modalItem.sources.length" class="modal-field">
              <label class="field-label">Used in</label>
              <div class="modal-sources">
                <span
                  v-for="src in modalItem.sources"
                  :key="src"
                  class="source-badge"
                >
                  {{ src }}
                </span>
              </div>
            </div>

            <div class="modal-divider" />

            <div v-for="lang in languages" :key="lang" class="modal-field">
              <label class="field-label">
                {{ lang.toUpperCase() }}
                <span v-if="!modalDraft[lang]" class="label-missing"
                  >missing</span
                >
              </label>
              <input
                v-model="modalDraft[lang]"
                class="modal-input"
                :placeholder="`Enter ${lang} translation...`"
              />
            </div>
          </div>

          <div class="modal-footer">
            <span v-if="saveError" class="save-error">{{ saveError }}</span>
            <button class="btn-cancel-modal" @click="closeModal">Cancel</button>
            <button
              class="btn-save-modal"
              :disabled="saving"
              @click="saveModal"
            >
              {{ saving ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// ── Types ──────────────────────────────────────────────────────────────────
interface KeyItem {
  key: string;
  defaultValue: string;
  sources: string[];
  translations: Record<string, string>;
  hasMissing: boolean;
}

// ── State ──────────────────────────────────────────────────────────────────
const scanning = ref(false);
const saving = ref(false);
const saveError = ref("");
const scannedKeys = ref<KeyItem[]>([]);
const languages = ref<string[]>([]);
const search = ref("");
const missingFilter = ref<string[]>([]);
const aiCopied = ref(false);

// Inline edit
const editingKey = ref<string | null>(null);
const editDraft = ref<Record<string, string>>({});

// Modal edit
const modalItem = ref<KeyItem | null>(null);
const modalDraft = ref<Record<string, string>>({});

// ── Computed ───────────────────────────────────────────────────────────────
const missingCount = computed(
  () => scannedKeys.value.filter((k) => k.hasMissing).length,
);

const filteredKeys = computed(() => {
  let list = scannedKeys.value;

  // Missing filter: show only rows missing in ALL selected languages
  if (missingFilter.value.length) {
    list = list.filter((item) =>
      missingFilter.value.some((lang) => !item.translations[lang]),
    );
  }

  // Search filter
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (item) =>
        item.key.toLowerCase().includes(q) ||
        item.defaultValue.toLowerCase().includes(q) ||
        Object.values(item.translations).some((v) =>
          v.toLowerCase().includes(q),
        ) ||
        item.sources.some((s) => s.toLowerCase().includes(q)),
    );
  }

  return list;
});

// ── Helpers ────────────────────────────────────────────────────────────────
function missingCountByLang(lang: string) {
  return scannedKeys.value.filter((k) => !k.translations[lang]).length;
}

function toggleMissingFilter(lang: string) {
  const idx = missingFilter.value.indexOf(lang);
  if (idx === -1) missingFilter.value.push(lang);
  else missingFilter.value.splice(idx, 1);
}

// ── Copy for AI ────────────────────────────────────────────────────────────
// ── Copy for AI ────────────────────────────────────────────────────────────
function copyForAI() {
  const visibleKeys = filteredKeys.value; // Use filtered keys instead of all keys

  if (visibleKeys.length === 0) {
    aiCopied.value = true;
    setTimeout(() => (aiCopied.value = false), 2500);
    return;
  }

  const lines: string[] = [
    `You are a professional translator. Translate the following UI strings into the missing languages.`,
    `For each entry provide JSON in this format: { "key": "...", "translations": { "lang": "value" } }`,
    `Only provide translations for languages marked as MISSING. Keep the tone natural and UI-appropriate.`,
    ``,
    `Languages: ${languages.value.join(", ")}`,
    ``,
    `Keys to translate:`,
    ``,
  ];

  visibleKeys.forEach((item) => {
    const missingLangs = languages.value.filter((l) => !item.translations[l]);

    lines.push(`Key: ${item.key}`);
    lines.push(`Default (context): "${item.defaultValue}"`);
    if (item.sources.length) lines.push(`Used in: ${item.sources.join(", ")}`);

    languages.value.forEach((lang) => {
      if (item.translations[lang]) {
        lines.push(`  ${lang}: "${item.translations[lang]}" (existing)`);
      } else {
        lines.push(`  ${lang}: MISSING`);
      }
    });
    lines.push(``);
  });

  navigator.clipboard.writeText(lines.join("\n")).then(() => {
    aiCopied.value = true;
    setTimeout(() => (aiCopied.value = false), 2500);
  });
}
// ── Vite glob imports ──────────────────────────────────────────────────────
const vueModules = import.meta.glob("/src/**/*.vue", {
  as: "raw",
  eager: false,
});
const localeModules = import.meta.glob("/src/i18n/locales/*.json", {
  eager: false,
});

// ── Helpers ────────────────────────────────────────────────────────────────
function extractKeys(
  source: string,
  filename: string,
): Array<{ key: string; defaultValue: string; source: string }> {
  const results: Array<{ key: string; defaultValue: string; source: string }> =
    [];
  const regex = /\bl\(\s*(['"`])(.*?)\1\s*,\s*(['"`])(.*?)\3\s*\)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source)) !== null) {
    results.push({ defaultValue: match[2], key: match[4], source: filename });
  }
  return results;
}

function getNestedValue(
  obj: Record<string, any>,
  dotKey: string,
): string | undefined {
  return dotKey.split(".").reduce((acc, part) => acc?.[part], obj as any);
}

async function loadLocales(): Promise<Record<string, Record<string, any>>> {
  const result: Record<string, Record<string, any>> = {};
  await Promise.all(
    Object.entries(localeModules).map(async ([path, loader]) => {
      const langMatch = path.match(/\/([a-z]{2,5})\.json$/);
      if (!langMatch) return;
      const lang = langMatch[1];
      const mod = (await loader()) as { default: Record<string, any> };
      result[lang] = mod.default ?? mod;
    }),
  );
  return result;
}

// ── Scan ───────────────────────────────────────────────────────────────────
async function scanAllKeys() {
  scanning.value = true;
  scannedKeys.value = [];
  missingFilter.value = [];
  cancelEdit();

  try {
    const locales = await loadLocales();
    languages.value = Object.keys(locales).sort();

    // key → { defaultValue, sources[] }
    const keyMap = new Map<
      string,
      { defaultValue: string; sources: Set<string> }
    >();

    await Promise.all(
      Object.entries(vueModules).map(async ([filePath, loader]) => {
        const source = await loader();
        // Get just the filename for display
        const filename = filePath.split("/").pop() ?? filePath;
        extractKeys(source, filename).forEach(
          ({ key, defaultValue, source: src }) => {
            if (!keyMap.has(key)) {
              keyMap.set(key, { defaultValue, sources: new Set([src]) });
            } else {
              keyMap.get(key)!.sources.add(src);
            }
          },
        );
      }),
    );

    const rows: KeyItem[] = [];
    keyMap.forEach(({ defaultValue, sources }, key) => {
      const translations: Record<string, string> = {};
      let hasMissing = false;
      languages.value.forEach((lang) => {
        const val = getNestedValue(locales[lang] ?? {}, key) ?? "";
        translations[lang] = val;
        if (!val) hasMissing = true;
      });
      rows.push({
        key,
        defaultValue,
        sources: Array.from(sources),
        translations,
        hasMissing,
      });
    });

    rows.sort((a, b) => {
      if (a.hasMissing !== b.hasMissing) return a.hasMissing ? -1 : 1;
      return a.key.localeCompare(b.key);
    });

    scannedKeys.value = rows;
  } finally {
    scanning.value = false;
  }
}

// ── API ────────────────────────────────────────────────────────────────────
async function updateTranslation(
  key: string,
  translations: Record<string, string>,
) {
  const res = await fetch(`/api/translations/${encodeURIComponent(key)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, translations }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
}

function applyToTable(key: string, translations: Record<string, string>) {
  const row = scannedKeys.value.find((r) => r.key === key);
  if (!row) return;
  languages.value.forEach((lang) => {
    if (translations[lang] !== undefined)
      row.translations[lang] = translations[lang];
  });
  row.hasMissing = languages.value.some((lang) => !row.translations[lang]);
}

// ── Inline edit ────────────────────────────────────────────────────────────
function startInlineEdit(item: KeyItem) {
  editingKey.value = item.key;
  editDraft.value = { ...item.translations };
  saveError.value = "";
}

function cancelEdit() {
  editingKey.value = null;
  editDraft.value = {};
  saveError.value = "";
}

async function saveInline(item: KeyItem) {
  saving.value = true;
  saveError.value = "";
  try {
    await updateTranslation(item.key, editDraft.value);
    applyToTable(item.key, editDraft.value);
    cancelEdit();
  } catch (e: any) {
    saveError.value = e.message;
  } finally {
    saving.value = false;
  }
}

// ── Modal edit ─────────────────────────────────────────────────────────────
function openModal(item: KeyItem) {
  modalItem.value = item;
  modalDraft.value = { ...item.translations };
  saveError.value = "";
}

function closeModal() {
  modalItem.value = null;
  modalDraft.value = {};
  saveError.value = "";
}

async function saveModal() {
  if (!modalItem.value) return;
  saving.value = true;
  saveError.value = "";
  try {
    await updateTranslation(modalItem.value.key, modalDraft.value);
    applyToTable(modalItem.value.key, modalDraft.value);
    closeModal();
  } catch (e: any) {
    saveError.value = e.message;
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.translate-words-page {
  padding: 24px;
  max-width: 1400px;
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

/* ── Toolbar ── */
.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  flex-wrap: wrap;
}

.btn-scan {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--primary, #6366f1);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.btn-scan:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.scan-info {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.missing-count {
  color: var(--danger);
  font-weight: 600;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 13px;
  background: var(--input-bg, #fff);
  color: var(--text-primary);
  width: 200px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--primary, #6366f1);
}

/* Copy for AI button */
.btn-copy-ai {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--success-light);
  color: var(--success);
  border: 1px solid var(--success-light);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-copy-ai.copied {
  background: var(--success);
  color: #fff;
  border-color: var(--success);
}

/* ── Filter bar ── */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--body-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
}

.filter-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-secondary);
  background: var(--card-bg, #fff);
  transition: all 0.15s;
  user-select: none;
}

.filter-checkbox input {
  display: none;
}

.filter-checkbox.active {
  background: var(--danger-light);
  border-color: var(--danger);
  color: var(--danger);
}

.filter-count {
  font-weight: 400;
  opacity: 0.7;
}

.btn-clear-filter {
  background: none;
  border: none;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

/* ── Table ── */
.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  margin-bottom: 24px;
}

.keys-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.keys-table th {
  padding: 10px 14px;
  background: var(--body-bg);
  color: var(--text-secondary);
  font-weight: 600;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.keys-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.keys-table tr:last-child td {
  border-bottom: none;
}

.col-key code {
  background: var(--code-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  color: var(--primary);
}

.col-default {
  color: var(--text-secondary);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Context / source column */
.col-context {
  max-width: 180px;
}

.source-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.source-badge {
  display: inline-block;
  padding: 1px 6px;
  background: var(--code-bg);
  color: var(--text-secondary);
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  white-space: nowrap;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-actions {
  white-space: nowrap;
}

.col-actions > * {
  display: inline-flex;
}

.row-missing {
  background: var(--danger-light);
}

.row-editing {
  background: var(--primary-light);
  outline: 2px solid var(--primary);
  outline-offset: -1px;
}

.cell-ok {
  color: var(--text-primary);
}

.cell-missing {
  text-align: center;
}

.cell-editing {
  padding: 6px 10px !important;
}

.missing-badge {
  display: inline-block;
  padding: 2px 8px;
  background: var(--danger-light);
  color: var(--danger);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.inline-input {
  width: 100%;
  min-width: 120px;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 13px;
  background: var(--input-bg);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s;
}

.inline-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.btn-action {
  padding: 5px 10px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  white-space: nowrap;
  margin-right: 4px;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-edit {
  background: var(--primary-light);
  color: var(--primary);
}

.btn-modal {
  background: var(--border-color);
  color: var(--text-secondary);
  font-size: 14px;
}

.btn-save {
  background: var(--success);
  color: #fff;
}

.btn-cancel {
  background: var(--border-color);
  color: var(--text-secondary);
}

.empty-search {
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

/* ── Modal ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal {
  background: var(--card-bg);
  border-radius: 14px;
  width: 100%;
  max-width: 540px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.modal-key {
  font-size: 12px;
  background: var(--code-bg);
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--primary);
  font-family: monospace;
}

.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
  border-radius: 4px;
}

.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.label-missing {
  background: var(--danger-light);
  color: var(--danger);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 10px;
  text-transform: none;
  letter-spacing: 0;
}

.field-default {
  padding: 10px 12px;
  background: var(--code-bg);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.modal-sources {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.modal-divider {
  height: 1px;
  background: var(--border-color);
  margin: 4px 0;
}

.modal-input {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background: var(--input-bg);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s;
}

.modal-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
}

.save-error {
  font-size: 12px;
  color: var(--danger);
  flex: 1;
}

.btn-cancel-modal {
  padding: 9px 18px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-save-modal {
  padding: 9px 20px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-save-modal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
