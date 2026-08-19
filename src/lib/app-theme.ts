export type AppTheme = "dark" | "light" | "sepia";

export const READING_PREFERENCES_KEY = "lvj-consagraciones-reading-preferences";

export function applyAppTheme(theme: AppTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.appTheme = theme;
}

export function loadStoredAppTheme(): AppTheme {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = window.localStorage.getItem(READING_PREFERENCES_KEY);
    const theme = saved ? (JSON.parse(saved) as { theme?: string }).theme : undefined;
    return theme === "light" || theme === "sepia" || theme === "dark" ? theme : "dark";
  } catch {
    return "dark";
  }
}
