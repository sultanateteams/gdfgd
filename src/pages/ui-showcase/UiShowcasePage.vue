<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  AppInput,
  AppPasswordInput,
  AppTextArea,
  AppSelect,
  AppDatePicker,
  AppCheckbox,
  AppRadio,
  AppSwitch,
  AppButton,
  AppIconButton,
  AppModal,
  AppConfirmModal,
  AppAlert,
  AppTable,
  AppStatusBadge,
  AppCard,
  AppStatisticCard,
  AppTabs,
  AppBreadcrumb,
  AppDrawer,
  AppDropdown,
  type TableColumn,
  type TableAction,
} from '@/shared/components/ui'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue'

// ============ STATE ============
const showModal = ref(false)
const showConfirmModal = ref(false)
const showDrawer = ref(false)
const drawerLoading = ref(false)

// Form state
const formState = reactive({
  inputText: '',
  password: '',
  textArea: '',
  selectValue: '' as string | number | string[] | number[] | undefined,
  multiSelectValue: [] as string[] | number[],
  datePickerValue: '' as string | undefined,
  checkboxValue: false,
  checkboxGroupValue: [] as string[] | number[],
  radioValue: '' as string | number | boolean | undefined,
  switchValue: false,
})

// ============ MOCK DATA ============
const selectOptions = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
  { label: 'Option 4', value: 'opt4' },
]

const checkboxOptions = [
  { label: 'Checkbox 1', value: 'cb1' },
  { label: 'Checkbox 2', value: 'cb2' },
  { label: 'Checkbox 3', value: 'cb3' },
]

const radioOptions = [
  { label: 'Radio 1', value: 'r1' },
  { label: 'Radio 2', value: 'r2' },
  { label: 'Radio 3', value: 'r3' },
]

// Table mock data
const tableData = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', role: 'Admin', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', role: 'Editor', createdAt: '2024-01-14' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', role: 'Viewer', createdAt: '2024-01-13' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'pending', role: 'Editor', createdAt: '2024-01-12' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'active', role: 'Admin', createdAt: '2024-01-11' },
  { id: 6, name: 'Diana Lee', email: 'diana@example.com', status: 'inactive', role: 'Viewer', createdAt: '2024-01-10' },
  { id: 7, name: 'Ethan Martinez', email: 'ethan@example.com', status: 'active', role: 'Editor', createdAt: '2024-01-09' },
  { id: 8, name: 'Fiona Garcia', email: 'fiona@example.com', status: 'pending', role: 'Viewer', createdAt: '2024-01-08' },
])

// Table columns
const tableColumns: TableColumn[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sorter: true },
  { key: 'email', title: 'Email', dataIndex: 'email' },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    customRender: ({ text }: { text: string }) => {
      const statusMap: Record<string, { status: any; text: string }> = {
        active: { status: 'success', text: 'Active' },
        inactive: { status: 'neutral', text: 'Inactive' },
        pending: { status: 'warning', text: 'Pending' },
      }
      const status = statusMap[text] || { status: 'neutral', text }
      return h(AppStatusBadge, { status: status.status, text: status.text })
    },
  },
  { key: 'role', title: 'Role', dataIndex: 'role' },
  { key: 'createdAt', title: 'Created', dataIndex: 'createdAt' },
]

// Table actions
const tableActions: TableAction[] = [
  { type: 'view', onClick: (record) => console.log('View:', record.id) },
  { type: 'edit', onClick: (record) => console.log('Edit:', record.id) },
  { type: 'delete', danger: true, onClick: (record) => handleDelete(record) },
]

// Dropdown items
const dropdownItems = [
  { key: 'profile', label: 'Profile', icon: UserOutlined },
  { key: 'settings', label: 'Settings', icon: SettingOutlined },
  { key: 'divider', label: '', divider: true },
  { key: 'logout', label: 'Logout', icon: CloseCircleOutlined, danger: true },
]

// ============ HANDLERS ============
const handleDelete = (record: any) => {
  console.log('Delete:', record.id)
}

const handleModalOk = () => {
  showModal.value = false
}

const handleConfirmOk = () => {
  showConfirmModal.value = false
  console.log('Confirmed!')
}

const handleDrawerOk = () => {
  drawerLoading.value = true
  setTimeout(() => {
    drawerLoading.value = false
    showDrawer.value = false
  }, 1000)
}

const handleTableChange = (pagination: any, filters: any, sorter: any) => {
  console.log('Table changed:', { pagination, filters, sorter })
}

const handleDropdownClick = (key: string, item: any) => {
  console.log('Dropdown clicked:', key, item)
}

// Breadcrumb items
const breadcrumbItems = [
  { title: 'Home', href: '/' },
  { title: 'Components', href: '/components' },
  { title: 'UI Showcase' },
]

// Tabs
const tabs = [
  { key: 'tab1', tab: 'Tab 1' },
  { key: 'tab2', tab: 'Tab 2' },
  { key: 'tab3', tab: 'Tab 3' },
]

// Statistic cards data
const stats = [
  { label: 'Total Users', value: 1248, change: 12, changeLabel: 'vs last month', icon: UserOutlined },
  { label: 'Active Sessions', value: 342, change: 8, changeLabel: 'vs last week', icon: DashboardOutlined },
  { label: 'Revenue', value: '24500', prefix: '$', change: -3, changeLabel: 'vs last month', icon: CheckCircleOutlined },
  { label: 'Conversion Rate', value: '3.24', suffix: '%', change: 5, changeLabel: 'vs last month', icon: TrendingUpOutlined },
]

// Import h from vue for rendering
import { h } from 'vue'

// Simple trending up icon component
function TrendingUpOutlined() {
  return h('svg', { width: '1em', height: '1em', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M23 6l-9.5 9.5-5-5L1 18' }),
    h('path', { d: 'M17 6h6v6' }),
  ])
}
</script>

<template>
  <div class="ui-showcase-page">
    <!-- Header -->
    <div class="showcase-header mb-8">
      <h1 class="text-3xl font-bold mb-2">UI Component Showcase</h1>
      <p class="text-secondary">
        A comprehensive demonstration of all custom UI components built with Ant Design Vue
      </p>
    </div>

    <!-- Breadcrumb -->
    <AppCard class="mb-6">
      <AppBreadcrumb :items="breadcrumbItems" show-home />
    </AppCard>

    <!-- Tabs Navigation -->
    <AppCard class="mb-6">
      <AppTabs :tabs="tabs" default-active-key="tab1">
        <template #tab-tab1>
          <div class="p-4">
            <h3>Tab 1 Content</h3>
            <p>This is the content for Tab 1</p>
          </div>
        </template>
        <template #tab-tab2>
          <div class="p-4">
            <h3>Tab 2 Content</h3>
            <p>This is the content for Tab 2</p>
          </div>
        </template>
        <template #tab-tab3>
          <div class="p-4">
            <h3>Tab 3 Content</h3>
            <p>This is the content for Tab 3</p>
          </div>
        </template>
      </AppTabs>
    </AppCard>

    <!-- Statistic Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <AppStatisticCard
        v-for="(stat, index) in stats"
        :key="index"
        :label="stat.label"
        :value="stat.value"
        :prefix="stat.prefix"
        :suffix="stat.suffix"
        :change="stat.change"
        :change-label="stat.changeLabel"
        :icon="stat.icon"
      />
    </div>

    <!-- Buttons Section -->
    <AppCard class="mb-6" title="Buttons">
      <div class="space-y-4">
        <div>
          <h4 class="text-sm font-semibold mb-3">Button Types</h4>
          <div class="flex flex-wrap gap-3">
            <AppButton type="primary">Primary</AppButton>
            <AppButton type="secondary">Secondary</AppButton>
            <AppButton type="ghost">Ghost</AppButton>
            <AppButton type="danger">Danger</AppButton>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold mb-3">Button Sizes</h4>
          <div class="flex flex-wrap items-center gap-3">
            <AppButton size="sm" type="primary">Small</AppButton>
            <AppButton size="md" type="primary">Medium</AppButton>
            <AppButton size="lg" type="primary">Large</AppButton>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold mb-3">Button States</h4>
          <div class="flex flex-wrap gap-3">
            <AppButton type="primary" disabled>Disabled</AppButton>
            <AppButton type="primary" loading>Loading</AppButton>
            <AppButton type="primary" block>Block Button</AppButton>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold mb-3">Icon Buttons</h4>
          <div class="flex flex-wrap gap-3">
            <AppIconButton :icon="PlusOutlined" title="Add" />
            <AppIconButton :icon="EditOutlined" title="Edit" />
            <AppIconButton :icon="DeleteOutlined" type="danger" title="Delete" />
            <AppIconButton :icon="EyeOutlined" title="View" />
            <AppIconButton :icon="MoreOutlined" title="More" size="lg" />
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold mb-3">Button with Icon</h4>
          <div class="flex flex-wrap gap-3">
            <AppButton type="primary" :icon="PlusOutlined">Add New</AppButton>
            <AppButton type="secondary" :icon="EditOutlined" icon-position="right">
              Edit
            </AppButton>
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Form Elements Section -->
    <AppCard class="mb-6" title="Form Elements">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-4">
          <AppInput
            v-model="formState.inputText"
            label="Text Input"
            placeholder="Enter some text..."
            hint="This is a hint message"
          />

          <AppPasswordInput
            v-model="formState.password"
            label="Password Input"
            placeholder="Enter password..."
            hint="Must be at least 8 characters"
          />

          <AppTextArea
            v-model="formState.textArea"
            label="Text Area"
            placeholder="Enter a longer text..."
            :rows="4"
            show-count
            :maxlength="200"
          />

          <AppSelect
            :model-value="formState.selectValue"
            label="Single Select"
            placeholder="Select an option..."
            :options="selectOptions"
            allow-clear
            show-search
            @update:model-value="(v) => formState.selectValue = v"
          />

          <AppSelect
            v-model="formState.multiSelectValue"
            label="Multiple Select"
            placeholder="Select multiple options..."
            :options="selectOptions"
            mode="multiple"
          />

          <AppDatePicker
            :model-value="formState.datePickerValue"
            label="Date Picker"
            placeholder="Select a date..."
            show-time
            @update:model-value="(v) => formState.datePickerValue = v"
          />
        </div>

        <!-- Right Column -->
        <div class="space-y-4">
          <AppCheckbox v-model="formState.checkboxValue" label="I agree to the terms and conditions" />

          <AppCheckbox
            v-model="formState.checkboxGroupValue"
            label="Checkbox Group"
            :options="checkboxOptions"
            group
            direction="vertical"
          />

          <AppRadio
            :model-value="formState.radioValue"
            label="Radio Group"
            :options="radioOptions"
            direction="vertical"
            @update:model-value="(v) => formState.radioValue = v"
          />

          <AppSwitch v-model="formState.switchValue" label="Enable notifications" />

          <div>
            <h4 class="text-sm font-semibold mb-3">Input with Error</h4>
            <AppInput
              label="Email"
              placeholder="Enter your email..."
              error="Please enter a valid email address"
            />
          </div>

          <div>
            <h4 class="text-sm font-semibold mb-3">Disabled Inputs</h4>
            <AppInput label="Disabled Input" disabled placeholder="This is disabled" />
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Alerts Section -->
    <AppCard class="mb-6" title="Alerts & Feedback">
      <div class="space-y-4">
        <AppAlert type="success" message="Success!" description="Your action was completed successfully." show-icon closable />
        <AppAlert type="info" message="Information" description="Here is some important information." show-icon />
        <AppAlert type="warning" message="Warning" description="Please review before continuing." show-icon />
        <AppAlert type="error" message="Error" description="Something went wrong. Please try again." show-icon closable />
      </div>
    </AppCard>

    <!-- Modal & Confirm Section -->
    <AppCard class="mb-6" title="Modals">
      <div class="flex flex-wrap gap-3">
        <AppButton type="primary" @click="showModal = true">
          Open Modal
        </AppButton>
        <AppButton type="secondary" @click="showConfirmModal = true">
          Open Confirmation Modal
        </AppButton>
      </div>
    </AppCard>

    <!-- Table Section -->
    <AppCard class="mb-6" title="Data Table" subtitle="Sortable columns with actions">
      <AppTable
        :columns="tableColumns"
        :data-source="tableData"
        :loading="false"
        :pagination="{ pageSize: 5, total: tableData.length }"
        row-key="id"
        :show-actions="true"
        :actions="tableActions"
        @change="handleTableChange"
      />
    </AppCard>

    <!-- Cards Section -->
    <AppCard class="mb-6" title="Cards">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppCard title="Basic Card" subtitle="Card subtitle">
          <p>This is a basic card with header, body, and optional footer sections.</p>
          <p class="mt-2">Cards are great for grouping related content together.</p>
        </AppCard>

        <AppCard title="Card with Actions" subtitle="Extra slot">
          <template #extra>
            <AppIconButton :icon="MoreOutlined" size="sm" />
          </template>
          <p>This card has an extra action in the header.</p>
          <template #footer>
            <div class="flex justify-end gap-2">
              <AppButton size="sm" type="secondary">Cancel</AppButton>
              <AppButton size="sm" type="primary">Save</AppButton>
            </div>
          </template>
        </AppCard>

        <AppCard title="Loading Card" loading>
          <p>This content won't be shown while loading.</p>
        </AppCard>

        <AppCard title="Hoverable Card" hoverable>
          <p>Hover over this card to see the shadow effect.</p>
        </AppCard>
      </div>
    </AppCard>

    <!-- Overlay Section -->
    <AppCard class="mb-6" title="Overlays">
      <div class="flex flex-wrap gap-3">
        <AppButton type="primary" :icon="PlusOutlined" @click="showDrawer = true">
          Open Drawer
        </AppButton>

        <AppDropdown :items="dropdownItems" @click="handleDropdownClick">
          <AppButton type="secondary" :icon="MoreOutlined">
            Dropdown Menu
          </AppButton>
        </AppDropdown>
      </div>
    </AppCard>

    <!-- Status Badges Section -->
    <AppCard class="mb-6" title="Status Badges">
      <div class="flex flex-wrap gap-4">
        <AppStatusBadge status="success" text="Active" />
        <AppStatusBadge status="warning" text="Pending" />
        <AppStatusBadge status="error" text="Error" />
        <AppStatusBadge status="info" text="Info" />
        <AppStatusBadge status="neutral" text="Neutral" />
        <AppStatusBadge status="success" text="Small Badge" size="sm" />
        <AppStatusBadge status="error" text="No Dot" :dot="false" />
      </div>
    </AppCard>

    <!-- Modals -->
    <AppModal
      v-model:open="showModal"
      title="Sample Modal"
      width="500"
      @ok="handleModalOk"
    >
      <p>This is a custom modal component built on top of Ant Design Vue.</p>
      <p class="mt-2">It supports custom headers, footers, and centered positioning.</p>
      <div class="mt-4 p-4 bg-secondary rounded">
        <h4 class="font-semibold mb-2">Features:</h4>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>Customizable title and content</li>
          <li>Centered positioning</li>
          <li>Custom footer actions</li>
          <li>Loading states</li>
        </ul>
      </div>
    </AppModal>

    <AppConfirmModal
      v-model:open="showConfirmModal"
      title="Delete Item"
      description="Are you sure you want to delete this item? This action cannot be undone."
      type="warning"
      ok-text="Delete"
      cancel-text="Cancel"
      ok-type="danger"
      @confirm="handleConfirmOk"
    />

    <!-- Drawer -->
    <AppDrawer
      v-model:open="showDrawer"
      title="Add New Item"
      placement="right"
      :width="400"
      :ok-loading="drawerLoading"
      @ok="handleDrawerOk"
    >
      <div class="space-y-4">
        <AppInput
          v-model="formState.inputText"
          label="Name"
          placeholder="Enter name..."
          required
        />
        <AppInput
          label="Email"
          placeholder="Enter email..."
          type="email"
        />
        <AppSelect
          label="Role"
          placeholder="Select role..."
          :options="[
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Viewer', value: 'viewer' },
          ]"
        />
        <AppTextArea
          label="Description"
          placeholder="Enter description..."
          :rows="3"
        />
        <AppSwitch v-model="formState.switchValue" label="Active" />
      </div>
    </AppDrawer>
  </div>
</template>

<style scoped>
.ui-showcase-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.showcase-header {
  padding: 24px;
  background: var(--app-bg-secondary);
  border-radius: var(--app-radius-lg);
  border: 1px solid var(--app-border-color);
}

.text-secondary {
  color: var(--app-text-secondary);
}

.bg-secondary {
  background-color: var(--app-bg-secondary);
}

/* Responsive grid */
.grid {
  display: grid;
  gap: 1rem;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Spacing utilities */
.space-y-4 > * + * {
  margin-top: 1rem;
}

.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}

.gap-4 {
  gap: 1rem;
}

.items-center {
  align-items: center;
}

.justify-end {
  justify-content: flex-end;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.p-4 {
  padding: 1rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-3xl {
  font-size: 1.875rem;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.list-disc {
  list-style-type: disc;
}

.list-inside {
  list-style-position: inside;
}
</style>