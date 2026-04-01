<script setup lang="ts">
import { computed, h } from 'vue'
import { Drawer } from 'ant-design-vue'

interface AppDrawerProps {
  open?: boolean
  title?: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
  width?: string | number
  height?: string | number
  closable?: boolean
  maskClosable?: boolean
  mask?: boolean
  destroyOnClose?: boolean
  showOkBtn?: boolean
  showCancelBtn?: boolean
  okText?: string
  cancelText?: string
  okLoading?: boolean
  footer?: any
}

const props = withDefaults(defineProps<AppDrawerProps>(), {
  open: false,
  title: '',
  placement: 'right',
  closable: true,
  maskClosable: false,
  mask: true,
  destroyOnClose: false,
  showOkBtn: true,
  showCancelBtn: true,
  okText: 'Save',
  cancelText: 'Cancel',
  okLoading: false,
})

defineOptions({
  name: 'AppDrawer',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'ok': []
  'cancel': []
  'close': []
}>()

const handleOk = () => {
  emit('ok')
}

const handleCancel = () => {
  emit('update:open', false)
  emit('cancel')
  emit('close')
}

const drawerWidth = computed(() => {
  if (typeof props.width === 'number') return `${props.width}px`
  return props.width
})

const drawerHeight = computed(() => {
  if (typeof props.height === 'number') return `${props.height}px`
  return props.height
})
</script>

<template>
  <!-- @vue-ignore -->
  <Drawer
    :open="open"
    :title="title"
    :placement="placement"
    :width="drawerWidth"
    :height="drawerHeight"
    :closable="closable"
    :mask-closable="maskClosable"
    :mask="mask"
    :destroy-on-close="destroyOnClose"
    class="app-drawer-wrapper"
    @close="handleCancel"
  >
    <!-- Footer slot with default actions -->
    <template v-if="!$slots.footer" #footer>
      <div class="flex justify-end gap-3">
        <AppButton v-if="showCancelBtn" type="secondary" @click="handleCancel">
          {{ cancelText }}
        </AppButton>
        <AppButton v-if="showOkBtn" type="primary" :loading="okLoading" @click="handleOk">
          {{ okText }}
        </AppButton>
      </div>
    </template>

    <!-- Other slots -->
    <template v-else #footer>
      <slot name="footer" />
    </template>

    <template #extra="slotData">
      <slot name="extra" v-bind="slotData || {}" />
    </template>
  </Drawer>
</template>

<style scoped>
/* Styles in ui-components.css */
</style>