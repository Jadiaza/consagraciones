import { ChevronDown, List } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type DayReadingSection = {
  id: string;
  label: string;
};

export function DayReadingNavigation({ sections }: { sections: DayReadingSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(true);

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  const goTo = (id: string) => {
    setActive(id);
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const buttons = (mobile = false) =>
    sections.map((section, index) => (
      <button
        key={section.id}
        type="button"
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
      <nav className="day-reading-nav day-reading-nav--desktop" aria-label="Secciones del día">
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
