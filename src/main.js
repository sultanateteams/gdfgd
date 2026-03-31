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
    el.setAttribute('data-t-key', binding.value)
  },
  updated(el, binding) {
    el.setAttribute('data-t-key', binding.value)
  }
})


app.mount('#app')