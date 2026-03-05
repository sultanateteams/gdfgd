import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import router from './app/router'
import './shared/styles/global.css'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

// Install plugins
app.use(Antd)
app.use(createPinia())
app.use(router)

app.mount('#app')
