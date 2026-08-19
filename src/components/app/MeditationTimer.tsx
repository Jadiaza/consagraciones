import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { SacredText } from "@/components/app/SacredText";

const OPTIONS = [1, 3, 5];

export function MeditationCard({ text }: { text?: string | null }) {
  const [minutes, setMinutes] = useState(3);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (remaining === null) return;
    if (remaining <= 0) return;
    const id = setTimeout(() => setRemaining(remaining - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  const running = remaining !== null && remaining > 0;
  const finished = remaining === 0;

  return (
    <div className="surface-sacred overflow-hidden rounded-2xl">
      <div className="relative p-5" style={{ background: "var(--gradient-night)" }}>
        {text && <SacredText children={text} />}

        <div className="mt-5 flex flex-col items-center">
          <div className="relative flex size-32 items-center justify-center rounded-full border border-primary/40">
            <span
              className="absolute inset-0 animate-halo rounded-full bg-primary/10"
              aria-hidden
            />
            <span className="font-display text-2xl text-primary">
              {remaining === null
                ? `${minutes} min`
                : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`}
            </span>
          </div>

          {!running && (
            <div
              className="mt-4 grid w-full grid-cols-3 gap-2"
              role="group"
              aria-label="Duración de la meditación"
            >
              {OPTIONS.map((value) => (
                <Button
                  key={value}
                  size="sm"
                  className="w-full"
                  variant={minutes === value ? "default" : "outline"}
                  onClick={() => {
                    setMinutes(value);
                    setRemaining(null);
                  }}
                >
                  {value} min
                </Button>
              ))}
            </div>
          )}

          <Button
            className="mt-4 w-full"
            size="lg"
            variant={running ? "outline" : "default"}
            onClick={() => setRemaining(running ? null : minutes * 60)}
          >
            {running ? "Detener" : finished ? "Meditar nuevamente" : "Comenzar meditación"}
          </Button>
          {finished && (
            <p className="mt-3 text-sm text-primary">Que este silencio te acerque más a Dios.</p>
          )}
        </div>
      </div>
    </div>
  );
}
