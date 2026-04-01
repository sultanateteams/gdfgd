<script setup lang="ts">
import { computed } from 'vue'
import { Input } from 'ant-design-vue'

interface AppTextAreaProps {
  label?: string
  required?: boolean
  error?: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  autoSize?: boolean | { minRows?: number; maxRows?: number }
  showCount?: boolean
  rows?: number
  id?: string
}

const props = withDefaults(defineProps<AppTextAreaProps>(), {
  label: '',
  required: false,
  error: '',
  hint: '',
  size: 'md',
  disabled: false,
  readonly: false,
  showCount: false,
  rows: 4,
})

defineOptions({
  name: 'AppTextArea',
})

const emit = defineEmits<{
  'update:value': [value: string]
  'update:modelValue': [value: string]
  'change': [e: Event]
  'blur': [e: FocusEvent]
  'focus': [e: FocusEvent]
}>()

const inputValue = computed({
  get: () => props.modelValue ?? '',
  set: (value) => {
    emit('update:value', value)
    emit('update:modelValue', value)
  },
})

const hasError = computed(() => !!props.error)

const sizeMap: Record<string, 'small' | 'large' | undefined> = {
  sm: 'small',
  md: undefined,
  lg: 'large',
}

const inputRef = computed(() => props.id)
</script>

<template>
  <div
    class="app-input-wrapper app-textarea"
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
    <Input.TextArea
      v-model:value="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :auto-size="autoSize"
      :show-count="showCount"
      :rows="rows"
      :size="sizeMap[size]"
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