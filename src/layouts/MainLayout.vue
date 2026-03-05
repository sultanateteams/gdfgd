<template>
  <div
    class="layout"
    :class="{ 'sidebar-collapsed': isCollapsed, 'dark-mode': isDarkMode }"
  >
    <!-- Sidebar Overlay (mobile) -->
    <div
      v-if="isMobileOpen"
      class="sidebar-overlay"
      @click="closeMobileSidebar"
    />

    <!-- ═══════════════════════════════ SIDEBAR ═══════════════════════════════ -->
    <aside class="sidebar" :class="{ 'mobile-open': isMobileOpen }">
      <!-- Logo Area -->
      <div class="sidebar-logo">
        <div class="logo-icon" v-if="!isCollapsed">
          <svg viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#4F46E5" />
            <path
              d="M8 22L16 10L24 22"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="16" cy="10" r="2" fill="#06B6D4" />
          </svg>
        </div>
        <div class="logo-text" v-if="!isCollapsed">
          <span class="logo-name">HRM System</span>
          <span class="logo-version">v2.0</span>
        </div>
        <button
          class="hamburger-btn"
          @click="toggleSidebar"
          aria-label="Toggle sidebar"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <!-- Main Menu -->
        <div class="nav-group">
          <span class="nav-group-label">Main Menu</span>
          <RouterLink
            v-for="item in mainMenuItems"
            :key="item.name"
            :to="item.to"
            class="nav-item"
            :class="{ active: isActive(item.to) }"
            :title="isCollapsed ? item.label : ''"
          >
            <span class="nav-icon" v-html="item.icon" />
            <span class="nav-label" v-if="!isCollapsed">{{ item.label }}</span>
            <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
          </RouterLink>
        </div>

        <!-- Workforce -->
        <div class="nav-group">
          <span class="nav-group-label">Workforce</span>
          <RouterLink
            v-for="item in workforceItems"
            :key="item.name"
            :to="item.to"
            class="nav-item"
            :class="{ active: isActive(item.to) }"
            :title="isCollapsed ? item.label : ''"
          >
            <span class="nav-icon" v-html="item.icon" />
            <span class="nav-label" v-if="!isCollapsed">{{ item.label }}</span>
            <span v-if="item.badge && !isCollapsed" class="nav-badge">{{ item.badge }}</span>
          </RouterLink>
        </div>

        <!-- Finance -->
        <div class="nav-group">
          <span class="nav-group-label">Finance</span>
          <RouterLink
            v-for="item in financeItems"
            :key="item.name"
            :to="item.to"
            class="nav-item"
            :class="{ active: isActive(item.to) }"
            :title="isCollapsed ? item.label : ''"
          >
            <span class="nav-icon" v-html="item.icon" />
            <span class="nav-label" v-if="!isCollapsed">{{ item.label }}</span>
            <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
          </RouterLink>
        </div>

        <!-- System -->
        <div class="nav-group">
          <span class="nav-group-label">System</span>
          <RouterLink
            v-for="item in systemItems"
            :key="item.name"
            :to="item.to"
            class="nav-item"
            :class="{ active: isActive(item.to) }"
            :title="isCollapsed ? item.label : ''"
          >
            <span class="nav-icon" v-html="item.icon" />
            <span class="nav-label" v-if="!isCollapsed">{{ item.label }}</span>
            <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
          </RouterLink>
        </div>
      </nav>
    </aside>

    <!-- ═══════════════════════════════ MAIN AREA ═══════════════════════════════ -->
    <div class="main-area">
      <!-- ─────────── HEADER ─────────── -->
      <header class="header">
        <!-- Left: Breadcrumb -->
        <div class="header-left">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <span class="breadcrumb-home">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                width="14"
                height="14"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </span>
            <span class="breadcrumb-sep">›</span>
            <span class="breadcrumb-current">{{ currentPageName }}</span>
          </nav>
        </div>

        <!-- Center: Search -->
        <div class="header-search">
          <div class="search-wrapper">
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
              type="text"
              class="search-input"
              placeholder="Search employees, reports..."
              v-model="searchQuery"
            />
            <kbd class="search-kbd">⌘K</kbd>
          </div>
        </div>

        <!-- Right: Actions + User -->
        <div class="header-right">
          <!-- Theme Toggle -->
          <button
            class="icon-btn"
            @click="toggleDarkMode"
            :title="isDarkMode ? 'Light mode' : 'Dark mode'"
          >
            <svg
              v-if="isDarkMode"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="5" />
              <path
                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>

          <!-- Notifications -->
          <div class="notif-wrapper" @click="toggleNotifDropdown">
            <button class="icon-btn notif-btn" aria-label="Notifications">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                />
              </svg>
              <span class="notif-badge pulse">5</span>
            </button>

            <!-- Notif Dropdown -->
            <div
              class="dropdown notif-dropdown"
              v-if="showNotifDropdown"
              @click.stop
            >
              <div class="dropdown-header">
                <span>Notifications</span>
                <button class="mark-read-btn">Mark all read</button>
              </div>
              <div class="notif-list">
                <div class="notif-item unread">
                  <div class="notif-dot"></div>
                  <div class="notif-content">
                    <p>New leave request from <strong>Sara Lee</strong></p>
                    <span>2 minutes ago</span>
                  </div>
                </div>
                <div class="notif-item unread">
                  <div class="notif-dot"></div>
                  <div class="notif-content">
                    <p>Payroll processing completed</p>
                    <span>1 hour ago</span>
                  </div>
                </div>
                <div class="notif-item">
                  <div class="notif-dot"></div>
                  <div class="notif-content">
                    <p>New employee <strong>John Smith</strong> onboarded</p>
                    <span>3 hours ago</span>
                  </div>
                </div>
              </div>
              <div class="dropdown-footer">
                <RouterLink to="/notifications"
                  >View all notifications →</RouterLink
                >
              </div>
            </div>
          </div>

          <div class="header-divider"></div>

          <!-- User Menu -->
          <div class="user-menu-wrapper" @click="toggleUserDropdown">
            <div class="user-trigger">
              <div class="user-avatar">JD</div>
              <div class="user-meta">
                <span class="user-name">John Doe</span>
                <span class="user-role">Administrator</span>
              </div>
              <svg
                class="chevron"
                :class="{ rotated: showUserDropdown }"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            <!-- User Dropdown -->
            <div
              class="dropdown user-dropdown"
              v-if="showUserDropdown"
              @click.stop
            >
              <RouterLink to="/profile" class="dropdown-item">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile
              </RouterLink>
              <RouterLink to="/settings" class="dropdown-item">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path
                    d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                  />
                </svg>
                Settings
              </RouterLink>
              <div class="dropdown-sep"></div>
              <button class="dropdown-item danger" @click="handleLogout">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- ─────────── PAGE CONTENT ─────────── -->
      <main class="page-content">
        <RouterView />
      </main>
    </div>

    <!-- Click outside to close dropdowns -->
    <div
      v-if="showUserDropdown || showNotifDropdown"
      class="click-outside"
      @click="closeAllDropdowns"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, RouterLink, RouterView } from "vue-router";

const emit = defineEmits<{
  "sidebar-toggle": [collapsed: boolean];
}>();

const route = useRoute();

// State
const isCollapsed = ref(false);
const isMobileOpen = ref(false);
const isDarkMode = ref(false);
const showUserDropdown = ref(false);
const showNotifDropdown = ref(false);
const searchQuery = ref("");


// Navigation Items
const mainMenuItems = [
  {
    name: "dashboard",
    label: "Dashboard",
    to: "/",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
    badge: null,
  },
  {
    name: "analytics",
    label: "Analytics",
    to: "/analytics",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    badge: null,
  },
];

const workforceItems = [
  {
    name: "employees",
    label: "Employees",
    to: "/employees",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
    badge: null,
  },
  {
    name: "attendance",
    label: "Attendance",
    to: "/attendance",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    badge: "3",
  },
  {
    name: "leave",
    label: "Leave Management",
    to: "/leave",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    badge: "12",
  },
];

const financeItems = [
  {
    name: "payroll",
    label: "Payroll",
    to: "/payroll",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
    badge: null,
  },
  {
    name: "benefits",
    label: "Benefits",
    to: "/benefits",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>`,
    badge: null,
  },
];

const systemItems = [
  {
    name: "reports",
    label: "Reports",
    to: "/reports",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    badge: null,
  },
  {
    name: "settings",
    label: "Settings",
    to: "/settings",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
    badge: null,
  },
];

// Computed
const currentPageName = computed(() => {
  const allItems = [
    ...mainMenuItems,
    ...workforceItems,
    ...financeItems,
    ...systemItems,
  ];
  const current = allItems.find(
    (item) => route.path === item.to || route.path.startsWith(item.to + "/"),
  );
  return current?.label ?? "Dashboard";
});

// Methods
function isActive(path: string): boolean {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
}

function toggleSidebar() {
  const width = window.innerWidth;
  if (width < 768) {
    isMobileOpen.value = !isMobileOpen.value;
  } else {
    isCollapsed.value = !isCollapsed.value;
    emit("sidebar-toggle", isCollapsed.value);
  }
}

function closeMobileSidebar() {
  isMobileOpen.value = false;
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
}

function toggleUserDropdown() {
  showUserDropdown.value = !showUserDropdown.value;
  if (showUserDropdown.value) showNotifDropdown.value = false;
}

function toggleNotifDropdown() {
  showNotifDropdown.value = !showNotifDropdown.value;
  if (showNotifDropdown.value) showUserDropdown.value = false;
}

function closeAllDropdowns() {
  showUserDropdown.value = false;
  showNotifDropdown.value = false;
}

function handleLogout() {
  closeAllDropdowns();
  // Add logout logic here
}

// Handle resize
function handleResize() {
  if (window.innerWidth >= 768) {
    isMobileOpen.value = false;
  }
}

onMounted(() => window.addEventListener("resize", handleResize));
onUnmounted(() => window.removeEventListener("resize", handleResize));
</script>

<style scoped>
/* ═══════════════════════════════════════════
   CSS CUSTOM PROPERTIES
═══════════════════════════════════════════ */
.layout {
  --primary: #4f46e5;
  --primary-dark: #3730a3;
  --primary-light: #eef2ff;
  --accent: #06b6d4;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;

  --sidebar-bg: #0f172a;
  --sidebar-text: #94a3b8;
  --sidebar-text-hover: #cbd5e1;
  --sidebar-active-bg: rgba(79, 70, 229, 0.15);
  --sidebar-hover-bg: rgba(255, 255, 255, 0.05);
  --sidebar-group-label: #475569;
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 72px;

  --header-bg: #ffffff;
  --header-border: #e2e8f0;
  --header-height: 64px;

  --body-bg: #f8fafc;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --card-bg: #ffffff;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md:
    0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg:
    0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --radius: 10px;
  --transition: cubic-bezier(0.4, 0, 0.2, 1);

  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--body-bg);
  font-family:
    "DM Sans",
    "Segoe UI",
    system-ui,
    -apple-system,
    sans-serif;
}

/* Dark Mode */
.layout.dark-mode {
  --header-bg: #1e293b;
  --header-border: #334155;
  --body-bg: #0f172a;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #334155;
  --card-bg: #1e293b;
  --sidebar-bg: #020617;
  --sidebar-group-label: #334155;
}

/* ═══════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════ */
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 300ms var(--transition);
  position: relative;
  z-index: 100;
  border-right: 1px solid rgba(255, 255, 255, 0.04);
}

.sidebar-collapsed .sidebar {
  width: var(--sidebar-collapsed-width);
}

/* ─── Logo ─── */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.logo-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 200ms var(--transition);
}

.sidebar-collapsed .logo-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.sidebar-collapsed .logo-icon {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.logo-name {
  font-size: 15px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.3px;
  line-height: 1.2;
}

.logo-version {
  font-size: 10px;
  font-weight: 600;
  color: var(--accent);
  background: rgba(6, 182, 212, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.2);
  padding: 1px 6px;
  border-radius: 20px;
  display: inline-block;
  width: fit-content;
  margin-top: 3px;
}

/* ─── Navigation ─── */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 0;
  scrollbar-width: none;
}

.sidebar-nav::-webkit-scrollbar {
  display: none;
}

.nav-group {
  margin-bottom: 4px;
  padding: 0 8px;
}

.nav-group-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--sidebar-group-label);
  padding: 8px 8px 4px;
  white-space: nowrap;
  overflow: hidden;
  transition:
    opacity 200ms var(--transition),
    height 200ms,
    padding 200ms;
}

.sidebar-collapsed .nav-group-label {
  opacity: 0;
  height: 0;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px;
  border-radius: 8px;
  color: var(--sidebar-text);
  text-decoration: none;
  transition: all 150ms var(--transition);
  position: relative;
  cursor: pointer;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: var(--sidebar-hover-bg);
  color: var(--sidebar-text-hover);
}

.nav-item.active {
  background: var(--sidebar-active-bg);
  color: #818cf8;
  border-left-color: var(--primary);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon :deep(svg) {
  width: 18px;
  height: 18px;
  transition: stroke 150ms;
}

.nav-item.active .nav-icon :deep(svg) {
  stroke: #818cf8;
}

.nav-label {
  font-size: 13.5px;
  font-weight: 500;
  transition: opacity 200ms var(--transition);
  flex: 1;
}

.sidebar-collapsed .nav-label {
  opacity: 0;
  width: 0;
}

.nav-badge {
  background: var(--warning);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 20px;
  line-height: 1;
  flex-shrink: 0;
  transition: opacity 200ms var(--transition);
}

.sidebar-collapsed .nav-badge {
  opacity: 0;
}

.sidebar-collapsed .nav-item {
  justify-content: center;
  padding: 12px 0;
  border-left: none;
  border-radius: 8px;
}

.sidebar-collapsed .sidebar-logo {
  justify-content: center;
}

.sidebar-collapsed .hamburger-btn {
  margin-left: 0;
}

.sidebar-collapsed .nav-item.active::before {
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

/* ═══════════════════════════════════════════
   MAIN AREA
═══════════════════════════════════════════ */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* ═══════════════════════════════════════════
   HEADER
═══════════════════════════════════════════ */
.header {
  height: var(--header-height);
  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
  z-index: 50;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.hamburger-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.07);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  color: #94a3b8;
  transition:
    background 150ms,
    color 150ms;
  flex-shrink: 0;
  margin-left: auto;
}

.hamburger-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #f1f5f9;
}

.hamburger-btn svg {
  width: 16px;
  height: 16px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.breadcrumb-home {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
}

.breadcrumb-sep {
  color: var(--border-color);
  font-size: 16px;
}

.breadcrumb-current {
  font-weight: 600;
  color: var(--text-primary);
}

/* Center Search */
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
  transition:
    border-color 150ms,
    box-shadow 150ms;
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
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

/* Right */
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
}

.icon-btn {
  width: 38px;
  height: 38px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--text-secondary);
  transition:
    background 150ms,
    color 150ms;
}

.icon-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

/* Notifications */
.notif-wrapper {
  position: relative;
}

.notif-btn {
  position: relative;
}

.notif-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  background: var(--danger);
  color: white;
  font-size: 9px;
  font-weight: 700;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid var(--header-bg);
}

@keyframes pulse-badge {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.notif-badge.pulse {
  animation: pulse-badge 2s ease-in-out infinite;
}

.header-divider {
  width: 1px;
  height: 28px;
  background: var(--border-color);
  margin: 0 4px;
}

/* User Trigger */
.user-menu-wrapper {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 10px;
  transition: background 150ms;
}

.user-trigger:hover {
  background: var(--primary-light);
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.user-role {
  font-size: 11px;
  color: var(--text-secondary);
}

.chevron {
  width: 14px;
  height: 14px;
  color: var(--text-secondary);
  transition: transform 200ms var(--transition);
}

.chevron.rotated {
  transform: rotate(180deg);
}

/* ═══════════════════════════════════════════
   DROPDOWNS
═══════════════════════════════════════════ */
.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  z-index: 200;
  animation: dropdownFade 200ms var(--transition);
  overflow: hidden;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notif-dropdown {
  width: 340px;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.mark-read-btn {
  background: none;
  border: none;
  font-size: 12px;
  color: var(--primary);
  cursor: pointer;
  font-family: inherit;
}

.mark-read-btn:hover {
  text-decoration: underline;
}

.notif-list {
  max-height: 280px;
  overflow-y: auto;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  transition: background 150ms;
}

.notif-item:last-child {
  border-bottom: none;
}
.notif-item:hover {
  background: var(--body-bg);
}
.notif-item.unread {
  background: rgba(79, 70, 229, 0.03);
}

.notif-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-color);
  margin-top: 5px;
  flex-shrink: 0;
}

.notif-item.unread .notif-dot {
  background: var(--primary);
}

.notif-content p {
  font-size: 13px;
  color: var(--text-primary);
  margin: 0 0 4px;
  line-height: 1.4;
}

.notif-content span {
  font-size: 11px;
  color: var(--text-secondary);
}

.dropdown-footer {
  padding: 10px 16px;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.dropdown-footer a {
  font-size: 12.5px;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

/* User Dropdown */
.user-dropdown {
  width: 200px;
  padding: 6px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 7px;
  font-size: 13.5px;
  color: var(--text-primary);
  text-decoration: none;
  transition: background 150ms;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  font-family: inherit;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--body-bg);
}

.dropdown-item.danger {
  color: var(--danger);
}

.dropdown-item.danger:hover {
  background: rgba(239, 68, 68, 0.06);
}

.dropdown-item svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.dropdown-sep {
  height: 1px;
  background: var(--border-color);
  margin: 4px 0;
}

/* ═══════════════════════════════════════════
   PAGE CONTENT
═══════════════════════════════════════════ */
.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  color: var(--text-primary);
}

/* ═══════════════════════════════════════════
   OVERLAY
═══════════════════════════════════════════ */
.sidebar-overlay,
.click-outside {
  position: fixed;
  inset: 0;
  z-index: 90;
}

.sidebar-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

/* ═══════════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════════ */
@media (max-width: 1024px) {
  .user-meta {
    display: none;
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: var(--sidebar-width) !important;
    transform: translateX(-100%);
    transition: transform 300ms var(--transition);
    z-index: 110;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .main-area {
    width: 100%;
  }

  .header-search {
    display: none;
  }

  .page-content {
    padding: 16px;
  }
}
</style>
