<script setup lang="ts">
import { computed } from 'vue'
import { Checkbox } from 'ant-design-vue'

interface Option {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

interface AppCheckboxProps {
  label?: string
  required?: boolean
  error?: string
  hint?: string
  modelValue?: string | number | boolean | (string | number | boolean)[]
  options?: Option[]
  disabled?: boolean
  id?: string
  group?: boolean
  direction?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<AppCheckboxProps>(), {
  label: '',
  required: false,
  error: '',
  hint: '',
  disabled: false,
  group: false,
  direction: 'vertical',
})

defineOptions({
  name: 'AppCheckbox',
})

const emit = defineEmits<{
  'update:value': [value: string | number | boolean | (string | number | boolean)[]]
  'update:modelValue': [value: string | number | boolean | (string | number | boolean)[]]
  'change': [value: any]
}>()

const inputValue = computed({
  get: () => props.modelValue ?? (props.group ? [] : false),
  set: (value) => {
    emit('update:value', value)
    emit('update:modelValue', value)
  },
})

const hasError = computed(() => !!props.error)
</script>

<template>
  <div
    class="app-input-wrapper app-checkbox-wrapper"
    :class="{
      'has-error': hasError,
    }"
  >
    <label
      v-if="label && !group"
      class="app-input-label"
      :class="{ required }"
    >
      {{ label }}
    </label>

    <!-- Single Checkbox -->
    <Checkbox
      v-if="!group"
      :checked="inputValue as boolean"
      :disabled="disabled"
      @update:checked="(e) => emit('update:modelValue', e)"
      @change="(e) => emit('change', e)"
    >
      <slot>{{ label }}</slot>
    </Checkbox>

    <!-- Checkbox Group -->
    <div
      v-else
      :class="direction === 'vertical' ? 'flex flex-col gap-2' : 'flex gap-4'"
    >
      <Checkbox
        v-for="option in options"
        :key="String(option.value)"
        :checked="(inputValue as any[]).includes(option.value)"
        :disabled="option.disabled || disabled"
        @update:checked="(checked) => {
          const arr = [...(inputValue as any[])];
          if (checked) {
            arr.push(option.value);
          } else {
            const idx = arr.indexOf(option.value);
            if (idx > -1) arr.splice(idx, 1);
          }
          emit('update:modelValue', arr);
          emit('change', arr);
        }"
      >
        {{ option.label }}
      </Checkbox>
    </div>

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