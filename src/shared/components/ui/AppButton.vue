<script setup lang="ts">
import { computed, h } from 'vue'

type ButtonType = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonHtmlType = 'button' | 'submit' | 'reset'

interface AppButtonProps {
  type?: ButtonType
  size?: ButtonSize
  htmlType?: ButtonHtmlType
  disabled?: boolean
  loading?: boolean
  icon?: any
  iconPosition?: 'left' | 'right'
  block?: boolean
  href?: string
  target?: string
  download?: string
}

const props = withDefaults(defineProps<AppButtonProps>(), {
  type: 'primary',
  size: 'md',
  htmlType: 'button',
  disabled: false,
  loading: false,
  iconPosition: 'left',
  block: false,
})

defineOptions({
  name: 'AppButton',
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const classes = computed(() => ({
  'app-btn': true,
  [`app-btn--${props.type}`]: true,
  [`app-btn--${props.size}`]: true,
  'app-btn--loading': props.loading,
  'app-btn--disabled': props.disabled,
  'w-full': props.block,
}))

const handleClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', e)
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :type="href ? undefined : htmlType"
    :class="classes"
    :href="href"
    :target="target"
    :download="download"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin"
      :class="iconPosition === 'left' ? 'mr-2' : 'ml-2'"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>

    <!-- Icon (left) -->
    <span v-else-if="icon && iconPosition === 'left'" class="app-btn-icon mr-2">
      <component :is="icon" />
    </span>

    <!-- Default slot content -->
    <slot />

    <!-- Icon (right) -->
    <span v-if="icon && iconPosition === 'right'" class="app-btn-icon ml-2">
      <component :is="icon" />
    </span>
  </component>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>