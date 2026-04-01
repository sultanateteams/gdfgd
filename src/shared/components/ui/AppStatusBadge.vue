<script setup lang="ts">
import { computed } from 'vue'

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'default'

interface AppStatusBadgeProps {
  status?: StatusType
  text?: string
  dot?: boolean
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<AppStatusBadgeProps>(), {
  status: 'default',
  text: '',
  dot: true,
  size: 'md',
})

defineOptions({
  name: 'AppStatusBadge',
})

const classes = computed(() => ({
  'app-badge': true,
  [`app-badge--${props.status}`]: true,
  [`app-badge--${props.size}`]: true,
}))
</script>

<template>
  <span :class="classes">
    <span v-if="dot" class="app-badge-dot" />
    <slot>{{ text }}</slot>
  </span>
</template>

<style scoped>
/* Styles in ui-components.css */
</style>