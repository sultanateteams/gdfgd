<script setup lang="ts">
import { computed } from 'vue'

type ButtonType = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface AppIconButtonProps {
  icon: any
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  title?: string
  href?: string
  target?: string
}

const props = withDefaults(defineProps<AppIconButtonProps>(), {
  type: 'ghost',
  size: 'md',
  disabled: false,
  loading: false,
})

defineOptions({
  name: 'AppIconButton',
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const classes = computed(() => ({
  'app-btn': true,
  'app-btn--icon': true,
  [`app-btn--${props.type}`]: true,
  [`app-btn--${props.size}`]: true,
  'app-btn--loading': props.loading,
  'app-btn--disabled': props.disabled,
}))

const handleClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', e)
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :type="href ? undefined : 'button'"
    :class="classes"
    :href="href"
    :target="target"
    :disabled="disabled || loading"
    :title="title"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>

    <!-- Icon -->
    <component v-else :is="icon" />
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