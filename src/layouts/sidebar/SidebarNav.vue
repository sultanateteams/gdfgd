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
              v-if="
                item.children &&
                isGroupOpen(item.key) &&
                isEffectivelyOpen
              "
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
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  analytics: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>`,
  workforce: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  finance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 100 4h4a2 2 0 110 4H8"/></svg>`,
  system: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>`,
  language: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
  translate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2v3"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>`,
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
      { key: "languages", label: "Languages", route: "/admin/language/languages" },
      { key: "translate", label: "Translate Words", route: "/admin/language/translate" },
    ],
  },
  {
    key: "system",
    label: "System",
    icon: svg.system,
    children: [{ key: "settings", label: "Settings", route: "/settings" }],
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
    return route.path === item.route || route.path.startsWith(item.route + '/');
  }
  return false;
};

// Itemning childrenlaridan biri active bo'lsa
const isChildActive = (item: any) => {
  if (!item.children) return false;
  
  return item.children.some((child: any) => 
    route.path === child.route || route.path.startsWith(child.route + '/')
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
    const parentItem = menuItems.find(item => 
      item.children?.some((child: any) => 
        newPath === child.route || newPath.startsWith(child.route + '/')
      )
    );
    
    if (parentItem) {
      openGroups.value = [parentItem.key];
    } else {
      // Agar hech qanday group active bo'lmasa, hammasini yop
      openGroups.value = [];
    }
  },
  { immediate: true }
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
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, border-color 0.3s ease;
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
  transition: transform 0.2s, color 0.3s ease;
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