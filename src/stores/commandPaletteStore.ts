/**
 * Command Palette Store
 * Global search va navigation boshqaruvi
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { SearchItem } from "@/data/searchIndex";
import { allSearchItems, getItemById } from "@/data/searchIndex";
import { useThemeStore } from "./themeStore";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const STORAGE_KEY = "hrm-recent-searches";
const MAX_RECENT_ITEMS = 5;

export const useCommandPaletteStore = defineStore("commandPalette", () => {
  // State
  const isOpen = ref(false);
  const query = ref("");
  const recentItems = ref<SearchItem[]>([]);
  const activeIndex = ref(0);

  // Theme store va i18n
  const themeStore = useThemeStore();
  const { locale, availableLocales } = useI18n();
  const router = useRouter();

  // Action handlers - harakatlar uchun funksiyalar
  const actionHandlers: Record<string, () => void> = {
    "action-toggle-dark-mode": () => {
      themeStore.toggleMode();
    },
    "action-change-language": () => {
      // Aylana keyingi tilga o'tish
      const currentLocale = locale.value;
      if (currentLocale) {
        const currentIndex = availableLocales.indexOf(currentLocale);
        const nextIndex = (currentIndex + 1) % availableLocales.length;
        const nextLocale = availableLocales[nextIndex];
        if (nextLocale) {
          locale.value = nextLocale;
        }
      }
    },
    "action-refresh-page": () => {
      window.location.reload();
    },
    "action-go-top": () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    "action-export-table": () => {
      // Jadval ma'lumotlarini eksport qilish (placeholder)
      alert("Export functionality would be implemented here");
    },
  };

  // Fuzzy search logikasi
  function fuzzyMatch(text: string, searchQuery: string): boolean {
    const normalizedText = text.toLowerCase();
    const normalizedQuery = searchQuery.toLowerCase();

    // Bo'sh qidiruv - hamma narsa mos keladi
    if (!normalizedQuery.trim()) return true;

    // Har bir so'zni alohida tekshirish
    const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 0);

    return queryWords.every((word) => {
      // To'liq so'z yoki qismatchilik
      return normalizedText.includes(word);
    });
  }

  // Filtered items - qidiruv bo'yicha filtrlangan
  const filteredItems = computed(() => {
    if (!query.value.trim()) {
      return [];
    }

    return allSearchItems.filter((item) => {
      // Label da qidirish
      if (fuzzyMatch(item.label, query.value)) return true;

      // Description da qidirish
      if (item.description && fuzzyMatch(item.description, query.value))
        return true;

      // Keywords da qidirish
      if (
        item.keywords &&
        item.keywords.some((kw) => fuzzyMatch(kw, query.value))
      )
        return true;

      return false;
    });
  });

  // Grouped items - kategoriya bo'yicha guruhlangan
  const groupedItems = computed(() => {
    const groups: {
      recent: SearchItem[];
      pages: SearchItem[];
      tabs: SearchItem[];
      actions: SearchItem[];
    } = {
      recent: [],
      pages: [],
      tabs: [],
      actions: [],
    };

    if (query.value.trim()) {
      for (const item of items) {
        console.log("Item:", item);
        if (item.category === "page") {
          groups.pages.push(item);
        } else if (item.category === "tab") {
          groups.tabs.push(item);
        } else if (item.category === "action") {
          groups.actions.push(item);
        }
      }
    } else {
      // Qidiruv bo'sh bo'lsa - Recent + har bir kategoriyadan max 5 ta
      groups.recent = recentItems.value.slice(0, MAX_RECENT_ITEMS);

      // Pages
      const pageItems = allSearchItems.filter((i) => i.category === "page");
      groups.pages = pageItems.slice(0, 5);

      // Tabs
      const tabItems = allSearchItems.filter((i) => i.category === "tab");
      groups.tabs = tabItems.slice(0, 5);

      // Actions
      const actionItems = allSearchItems.filter((i) => i.category === "action");
      groups.actions = actionItems.slice(0, 5);
    }

    return groups;
  });

  // Flat list for keyboard navigation
  const flatItems = computed(() => {
    const { recent, pages, tabs, actions } = groupedItems.value;
    return [...recent, ...pages, ...tabs, ...actions];
  });

  // Recent items ni localStorage dan yuklash
  function loadRecentItems() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          recentItems.value = parsed
            .map((id: string) => getItemById(id))
            .filter((item): item is SearchItem => item !== undefined);
        }
      }
    } catch (error) {
      console.error("Failed to load recent items:", error);
      recentItems.value = [];
    }
  }

  // Recent items ni localStorage ga saqlash
  function saveRecentItems() {
    try {
      const ids = recentItems.value.map((item) => item.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error("Failed to save recent items:", error);
    }
  }

  // Item ni recent ga qo'shish
  function addToRecent(item: SearchItem) {
    // Agar allaqachon recent da bo'lsa, oldinga o'tkazish
    const existingIndex = recentItems.value.findIndex((i) => i.id === item.id);
    if (existingIndex !== -1) {
      recentItems.value.splice(existingIndex, 1);
    }

    // Oldinga qo'shish
    recentItems.value.unshift(item);

    // Max 5 ta
    if (recentItems.value.length > MAX_RECENT_ITEMS) {
      recentItems.value = recentItems.value.slice(0, MAX_RECENT_ITEMS);
    }

    saveRecentItems();
  }

  // Modalni ochish
  function open() {
    isOpen.value = true;
    query.value = "";
    activeIndex.value = 0;
    loadRecentItems();
  }

  // Modalni yopish
  function close() {
    isOpen.value = false;
    query.value = "";
    activeIndex.value = 0;
  }

  // Modalni toggle qilish
  function toggle() {
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  }

  // Item tanlash
  function selectItem(item: SearchItem) {
    // Recent ga qo'shish
    addToRecent(item);

    // Action bo'lsa, handler ni chaqirish
    const handler = actionHandlers[item.id];
    if (item.category === "action" && handler) {
      handler();
      close();
      return;
    }

    // Path bo'lsa, router orqali o'tish
    if (item.path) {
      if (item.query) {
        router.push({
          path: item.path,
          query: { ...item.query },
        });
      } else {
        router.push(item.path);
      }
    }

    close();
  }

  // Keyboard navigation
  function navigateUp() {
    if (flatItems.value.length === 0) return;
    activeIndex.value = Math.max(0, activeIndex.value - 1);
  }

  function navigateDown() {
    if (flatItems.value.length === 0) return;
    activeIndex.value = Math.min(
      flatItems.value.length - 1,
      activeIndex.value + 1,
    );
  }

  function selectActive() {
    if (flatItems.value.length > 0 && activeIndex.value >= 0) {
      const item = flatItems.value[activeIndex.value];
      if (item) {
        selectItem(item);
      }
    }
  }

  // Initialize
  loadRecentItems();

  return {
    // State
    isOpen,
    query,
    recentItems,
    activeIndex,

    // Computed
    filteredItems,
    groupedItems,
    flatItems,

    // Methods
    open,
    close,
    toggle,
    selectItem,
    addToRecent,
    navigateUp,
    navigateDown,
    selectActive,
    loadRecentItems,
  };
});
