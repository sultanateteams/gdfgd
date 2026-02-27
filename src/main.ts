import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import global styles
import './style.css'

// Create app instance
const app = createApp(App)

// Setup Pinia
const pinia = createPinia()

// Install plugins
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
