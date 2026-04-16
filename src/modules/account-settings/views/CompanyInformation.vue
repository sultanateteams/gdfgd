<template>
  <!-- No overall wrapper space-y-6 is needed since we added space-y-6 in AccountSettingsLayout.vue -->
  <div>
    
    <!-- User Details / Company Details -->
    <AppCard title="Company Details">
      <!-- Avatar -->
      <div class="mb-6">
        <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
          CN
        </div>
      </div>
      
      <div class="space-y-4">
        <!-- Row 1 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput v-model="companyForm.userName" label="Company Name" placeholder="Enter name" />
          <AppInput v-model="companyForm.dotNumber" label="DOT Number" placeholder="Enter DOT number" />
        </div>
        
        <!-- Row 2 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput v-model="companyForm.email" label="Email Address" type="email" placeholder="example@example.com" />
          <AppInput v-model="companyForm.contactNumber" label="Contact Number" placeholder="e.g. 555-123-4567" />
        </div>
        
        <!-- Row 3 -->
        <div>
          <AppInput v-model="companyForm.streetAddress" label="Street Address" placeholder="123 Main St" />
        </div>
        
        <!-- Row 4 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppInput v-model="companyForm.city" label="City" placeholder="City" />
          <AppSelect 
            v-model="companyForm.state" 
            label="State" 
            :options="stateOptions" 
            placeholder="Select a state"
          />
          <AppInput v-model="companyForm.zipCode" label="Zip Code" placeholder="Zip code" />
        </div>
      </div>
    </AppCard>

    <!-- Password & Security -->
    <AppCard title="Password & Security" class="mt-6">
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppPasswordInput v-model="companyForm.currentPassword" label="Current Password" placeholder="Enter current password" class="md:col-span-2 md:w-1/2" />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppPasswordInput v-model="companyForm.newPassword" label="New Password" placeholder="Enter strong password" />
          <AppPasswordInput v-model="companyForm.confirmPassword" label="Confirm New Password" placeholder="Confirm strong password" />
        </div>

        <div class="pt-4 border-t border-border-color">
          <h4 class="font-medium text-base mb-1 text-text-primary">Two-Factor Authentication</h4>
          <p class="text-sm text-text-secondary mb-4">Keep your account secure by enabling 2FA via SMS or using a temporary one-time passcode (TOTP) from an authenticator app.</p>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-body-bg rounded-lg">
              <div>
                <p class="font-medium text-sm text-text-primary">Text Message (SMS)</p>
                <p class="text-xs text-text-secondary">Receive a one-time passcode via SMS each time you log in.</p>
              </div>
              <AppSwitch v-model="companyForm.twoFactorSms" />
            </div>
            
            <div class="flex items-center justify-between p-4 bg-body-bg rounded-lg">
              <div>
                <p class="font-medium text-sm text-text-primary">Authenticator App (TOTP)</p>
                <p class="text-xs text-text-secondary">Use an app to receive a temporary one-time passcode each time you log in.</p>
              </div>
              <AppSwitch v-model="companyForm.twoFactorApp" />
            </div>
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Session History -->
    <AppCard title="Session History" class="mt-6">
      <AppTable 
        :columns="sessionColumns" 
        :data-source="sessionData"
        :pagination="false"
      />
    </AppCard>

    <!-- Danger Zone -->
    <AppCard title="Danger Zone" class="mt-6">
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium text-base text-text-primary">Log out all sessions</h4>
            <p class="text-sm text-text-secondary">Log out all sessions including any session on mobile, iPad, and other browsers</p>
          </div>
          <button class="text-danger font-medium text-sm hover:underline border-none bg-transparent cursor-pointer" @click="handleLogoutAll">
            Log out from all sessions
          </button>
        </div>
        
        <div class="pt-4 border-t border-border-color">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium text-base text-text-primary">Delete</h4>
              <p class="text-sm text-text-secondary">Everything in your account will be deleted permanently</p>
            </div>
          </div>
          <div class="mt-4">
            <AppButton type="danger" @click="showDeleteModal = true">Delete Account</AppButton>
          </div>
        </div>
      </div>
    </AppCard>

    <AppConfirmModal
      v-model:open="showDeleteModal"
      title="Delete Account"
      description="Are you sure you want to delete your account? This action cannot be undone."
      type="warning"
      ok-text="Yes, Delete"
      cancel-text="Cancel"
      ok-type="danger"
      @confirm="handleConfirmDelete"
    />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  AppCard, 
  AppInput, 
  AppPasswordInput, 
  AppSwitch, 
  AppButton, 
  AppSelect,
  AppTable,
  AppConfirmModal
} from '@/shared/components/ui'
import { useAccountSettings } from '../composables/useAccountSettings'

const { companyForm } = useAccountSettings()
const showDeleteModal = ref(false)

const stateOptions = [
  { label: 'Tennessee', value: 'TN' },
  { label: 'California', value: 'CA' },
  { label: 'New York', value: 'NY' }
  // Provide additional ones as needed
]

const sessionColumns = [
  { title: 'Device', dataIndex: 'device', key: 'device' },
  { title: 'Location', dataIndex: 'location', key: 'location' },
  { title: 'Login Time', dataIndex: 'loginTime', key: 'loginTime' },
  { title: 'Last Active', dataIndex: 'lastActive', key: 'lastActive' }
]

const sessionData = ref([
  { id: 1, device: 'Chrome on Windows', location: 'San Francisco, CA', loginTime: '11/28/2024 8:00 AM', lastActive: '11/28/2024 2:45 PM' },
  { id: 2, device: 'Safari on MacBook', location: 'Oakland, CA', loginTime: '11/28/2024 7:30 AM', lastActive: '11/28/2024 10:30 AM' },
  { id: 3, device: 'Chrome on Windows', location: 'San Jose, CA', loginTime: '11/27/2024 9:00 AM', lastActive: '11/27/2024 4:15 PM' },
  { id: 4, device: 'Safari on MacBook', location: 'San Francisco, CA', loginTime: '11/28/2024 8:00 AM', lastActive: '11/28/2024 2:45 PM' }
])

function handleLogoutAll() {
  console.log('Logging out all sessions')
}

function handleConfirmDelete() {
  console.log('Account deleted')
  showDeleteModal.value = false
}
</script>
