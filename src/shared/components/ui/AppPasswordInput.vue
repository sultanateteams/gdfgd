<script setup lang="ts">
import { computed, ref } from 'vue'
import { Input } from 'ant-design-vue'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue'

interface AppPasswordProps {
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
  id?: string
}

const props = withDefaults(defineProps<AppPasswordProps>(), {
  label: '',
  required: false,
  error: '',
  hint: '',
  size: 'md',
  disabled: false,
  readonly: false,
})

defineOptions({
  name: 'AppPasswordInput',
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

const visible = ref(false)

const toggleVisible = () => {
  visible.value = !visible.value
}

const hasError = computed(() => !!props.error)

const sizeMap: Record<string, 'small' | 'large' | undefined> = {
  sm: 'small',
  md: undefined,
  lg: 'large',
}

const inputRef = ref<InstanceType<typeof Input> | null>(null)

const focusInput = () => {
  const inputElement = inputRef.value?.$el?.querySelector('input')
  if (inputElement) inputElement.focus()
}

const blurInput = () => {
  const inputElement = inputRef.value?.$el?.querySelector('input')
  if (inputElement) inputElement.blur()
}

defineExpose({
  focus: focusInput,
  blur: blurInput,
  inputRef,
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
    <Input
      ref="inputRef"
      v-model:value="inputValue"
      :type="visible ? 'text' : 'password'"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :size="sizeMap[size]"
      @change="(e) => emit('change', e)"
      @blur="(e) => emit('blur', e)"
      @focus="(e) => emit('focus', e)"
    >
      <template #suffix>
        <component
          :is="visible ? EyeInvisibleOutlined : EyeOutlined"
          style="cursor: pointer; color: var(--app-text-muted)"
          @click="toggleVisible"
        />
      </template>
    </Input>

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