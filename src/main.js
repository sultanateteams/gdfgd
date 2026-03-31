import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import router from './app/router'
import './shared/styles/global.css'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import i18n from './i18n'

const app = createApp(App)

// Install plugins
app.use(Antd)
app.use(createPinia())
app.use(i18n)
app.use(router)

app.mount('#app')
