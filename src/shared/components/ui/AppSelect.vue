<script setup lang="ts">
import { computed, ref } from 'vue'
import { Select } from 'ant-design-vue'
import type { SelectProps } from 'ant-design-vue'

interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

interface AppSelectProps {
  label?: string
  required?: boolean
  error?: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
  modelValue?: string | number | string[] | number[]
  options?: Option[]
  placeholder?: string
  disabled?: boolean
  mode?: 'multiple' | 'tags'
  allowClear?: boolean
  showSearch?: boolean
  filterOption?: boolean | ((input: string, option: any) => boolean)
  optionLabelProp?: string
  loading?: boolean
  id?: string
  maxTagCount?: number
}

const props = withDefaults(defineProps<AppSelectProps>(), {
  label: '',
  required: false,
  error: '',
  hint: '',
  size: 'md',
  disabled: false,
  allowClear: false,
  showSearch: false,
  filterOption: true,
  loading: false,
})

defineOptions({
  name: 'AppSelect',
})

const emit = defineEmits<{
  'update:value': [value: string | number | string[] | number[]]
  'update:modelValue': [value: string | number | string[] | number[]]
  'change': [value: any]
  'blur': [e: FocusEvent]
  'focus': [e: FocusEvent]
  'search': [value: string]
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

const selectRef = ref<InstanceType<typeof Select> | null>(null)

const focusSelect = () => {
  const inputElement = selectRef.value?.$el?.querySelector('input')
  if (inputElement) inputElement.focus()
}

const blurSelect = () => {
  const inputElement = selectRef.value?.$el?.querySelector('input')
  if (inputElement) inputElement.blur()
}

defineExpose({
  focus: focusSelect,
  blur: blurSelect,
  selectRef,
})
</script>

<template>
  <div
    class="app-input-wrapper app-select-wrapper"
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
    <Select
      ref="selectRef"
      v-model:value="inputValue"
      :options="options"
      :placeholder="placeholder"
      :disabled="disabled"
      :allow-clear="allowClear"
      :show-search="showSearch"
      :filter-option="filterOption"
      :loading="loading"
      :mode="mode"
      :option-label-prop="optionLabelProp"
      :size="sizeMap[size]"
      :max-tag-count="maxTagCount"
      @change="(e) => emit('change', e)"
      @blur="(e) => emit('blur', e)"
      @focus="(e) => emit('focus', e)"
      @search="(e) => emit('search', e)"
    >
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>
    </Select>

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