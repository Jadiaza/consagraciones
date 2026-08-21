import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronRight, CircleDot, Hand, Headphones, Play, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { RosaryCounter } from "@/components/app/RosaryCounter";
import { LoadingState, PrayerCard } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { prayersQuery } from "@/lib/consecration";

type Modo = null | "interactiva" | "manual" | "audio";

const SAN_MIGUEL_ROUND_PRAYER =
  "San Miguel Arcángel, defiéndenos en la pelea. Sé nuestro amparo y refugio contra las asechanzas del demonio. ¡Reprímele, oh Dios, con voz imperiosa, como rendidamente te lo suplicamos! Y tú, Príncipe de las Milicias Celestiales, armado del poder divino, precipita al infierno a Satanás y a todos los espíritus malignos que, para la perdición de las almas, vagan por el mundo. Amén.";

export const Route = createFileRoute("/_authenticated/coronilla")({ component: Coronilla });

function Coronilla() {
  const { user } = useAuth();
  const navigate = Route.useNavigate();
  const { data: prayers, isLoading } = useQuery(prayersQuery());
  const { data: savedProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["coronilla-progress", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_prayer_progress")
        .select("current_group,current_bead")
        .eq("user_id", user!.id)
        .eq("prayer_slug", "coronilla-san-miguel")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const [modo, setModo] = useState<Modo>(null);
  const [guidedStep, setGuidedStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (isLoading || isLoadingProgress || !prayers)
    return (
      <AppShell title="Coronilla">
        <LoadingState />
      </AppShell>
    );

  const bySlug = (slug: string) => prayers.find((p) => p.slug === slug);
  const opening = prayers.filter(
    (p) => p.kind === "opening" && p.slug !== "oracion-inicial-san-miguel",
  );
  const closing = prayers.filter((p) => p.kind === "closing");
  const guidedClosing = closing.flatMap((prayer) => {
    if (prayer.slug === "invocacion-final-triple") {
      return Array.from({ length: 3 }, (_, index) => ({
        ...prayer,
        id: `${prayer.id}-${index + 1}`,
        title: `Invocación final · ${index + 1} de 3`,
      }));
    }
    return [prayer];
  });
  const roundPrayer = bySlug("oracion-inicio-ronda");
  const roundPrayerBody = roundPrayer?.body?.trim() || SAN_MIGUEL_ROUND_PRAYER;
  const bead = bySlug("invocacion-cuenta");
  const gloria = bySlug("gloria-grupo");
  const guidedTotal = opening.length + 1 + guidedClosing.length;

  const chooseMode = (next: Exclude<Modo, null>) => {
    setGuidedStep(0);
    setCompleted(false);
    setModo(next);
  };

  const saveProgress = async (group: number, beadIndex: number) => {
    if (!user) return;
    const { error } = await supabase.from("user_prayer_progress").upsert(
      {
        user_id: user.id,
        prayer_slug: "coronilla-san-miguel",
        current_group: group,
        current_bead: beadIndex,
        last_prayed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,prayer_slug" },
    );
    if (error) throw error;
  };

  const saveAndExit = async (group: number, beadIndex: number) => {
    try {
      await saveProgress(group, beadIndex);
      toast.success("Guardamos tu última cuenta.");
      await navigate({ to: "/dashboard" });
    } catch {
      toast.error("No pudimos guardar tu cuenta. Intenta de nuevo.");
    }
  };

  if (modo === null) {
    return (
      <AppShell title="Coronilla · Selección">
        <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-accent/15 px-5 py-8 text-center shadow-[var(--shadow-halo)]">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-primary/25 bg-background/70 text-primary">
            <CircleDot className="size-7" aria-hidden />
          </span>
          <p className="mt-4 text-xs uppercase tracking-[0.24em] text-primary">
            Momento de oración
          </p>
          <h1 className="mt-2 font-display text-3xl">Coronilla de San Miguel Arcángel</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Elige cómo deseas rezar. En el modo interactivo avanzas una sola vez por cada cuenta.
          </p>
        </section>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ModeCard
            icon={<Sparkles className="size-5" />}
            title="Modo interactivo"
            hint="Reza paso a paso con ayudas visuales"
            badge={savedProgress?.current_bead ? "Continuar" : "Recomendado"}
            featured
            onClick={() => chooseMode("interactiva")}
          />
          <ModeCard
            icon={<Hand className="size-5" />}
            title="Modo manual"
            hint="Reza a tu ritmo con el texto completo"
            onClick={() => chooseMode("manual")}
          />
          <ModeCard
            icon={<Headphones className="size-5" />}
            title="Modo audio"
            hint="Escucha y reza con la guía de audio"
            onClick={() => chooseMode("audio")}
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
              <p className="font-display text-sm text-primary">Cinco rondas de diez cuentas</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Al comenzar cada ronda
              </p>
              <p className="mt-2 whitespace-pre-line font-display text-lg leading-relaxed">
                {roundPrayerBody}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                En cada una de las diez cuentas
              </p>
              <p className="mt-2 font-display text-xl">{bead.body}</p>
              <p className="font-display text-xl text-primary">{bead.response}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Al completar las diez cuentas se reza el Gloria al Padre. Esta secuencia se repite
                durante las cinco rondas.
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

  if (completed) {
    return (
      <AppShell title="Coronilla · Finalizada">
        <div className="surface-sacred mx-auto max-w-lg rounded-3xl p-6 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-8" aria-hidden />
          </span>
          <h1 className="mt-5 font-display text-2xl">Coronilla completada</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Has concluido este momento de oración. Que san Miguel Arcángel te acompañe y te ayude a
            permanecer fiel a Jesucristo.
          </p>
          <Button
            className="mt-6 w-full"
            onClick={() => {
              setGuidedStep(0);
              setCompleted(false);
            }}
          >
            Rezar nuevamente
          </Button>
          <Button className="mt-3 w-full" variant="outline" onClick={() => setModo(null)}>
            Volver a modalidades
          </Button>
        </div>
      </AppShell>
    );
  }

  const currentPrayer =
    guidedStep < opening.length
      ? opening[guidedStep]
      : guidedStep > opening.length
        ? guidedClosing[guidedStep - opening.length - 1]
        : null;
  const isCounterStep = guidedStep === opening.length;
  const isLastStep = guidedStep === guidedTotal - 1;

  return (
    <AppShell title="Coronilla · Interactiva">
      <div className="mx-auto max-w-lg">
        <div className="surface-sacred rounded-2xl p-4">
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CircleDot className="size-4 text-primary" aria-hidden />
              Oración guiada
            </span>
            <span>
              Paso {guidedStep + 1} de {guidedTotal}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${((guidedStep + 1) / guidedTotal) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-4 min-h-[28rem]">
          {isCounterStep ? (
            <div className="surface-sacred rounded-3xl p-5">
              <RosaryCounter
                groupPrayer={roundPrayerBody}
                invocation={bead?.body ?? "¿Quién como Dios?"}
                response={bead?.response ?? "¡Nadie como Dios!"}
                gloria={gloria?.body ?? ""}
                initialGroup={savedProgress?.current_group ?? 1}
                initialBead={savedProgress?.current_bead ?? 0}
                onSaveAndExit={saveAndExit}
                onFinished={() => {
                  toast.success(
                    "Has completado las cinco rondas. Continúa con las oraciones finales.",
                  );
                  setGuidedStep((step) => Math.min(step + 1, guidedTotal - 1));
                }}
              />
            </div>
          ) : currentPrayer ? (
            <div className="surface-sacred rounded-3xl p-5 sm:p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">
                {guidedStep < opening.length ? "Oraciones iniciales" : "Oraciones finales"}
              </p>
              <PrayerCard
                title={currentPrayer.title}
                body={currentPrayer.body}
                response={currentPrayer.response}
              />
            </div>
          ) : null}
        </div>

        <div className="mt-5">
          {!isCounterStep && (
            <Button
              className="h-14 w-full rounded-full"
              onClick={() => {
                if (isLastStep) setCompleted(true);
                else setGuidedStep((step) => Math.min(step + 1, guidedTotal - 1));
              }}
            >
              {isLastStep ? "Finalizar" : "Siguiente"}
              <ChevronRight className="size-5" aria-hidden />
            </Button>
          )}
        </div>
        {!isCounterStep && (
          <Button
            className="mt-3 w-full"
            variant="ghost"
            onClick={() => void navigate({ to: "/dashboard" })}
          >
            Salir de la coronilla
          </Button>
        )}
      </div>
    </AppShell>
  );
}

function ModeCard({
  icon,
  title,
  hint,
  badge,
  featured = false,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  badge?: string;
  featured?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex min-h-28 items-center gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        featured
          ? "border-primary/45 bg-gradient-to-br from-primary/15 to-card sm:col-span-2"
          : "border-border bg-card/80"
      }`}
    >
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105"
        aria-hidden
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        {badge && (
          <span className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary">
            {badge}
          </span>
        )}
        <span className="block font-display text-base">{title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{hint}</span>
      </span>
      <Play className="size-4 shrink-0 text-primary/70" aria-hidden />
    </button>
  );
}
