import {
  AlignJustify,
  AlignLeft,
  ALargeSmall,
  CaseSensitive,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import { useState } from "react";

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
  onClose,
  onReset,
}: {
  preferences: ReadingPreferences;
  onChange: (next: ReadingPreferences) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<"theme" | "font" | "format" | "more">("theme");
  const update = <K extends keyof ReadingPreferences>(key: K, value: ReadingPreferences[K]) =>
    onChange({ ...preferences, [key]: value });

  return (
    <aside className="reading-toolbar" aria-label="Preferencias de lectura">
      <div className="reading-toolbar__topbar">
        <strong>Preferencias de lectura</strong>
        <button type="button" aria-label="Cerrar preferencias" onClick={onClose}>
          <X aria-hidden />
        </button>
      </div>
      <div className="reading-toolbar__tabs" role="tablist" aria-label="Opciones de lectura">
        {(
          [
            ["theme", "Temas"],
            ["font", "Fuente"],
            ["format", "Formato"],
            ["more", "Más"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            className={cn(tab === value && "is-active")}
            onClick={() => setTab(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="reading-toolbar__panel" role="tabpanel">
        {tab === "theme" && (
          <div className="reading-toolbar__choices reading-toolbar__themes">
            {(Object.keys(themeLabels) as ReadingTheme[]).map((theme) => (
              <button
                key={theme}
                type="button"
                className={cn(preferences.theme === theme && "is-active")}
                aria-pressed={preferences.theme === theme}
                onClick={() => update("theme", theme)}
              >
                <span
                  className={`reading-theme-swatch reading-theme-swatch--${theme}`}
                  aria-hidden
                />
                {themeLabels[theme]}
              </button>
            ))}
          </div>
        )}
        {tab === "font" && (
          <div className="reading-toolbar__choices">
            <button
              type="button"
              className={cn(preferences.font === "serif" && "is-active")}
              aria-pressed={preferences.font === "serif"}
              onClick={() => update("font", "serif")}
            >
              <CaseSensitive aria-hidden /> Clásica
            </button>
            <button
              type="button"
              className={cn(preferences.font === "sans" && "is-active")}
              aria-pressed={preferences.font === "sans"}
              onClick={() => update("font", "sans")}
            >
              <ALargeSmall aria-hidden /> Moderna
            </button>
          </div>
        )}
        {tab === "format" && (
          <div className="reading-toolbar__settings">
            <div className="reading-toolbar__row">
              <span>Tamaño</span>
              <div className="reading-toolbar__stepper">
                <button
                  type="button"
                  aria-label="Reducir tamaño"
                  disabled={preferences.size <= 15}
                  onClick={() => update("size", Math.max(15, preferences.size - 1))}
                >
                  <Minus />
                </button>
                <strong>{preferences.size}</strong>
                <button
                  type="button"
                  aria-label="Aumentar tamaño"
                  disabled={preferences.size >= 24}
                  onClick={() => update("size", Math.min(24, preferences.size + 1))}
                >
                  <Plus />
                </button>
              </div>
            </div>
            <div className="reading-toolbar__row">
              <span>Alineación</span>
              <div className="reading-toolbar__choices">
                <button
                  type="button"
                  className={cn(preferences.align === "left" && "is-active")}
                  onClick={() => update("align", "left")}
                >
                  <AlignLeft /> Izquierda
                </button>
                <button
                  type="button"
                  className={cn(preferences.align === "justify" && "is-active")}
                  onClick={() => update("align", "justify")}
                >
                  <AlignJustify /> Justificada
                </button>
              </div>
            </div>
          </div>
        )}
        {tab === "more" && (
          <div className="reading-toolbar__settings">
            <div className="reading-toolbar__row">
              <span>Interlineado</span>
              <div className="reading-toolbar__choices">
                {(Object.keys(spacingLabels) as ReadingSpacing[]).map((spacing) => (
                  <button
                    key={spacing}
                    type="button"
                    className={cn(preferences.spacing === spacing && "is-active")}
                    onClick={() => update("spacing", spacing)}
                  >
                    {spacingLabels[spacing]}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" className="reading-toolbar__reset" onClick={onReset}>
              <RotateCcw aria-hidden /> Restablecer preferencias
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
