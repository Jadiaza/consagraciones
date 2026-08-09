import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  ResourceCard,
  SectionTitle,
} from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { RESOURCE_CATEGORIES, myConsecrationQuery, resourcesQuery } from "@/lib/consecration";

export const Route = createFileRoute("/recursos")({
  head: () => ({
    meta: [
      { title: "Recursos y oraciones · Consagración 33 días" },
      {
        name: "description",
        content:
          "Oraciones, Biblia, catequesis, combate espiritual y vida sacramental para acompañar la consagración.",
      },
      { property: "og:title", content: "Recursos y oraciones · Consagración 33 días" },
      {
        property: "og:description",
        content: "Oraciones y formación católica para el camino de 33 días.",
      },
    ],
  }),
  component: Recursos,
});

function Recursos() {
  const { data, isLoading, error } = useQuery(resourcesQuery());
  const [open, setOpen] = useState<string | null>(null);

  return (
    <AppShell title="Recursos">
      {isLoading && <LoadingState />}
      {error && <ErrorState message={(error as Error).message} />}
      {data && data.length === 0 && <EmptyState title="Aún no hay recursos publicados" />}
      {data &&
        RESOURCE_CATEGORIES.map((category) => {
          const items = data.filter((item) => item.category === category.key);
          if (items.length === 0) return null;
          return (
            <section key={category.key}>
              <SectionTitle>{category.label}</SectionTitle>
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <div key={item.id}>
                    <ResourceCard
                      title={item.title}
                      summary={item.summary}
                      onClick={() => setOpen(open === item.id ? null : item.id)}
                    />
                    {open === item.id && item.body && (
                      <p className="mt-2 whitespace-pre-line rounded-2xl bg-secondary/40 p-4 text-[15px] leading-relaxed">
                        {item.body}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      <div className="mt-10 text-center">
        <Button asChild variant="outline">
          <a href="/">Volver al inicio</a>
        </Button>
      </div>
    </AppShell>
  );
}
