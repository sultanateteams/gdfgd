<script setup lang="ts">
import { computed, h } from 'vue'
import { Table, Empty } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons-vue'
import type { ColumnsType } from 'ant-design-vue/es/table'

export interface TableColumn {
  key: string
  title: string
  dataIndex?: string
  width?: string | number
  sorter?: boolean | ((a: any, b: any) => number)
  customRender?: (info: { text: any; record: any; index: number }) => any
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right' | boolean
  ellipsis?: boolean
}

export interface TableAction {
  type: 'edit' | 'delete' | 'view' | 'custom'
  icon?: any
  label?: string
  onClick?: (record: any) => void
  disabled?: boolean
  danger?: boolean
}

interface AppTableProps {
  columns: TableColumn[]
  dataSource: any[]
  loading?: boolean
  pagination?: false | {
    current?: number
    pageSize?: number
    total?: number
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    pageSizeOptions?: string[]
  }
  rowKey?: string | ((record: any) => string)
  rowSelection?: {
    selectedRowKeys?: (string | number)[]
    onChange?: (selectedRowKeys: (string | number)[], selectedRows: any[]) => void
  }
  showActions?: boolean
  actions?: TableAction[]
  emptyText?: string
  bordered?: boolean
  size?: 'small' | 'middle' | 'large'
  scroll?: { x?: number; y?: number }
}

const props = withDefaults(defineProps<AppTableProps>(), {
  loading: false,
  rowKey: 'id',
  showActions: false,
  emptyText: 'No data available',
  bordered: false,
  size: 'middle',
})

defineOptions({
  name: 'AppTable',
})

const emit = defineEmits<{
  'update:pagination': [pagination: { current: number; pageSize: number }]
  'change': [pagination: any, filters: any, sorter: any]
}>()

// Get default action icons
const getActionIcon = (type: string) => {
  switch (type) {
    case 'edit':
      return h(EditOutlined)
    case 'delete':
      return h(DeleteOutlined)
    case 'view':
      return h(EyeOutlined)
    default:
      return null
  }
}

// Render action buttons
const renderActions = (record: any) => {
  if (!props.actions || props.actions.length === 0) return null

  const buttons = props.actions.map((action) =>
    h(
      'button',
      {
        class: ['app-table-action-btn', action.danger ? 'app-table-action-btn--danger' : ''],
        disabled: action.disabled,
        title: action.label,
        onClick: () => action.onClick?.(record),
      },
      [action.icon ? h(action.icon) : getActionIcon(action.type)]
    )
  )

  return h('div', { class: 'app-table-actions' }, buttons)
}

// Create custom render function for actions column
const createActionColumn = (): TableColumn => ({
  key: 'actions',
  title: 'Actions',
  width: 120,
  align: 'center',
  fixed: 'right' as const,
  customRender: ({ record }: { record: any }) => renderActions(record),
})

// Merge columns with actions
const mergedColumns = computed((): ColumnsType => {
  const cols = props.columns.map((col) => ({
    ...col,
    fixed: col.fixed === true ? ('right' as const) : col.fixed,
  })) as ColumnsType

  if (props.showActions && props.actions && props.actions.length > 0) {
    cols.push(createActionColumn() as any)
  }

  return cols
})

// Pagination config
const paginationConfig = computed(() => {
  if (props.pagination === false) return false

  return {
    ...props.pagination,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} items`,
    onChange: (page: number, pageSize: number) => {
      emit('update:pagination', { current: page, pageSize })
    },
  }
})

// Empty state render
const emptyTextRender = () =>
  h(
    'div',
    { class: 'app-table-empty' },
    [
      h(
        'div',
        { class: 'app-table-empty-icon' },
        h(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE })
      ),
      h('div', { class: 'app-table-empty-text' }, props.emptyText),
    ]
  )

const tableLocale = computed(() => ({
  emptyText: emptyTextRender(),
}))
</script>

<template>
  <div class="app-table-wrapper">
    <!-- @vue-ignore -->
    <Table
      :columns="mergedColumns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="paginationConfig"
      :row-key="rowKey"
      :row-selection="rowSelection"
      :bordered="bordered"
      :size="size"
      :scroll="scroll"
      :locale="tableLocale"
      @change="(pagination, filters, sorter) => emit('change', pagination, filters, sorter)"
    >
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>
    </Table>
  </div>
</template>

<style scoped>
/* Styles in ui-components.css */
</style>