import type { ReadingPreferences } from "@/components/app/ReadingToolbar";
import { applyAppTheme, READING_PREFERENCES_KEY } from "@/lib/app-theme";

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  size: 17,
  theme: "dark",
  font: "serif",
  align: "left",
  spacing: "comfortable",
};

export function loadReadingPreferences(): ReadingPreferences {
  if (typeof window === "undefined") return DEFAULT_READING_PREFERENCES;

  try {
    const saved = window.localStorage.getItem(READING_PREFERENCES_KEY);
    if (!saved) return DEFAULT_READING_PREFERENCES;
    return { ...DEFAULT_READING_PREFERENCES, ...JSON.parse(saved) } as ReadingPreferences;
  } catch {
    return DEFAULT_READING_PREFERENCES;
  }
}

export function persistReadingPreferences(preferences: ReadingPreferences) {
  applyAppTheme(preferences.theme);
  try {
    window.localStorage.setItem(READING_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // Preferences remain active for the current session when storage is unavailable.
  }
}
