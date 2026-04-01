<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, CloseOutlined } from '@ant-design/icons-vue'

type AlertType = 'success' | 'warning' | 'error' | 'info'

interface AppAlertProps {
  type?: AlertType
  message?: string
  description?: string
  showIcon?: boolean
  closable?: boolean
  banner?: boolean
  centered?: boolean
}

const props = withDefaults(defineProps<AppAlertProps>(), {
  type: 'info',
  message: '',
  description: '',
  showIcon: true,
  closable: false,
  banner: false,
  centered: false,
})

defineOptions({
  name: 'AppAlert',
})

const emit = defineEmits<{
  close: []
}>()

const iconMap: Record<AlertType, any> = {
  success: CheckCircleOutlined,
  warning: ExclamationCircleOutlined,
  error: CloseCircleOutlined,
  info: InfoCircleOutlined,
}

const currentIcon = computed(() => iconMap[props.type])
</script>

<template>
  <div
    class="app-alert"
    :class="[
      `app-alert--${type}`,
      {
        'app-alert--banner': banner,
        'app-alert--centered': centered,
      },
    ]"
    role="alert"
  >
    <!-- Icon -->
    <span v-if="showIcon" class="app-alert-icon">
      <component :is="currentIcon" />
    </span>

    <!-- Content -->
    <div class="app-alert-content">
      <div v-if="message" class="app-alert-title">
        {{ message }}
      </div>
      <div v-if="description" class="app-alert-description">
        {{ description }}
      </div>
      <slot />
    </div>

    <!-- Close Button -->
    <button
      v-if="closable"
      class="app-alert-close"
      @click="emit('close')"
    >
      <CloseOutlined />
    </button>
  </div>
</template>

<style scoped>
.app-alert-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.app-alert-close:hover {
  opacity: 1;
}
</style>