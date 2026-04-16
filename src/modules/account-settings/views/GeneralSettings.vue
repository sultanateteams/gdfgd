<template>
  <div>
    
    <!-- General -->
    <AppCard title="General">
      <div class="space-y-6">
        <!-- Appearance -->
        <div>
          <h4 class="font-medium text-base mb-1 text-text-primary">Appearance</h4>
          <p class="text-sm text-text-secondary mb-4">Choose light or dark mode, or switch your mode automatically based on your system settings.</p>
          
          <div class="flex flex-wrap gap-4">
            <!-- Light Mode Button -->
            <button 
              class="group flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer p-0"
              @click="theme = 'light'"
            >
              <div 
                class="w-32 h-20 rounded-lg border-2 transition-all p-2"
                :class="theme === 'light' ? 'border-primary bg-primary-light' : 'border-border-color bg-card-bg hover:border-primary'"
              >
                <!-- Mini preview UI representation -->
                <div class="w-full h-full flex flex-col gap-1 overflow-hidden opacity-80">
                  <div class="w-full h-2 bg-body-bg rounded-sm border border-border-color"></div>
                  <div class="flex gap-1 h-full">
                    <div class="w-1/3 h-full bg-sidebar-bg rounded-sm border border-border-color"></div>
                    <div class="w-2/3 h-full bg-body-bg rounded-sm border border-border-color"></div>
                  </div>
                </div>
              </div>
              <span class="text-sm font-medium" :class="theme === 'light' ? 'text-primary' : 'text-text-secondary'">Light</span>
            </button>

            <!-- Dark Mode Button -->
            <button 
              class="group flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer p-0"
              @click="theme = 'dark'"
            >
              <div 
                class="w-32 h-20 rounded-lg border-2 transition-all p-2"
                :class="theme === 'dark' ? 'border-primary bg-primary-light' : 'border-border-color bg-card-bg hover:border-primary'"
              >
                <!-- Mock dark preview explicitly passing static dark-looking classes -->
                <div class="w-full h-full flex flex-col gap-1 overflow-hidden opacity-80">
                  <div class="w-full h-2 bg-[#1f2937] rounded-sm border border-[#374151]"></div>
                  <div class="flex gap-1 h-full">
                    <div class="w-1/3 h-full bg-[#111827] rounded-sm border border-[#374151]"></div>
                    <div class="w-2/3 h-full bg-[#1f2937] rounded-sm border border-[#374151]"></div>
                  </div>
                </div>
              </div>
              <span class="text-sm font-medium" :class="theme === 'dark' ? 'text-primary' : 'text-text-secondary'">Dark</span>
            </button>

            <!-- Auto Mode Button -->
            <button 
              class="group flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer p-0"
              @click="theme = 'auto'"
            >
              <div 
                class="w-32 h-20 rounded-lg border-2 transition-all flex overflow-hidden p-0"
                :class="theme === 'auto' ? 'border-primary' : 'border-border-color hover:border-primary'"
              >
                <!-- Split Light / Dark -->
                <div class="w-1/2 h-full bg-card-bg flex border-r border-border-color p-1 opacity-80">
                   <div class="w-full h-full bg-body-bg border border-border-color rounded-sm"></div>
                </div>
                <div class="w-1/2 h-full bg-[#111827] flex p-1 border-l border-[#374151] opacity-80">
                   <div class="w-full h-full bg-[#1f2937] border border-[#374151] rounded-sm"></div>
                </div>
              </div>
              <span class="text-sm font-medium" :class="theme === 'auto' ? 'text-primary' : 'text-text-secondary'">Auto</span>
            </button>
          </div>
        </div>

        <div class="border-t border-border-color"></div>

        <!-- Personal Preferences -->
        <div>
          <h4 class="font-medium text-base mb-1 text-text-primary">Personal Preferences</h4>
          <p class="text-sm text-text-secondary mb-4">Customize your experience</p>
          
          <div class="space-y-4">
            <!-- Dropdowns -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppSelect 
                v-model="timezone" 
                label="Time Zone" 
                :options="timezoneOptions" 
              />
              <AppSelect 
                v-model="language" 
                label="Language" 
                :options="languageOptions" 
              />
            </div>
            
            <!-- Date Format -->
            <div>
              <AppRadio 
                v-model="dateFormat" 
                label="Date Format" 
                :options="dateFormatOptions" 
                direction="horizontal" 
              />
            </div>
            
            <!-- Time Format -->
            <div>
              <AppRadio 
                v-model="timeFormat" 
                label="Time Format" 
                :options="timeFormatOptions" 
                direction="horizontal" 
              />
            </div>
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Company Logo -->
    <AppCard title="Company Logo" class="mt-6">
      <div class="space-y-2">
        <p class="text-sm text-text-secondary">Upload a new logo or link to an existing file from Documents</p>
        
        <!-- Upload Zone -->
        <div class="mt-4 w-48 h-32 border-2 border-dashed border-border-color rounded-lg flex flex-col items-center justify-center bg-body-bg cursor-pointer hover:border-primary hover:bg-primary-light transition-colors group">
          <CloudUploadOutlined class="text-2xl text-primary mb-2 group-hover:scale-110 transition-transform" />
          <span class="text-sm font-medium text-primary">Upload</span>
        </div>
        
        <p class="text-xs text-text-secondary mt-2">Recommended: 128×128px, PNG or JPG, max 2MB</p>
      </div>
    </AppCard>

    <!-- Signature Setup -->
    <AppCard title="Signature Setup (for eSign)" class="mt-6">
      <div class="space-y-4">
        <p class="text-sm text-text-secondary">Set up your digital signature for electronic document signing</p>
        
        <!-- Signature Display -->
        <div class="bg-body-bg border border-border-color rounded-lg h-24 flex items-center justify-center">
          <!-- A cursive-like font for the signature -->
          <span class="text-4xl text-text-primary opacity-80" style="font-family: 'Brush Script MT', 'Dancing Script', cursive;">Courtney Henry</span>
        </div>
        
        <div>
          <AppButton type="default" size="sm" :icon="EditOutlined">Update</AppButton>
        </div>
      </div>
    </AppCard>

  </div>
</template>

<script setup lang="ts">
import { 
  AppCard, 
  AppButton, 
  AppSelect,
  AppRadio
} from '@/shared/components/ui'
import {
  CloudUploadOutlined,
  EditOutlined
} from '@ant-design/icons-vue'
import { useAccountSettings } from '../composables/useAccountSettings'

const { theme, timezone, language, dateFormat, timeFormat } = useAccountSettings()

const timezoneOptions = [
  { label: 'Pacific Time', value: 'Pacific Time' },
  { label: 'Eastern Time', value: 'Eastern Time' },
  { label: 'Central Time', value: 'Central Time' },
  { label: 'Mountain Time', value: 'Mountain Time' }
]

const languageOptions = [
  { label: 'English', value: 'English' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'French', value: 'French' }
]

const dateFormatOptions = [
  { label: 'mm/dd/yyyy', value: 'mm/dd/yyyy' },
  { label: 'dd/mm/yyyy', value: 'dd/mm/yyyy' },
  { label: 'yyyy/mm/dd', value: 'yyyy/mm/dd' }
]

const timeFormatOptions = [
  { label: '12 Hours', value: '12 Hours' },
  { label: '24 Hours', value: '24 Hours' }
]
</script>
