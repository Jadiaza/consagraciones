import {
  AlignJustify,
  AlignLeft,
  ALargeSmall,
  BookOpenText,
  CaseSensitive,
  Minus,
  Plus,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type ReadingTheme = "dark" | "light" | "sepia";
export type ReadingFont = "serif" | "sans";
export type ReadingAlign = "left" | "justify";
export type ReadingSpacing = "compact" | "comfortable" | "spacious";

export type ReadingPreferences = {
  size: number;
  theme: ReadingTheme;
  font: ReadingFont;
  align: ReadingAlign;
  spacing: ReadingSpacing;
};

const themeLabels: Record<ReadingTheme, string> = {
  dark: "Oscuro",
  light: "Claro",
  sepia: "Sepia",
};

const spacingLabels: Record<ReadingSpacing, string> = {
  compact: "Compacto",
  comfortable: "Cómodo",
  spacious: "Amplio",
};

export function ReadingToolbar({
  preferences,
  onChange,
}: {
  preferences: ReadingPreferences;
  onChange: (next: ReadingPreferences) => void;
}) {
  const update = <K extends keyof ReadingPreferences>(key: K, value: ReadingPreferences[K]) =>
    onChange({ ...preferences, [key]: value });

  return (
    <aside className="reading-toolbar" aria-label="Preferencias de lectura">
      <div className="reading-toolbar__title">
        <BookOpenText className="size-4" aria-hidden />
        <span>Lectura</span>
      </div>

      <div className="reading-toolbar__group" aria-label="Tamaño de letra">
        <button
          type="button"
          aria-label="Reducir tamaño de letra"
          disabled={preferences.size <= 15}
          onClick={() => update("size", Math.max(15, preferences.size - 1))}
        >
          <Minus aria-hidden />
        </button>
        <span className="reading-toolbar__value">{preferences.size}</span>
        <button
          type="button"
          aria-label="Aumentar tamaño de letra"
          disabled={preferences.size >= 24}
          onClick={() => update("size", Math.min(24, preferences.size + 1))}
        >
          <Plus aria-hidden />
        </button>
      </div>

      <div className="reading-toolbar__group" aria-label="Tema de lectura">
        {(Object.keys(themeLabels) as ReadingTheme[]).map((theme) => (
          <button
            type="button"
            key={theme}
            className={cn(preferences.theme === theme && "is-active")}
            aria-pressed={preferences.theme === theme}
            onClick={() => update("theme", theme)}
          >
            {themeLabels[theme]}
          </button>
        ))}
      </div>

      <div className="reading-toolbar__group" aria-label="Tipo de fuente">
        <button
          type="button"
          className={cn(preferences.font === "serif" && "is-active")}
          aria-label="Fuente clásica"
          aria-pressed={preferences.font === "serif"}
          onClick={() => update("font", "serif")}
        >
          <CaseSensitive aria-hidden /> Clásica
        </button>
        <button
          type="button"
          className={cn(preferences.font === "sans" && "is-active")}
          aria-label="Fuente moderna"
          aria-pressed={preferences.font === "sans"}
          onClick={() => update("font", "sans")}
        >
          <ALargeSmall aria-hidden /> Moderna
        </button>
      </div>

      <div className="reading-toolbar__group" aria-label="Alineación del texto">
        <button
          type="button"
          className={cn(preferences.align === "left" && "is-active")}
          aria-label="Alinear a la izquierda"
          aria-pressed={preferences.align === "left"}
          onClick={() => update("align", "left")}
        >
          <AlignLeft aria-hidden />
        </button>
        <button
          type="button"
          className={cn(preferences.align === "justify" && "is-active")}
          aria-label="Justificar texto"
          aria-pressed={preferences.align === "justify"}
          onClick={() => update("align", "justify")}
        >
          <AlignJustify aria-hidden />
        </button>
      </div>

      <label className="reading-toolbar__select">
        <span>Interlineado</span>
        <select
          value={preferences.spacing}
          onChange={(event) => update("spacing", event.target.value as ReadingSpacing)}
        >
          {(Object.keys(spacingLabels) as ReadingSpacing[]).map((spacing) => (
            <option key={spacing} value={spacing}>
              {spacingLabels[spacing]}
            </option>
          ))}
        </select>
      </label>
    </aside>
  );
}
