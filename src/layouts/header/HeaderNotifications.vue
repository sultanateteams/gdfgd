<template>
  <div class="notif-wrapper" ref="wrapperRef">
    <button
      class="icon-btn notif-btn"
      aria-label="Notifications"
      @click="toggle"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
      </svg>
      <span v-if="unreadCount > 0" class="notif-badge pulse">{{ unreadCount }}</span>
    </button>

    <Transition name="dropdown">
      <div class="dropdown notif-dropdown" v-if="isOpen" @click.stop>
        <div class="dropdown-header">
          <span>Notifications</span>
          <button class="mark-read-btn" @click="markAllRead">Mark all read</button>
        </div>
        <div class="notif-list">
          <div
            v-for="notif in notifications"
            :key="notif.id"
            class="notif-item"
            :class="{ unread: !notif.read }"
          >
            <div class="notif-dot"></div>
            <div class="notif-content">
              <p v-html="notif.text"></p>
              <span>{{ notif.time }}</span>
            </div>
          </div>
        </div>
        <div class="dropdown-footer">
          <RouterLink to="/notifications">View all notifications →</RouterLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const isOpen = ref(false)
const wrapperRef = ref<HTMLElement>()

const notifications = ref([
  { id: 1, text: "New leave request from <strong>Sara Lee</strong>", time: "2 minutes ago", read: false },
  { id: 2, text: "Payroll processing completed", time: "1 hour ago", read: false },
  { id: 3, text: "New employee <strong>John Smith</strong> onboarded", time: "3 hours ago", read: true },
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function toggle() { isOpen.value = !isOpen.value }

function markAllRead() {
  notifications.value.forEach(n => n.read = true)
}

function handleClickOutside(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleEsc)
})

defineExpose({ close: () => { isOpen.value = false } })
</script>

<style scoped>
.notif-wrapper { position: relative; }

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
  transition: background 150ms, color 150ms;
  position: relative;
}
.icon-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
}
.icon-btn svg { width: 18px; height: 18px; }

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
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
.notif-badge.pulse { animation: pulse-badge 2s ease-in-out infinite; }

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  z-index: 200;
  overflow: hidden;
}
.notif-dropdown { width: 340px; }

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
.mark-read-btn:hover { text-decoration: underline; }

.notif-list { max-height: 280px; overflow-y: auto; }
.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  transition: background 150ms;
}
.notif-item:last-child { border-bottom: none; }
.notif-item:hover { background: var(--body-bg); }
.notif-item.unread { background: var(--primary-light); }

.notif-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-color);
  margin-top: 5px;
  flex-shrink: 0;
}
.notif-item.unread .notif-dot { background: var(--primary); }

.notif-content p {
  font-size: 13px;
  color: var(--text-primary);
  margin: 0 0 4px;
  line-height: 1.4;
}
.notif-content span { font-size: 11px; color: var(--text-secondary); }

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

.dropdown-enter-active, .dropdown-leave-active {
  transition: opacity 200ms, transform 200ms;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>