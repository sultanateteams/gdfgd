<template>
  <div class="sidebar-nav-wrapper">
    <a-menu
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
      :items="menuItems"
      class="hrm-menu"
      :class="{ 'collapsed': collapsed }"
      @click="handleMenuClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{
  collapsed?: boolean;
}>();

const route = useRoute();
const router = useRouter();

const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);

function makeIcon(svgStr: string) {
  return () => h("span", { class: "menu-icon", innerHTML: svgStr });
}

function labelBadge(text: string, badge: string, ml?: number) {
  return h("span", { class: "menu-label-row" }, [
    h("span", text),
    h("span", { class: "menu-badge", style: { marginLeft: ml + "px" } }, badge),
  ]);
}

const svg = {
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  analytics: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  workforce: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  attendance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  leave: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  finance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  payroll: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  benefits: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/></svg>`,
  reports: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
};

const routeKeyMap: Record<string, string> = {
  "/": "dashboard",
  "/analytics": "analytics",
  "/employees": "employees",
  "/attendance": "attendance",
  "/leave": "leave",
  "/payroll": "payroll",
  "/benefits": "benefits",
  "/reports": "reports",
  "/settings": "settings",
};
const keyRouteMap = Object.fromEntries(
  Object.entries(routeKeyMap).map(([k, v]) => [v, k]),
);
const keyParentMap: Record<string, string> = {
  employees: "workforce",
  attendance: "workforce",
  leave: "workforce",
  payroll: "finance",
  benefits: "finance",
  reports: "system",
  settings: "system",
};

// ─── TRICK: collapsed holatda children bo'lmagan itemlarga
// bitta "ghost" child beramiz — shu orqali Ant Design
// ularni ham submenu deb biladi va popup chiqaradi.
// Ghost child click qilinganda parent route ga o'tadi.
// ──────────────────────────────────────────────────────
function ghostChild(parentKey: string, label: string) {
  return {
    key: `${parentKey}__ghost`,
    label: label,
    icon: makeIcon(svg[parentKey as keyof typeof svg] || svg.dashboard),
    className: "ghost-menu-item",
  };
}

const menuItems = computed(() => {
  const c = props.collapsed;

  return [
    {
      key: "dashboard",
      className: "ghost-menu-item",
      icon: makeIcon(svg.dashboard),
      style: { color: "#cbd5e1" },
      label: c ? "" : "Dashboard",
      ...(c ? { children: [ghostChild("dashboard", "Dashboard")] } : {}),
    },
    {
      key: "analytics",
      icon: makeIcon(svg.analytics),
      label: c ? "" : "Analytics",
      ...(c ? { children: [ghostChild("analytics", "Analytics")] } : {}),
    },
    {
      key: "workforce",
      icon: makeIcon(svg.workforce),
      label: c ? "" : labelBadge("Workforce", "15", 55),
      children: [
        { key: "employees", icon: makeIcon(svg.workforce), label: "Employees" },
        {
          key: "attendance",
          icon: makeIcon(svg.attendance),
          label: "Attendance",
        },
        { key: "leave", icon: makeIcon(svg.leave), label: "Leave Mgmt" },
      ],
    },
    {
      key: "finance",
      icon: makeIcon(svg.finance),
      label: c ? "" : "Finance",
      children: [
        { key: "payroll", icon: makeIcon(svg.payroll), label: "Payroll" },
        { key: "benefits", icon: makeIcon(svg.benefits), label: "Benefits" },
      ],
    },
    {
      key: "system",
      icon: makeIcon(svg.reports),
      label: c ? "" : "System",
      children: [
        { key: "reports", icon: makeIcon(svg.reports), label: "Reports" },
        { key: "settings", icon: makeIcon(svg.settings), label: "Settings" },
      ],
    },
  ];
});

watch(
  () => route.path,
  (path) => {
    const key = routeKeyMap[path] || "dashboard";
    selectedKeys.value = [key];
    if (!props.collapsed) {
      const parent = keyParentMap[key];
      if (parent) openKeys.value = [parent];
    }
  },
  { immediate: true },
);

watch(
  () => props.collapsed,
  (val) => {
    if (val) openKeys.value = [];
  },
);

function handleMenuClick({ key }: { key: string }) {
  // Ghost child bosilsa → parent key ga o'tkazamiz
  const realKey = key.endsWith("__ghost") ? key.replace("__ghost", "") : key;
  const path = keyRouteMap[realKey];
  if (path) {
    selectedKeys.value = [realKey];
    router.push(path);
  }
}
</script>

<style>
.hrm-menu.ant-menu {
  background: transparent !important;
  border-inline-end: none !important;
  padding: 4px 12px;
  font-family: inherit;
  width: 100% !important;
}

.hrm-menu .ant-menu-item,
.hrm-menu .ant-menu-submenu-title {
  border-radius: 6px !important;
  margin: 4px 0 !important;
  height: 40px !important;
  line-height: 40px !important;
  color: var(--text-primary) !important;
  transition: all 0.2s ease !important;
  width: 100%;
}

.hrm-menu .ant-menu-item:hover,
.hrm-menu .ant-menu-submenu-title:hover {
  background: var(--sidebar-hover-bg) !important;
  color: var(--primary) !important;
}

.hrm-menu .ant-menu-item-selected {
  background: var(--sidebar-active-bg) !important;
  color: var(--primary) !important;
}
.hrm-menu .ant-menu-item-selected::after {
  display: none !important;
}

.hrm-menu .ant-menu-submenu-open > .ant-menu-submenu-title,
.hrm-menu .ant-menu-submenu-selected > .ant-menu-submenu-title {
  color: var(--primary) !important;
}

.hrm-menu .ant-menu-sub.ant-menu-inline {
  background: transparent !important;
}

.hrm-menu .ant-menu-sub .ant-menu-item {
  padding-inline-start: 48px !important;
  height: 40px !important;
  line-height: 40px !important;
}

.hrm-menu .ant-menu-submenu-arrow {
  color: var(--text-secondary) !important;
}

.hrm-menu.collapsed .ant-menu-submenu-arrow {
 display: none !important;
}

.hrm-menu.collapsed .ant-menu-title-content {
 display: none !important;
}

.hrm-menu .ant-menu-submenu-open .ant-menu-submenu-arrow,
.hrm-menu .ant-menu-submenu-selected .ant-menu-submenu-arrow {
  color: var(--primary) !important;
}

/* Collapsed */
.hrm-menu.ant-menu-inline-collapsed .ant-menu-item,
.hrm-menu.ant-menu-inline-collapsed .ant-menu-submenu-title {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding-inline: 0 !important;
  border-left: none !important;
}
.hrm-menu.ant-menu-inline-collapsed .ant-menu-item-selected {
  position: relative;
}
.hrm-menu.ant-menu-inline-collapsed .ant-menu-item-selected::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: var(--primary);
  border-radius: 0 2px 2px 0;
}

/* Icon */
.menu-icon {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 18px !important;
  height: 18px !important;
  line-height: 1 !important;
  vertical-align: middle !important;
  flex-shrink: 0;
}
.menu-icon svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  display: block;
}

/* Badge */
.menu-label-row {
  display: inline-flex !important;
  align-items: center !important;
  width: 100%;
  gap: 6px;
}
.menu-badge {
  margin-left: auto;
  background: #f59e0b;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 20px;
  line-height: 1.5;
}

/* Ghost item — popup ichida bitta katta havola ko'rinadi */
.ghost-menu-item.ant-menu-item {
  height: 40px !important;
  line-height: 40px !important;
  font-weight: 600 !important;
  font-size: 13.5px !important;
  color: #cbd5e1 !important;
  padding-inline: 14px !important;
}
.ghost-item {
  display: block;
  width: 100%;
}

/* Popup */
.ant-menu-submenu-popup .ant-menu {
  background: #1e293b !important;
  border-radius: 10px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
  padding: 6px !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  min-width: 180px !important;
  font-family: "DM Sans", system-ui, sans-serif !important;
}
.ant-menu-submenu-popup .ant-menu-item {
  border-radius: 7px !important;
  color: #94a3b8 !important;
  height: 36px !important;
  line-height: 36px !important;
  margin: 2px 0 !important;
  font-size: 13px !important;
  padding-inline: 12px !important;
}
.ant-menu-submenu-popup .ant-menu-item:hover {
  background: rgba(79, 70, 229, 0.12) !important;
  color: #cbd5e1 !important;
}
.ant-menu-submenu-popup .ant-menu-item-selected {
  background: rgba(79, 70, 229, 0.2) !important;
  color: #818cf8 !important;
}

/* Tooltip */
.ant-tooltip .ant-tooltip-inner {
  background: #1e293b !important;
  font-family: "DM Sans", system-ui, sans-serif !important;
  font-size: 13px !important;
  border-radius: 7px !important;
  padding: 6px 10px !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.ant-tooltip .ant-tooltip-arrow::before {
  background: #1e293b !important;
}
</style>
