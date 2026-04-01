<script setup lang="ts">
import { Tabs, Tabs as TabPane } from 'ant-design-vue'
import type { TabPaneProps, TabsProps } from 'ant-design-vue'

interface AppTabPane {
  key: string
  tab: string
  disabled?: boolean
}

interface AppTabsProps {
  activeKey?: string
  defaultActiveKey?: string
  tabs?: AppTabPane[]
  type?: TabsProps['type']
  size?: TabsProps['size']
  centered?: boolean
  destroyInactiveTabPane?: boolean
}

const props = withDefaults(defineProps<AppTabsProps>(), {
  type: 'line',
  centered: false,
  destroyInactiveTabPane: false,
})

defineOptions({
  name: 'AppTabs',
})

const emit = defineEmits<{
  'update:activeKey': [key: string]
  'change': [key: string]
}>()

const handleChange = (key: string) => {
  emit('update:activeKey', key)
  emit('change', key)
}
</script>

<template>
  <div class="app-tabs-wrapper">
    <!-- @vue-ignore -->
    <Tabs
      :active-key="activeKey"
      :default-active-key="defaultActiveKey"
      :type="type"
      :size="size"
      :centered="centered"
      :destroy-inactive-tab-pane="destroyInactiveTabPane"
      @change="handleChange"
    >
      <!-- Render tabs from prop -->
      <template v-if="tabs && tabs.length > 0">
        <Tabs.TabPane
          v-for="tab in tabs"
          :key="tab.key"
          :tab="tab.tab"
          :disabled="tab.disabled"
        >
          <slot :name="`tab-${tab.key}`">
            <slot name="content" :key="tab.key" />
          </slot>
        </Tabs.TabPane>
      </template>

      <!-- Or use slots directly -->
      <template v-else>
        <slot />
      </template>
    </Tabs>
  </div>
</template>

<style scoped>
/* Styles in ui-components.css */
</style>