<script setup lang="ts">
import { computed, ref } from 'vue'
import { Input } from 'ant-design-vue'
import type { InputProps } from 'ant-design-vue'

interface AppInputProps {
  // Custom props
  label?: string
  required?: boolean
  error?: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
  // v-model support
  modelValue?: string
  value?: string
  // Pass through Ant Design props
  id?: InputProps['id']
  placeholder?: InputProps['placeholder']
  type?: InputProps['type']
  disabled?: InputProps['disabled']
  readonly?: InputProps['readonly']
  maxlength?: InputProps['maxlength']
  allowClear?: InputProps['allowClear']
  showCount?: InputProps['showCount']
  addonBefore?: InputProps['addonBefore']
  addonAfter?: InputProps['addonAfter']
  prefix?: InputProps['prefix']
  suffix?: InputProps['suffix']
}

const props = withDefaults(defineProps<AppInputProps>(), {
  label: '',
  required: false,
  error: '',
  hint: '',
  size: 'md',
  disabled: false,
  readonly: false,
  allowClear: false,
  showCount: false,
})

defineOptions({
  name: 'AppInput',
  inheritAttrs: false,
})

const emit = defineEmits<{
  'update:value': [value: string]
  'update:modelValue': [value: string]
  'change': [e: Event]
  'blur': [e: FocusEvent]
  'focus': [e: FocusEvent]
}>()

const inputValue = computed({
  get: () => props.modelValue ?? props.value ?? '',
  set: (value) => {
    emit('update:value', value)
    emit('update:modelValue', value)
  },
})

type InputRef = InstanceType<typeof Input>
const inputRef = ref<InputRef | null>(null)

const focus = () => {
  const inputElement = inputRef.value?.$el?.querySelector('input')
  if (inputElement) inputElement.focus()
}

const blur = () => {
  const inputElement = inputRef.value?.$el?.querySelector('input')
  if (inputElement) inputElement.blur()
}

defineExpose({
  focus,
  blur,
  inputRef,
})

const hasError = computed(() => !!props.error)

const sizeMap: Record<string, 'small' | 'large' | undefined> = {
  sm: 'small',
  md: undefined,
  lg: 'large',
}
</script>

<template>
  <div
    class="app-input-wrapper"
    :class="{
      'has-error': hasError,
    }"
  >
    <!-- Label -->
    <label
      v-if="label"
      class="app-input-label"
      :class="{ required }"
      :for="props.id"
    >
      {{ label }}
    </label>

    <!-- Input -->
    <Input
      ref="inputRef"
      v-bind="$attrs"
      v-model:value="inputValue"
      :size="sizeMap[size]"
      @change="(e) => emit('change', e)"
      @blur="(e) => emit('blur', e)"
      @focus="(e) => emit('focus', e)"
    >
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>
    </Input>

    <!-- Error Message -->
    <div v-if="error" class="app-input-error">
      {{ error }}
    </div>

    <!-- Hint Text -->
    <div v-else-if="hint" class="app-input-hint">
      {{ hint }}
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles are in ui-components.css */
</style>