import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import router from './app/router'
import './shared/styles/global.css'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import i18n from './i18n'

const app = createApp(App)

app.use(Antd)
app.use(createPinia())
app.use(i18n)
app.use(router)

app.directive('t-edit', {
  mounted(el, binding) {
    const value = binding.value
    if (typeof value === 'string') {
      el.setAttribute('data-t-key', value)
    } else if (typeof value === 'object' && value !== null) {
      if (value.key) el.setAttribute('data-t-key', value.key)
      if (value.default !== undefined && value.default !== null) {
        el.setAttribute('data-t-default', String(value.default))
      }
    }
  },
  updated(el, binding) {
    const value = binding.value
    if (typeof value === 'string') {
      el.setAttribute('data-t-key', value)
    } else if (typeof value === 'object' && value !== null) {
      if (value.key) el.setAttribute('data-t-key', value.key)
      if (value.default !== undefined && value.default !== null) {
        el.setAttribute('data-t-default', String(value.default))
      }
    }
  }
})


app.mount('#app')