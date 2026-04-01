<script setup lang="ts">
import { Breadcrumb } from 'ant-design-vue'
import { HomeOutlined } from '@ant-design/icons-vue'

interface BreadcrumbItem {
  title: string
  href?: string
  icon?: any
}

interface AppBreadcrumbProps {
  items?: BreadcrumbItem[]
  separator?: string
  showHome?: boolean
}

const props = withDefaults(defineProps<AppBreadcrumbProps>(), {
  separator: '/',
  showHome: false,
})

defineOptions({
  name: 'AppBreadcrumb',
})
</script>

<template>
  <div class="app-breadcrumb">
    <Breadcrumb :separator="separator">
      <!-- Home icon -->
      <Breadcrumb.Item v-if="showHome" key="home">
        <HomeOutlined />
      </Breadcrumb.Item>

      <!-- Items -->
      <template v-if="items && items.length > 0">
        <Breadcrumb.Item
          v-for="(item, index) in items"
          :key="index"
          :href="item.href || undefined"
        >
          <span v-if="item.icon" class="mr-1">
            <component :is="item.icon" />
          </span>
          {{ item.title }}
        </Breadcrumb.Item>
      </template>

      <!-- Or use slots -->
      <template v-else>
        <slot />
      </template>
    </Breadcrumb>
  </div>
</template>

<style scoped>
/* Styles in ui-components.css */
</style>