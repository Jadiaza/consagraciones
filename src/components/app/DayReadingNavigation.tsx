import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type DayReadingSection = {
  id: string;
  label: string;
};

export function DayReadingNavigation({ sections }: { sections: DayReadingSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

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

  return (
    <nav className="day-reading-nav" aria-label="Secciones del día">
      {sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          className={cn(active === section.id && "is-active")}
          aria-current={active === section.id ? "location" : undefined}
          onClick={() => {
            setActive(section.id);
            document
              .getElementById(section.id)
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <span>{index + 1}</span>
          {section.label}
        </button>
      ))}
    </nav>
  );
}
