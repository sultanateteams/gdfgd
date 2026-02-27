import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import router from './app/router'
import './shared/styles/global.css'

const app = createApp(App)

// Install plugins
app.use(createPinia())
app.use(router)

app.mount('#app')
