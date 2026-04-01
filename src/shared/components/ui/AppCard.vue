<script setup lang="ts">
import { computed } from 'vue'

interface AppCardProps {
  title?: string
  subtitle?: string
  bordered?: boolean
  hoverable?: boolean
  loading?: boolean
  padding?: 'sm' | 'md' | 'lg'
  headerAction?: any
}

const props = withDefaults(defineProps<AppCardProps>(), {
  title: '',
  subtitle: '',
  bordered: true,
  hoverable: false,
  loading: false,
  padding: 'md',
})

defineOptions({
  name: 'AppCard',
})

const classes = computed(() => ({
  'app-card': true,
  'app-card--hoverable': props.hoverable,
  'app-card--loading': props.loading,
}))

const paddingClass = computed(() => ({
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}[props.padding]))
</script>

<template>
  <div :class="classes">
    <!-- Header -->
    <div v-if="title || $slots.title || $slots.extra" class="app-card-header">
      <div class="flex items-center gap-3">
        <div>
          <h3 v-if="title || $slots.title" class="app-card-title">
            <slot name="title">{{ title }}</slot>
          </h3>
          <p v-if="subtitle" class="text-sm text-secondary mt-1">
            {{ subtitle }}
          </p>
        </div>
      </div>
      <div v-if="$slots.extra" class="app-card-header-action">
        <slot name="extra" />
      </div>
    </div>

    <!-- Body -->
    <div :class="['app-card-body', paddingClass]">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="animate-pulse">
        <div class="app-skeleton h-4 w-3/4 mb-3" />
        <div class="app-skeleton h-4 w-full mb-3" />
        <div class="app-skeleton h-4 w-5/6" />
      </div>
      <!-- Content -->
      <slot v-else />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="app-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
/* Styles in ui-components.css */
</style>