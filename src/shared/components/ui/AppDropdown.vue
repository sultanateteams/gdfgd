<script setup lang="ts">
import { Dropdown } from 'ant-design-vue'
import type { MenuProps } from 'ant-design-vue'

interface DropdownItem {
  key: string
  label: string
  icon?: any
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

interface AppDropdownProps {
  items?: DropdownItem[]
  trigger?: ('hover' | 'click' | 'contextMenu')[]
  placement?: 'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'top' | 'bottom'
  disabled?: boolean
  destroyPopupOnHide?: boolean
}

const props = withDefaults(defineProps<AppDropdownProps>(), {
  trigger: () => ['click'] as ('hover' | 'click' | 'contextMenu')[],
  placement: 'bottomLeft',
  disabled: false,
  destroyPopupOnHide: true,
})

defineOptions({
  name: 'AppDropdown',
})

const emit = defineEmits<{
  click: [key: string, item: DropdownItem]
}>()

const handleClick = ({ key, keyPath, domEvent }: { key: string; keyPath: string[]; domEvent: Event }) => {
  const item = props.items?.find((i) => i.key === key)
  if (item) {
    emit('click', key, item)
  }
}

// Build menu items for Ant Design
const menuItems = props.items?.map((item) => {
  if (item.divider) {
    return { type: 'divider' }
  }
  return {
    key: item.key,
    label: item.label,
    icon: item.icon,
    disabled: item.disabled,
    danger: item.danger,
  }
})
</script>

<template>
  <!-- @vue-ignore -->
  <Dropdown
    :menu="{ items: menuItems, onClick: handleClick }"
    :trigger="trigger"
    :placement="placement"
    :disabled="disabled"
    :destroy-popup-on-hide="destroyPopupOnHide"
    class="app-dropdown"
  >
    <slot>
      <span class="cursor-pointer">
        <slot name="trigger" />
      </span>
    </slot>
  </Dropdown>
</template>

<style scoped>
/* Styles in ui-components.css */
</style>