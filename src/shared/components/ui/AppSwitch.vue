<script setup lang="ts">
import { computed } from 'vue'
import { Switch } from 'ant-design-vue'

interface AppSwitchProps {
  label?: string
  required?: boolean
  error?: string
  hint?: string
  modelValue?: boolean
  checkedChildren?: string
  unCheckedChildren?: string
  disabled?: boolean
  loading?: boolean
  size?: 'default' | 'small'
  id?: string
}

const props = withDefaults(defineProps<AppSwitchProps>(), {
  label: '',
  required: false,
  error: '',
  hint: '',
  disabled: false,
  loading: false,
  size: 'default',
})

defineOptions({
  name: 'AppSwitch',
})

const emit = defineEmits<{
  'update:value': [value: boolean]
  'update:modelValue': [value: boolean]
  'change': [value: boolean]
}>()

const inputValue = computed({
  get: () => props.modelValue ?? false,
  set: (value) => {
    emit('update:value', value)
    emit('update:modelValue', value)
  },
})

const hasError = computed(() => !!props.error)
</script>

<template>
  <div
    class="app-input-wrapper app-switch-wrapper"
    :class="{
      'has-error': hasError,
    }"
  >
    <div class="flex items-center gap-3">
      <!-- @vue-ignore -->
      <Switch
        v-model:checked="inputValue"
        :checked-children="checkedChildren"
        :un-checked-children="unCheckedChildren"
        :disabled="disabled"
        :loading="loading"
        :size="size"
        @change="(e) => emit('change', e)"
      />
      <label
        v-if="label"
        class="app-input-label"
        :class="{ required }"
        :for="id"
        style="margin-bottom: 0; cursor: pointer"
        @click="inputValue = !inputValue"
      >
        {{ label }}
      </label>
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