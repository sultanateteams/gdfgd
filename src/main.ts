import { createApp } from "vue";
import { createPinia } from "pinia";
import { useThemeStore } from "./stores/themeStore";

import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import i18n from "./i18n";

// Import global styles
import "./assets/themes.css"; // ← shu birinchi bo'lishi kerak
import "./style.css";
import "ant-design-vue/dist/reset.css";

// Create app instance
const app = createApp(App);
const themeStore = useThemeStore();

// Setup Pinia
const pinia = createPinia();

// Install plugins
app.use(Antd);
app.use(pinia);
app.use(i18n);
app.use(router);

// Mount app
app.mount("#app");
  
themeStore.applyTheme(); // data-theme va data-mode ni DOM ga qo'yadi
// Enable hot module replacement in development
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    app.unmount();
  });
}
