<template>
  <aside
    ref="asideRef"
    class="app-aside"
    :class="{
      'is-collapsed': !isEffectivelyOpen,
      'is-hover-expanded': isHoverExpanded,
    }"
    @mouseenter="onAsideEnter"
    @mouseleave="onAsideLeave"
  >
    <nav class="nav-list">
      <template v-for="item in menuItems" :key="item.key">
        <div class="nav-group-wrapper">
          <div
            class="nav-item"
            :class="{
              active: isItemActive(item) || isChildActive(item),
              'is-group': item.children,
            }"
            @click="handleItemClick(item)"
            :title="!isEffectivelyOpen ? item.label : ''"
          >
            <span class="nav-icon" v-html="item.icon" />

            <Transition name="fade">
              <span v-if="isEffectivelyOpen" class="nav-label">{{
                item.label
              }}</span>
            </Transition>

            <template v-if="isEffectivelyOpen">
              <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
              <span
                v-if="item.children"
                class="nav-arrow"
                :class="{ open: isGroupOpen(item.key) }"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </template>
          </div>

          <Transition name="expand">
            <div
              v-if="item.children && isGroupOpen(item.key) && isEffectivelyOpen"
              class="nav-children"
            >
              <div
                v-for="child in item.children"
                :key="child.key"
                class="nav-item nav-child-item"
                :class="{ active: isItemActive(child) }"
                @click="handleItemClick(child)"
              >
                <span class="nav-label">{{ child.label }}</span>
              </div>
            </div>
          </Transition>
        </div>
      </template>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{ collapsed?: boolean }>();
const router = useRouter();
const route = useRoute();

const isHoverExpanded = ref(false);
const isAsideOpen = ref(true);
const openGroups = ref<string[]>([]);
let hoverLeaveTimer: any = null;

const svg = {
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  analytics: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  workforce: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  employees: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  attendance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  leave: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  finance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  payroll: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  benefits: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>`,
  system: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  reports: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
  themes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0110 10 10 10 0 01-10 10 10 10 0 00-10-10 10 10 0 0010-10z"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>`,
};

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: svg.dashboard, route: "/" },
  {
    key: "analytics",
    label: "Analytics",
    icon: svg.analytics,
    route: "/analytics",
  },
  {
    key: "workforce",
    label: "Workforce",
    icon: svg.workforce,
    badge: "15",
    children: [
      { key: "employees", label: "Employees", route: "/employees" },
      { key: "attendance", label: "Attendance", route: "/attendance" },
    ],
  },
  {
    key: "finance",
    label: "Finance",
    icon: svg.finance,
    children: [{ key: "payroll", label: "Payroll", route: "/payroll" }],
  },
  {
    key: "language",
    label: "Language",
    icon: svg.language,
    children: [
      {
        key: "languages",
        label: "Languages",
        route: "/admin/language/languages",
      },
      {
        key: "translate",
        label: "Translate Words",
        route: "/admin/language/translate",
      },
    ],
  },
  {
    key: "system",
    label: "System",
    icon: svg.system,
    children: [{ key: "settings", label: "Settings", route: "/settings" }],
  },
  {
    key: "theme",
    label: "Theme Management",
    icon: svg.system,
    route: "/settings/themes",
  },
];

const isEffectivelyOpen = computed(() => {
  if (props.collapsed !== undefined)
    return !props.collapsed || isHoverExpanded.value;
  return isAsideOpen.value || isHoverExpanded.value;
});

const onAsideEnter = () => {
  if (hoverLeaveTimer) clearTimeout(hoverLeaveTimer);
  if (!isAsideOpen.value) isHoverExpanded.value = true;
};

const onAsideLeave = () => {
  hoverLeaveTimer = setTimeout(() => {
    isHoverExpanded.value = false;
  }, 150);
};

// Route asosida active aniqlash
const isItemActive = (item: any) => {
  // Agar itemning o'z route'i bor bo'lsa
  if (item.route) {
    return route.path === item.route || route.path.startsWith(item.route + "/");
  }
  return false;
};

// Itemning childrenlaridan biri active bo'lsa
const isChildActive = (item: any) => {
  if (!item.children) return false;

  return item.children.some(
    (child: any) =>
      route.path === child.route || route.path.startsWith(child.route + "/"),
  );
};

const isGroupOpen = (key: string) => {
  return openGroups.value.includes(key);
};

const toggleGroup = (key: string) => {
  // Sidebar yopiq bo'lsa submenu ochilmasin
  if (!isEffectivelyOpen.value) return;

  const index = openGroups.value.indexOf(key);
  if (index > -1) {
    openGroups.value.splice(index, 1);
  } else {
    // Faqat bitta group ochiq bo'lishi uchun
    openGroups.value = [key];
  }
};

const handleItemClick = (item: any) => {
  if (item.children) {
    // Group item: submenuni ochish/yopish
    toggleGroup(item.key);
  } else if (item.route) {
    // Oddiy item: navigatsiya
    router.push(item.route);
  }
};

// Route o'zgarganda group larni avtomatik ochish
watch(
  () => route.path,
  (newPath) => {
    // Active bo'lgan itemning parent groupini ochish
    const parentItem = menuItems.find((item) =>
      item.children?.some(
        (child: any) =>
          newPath === child.route || newPath.startsWith(child.route + "/"),
      ),
    );

    if (parentItem) {
      openGroups.value = [parentItem.key];
    } else {
      // Agar hech qanday group active bo'lmasa, hammasini yop
      openGroups.value = [];
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.app-aside {
  --aside-bg: var(--sidebar-bg);
  --item-active-bg: var(--primary-light);
  --accent-color: var(--primary);
  --text-main: var(--text-primary);
  --icon-color: var(--text-secondary);
  --hover-bg: var(--sidebar-hover-bg);
  --border-color: var(--border-color);
  --badge-bg: var(--primary-light);
  --badge-text: var(--primary);
  --arrow-color: var(--text-secondary);

  width: 260px;
  height: 100vh;
  background: var(--aside-bg);
  display: flex;
  flex-direction: column;
  transition:
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.3s ease,
    border-color 0.3s ease;
  border-right: 1px solid var(--border-color);
  position: relative;
  z-index: 1000;
  font-family: "Inter", sans-serif;
}

.nav-list {
  flex: 1;
  padding: 12px 16px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-main);
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
}

.nav-item:hover {
  background: var(--hover-bg);
}

/* Active holat - o'zi active bo'lsa */
.nav-item.active {
  background: var(--item-active-bg);
  color: var(--accent-color);
}

.nav-item.active .nav-icon {
  color: var(--accent-color);
}

/* Child active bo'lganda parentning active holati */
.nav-item.is-group.child-active {
  background: var(--item-active-bg);
  color: var(--accent-color);
}

.nav-item.is-group.child-active .nav-icon {
  color: var(--accent-color);
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--icon-color);
  transition: color 0.3s ease;
}

.nav-icon :deep(svg) {
  width: 100%;
  height: 100%;
  stroke-width: 1.5;
}

.nav-label {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
}

.nav-badge {
  background: var(--badge-bg);
  color: var(--badge-text);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

.nav-arrow {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  color: var(--arrow-color);
  transition:
    transform 0.2s,
    color 0.3s ease;
}

.nav-arrow svg {
  width: 14px;
  height: 14px;
  stroke-width: 2.5;
}

.nav-arrow.open {
  transform: rotate(180deg);
}

.nav-children {
  padding-left: 36px;
  margin-bottom: 8px;
}

.nav-child-item {
  padding: 8px 16px;
  font-size: 14px;
  color: var(--text-main);
  border-radius: 6px;
}

.nav-child-item.active {
  background: var(--item-active-bg);
  color: var(--accent-color);
  font-weight: 500;
}

/* Collapsed holat */
.is-collapsed:not(.is-hover-expanded) {
  width: 80px;
}

.is-collapsed:not(.is-hover-expanded) .nav-item {
  padding: 12px;
  justify-content: center;
}

.is-collapsed:not(.is-hover-expanded) .nav-icon {
  margin: 0;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
  max-height: 200px;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
</style>
