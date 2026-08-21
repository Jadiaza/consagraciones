import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Hand,
  Headphones,
  Sparkles,
} from "lucide-react";
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
const FINAL_INVOCATION =
  "San Miguel Arcángel, con tu luz ilumínanos, con tus alas protégenos y con tu espada desafiante.";
const MISERABLES_PEREGRINOS =
  "Somos miserables peregrinos en la tierra, pero somos tus devotos, oh, glorioso San Miguel Arcángel, ruega por nosotros.";
const FINAL_RESPONSE =
  "Para que seamos dignos de alcanzar las divinas gracias de Nuestro Señor Jesucristo. Amén.";
const FINAL_PRAYER =
  "Oh Señor, que la poderosa intercesión del Arcángel San Miguel nos proteja siempre de todo mal y peligro y nos conduzca a la vida eterna. Por Jesucristo nuestro Señor. Amén.";

export const Route = createFileRoute("/_authenticated/coronilla")({ component: Coronilla });

function Coronilla() {
  const { user } = useAuth();
  const { data: prayers, isLoading } = useQuery(prayersQuery());
  const [modo, setModo] = useState<Modo>(null);
  const [guidedStep, setGuidedStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (isLoading || !prayers)
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
        body: FINAL_INVOCATION,
        response: null,
      }));
    }
    if (prayer.slug === "peregrinos") {
      return [{ ...prayer, body: MISERABLES_PEREGRINOS, response: FINAL_RESPONSE }];
    }
    if (prayer.slug === "oracion-final") return [{ ...prayer, body: FINAL_PRAYER }];
    return [prayer];
  });
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
                {SAN_MIGUEL_ROUND_PRAYER}
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
            <PrayerCard
              key={p.id}
              title={p.title}
              body={
                p.slug === "invocacion-final-triple"
                  ? FINAL_INVOCATION
                  : p.slug === "peregrinos"
                    ? MISERABLES_PEREGRINOS
                    : p.slug === "oracion-final"
                      ? FINAL_PRAYER
                      : p.body
              }
              response={p.slug === "peregrinos" ? FINAL_RESPONSE : p.response}
            />
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
                groupPrayer={SAN_MIGUEL_ROUND_PRAYER}
                invocation={bead?.body ?? "¿Quién como Dios?"}
                response={bead?.response ?? "¡Nadie como Dios!"}
                gloria={gloria?.body ?? ""}
                onProgress={(group, index) => void saveProgress(group, index)}
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

        <div className="mt-5 grid grid-cols-[4rem_1fr_4rem] items-center gap-3">
          <button
            type="button"
            aria-label="Oración anterior"
            disabled={guidedStep === 0 || isCounterStep}
            className="flex size-16 items-center justify-center rounded-full border border-primary/60 text-primary disabled:opacity-30"
            onClick={() => setGuidedStep((step) => Math.max(0, step - 1))}
          >
            <ChevronLeft className="size-7" aria-hidden />
          </button>
          {!isCounterStep && (
            <Button
              className="h-14 rounded-full"
              onClick={() => {
                if (isLastStep) setCompleted(true);
                else setGuidedStep((step) => Math.min(step + 1, guidedTotal - 1));
              }}
            >
              {isLastStep ? "Finalizar" : "Siguiente"}
              <ChevronRight className="size-5" aria-hidden />
            </Button>
          )}
          {isCounterStep && <span />}
          <button
            type="button"
            aria-label="Siguiente oración"
            disabled={isCounterStep || isLastStep}
            className="flex size-16 items-center justify-center rounded-full border border-primary/60 text-primary disabled:opacity-30"
            onClick={() => setGuidedStep((step) => Math.min(step + 1, guidedTotal - 1))}
          >
            <ChevronRight className="size-7" aria-hidden />
          </button>
        </div>

        <Button className="mt-5 w-full" variant="outline" onClick={() => setModo(null)}>
          Volver a modalidades
        </Button>
      </div>
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