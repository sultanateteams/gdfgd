<script setup lang="ts">
import { computed, ref } from 'vue'
import { DatePicker } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'

interface AppDatePickerProps {
  label?: string
  required?: boolean
  error?: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
  modelValue?: Dayjs | string
  placeholder?: string
  disabled?: boolean
  format?: string
  showTime?: boolean
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year'
  id?: string
  disabledDate?: (date: Dayjs) => boolean
}

const props = withDefaults(defineProps<AppDatePickerProps>(), {
  label: '',
  required: false,
  error: '',
  hint: '',
  size: 'md',
  disabled: false,
  format: 'YYYY-MM-DD',
  showTime: false,
  picker: 'date',
})

defineOptions({
  name: 'AppDatePicker',
})

const emit = defineEmits<{
  'update:value': [value: Dayjs | string]
  'update:modelValue': [value: Dayjs | string]
  'change': [value: Dayjs | string]
  'blur': [e: FocusEvent]
  'focus': [e: FocusEvent]
}>()

const inputValue = computed({
  get: () => props.modelValue ?? null,
  set: (value) => {
    emit('update:value', value as Dayjs | string)
    emit('update:modelValue', value as Dayjs | string)
  },
})

const hasError = computed(() => !!props.error)

const sizeMap: Record<string, 'small' | 'large' | undefined> = {
  sm: 'small',
  md: undefined,
  lg: 'large',
}

const pickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

const focusPicker = () => {
  const inputElement = pickerRef.value?.$el?.querySelector('input')
  if (inputElement) inputElement.focus()
}

const blurPicker = () => {
  const inputElement = pickerRef.value?.$el?.querySelector('input')
  if (inputElement) inputElement.blur()
}

defineExpose({
  focus: focusPicker,
  blur: blurPicker,
  pickerRef,
})
</script>

<template>
  <div
    class="app-input-wrapper"
    :class="{
      'has-error': hasError,
    }"
  >
    <label
      v-if="label"
      class="app-input-label"
      :class="{ required }"
      :for="id"
    >
      {{ label }}
    </label>

    <!-- @vue-ignore -->
    <DatePicker
      ref="pickerRef"
      v-model:value="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :format="format"
      :show-time="showTime"
      :picker="picker"
      :size="sizeMap[size]"
      :disabled-date="disabledDate"
      @change="(e) => emit('change', e)"
      @blur="(e) => emit('blur', e)"
      @focus="(e) => emit('focus', e)"
    />

    <div v-if="error" class="app-input-error">
      {{ error }}
    </div>
    <div v-else-if="hint" class="app-input-hint">
      {{ hint }}
    </div>
  </div>
</template>

<style scoped>
/* Styles in ui-components.css */
</style>