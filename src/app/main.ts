import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import i18n from "@/i18n";
import "../shared/styles/global.css";

async function bootstrap() {
  const pinia = createPinia();
  const app = createApp(App);

  app.use(pinia);
  app.use(router);
  app.use(i18n);

  // Initialize theme store early
  const { useThemeStore } = await import("@/stores/themeStore");
  const themeStore = useThemeStore();
  themeStore.initialize();

  // Import and use languages store
  const { useLanguagesStore } = await import("@/stores/languages");
  const languagesStore = useLanguagesStore(pinia);

  // Fetch languages from API (fire and forget - localStorage data is already loaded)
  languagesStore.fetchLanguages();

  // Determine initial locale
  const PREFERRED_LOCALE_KEY = "preferred-locale";
  let initialLocale = localStorage.getItem(PREFERRED_LOCALE_KEY);

  // Check if saved locale exists in store codes
  if (!initialLocale || !languagesStore.codes.includes(initialLocale)) {
    initialLocale = languagesStore.defaultLocale;
  }

  // Load translations for the initial locale
  const { loadTranslations } = await import("@/i18n");
  await loadTranslations(initialLocale);

  // Mount app immediately - do not await
  app.mount("#app");
}

bootstrap().catch(console.error);
