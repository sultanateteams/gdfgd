<script setup lang="ts">
import { computed } from 'vue'
import { Modal } from 'ant-design-vue'
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue'
import AppButton from './AppButton.vue'

type ConfirmType = 'info' | 'success' | 'warning' | 'error'

interface AppConfirmModalProps {
  open?: boolean
  title?: string
  description?: string
  type?: ConfirmType
  okText?: string
  cancelText?: string
  okType?: 'primary' | 'danger'
  okLoading?: boolean
  centered?: boolean
  width?: number
}

const props = withDefaults(defineProps<AppConfirmModalProps>(), {
  open: false,
  title: 'Confirm',
  description: '',
  type: 'info',
  okText: 'Confirm',
  cancelText: 'Cancel',
  okType: 'primary',
  okLoading: false,
  centered: true,
  width: 400,
})

defineOptions({
  name: 'AppConfirmModal',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': []
  'cancel': []
}>()

const iconMap: Record<ConfirmType, any> = {
  info: InfoCircleOutlined,
  success: CheckCircleOutlined,
  warning: ExclamationCircleOutlined,
  error: CloseCircleOutlined,
}

const iconColorMap: Record<ConfirmType, string> = {
  info: 'var(--app-info)',
  success: 'var(--app-success)',
  warning: 'var(--app-warning)',
  error: 'var(--app-error)',
}

const currentIcon = computed(() => iconMap[props.type])
const currentColor = computed(() => iconColorMap[props.type])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('update:open', false)
  emit('cancel')
}

// Custom footer
const footer = computed(() => null)
</script>

<template>
  <!-- @vue-ignore -->
  <Modal
    :open="open"
    :centered="centered"
    :width="`${width}px`"
    :footer="null"
    :closable="false"
    :mask-closable="false"
    class="app-modal-wrapper"
    @cancel="handleCancel"
  >
    <div class="app-confirm-modal">
      <!-- Icon -->
      <div class="app-confirm-modal-icon" :style="{ color: currentColor }">
        <component :is="currentIcon" style="font-size: 48px" />
      </div>

      <!-- Title -->
      <div class="app-confirm-modal-title">
        {{ title }}
      </div>

      <!-- Description -->
      <div v-if="description" class="app-confirm-modal-description">
        {{ description }}
      </div>

      <!-- Actions -->
      <div class="flex gap-3 justify-center mt-6">
        <AppButton type="secondary" @click="handleCancel">
          {{ cancelText }}
        </AppButton>
        <AppButton
          :type="okType === 'danger' ? 'danger' : 'primary'"
          :loading="okLoading"
          @click="handleConfirm"
        >
          {{ okText }}
        </AppButton>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
/* Styles in ui-components.css */
</style>