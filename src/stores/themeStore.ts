import { defineStore } from "pinia";
import { ref, computed, watchEffect } from "vue";
import type { Theme, ThemeColors, ThemeMode } from "@/types/theme";
import { DEFAULT_THEMES } from "@/types/theme";

// Storage keys
const STORAGE_KEYS = {
  CURRENT_THEME: "hrm-current-theme",
  CURRENT_MODE: "hrm-mode",
  CUSTOM_THEMES: "hrm-custom-themes",
};

// Legacy theme names mapping
export const LEGACY_THEME_NAMES = [
  "ocean",
  "forest",
  "sunset",
  "slate",
] as const;
export type LegacyThemeName = (typeof LEGACY_THEME_NAMES)[number];

export const useThemeStore = defineStore("theme", () => {
  // State
  const currentThemeId = ref<string>("ocean-light");
  const currentMode = ref<ThemeMode>("light");
  const customThemes = ref<Theme[]>([]);
  const isInitialized = ref(false);

  // Get all themes (default + custom)
  const allThemes = computed<Theme[]>(() => {
    return [...DEFAULT_THEMES, ...customThemes.value];
  });

  // Get current theme object
  const currentTheme = computed<Theme | undefined>(() => {
    return allThemes.value.find((t) => t.id === currentThemeId.value);
  });

  // Get themes by mode
  const lightThemes = computed<Theme[]>(() => {
    return allThemes.value.filter((t) => t.type === "light");
  });

  const darkThemes = computed<Theme[]>(() => {
    return allThemes.value.filter((t) => t.type === "dark");
  });

  // Get only custom themes
  const userCustomThemes = computed<Theme[]>(() => {
    return customThemes.value;
  });

  // Get legacy theme name (for backward compatibility)
  const legacyThemeName = computed<LegacyThemeName>(() => {
    const theme = currentTheme.value;
    if (!theme) return "ocean";

    // Extract base name from id (e.g., 'ocean' from 'ocean-dark')
    const baseName = theme.id.split("-")[0] as LegacyThemeName;
    return LEGACY_THEME_NAMES.includes(baseName) ? baseName : "ocean";
  });

  // Initialize store from localStorage
  function initialize() {
    if (isInitialized.value) return;

    try {
      // Load custom themes
      const savedCustomThemes = localStorage.getItem(
        STORAGE_KEYS.CUSTOM_THEMES,
      );
      if (savedCustomThemes) {
        const parsed = JSON.parse(savedCustomThemes);
        if (Array.isArray(parsed)) {
          customThemes.value = parsed.filter(isValidTheme);
        }
      }

      // Load current theme preference
      const savedTheme = localStorage.getItem(STORAGE_KEYS.CURRENT_THEME);
      if (savedTheme) {
        const theme = allThemes.value.find((t) => t.id === savedTheme);
        if (theme) {
          currentThemeId.value = savedTheme;
        }
      }

      // Load mode preference
      const savedMode = localStorage.getItem(
        STORAGE_KEYS.CURRENT_MODE,
      ) as ThemeMode;
      if (savedMode === "light" || savedMode === "dark") {
        currentMode.value = savedMode;
      }

      // Apply theme
      applyTheme();
    } catch (error) {
      console.error("Failed to initialize theme store:", error);
    }

    isInitialized.value = true;
  }

  // Validate theme object
  function isValidTheme(theme: any): theme is Theme {
    return (
      theme &&
      typeof theme.id === "string" &&
      typeof theme.name === "string" &&
      typeof theme.type === "string" &&
      ["light", "dark"].includes(theme.type) &&
      typeof theme.colors === "object" &&
      theme.colors !== null
    );
  }

  // Apply theme to document
  function applyTheme() {
    const theme = currentTheme.value;
    if (!theme) return;

    const root = document.documentElement;

    // Set theme and mode attributes
    root.setAttribute("data-theme", legacyThemeName.value);
    root.setAttribute("data-mode", currentMode.value);
    root.classList.toggle("dark", currentMode.value === "dark");

    // Apply custom colors as CSS variables
    applyCustomColors(theme.colors);

    // Save preferences
    localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, currentThemeId.value);
    localStorage.setItem(STORAGE_KEYS.CURRENT_MODE, currentMode.value);

    console.log("Applied theme →", theme.name, "Mode →", currentMode.value);
  }

  // Apply custom colors as CSS variables
  function applyCustomColors(colors: ThemeColors) {
    const root = document.documentElement;

    // Map theme colors to CSS custom properties
    const cssVariables: Record<string, string> = {
      // Backgrounds
      "--bg-primary": colors.bgPrimary,
      "--bg-secondary": colors.bgSecondary,
      "--bg-tertiary": colors.bgTertiary,
      "--bg-inverse": colors.bgInverse,

      // Text
      "--text-primary": colors.textPrimary,
      "--text-secondary": colors.textSecondary,
      "--text-muted": colors.textMuted,
      "--text-inverse": colors.textInverse,

      // Accents
      "--accent-primary": colors.accentPrimary,
      "--accent-secondary": colors.accentSecondary,
      "--accent-success": colors.accentSuccess,
      "--accent-warning": colors.accentWarning,
      "--accent-error": colors.accentError,
      "--accent-info": colors.accentInfo,

      // Borders
      "--border-primary": colors.borderPrimary,
      "--border-secondary": colors.borderSecondary,
      "--border-focus": colors.borderFocus,

      // Interactive
      "--hover-bg": colors.hoverBg,
      "--hover-text": colors.hoverText,
      "--active-bg": colors.activeBg,

      // Tables
      "--table-header-bg": colors.tableHeaderBg,
      "--table-row-even-bg": colors.tableRowEvenBg,
      "--table-row-odd-bg": colors.tableRowOddBg,
      "--table-row-hover-bg": colors.tableRowHoverBg,

      // Forms
      "--input-bg": colors.inputBg,
      "--input-border": colors.inputBorder,
      "--input-focus-border": colors.inputFocusBorder,
      "--input-text": colors.inputText,
      "--input-placeholder": colors.inputPlaceholder,

      // Modals
      "--modal-bg": colors.modalBg,
      "--modal-overlay": colors.modalOverlay,

      // Shadows
      "--shadow-sm-color": colors.shadowSm,
      "--shadow-md-color": colors.shadowMd,
      "--shadow-lg-color": colors.shadowLg,
    };

    // Set primary color aliases for backward compatibility
    cssVariables["--primary"] = colors.accentPrimary;
    cssVariables["--primary-light"] = colors.accentPrimary + "26"; // 20% opacity
    cssVariables["--primary-dark"] = colors.accentPrimary;

    // Apply all CSS variables
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  // Set current theme by ID
  function setTheme(themeId: string) {
    const theme = allThemes.value.find((t) => t.id === themeId);
    if (theme) {
      currentThemeId.value = themeId;
      // Sync mode with theme type
      currentMode.value = theme.type;
      applyTheme();
    }
  }

  // Set theme by legacy name (for backward compatibility)
  function setThemeByName(name: LegacyThemeName) {
    // Find theme matching legacy name and current mode
    const theme = allThemes.value.find(
      (t) => t.id.startsWith(name + "-") && t.type === currentMode.value,
    );
    if (theme) {
      setTheme(theme.id);
    }
  }

  // Toggle light/dark mode
  function toggleMode() {
    currentMode.value = currentMode.value === "dark" ? "light" : "dark";

    // Try to find a theme with the same base name but different mode
    const currentBaseName = legacyThemeName.value;
    const newTheme = allThemes.value.find(
      (t) =>
        t.id.startsWith(currentBaseName + "-") && t.type === currentMode.value,
    );

    if (newTheme) {
      currentThemeId.value = newTheme.id;
    }

    applyTheme();
  }

  // Set mode directly
  function setMode(mode: ThemeMode) {
    if (mode === "light" || mode === "dark") {
      currentMode.value = mode;

      // Try to find a theme with the same base name but different mode
      const currentBaseName = legacyThemeName.value;
      const newTheme = allThemes.value.find(
        (t) =>
          t.id.startsWith(currentBaseName + "-") &&
          t.type === currentMode.value,
      );

      if (newTheme) {
        currentThemeId.value = newTheme.id;
      }

      applyTheme();
    }
  }

  // Save custom themes to localStorage
  function saveCustomThemes() {
    localStorage.setItem(
      STORAGE_KEYS.CUSTOM_THEMES,
      JSON.stringify(customThemes.value),
    );
  }

  // Create a new custom theme
  function createTheme(
    name: string,
    type: ThemeMode,
    colors: ThemeColors,
    description?: string,
  ): Theme {
    const now = new Date().toISOString();
    const theme: Theme = {
      id: `custom-${Date.now()}`,
      name,
      type,
      isDefault: false,
      isCustom: true,
      colors,
      createdAt: now,
      updatedAt: now,
    };

    if (description) {
      theme.description = description;
    }

    customThemes.value.push(theme);
    saveCustomThemes();

    return theme;
  }

  // Update an existing custom theme
  function updateTheme(
    themeId: string,
    updates: Partial<Omit<Theme, "id" | "isCustom" | "createdAt">>,
  ): boolean {
    const index = customThemes.value.findIndex((t) => t.id === themeId);
    if (index === -1) return false;

    const theme = customThemes.value[index];
    if (!theme) return false;

    const now = new Date().toISOString();

    // Build updated theme explicitly to avoid type issues
    const updatedTheme: Theme = {
      id: theme.id,
      name: updates.name ?? theme.name,
      type: updates.type ?? theme.type,
      isDefault: updates.isDefault ?? theme.isDefault,
      isCustom: theme.isCustom,
      colors: updates.colors ?? theme.colors,
      updatedAt: now,
    };

    // Handle optional createdAt
    if (theme.createdAt !== undefined) {
      updatedTheme.createdAt = theme.createdAt;
    }

    // Handle optional description
    if (updates.description !== undefined) {
      updatedTheme.description = updates.description;
    } else if (theme.description !== undefined) {
      updatedTheme.description = theme.description;
    }

    customThemes.value[index] = updatedTheme;

    saveCustomThemes();

    // Re-apply if this is the current theme
    if (currentThemeId.value === themeId) {
      applyTheme();
    }

    return true;
  }

  // Delete a custom theme
  function deleteTheme(themeId: string): boolean {
    const index = customThemes.value.findIndex((t) => t.id === themeId);
    if (index === -1) return false;

    customThemes.value.splice(index, 1);
    saveCustomThemes();

    // Switch to default theme if deleted theme was active
    if (currentThemeId.value === themeId) {
      currentThemeId.value = "ocean-dark";
      applyTheme();
    }

    return true;
  }

  // Duplicate a theme
  function duplicateTheme(themeId: string): Theme | null {
    const sourceTheme = allThemes.value.find((t) => t.id === themeId);
    if (!sourceTheme) return null;

    const now = new Date().toISOString();
    const newTheme: Theme = {
      id: `custom-${Date.now()}`,
      name: `${sourceTheme.name} (Copy)`,
      type: sourceTheme.type,
      isDefault: false,
      isCustom: true,
      colors: { ...sourceTheme.colors },
      createdAt: now,
      updatedAt: now,
    };

    if (sourceTheme.description) {
      newTheme.description = `Copy of ${sourceTheme.description}`;
    }

    customThemes.value.push(newTheme);
    saveCustomThemes();

    return newTheme;
  }

  // Export theme as JSON
  function exportTheme(themeId: string): string | null {
    const theme = allThemes.value.find((t) => t.id === themeId);
    if (!theme) return null;

    return JSON.stringify(theme, null, 2);
  }

  // Import theme from JSON
  function importTheme(jsonString: string): Theme | null {
    try {
      const parsed = JSON.parse(jsonString);

      if (!isValidTheme(parsed)) {
        return null;
      }

      const now = new Date().toISOString();
      const newTheme: Theme = {
        ...parsed,
        id: `custom-${Date.now()}`,
        isCustom: true,
        isDefault: false,
        createdAt: now,
        updatedAt: now,
      };

      customThemes.value.push(newTheme);
      saveCustomThemes();

      return newTheme;
    } catch (error) {
      console.error("Failed to import theme:", error);
      return null;
    }
  }

  // Watch for changes and apply theme
  watchEffect(() => {
    if (isInitialized.value) {
      applyTheme();
    }
  });

  return {
    // State
    currentThemeId,
    currentMode,
    customThemes,
    isInitialized,

    // Computed
    currentTheme,
    allThemes,
    lightThemes,
    darkThemes,
    userCustomThemes,
    legacyThemeName,

    // Methods
    initialize,
    setTheme,
    setThemeByName,
    toggleMode,
    setMode,
    createTheme,
    updateTheme,
    deleteTheme,
    duplicateTheme,
    exportTheme,
    importTheme,
  };
});
