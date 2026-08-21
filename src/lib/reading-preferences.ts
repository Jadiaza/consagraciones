import type { ReadingPreferences } from "@/components/app/ReadingToolbar";
import { applyAppTheme, READING_PREFERENCES_KEY } from "@/lib/app-theme";

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  size: 17,
  theme: "dark",
  font: "literata",
  align: "left",
  spacing: "comfortable",
};

export function loadReadingPreferences(): ReadingPreferences {
  if (typeof window === "undefined") return DEFAULT_READING_PREFERENCES;

  try {
    const saved = window.localStorage.getItem(READING_PREFERENCES_KEY);
    if (!saved) return DEFAULT_READING_PREFERENCES;
    const parsed = JSON.parse(saved) as Partial<ReadingPreferences> & { font?: string };
    const migratedFont =
      parsed.font === "serif" ? "literata" : parsed.font === "sans" ? "modern" : parsed.font;
    return {
      ...DEFAULT_READING_PREFERENCES,
      ...parsed,
      font: migratedFont ?? DEFAULT_READING_PREFERENCES.font,
    } as ReadingPreferences;
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
