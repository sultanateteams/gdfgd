<template>
  <div>
    
    <!-- Current Plan -->
    <AppCard title="Current Plan">
      <div class="space-y-4">
        <!-- Plan Box -->
        <div class="bg-body-bg p-5 flex flex-col md:flex-row md:items-center justify-between border border-border-color rounded-lg">
          <div>
            <h3 class="text-lg font-semibold text-text-primary">Professional Plan</h3>
            <p class="text-sm text-text-secondary mt-1">Up to 200 drivers</p>
          </div>
          <div class="mt-4 md:mt-0 flex items-center gap-4">
            <AppStatusBadge status="success" text="Active" />
            <div class="text-right">
              <span class="text-2xl font-bold text-text-primary">$299</span>
              <span class="text-sm text-text-secondary">/month</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center justify-between pt-2">
          <p class="text-sm text-text-secondary">Next Billing Date</p>
          <p class="text-sm font-medium text-text-primary">12/1/2024</p>
        </div>
        
        <div class="pt-4">
          <AppButton type="primary">Upgrade Plan</AppButton>
        </div>
      </div>
    </AppCard>

    <!-- Add-ons Enabled -->
    <AppCard title="Add-ons Enabled" class="mt-6">
      <div class="space-y-3">
        <!-- Addon 1 -->
        <div class="bg-body-bg p-4 flex flex-col md:flex-row md:items-center justify-between border border-border-color rounded-lg">
          <div>
            <h4 class="font-medium text-sm text-text-primary">MVR Monitoring</h4>
            <p class="text-xs text-text-secondary mt-1">$1.75 per driver/month</p>
          </div>
          <div class="mt-3 md:mt-0">
            <AppButton type="default" size="sm" :icon="UserAddOutlined">Enroll Driver</AppButton>
          </div>
        </div>
        
        <!-- Addon 2 -->
        <div class="bg-body-bg p-4 flex flex-col md:flex-row md:items-center justify-between border border-border-color rounded-lg">
          <div>
            <h4 class="font-medium text-sm text-text-primary">Clearinghouse Queries</h4>
            <p class="text-xs text-text-secondary mt-1">$2 flat per query rate (limited or full)</p>
          </div>
          <div class="mt-3 md:mt-0">
            <AppButton type="default" size="sm" :icon="DollarCircleOutlined">Purchase</AppButton>
          </div>
        </div>

        <!-- Addon 3 -->
        <div class="bg-body-bg p-4 flex flex-col md:flex-row md:items-center justify-between border border-border-color rounded-lg">
          <div>
            <h4 class="font-medium text-sm text-text-primary">BlueSign - Electronic Signatures</h4>
            <p class="text-xs text-text-secondary mt-1">$50/unlimited envelopes</p>
          </div>
        </div>
        
        <!-- Addon 4 -->
        <div class="bg-body-bg p-4 flex flex-col md:flex-row md:items-center justify-between border border-border-color rounded-lg">
          <div>
            <h4 class="font-medium text-sm text-text-primary">White Label</h4>
            <p class="text-xs text-text-secondary mt-1">Custom branding for your organization</p>
          </div>
          <div class="mt-3 md:mt-0">
            <AppButton type="default" size="sm" :icon="MailOutlined">Contact Us</AppButton>
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Payment Method -->
    <AppCard title="Payment Method" class="mt-6">
      <div class="space-y-6">
        <!-- Card Box -->
        <div class="bg-body-bg p-5 flex flex-col md:flex-row md:items-center justify-between border border-border-color rounded-lg">
          <div class="flex items-center gap-4">
            <div class="w-10 h-8 bg-card-bg border border-border-color rounded flex items-center justify-center text-text-muted">
              <CreditCardOutlined class="text-xl" />
            </div>
            <div>
              <p class="font-medium text-sm text-text-primary tracking-widest">• • • •  • • • •  • • • •  4242</p>
              <p class="text-xs text-text-secondary mt-1">Expires 12/2026 &bull; Visa</p>
            </div>
          </div>
          <div class="mt-4 md:mt-0">
            <AppButton type="default" size="sm" :icon="EditOutlined">Update</AppButton>
          </div>
        </div>
        
        <!-- Billing Email -->
        <div>
          <AppInput 
            v-model="billingEmail" 
            label="Billing Email Address" 
            placeholder="example@example.com"
          />
          <div class="flex items-center gap-2 mt-2 text-xs text-text-secondary bg-body-bg p-2 rounded">
            <InfoCircleOutlined class="text-text-muted" />
            <span>Invoices and receipts will be sent to this email</span>
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Invoice History -->
    <AppCard title="Invoice History" class="mt-6">
      <AppTable 
        :columns="invoiceColumns" 
        :data-source="invoiceData"
        :pagination="false"
      />
    </AppCard>

  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { 
  AppCard, 
  AppButton, 
  AppStatusBadge, 
  AppTable,
  AppInput,
  AppIconButton
} from '@/shared/components/ui'
import { useAccountSettings } from '../composables/useAccountSettings'
import {
  UserAddOutlined,
  DollarCircleOutlined,
  MailOutlined,
  EditOutlined,
  CreditCardOutlined,
  InfoCircleOutlined,
  DownloadOutlined
} from '@ant-design/icons-vue'

const { billingEmail } = useAccountSettings()

const invoiceColumns = [
  { title: 'Invoice', dataIndex: 'invoice', key: 'invoice' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Amount', dataIndex: 'amount', key: 'amount' },
  { 
    title: 'Status', 
    dataIndex: 'status', 
    key: 'status',
    customRender: ({ text }: { text: string }) => {
      return h(AppStatusBadge, { status: text === 'Paid' ? 'success' : 'warning', text: text, size: 'sm' })
    }
  },
  { 
    title: 'Download', 
    key: 'download',
    align: 'right',
    customRender: () => {
      return h('div', { class: 'flex justify-end' }, [
        h(AppIconButton, { icon: DownloadOutlined, size: 'sm' })
      ])
    }
  }
]

const invoiceData = ref([
  { id: 1, invoice: 'INV-2024-11', date: '11/1/2024', amount: '$299.00', status: 'Paid' },
  { id: 2, invoice: 'INV-2024-10', date: '10/1/2024', amount: '$299.00', status: 'Paid' },
  { id: 3, invoice: 'INV-2024-09', date: '9/1/2024', amount: '$299.00', status: 'Paid' },
  { id: 4, invoice: 'INV-2024-08', date: '8/1/2024', amount: '$299.00', status: 'Paid' }
])
</script>
