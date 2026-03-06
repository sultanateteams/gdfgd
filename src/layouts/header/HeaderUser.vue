<template>
  <div class="user-menu-wrapper" ref="wrapperRef">
    <div class="user-trigger" @click="toggle">
      <div class="user-avatar">{{ initials }}</div>
      <div class="user-meta">
        <span class="user-name">{{ user.name }}</span>
        <span class="user-role">{{ user.role }}</span>
      </div>
      <svg class="chevron" :class="{ rotated: isOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>

    <Transition name="dropdown">
      <div class="dropdown user-dropdown" v-if="isOpen" @click.stop>
        <RouterLink to="/profile" class="dropdown-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Profile
        </RouterLink>
        <RouterLink to="/settings" class="dropdown-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          Settings
        </RouterLink>
        <div class="dropdown-sep"></div>
        <button class="dropdown-item danger" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Logout
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const user = {
  name: 'John Doe',
  role: 'Administrator',
}

const initials = computed(() =>
  user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
)

const isOpen = ref(false)
const wrapperRef = ref<HTMLElement>()
const router = useRouter()

function toggle() {
  isOpen.value = !isOpen.value
}

function handleLogout() {
  isOpen.value = false
  router.push('/login')
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
.user-menu-wrapper { position: relative; }

.user-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 10px;
  transition: background 150ms;
}
.user-trigger:hover { background: var(--primary-light); }

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
.user-meta { display: flex; flex-direction: column; }
.user-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}
.user-role { font-size: 11px; color: var(--text-secondary); }

.chevron {
  width: 14px;
  height: 14px;
  color: var(--text-secondary);
  transition: transform 200ms var(--transition);
}
.chevron.rotated { transform: rotate(180deg); }

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
.user-dropdown { width: 200px; padding: 6px; }

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
.dropdown-item:hover { background: var(--body-bg); }
.dropdown-item.danger { color: var(--danger); }
.dropdown-item.danger:hover { background: rgba(239, 68, 68, 0.06); }
.dropdown-item svg { width: 16px; height: 16px; flex-shrink: 0; }
.dropdown-sep { height: 1px; background: var(--border-color); margin: 4px 0; }

.dropdown-enter-active, .dropdown-leave-active {
  transition: opacity 200ms, transform 200ms;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 1024px) {
  .user-meta { display: none; }
}
</style>