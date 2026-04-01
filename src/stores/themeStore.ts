import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

export type ThemeName = "ocean" | "forest" | "sunset" | "slate";
export type ThemeMode = "light" | "dark";

const VALID_THEMES: ThemeName[] = ["ocean", "forest", "sunset", "slate"];
const VALID_MODES: ThemeMode[] = ["light", "dark"];

function getSaved<T extends string>(key: string, fallback: T, valid: T[]): T {
  const val = localStorage.getItem(key) as T;
  return valid.includes(val) ? val : fallback;
}

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref<ThemeName>(
    getSaved("hrm-theme", "ocean", VALID_THEMES)
  );
  const mode = ref<ThemeMode>(
    getSaved("hrm-mode", "dark", VALID_MODES)
  );

  // watchEffect — barcha dependencylar o'zgarganda avtomatik ishlaydi
  watchEffect(() => {
    const root = document.documentElement;
    
    root.setAttribute("data-theme", currentTheme.value);
    root.setAttribute("data-mode", mode.value);
    root.classList.toggle("dark", mode.value === "dark");

    localStorage.setItem("hrm-theme", currentTheme.value);
    localStorage.setItem("hrm-mode", mode.value);
    
    // Debug: haqiqatan o'zgarayaptimi?
    console.log(
      "Applied →",
      "theme:", root.getAttribute("data-theme"),
      "mode:", root.getAttribute("data-mode"),
      "dark class:", root.classList.contains("dark")
    );
  });

  function setTheme(theme: ThemeName) {
    currentTheme.value = theme; // watchEffect avtomatik ishlaydi
  }

  function toggleMode() {
    mode.value = mode.value === "dark" ? "light" : "dark"; // watchEffect avtomatik ishlaydi
  }

  function setMode(m: ThemeMode) {
    mode.value = m;
  }

  return { currentTheme, mode, setTheme, toggleMode, setMode };
});