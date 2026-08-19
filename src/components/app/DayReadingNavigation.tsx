import { ChevronDown, List } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type DayReadingSection = {
  id: string;
  label: string;
};

export function DayReadingNavigation({
  sections,
  active,
  onSelect,
}: {
  sections: DayReadingSection[];
  active: string;
  onSelect: (id: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(true);

  const goTo = (id: string) => {
    setMobileOpen(false);
    onSelect(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buttons = (mobile = false) =>
    sections.map((section, index) => (
      <button
        key={section.id}
        id={mobile ? undefined : `tab-${section.id}`}
        type="button"
        role="tab"
        aria-controls={`panel-${section.id}`}
        aria-selected={active === section.id}
        className={cn(active === section.id && "is-active")}
        aria-current={active === section.id ? "location" : undefined}
        onClick={() => goTo(section.id)}
      >
        <span>{index + 1}</span>
        <span className="day-reading-nav__label">{section.label}</span>
        {mobile && <span className="day-reading-nav__hint">Ir a esta sección</span>}
      </button>
    ));

  return (
    <>
      <nav
        className="day-reading-nav day-reading-nav--desktop"
        role="tablist"
        aria-label="Secciones del día"
      >
        {buttons()}
      </nav>
      <nav className="day-reading-nav-mobile" aria-label="Secciones del día">
        <button
          type="button"
          className="day-reading-nav-mobile__trigger"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          <List aria-hidden />
          <span>
            <small>Sección actual</small>
            <strong>{sections.find((section) => section.id === active)?.label}</strong>
          </span>
          <ChevronDown
            className={cn("transition-transform", mobileOpen && "rotate-180")}
            aria-hidden
          />
        </button>
        {mobileOpen && <div className="day-reading-nav-mobile__list">{buttons(true)}</div>}
      </nav>
    </>
  );
}
