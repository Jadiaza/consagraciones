import { AlignJustify, AlignLeft, Check, Minus, Plus, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type ReadingTheme = "dark" | "light" | "sepia";
export type ReadingFont = "literata" | "georgia" | "garamond" | "atkinson" | "modern";
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

const fontOptions: Array<{
  value: ReadingFont;
  label: string;
  description: string;
  recommended?: boolean;
}> = [
  {
    value: "literata",
    label: "Literata",
    description: "Diseñada para lectura prolongada en pantalla",
    recommended: true,
  },
  {
    value: "georgia",
    label: "Georgia",
    description: "Clásica y clara incluso en tamaños pequeños",
  },
  { value: "garamond", label: "Garamond", description: "Elegancia editorial para textos extensos" },
  {
    value: "atkinson",
    label: "Atkinson",
    description: "Formas diferenciadas para máxima accesibilidad",
  },
  { value: "modern", label: "Moderna", description: "Trazos limpios y presentación contemporánea" },
];

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
  const toolbarRef = useRef<HTMLElement>(null);
  const update = <K extends keyof ReadingPreferences>(key: K, value: ReadingPreferences[K]) =>
    onChange({ ...preferences, [key]: value });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (toolbarRef.current?.contains(target)) return;
      if ((target as Element).closest?.("[data-reading-tools-trigger]")) return;
      onClose();
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [onClose]);

  return (
    <div
      className={cn(
        "reading-toolbar-modal",
        `reading-theme-${preferences.theme}`,
        `reading-font-${preferences.font}`,
      )}
      role="presentation"
    >
      <aside
        ref={toolbarRef}
        className="reading-toolbar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reading-preferences-title"
      >
        <div className="reading-toolbar__topbar">
          <div>
            <strong id="reading-preferences-title">Formato de la aplicación</strong>
            <p>Personaliza el tema y la lectura</p>
          </div>
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
            <div className="reading-toolbar__font-list">
              {fontOptions.map((font) => (
                <button
                  key={font.value}
                  type="button"
                  className={cn(
                    "reading-toolbar__font-option",
                    `reading-font-${font.value}`,
                    preferences.font === font.value && "is-active",
                  )}
                  aria-pressed={preferences.font === font.value}
                  onClick={() => update("font", font.value)}
                >
                  <span className="reading-toolbar__font-sample" aria-hidden>
                    Aa
                  </span>
                  <span className="reading-toolbar__font-copy">
                    <strong>{font.label}</strong>
                    <small>{font.description}</small>
                  </span>
                  {font.recommended && (
                    <span className="reading-toolbar__recommended">Recomendada</span>
                  )}
                  {preferences.font === font.value && (
                    <Check className="reading-toolbar__font-check" aria-hidden />
                  )}
                </button>
              ))}
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
    </div>
  );
}
