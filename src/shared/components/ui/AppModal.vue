<script setup lang="ts">
import { computed } from 'vue'
import { Modal } from 'ant-design-vue'
import type { ModalProps } from 'ant-design-vue'

interface AppModalProps {
  open?: boolean
  title?: string
  centered?: boolean
  closable?: boolean
  maskClosable?: boolean
  confirmLoading?: boolean
  okText?: string
  cancelText?: string
  okType?: 'primary' | 'default' | 'dashed' | 'danger'
  width?: string | number
  footer?: any
  destroyOnClose?: boolean
  showOkBtn?: boolean
  showCancelBtn?: boolean
}

const props = withDefaults(defineProps<AppModalProps>(), {
  open: false,
  title: '',
  centered: true,
  closable: true,
  maskClosable: false,
  confirmLoading: false,
  okText: 'OK',
  cancelText: 'Cancel',
  okType: 'primary',
  width: 480,
  destroyOnClose: false,
  showOkBtn: true,
  showCancelBtn: true,
})

defineOptions({
  name: 'AppModal',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'ok': []
  'cancel': []
}>()

const handleOk = () => {
  emit('ok')
}

const handleCancel = () => {
  emit('update:open', false)
  emit('cancel')
}

const modalWidth = computed(() => {
  if (typeof props.width === 'number') return `${props.width}px`
  return props.width
})
</script>

<template>
  <!-- @vue-ignore -->
  <Modal
    :open="open"
    :title="title"
    :centered="centered"
    :closable="closable"
    :mask-closable="maskClosable"
    :confirm-loading="confirmLoading"
    :ok-text="okText"
    :cancel-text="cancelText"
    :ok-type="okType"
    :width="modalWidth"
    :destroy-on-close="destroyOnClose"
    :footer="footer"
    class="app-modal-wrapper"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </Modal>
</template>

<style scoped>
/* Styles in ui-components.css */
</style>