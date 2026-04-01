<script setup lang="ts">
interface AppStatisticCardProps {
  label?: string
  value?: string | number
  prefix?: string
  suffix?: string
  change?: number
  changeLabel?: string
  loading?: boolean
  icon?: any
  iconBg?: string
}

const props = withDefaults(defineProps<AppStatisticCardProps>(), {
  label: '',
  value: 0,
  loading: false,
})

defineOptions({
  name: 'AppStatisticCard',
})

const formattedValue = (val: string | number) => {
  if (typeof val === 'number') {
    return val.toLocaleString()
  }
  return val
}

const changePositive = (change: number) => change >= 0
</script>

<template>
  <div class="app-statistic-card">
    <!-- Header with icon -->
    <div v-if="icon" class="flex items-center gap-3 mb-2">
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center"
        :style="{ backgroundColor: iconBg || 'var(--app-primary-light)' }"
      >
        <component :is="icon" :style="{ color: 'var(--app-primary)' }" />
      </div>
      <span class="app-statistic-label">{{ label }}</span>
    </div>

    <!-- Value -->
    <div class="app-statistic-value">
      <span v-if="prefix" class="text-lg font-medium mr-1">{{ prefix }}</span>
      <span v-if="loading" class="app-skeleton inline-block w-24 h-8" />
      <span v-else>{{ formattedValue(value) }}</span>
      <span v-if="suffix" class="text-lg font-medium ml-1">{{ suffix }}</span>
    </div>

    <!-- Change indicator -->
    <div
      v-if="change !== undefined && changeLabel"
      class="app-statistic-change"
      :class="changePositive(change) ? 'app-statistic-change--positive' : 'app-statistic-change--negative'"
    >
      <svg
        v-if="changePositive(change)"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
      <svg
        v-else
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
      <span>{{ Math.abs(change) }}%</span>
      <span class="text-muted ml-1">{{ changeLabel }}</span>
    </div>

    <!-- Additional slot content -->
    <slot />
  </div>
</template>

<style scoped>
/* Styles in ui-components.css */
</style>