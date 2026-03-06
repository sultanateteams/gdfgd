import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'

// Import global styles
import './style.css'
import 'ant-design-vue/dist/reset.css'

// Create app instance
const app = createApp(App)

// Setup Pinia
const pinia = createPinia()

// Install plugins
app.use(Antd)
app.use(pinia)
app.use(router)

// Mount app
app.mount('#app')

// Enable hot module replacement in development
if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.dispose(() => {
    app.unmount()
  })
}
