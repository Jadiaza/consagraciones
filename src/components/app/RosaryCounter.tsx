import { CheckCircle2, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BEADS = 10;
const GROUPS = 5;

function vibrate() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(8);
}

export function PrayerBead({ active, done }: { active: boolean; done: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block size-3.5 rounded-full border transition-all",
        done ? "border-primary bg-primary" : "border-border bg-secondary",
        active && "scale-150 border-primary bg-primary/70 shadow-[var(--shadow-halo)]",
      )}
    />
  );
}

export function RosaryCounter({
  groupPrayer,
  invocation,
  response,
  gloria,
  initialGroup = 1,
  initialBead = 0,
  onProgress,
  onSaveAndExit,
  onFinished,
}: {
  groupPrayer: string;
  invocation: string;
  response: string;
  gloria: string;
  initialGroup?: number;
  initialBead?: number;
  onProgress?: (group: number, bead: number) => void;
  onSaveAndExit?: (group: number, bead: number) => void | Promise<void>;
  onFinished?: () => void;
}) {
  const [group, setGroup] = useState(initialGroup);
  const [bead, setBead] = useState(initialBead);
  const [phase, setPhase] = useState<"group-prayer" | "beads" | "gloria">(() => {
    if (initialBead >= BEADS) return "gloria";
    return initialBead > 0 ? "beads" : "group-prayer";
  });

  const advance = () => {
    vibrate();
    if (bead + 1 >= BEADS) {
      setBead(BEADS);
      setPhase("gloria");
      onProgress?.(group, BEADS);
      return;
    }
    setBead(bead + 1);
    onProgress?.(group, bead + 1);
  };

  const goBack = () => {
    vibrate();

    if (phase === "gloria") {
      setBead(BEADS - 1);
      setPhase("beads");
      onProgress?.(group, BEADS - 1);
      return;
    }

    if (bead > 0) {
      setBead(bead - 1);
      onProgress?.(group, bead - 1);
      return;
    }

    setPhase("group-prayer");
  };

  const nextGroup = () => {
    if (group >= GROUPS) {
      onFinished?.();
      return;
    }
    setGroup(group + 1);
    setBead(0);
    setPhase("group-prayer");
    onProgress?.(group + 1, 0);
  };

  const angle = (index: number) => (index / BEADS) * 2 * Math.PI - Math.PI / 2;

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs uppercase tracking-[0.25em] text-primary">
        Ronda {group} de {GROUPS}
      </p>

      {phase === "group-prayer" ? (
        <div className="mt-6 w-full text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Oración a San Miguel Arcángel
          </p>
          <p className="mt-4 whitespace-pre-line font-display text-xl leading-relaxed">
            {groupPrayer}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Después de rezar esta oración, continúa con la primera de las diez cuentas.
          </p>
          <Button
            className="mt-6 h-14 w-full text-base"
            size="lg"
            onClick={() => setPhase("beads")}
          >
            Continuar a la primera cuenta
          </Button>
        </div>
      ) : phase === "beads" ? (
        <div className="relative mt-6 size-64">
          {Array.from({ length: BEADS }).map((_, index) => {
            const a = angle(index);
            return (
              <span
                key={index}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(${Math.cos(a) * 110 - 7}px, ${Math.sin(a) * 110 - 7}px)`,
                }}
              >
                <PrayerBead active={index === bead && phase === "beads"} done={index < bead} />
              </span>
            );
          })}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-4xl text-primary">
              {Math.min(bead, BEADS)} / {BEADS}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              cuentas
            </span>
          </div>
        </div>
      ) : null}

      {phase === "gloria" ? (
        <div className="mt-6 w-full text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-primary/35 bg-primary/10 text-primary shadow-[var(--shadow-halo)]">
            <CheckCircle2 className="size-8" aria-hidden />
          </span>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-primary">
            Diez cuentas completadas
          </p>
          <h3 className="mt-2 font-display text-2xl">Reza ahora el Gloria</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Haz una breve pausa y proclama esta oración antes de continuar.
          </p>
          <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-left">
            <p className="whitespace-pre-line font-display text-lg leading-relaxed">{gloria}</p>
          </div>
          <Button className="mt-6 h-14 w-full text-base" size="lg" onClick={nextGroup}>
            {group >= GROUPS ? "He rezado el Gloria · Finalizar rondas" : "He rezado el Gloria"}
            <ChevronRight className="size-5" aria-hidden />
          </Button>
          <Button className="mt-3 w-full" variant="ghost" onClick={goBack}>
            <ChevronLeft className="size-4" aria-hidden />
            Volver a la última cuenta
          </Button>
          {group < GROUPS && (
            <p className="mt-2 text-xs text-muted-foreground">
              A continuación comenzarás la ronda {group + 1} de {GROUPS}.
            </p>
          )}
        </div>
      ) : phase === "beads" ? (
        <div className="mt-8 w-full text-center">
          <p className="font-display text-2xl">{invocation}</p>
          <p className="mt-1 font-display text-2xl text-primary">{response}</p>
          <Button className="mt-6 h-14 w-full text-base" size="lg" onClick={advance}>
            Rezar esta cuenta
          </Button>
          <Button className="mt-3 w-full" variant="ghost" onClick={goBack}>
            <ChevronLeft className="size-4" aria-hidden />
            {bead > 0 ? "Volver a la cuenta anterior" : "Volver a la oración de la ronda"}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">Toca para avanzar a tu propio ritmo.</p>
        </div>
      ) : null}

      <Button
        className="mt-6 w-full"
        variant="outline"
        onClick={() => void onSaveAndExit?.(group, bead)}
      >
        <LogOut className="size-4" aria-hidden />
        Guardar la última cuenta y salir
      </Button>
    </div>
  );
}
