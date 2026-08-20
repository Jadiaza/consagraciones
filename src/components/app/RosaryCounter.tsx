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
  onFinished,
}: {
  groupPrayer: string;
  invocation: string;
  response: string;
  gloria: string;
  initialGroup?: number;
  initialBead?: number;
  onProgress?: (group: number, bead: number) => void;
  onFinished?: () => void;
}) {
  const [group, setGroup] = useState(initialGroup);
  const [bead, setBead] = useState(initialBead);
  const [phase, setPhase] = useState<"group-prayer" | "beads" | "gloria">(
    initialBead > 0 ? "beads" : "group-prayer",
  );

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
            Oración de inicio de la ronda
          </p>
          <p className="mt-4 whitespace-pre-line font-display text-xl leading-relaxed">
            {groupPrayer}
          </p>
          <Button
            className="mt-6 h-14 w-full text-base"
            size="lg"
            onClick={() => setPhase("beads")}
          >
            Comenzar las diez cuentas
          </Button>
        </div>
      ) : (
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
      )}

      {phase === "gloria" ? (
        <div className="mt-8 w-full text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-primary">
            Al finalizar las diez cuentas
          </p>
          <p className="whitespace-pre-line text-[15px] leading-relaxed">{gloria}</p>
          <Button className="mt-6 w-full" size="lg" onClick={nextGroup}>
            {group >= GROUPS ? "Terminar las cinco rondas" : "Continuar a la siguiente ronda"}
          </Button>
        </div>
      ) : phase === "beads" ? (
        <div className="mt-8 w-full text-center">
          <p className="font-display text-2xl">{invocation}</p>
          <p className="mt-1 font-display text-2xl text-primary">{response}</p>
          <Button className="mt-6 h-14 w-full text-base" size="lg" onClick={advance}>
            Rezar esta cuenta
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">Toca para avanzar a tu propio ritmo.</p>
        </div>
      ) : null}
    </div>
  );
}
