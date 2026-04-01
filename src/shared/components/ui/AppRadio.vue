<script setup lang="ts">
import { computed } from 'vue'
import { Radio } from 'ant-design-vue'

interface Option {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

interface AppRadioProps {
  label?: string
  required?: boolean
  error?: string
  hint?: string
  modelValue?: string | number | boolean
  options?: Option[]
  disabled?: boolean
  id?: string
  direction?: 'horizontal' | 'vertical'
  buttonStyle?: 'outline' | 'solid'
}

const props = withDefaults(defineProps<AppRadioProps>(), {
  label: '',
  required: false,
  error: '',
  hint: '',
  disabled: false,
  direction: 'vertical',
  buttonStyle: 'outline',
})

defineOptions({
  name: 'AppRadio',
})

const emit = defineEmits<{
  'update:value': [value: string | number | boolean]
  'update:modelValue': [value: string | number | boolean]
  'change': [value: any]
}>()

const inputValue = computed({
  get: () => props.modelValue ?? '',
  set: (value) => {
    emit('update:value', value)
    emit('update:modelValue', value)
  },
})

const hasError = computed(() => !!props.error)
</script>

<template>
  <div
    class="app-input-wrapper app-radio-group"
    :class="{
      'has-error': hasError,
    }"
  >
    <label
      v-if="label"
      class="app-input-label"
      :class="{ required }"
    >
      {{ label }}
    </label>

    <div
      :class="direction === 'vertical' ? 'flex flex-col gap-2' : 'flex gap-4'"
    >
      <!-- @vue-ignore -->
      <Radio.Group
        v-model:value="inputValue"
        :disabled="disabled"
        :button-style="buttonStyle === 'solid' ? 'solid' : 'outline'"
        @change="(e) => emit('change', e.target.value)"
      >
        <Radio
          v-for="option in options"
          :key="String(option.value)"
          :value="option.value"
          :disabled="option.disabled || false"
        >
          {{ option.label }}
        </Radio>
      </Radio.Group>
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