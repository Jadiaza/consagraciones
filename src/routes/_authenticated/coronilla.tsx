import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Hand, Headphones, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { RosaryCounter } from "@/components/app/RosaryCounter";
import { LoadingState, PrayerCard } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { myConsecrationQuery, prayersQuery } from "@/lib/consecration";

type Modo = null | "interactiva" | "manual" | "audio";

export const Route = createFileRoute("/_authenticated/coronilla")({ component: Coronilla });

function Coronilla() {
  const { user } = useAuth();
  const { data: prayers, isLoading } = useQuery(prayersQuery());
  const [modo, setModo] = useState<Modo>(null);

  if (isLoading || !prayers)
    return (
      <AppShell title="Coronilla">
        <LoadingState />
      </AppShell>
    );

  const bySlug = (slug: string) => prayers.find((p) => p.slug === slug);
  const opening = prayers.filter((p) => p.kind === "opening");
  const closing = prayers.filter((p) => p.kind === "closing");
  const bead = bySlug("invocacion-cuenta");
  const gloria = bySlug("gloria-grupo");

  const saveProgress = async (group: number, beadIndex: number) => {
    if (!user) return;
    await supabase.from("user_prayer_progress").upsert(
      {
        user_id: user.id,
        prayer_slug: "coronilla-san-miguel",
        current_group: group,
        current_bead: beadIndex,
        last_prayed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,prayer_slug" },
    );
  };

  if (modo === null) {
    return (
      <AppShell title="Coronilla · Selección">
        <h1 className="text-center font-display text-2xl">Coronilla de San Miguel Arcángel</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Elige la forma en que deseas rezarla.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <ModeCard
            icon={<Sparkles className="size-5" />}
            title="Modo interactivo"
            hint="Reza paso a paso con ayudas visuales"
            onClick={() => setModo("interactiva")}
          />
          <ModeCard
            icon={<Hand className="size-5" />}
            title="Modo manual"
            hint="Reza a tu ritmo con el texto completo"
            onClick={() => setModo("manual")}
          />
          <ModeCard
            icon={<Headphones className="size-5" />}
            title="Modo audio"
            hint="Escucha y reza con la guía de audio"
            onClick={() => setModo("audio")}
          />
        </div>
      </AppShell>
    );
  }

  if (modo === "audio") {
    return (
      <AppShell title="Coronilla · Audio">
        <p className="surface-sacred rounded-2xl p-5 text-center text-sm text-muted-foreground">
          La guía en audio se publicará desde el repositorio multimedia. Mientras tanto puedes rezar
          en modo interactivo o manual.
        </p>
        <Button className="mt-4 w-full" variant="outline" onClick={() => setModo(null)}>
          Volver
        </Button>
      </AppShell>
    );
  }

  if (modo === "manual") {
    return (
      <AppShell title="Coronilla · Manual">
        <div className="flex flex-col gap-3">
          {opening.map((p) => (
            <PrayerCard key={p.id} title={p.title} body={p.body} response={p.response} />
          ))}
          {bead && (
            <div className="surface-sacred rounded-2xl p-4">
              <p className="font-display text-sm text-primary">Cinco grupos de diez cuentas</p>
              <p className="mt-2 font-display text-xl">{bead.body}</p>
              <p className="font-display text-xl text-primary">{bead.response}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Al completar las diez cuentas se reza el Gloria. Se repite cinco veces.
              </p>
            </div>
          )}
          {gloria && <PrayerCard title={gloria.title} body={gloria.body} />}
          {closing.map((p) => (
            <PrayerCard key={p.id} title={p.title} body={p.body} response={p.response} />
          ))}
        </div>
        <Button className="mt-6 w-full" variant="outline" onClick={() => setModo(null)}>
          Volver
        </Button>
      </AppShell>
    );
  }

  return (
    <AppShell title="Coronilla · Interactiva">
      <div className="flex flex-col gap-3">
        {opening.map((p) => (
          <PrayerCard key={p.id} title={p.title} body={p.body} response={p.response} />
        ))}
      </div>
      <div className="mt-8">
        <RosaryCounter
          invocation={bead?.body ?? "¿Quién como Dios?"}
          response={bead?.response ?? "¡Nadie como Dios!"}
          gloria={gloria?.body ?? ""}
          onProgress={(group, index) => void saveProgress(group, index)}
          onFinished={() =>
            toast.success("Has completado los cinco grupos. Continúa con las oraciones finales.")
          }
        />
      </div>
      <div className="mt-10 flex flex-col gap-3">
        {closing.map((p) => (
          <PrayerCard key={p.id} title={p.title} body={p.body} response={p.response} />
        ))}
      </div>
      <Button className="mt-6 w-full" variant="outline" onClick={() => setModo(null)}>
        Volver
      </Button>
    </AppShell>
  );
}

function ModeCard({
  icon,
  title,
  hint,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="surface-sacred flex items-center gap-3 rounded-2xl p-4 text-left"
    >
      <span className="text-primary" aria-hidden>
        {icon}
      </span>
      <span>
        <span className="block font-display text-sm">{title}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </button>
  );
}
