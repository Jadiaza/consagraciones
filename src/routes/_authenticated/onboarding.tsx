import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Cross,
  Globe2,
  Heart,
  Shield,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import sanMiguel from "@/assets/san-miguel-hero.jpg";
import { romanize } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  addDays,
  fetchConsecration,
  formatLongDate,
  publishedConsecrationsQuery,
  stagesQuery,
} from "@/lib/consecration";

export const Route = createFileRoute("/_authenticated/onboarding")({ component: Onboarding });

function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: available } = useQuery(publishedConsecrationsQuery());
  const [selectedConsecrationId, setSelectedConsecrationId] = useState("");
  const { data: stages } = useQuery(stagesQuery(selectedConsecrationId || undefined));
  const selectedConsecration = available?.find((item) => item.id === selectedConsecrationId);
  const durationDays = selectedConsecration?.duration_days ?? 33;
  const [step, setStep] = useState(0);
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [intention, setIntention] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!selectedConsecrationId && available?.[0]) setSelectedConsecrationId(available[0].id);
  }, [available, selectedConsecrationId]);

  const end = formatLongDate(addDays(new Date(`${startDate}T00:00:00`), durationDays - 1));

  const finish = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const consecration = await fetchConsecration(selectedConsecrationId || undefined);
      if (!consecration) throw new Error("La consagración no está disponible.");
      const expected = addDays(new Date(`${startDate}T00:00:00`), durationDays - 1)
        .toISOString()
        .slice(0, 10);
      const { data, error } = await supabase
        .from("user_consecrations")
        .insert({
          user_id: user.id,
          consecration_id: consecration.id,
          start_date: startDate,
          expected_end_date: expected,
        })
        .select()
        .single();
      if (error) throw error;
      if (intention.trim()) {
        await supabase.from("user_intentions").insert({
          user_id: user.id,
          user_consecration_id: data.id,
          content: intention.trim().slice(0, 2000),
        });
      }
      void navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No fue posible comenzar el camino.");
    } finally {
      setBusy(false);
    }
  };

  if (step === 0) {
    return (
      <main className="relative min-h-dvh overflow-hidden bg-[#061426] text-[#f5f1e8]">
        <div
          className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_70%_8%,rgba(226,184,94,.15),transparent_32%),linear-gradient(160deg,#0b2442,#061426_58%)]"
          aria-hidden
        />
        <div className="relative mx-auto min-h-dvh w-full max-w-2xl pb-[calc(104px+env(safe-area-inset-bottom))]">
          <header className="relative min-h-[390px] overflow-hidden px-5 pt-[calc(28px+env(safe-area-inset-top))] sm:min-h-[430px] sm:px-8">
            <img
              src={sanMiguel}
              alt="San Miguel Arcángel, guía de este camino espiritual"
              width={1024}
              height={1536}
              className="absolute inset-0 size-full object-cover object-[62%_top] opacity-90"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,20,38,.98)_0%,rgba(6,20,38,.78)_43%,rgba(6,20,38,.15)_78%),linear-gradient(to_bottom,rgba(6,20,38,.08),rgba(6,20,38,.2)_50%,#061426_98%)]"
              aria-hidden
            />
            <div className="animate-rise relative z-10 max-w-[250px] pt-8 sm:max-w-[310px] sm:pt-12">
              <div className="flex size-11 items-center justify-center rounded-full border border-[#e2b85e]/45 bg-[#061426]/55 text-[#e2b85e] shadow-[0_0_28px_rgba(226,184,94,.16)] backdrop-blur-sm">
                <Cross className="size-5" aria-hidden />
              </div>
              <h1 className="mt-5 font-display text-[clamp(2.25rem,10vw,3.6rem)] uppercase leading-[.95] tracking-[0.015em]">
                <span className="block">Prepara</span>
                <span className="mt-2 block text-[#e2b85e]">tu camino</span>
              </h1>
              <div className="mt-5 flex items-center gap-2 text-[#c99a3d]" aria-hidden>
                <span className="h-px w-24 bg-current opacity-60" />
                <span className="size-1.5 rotate-45 bg-current" />
                <span className="h-px w-10 bg-current opacity-35" />
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-[#f5f1e8]/88 sm:text-base">
                Durante {durationDays} días recorrerás {stages?.length ?? 0} etapas que te
                conducirán, de la mano de los Santos Arcángeles, hacia una entrega más profunda a
                Jesucristo.
              </p>
            </div>
          </header>

          <section
            aria-label="Etapas de la consagración"
            className="relative z-10 -mt-3 space-y-3.5 px-4 sm:px-6"
          >
            {(stages ?? []).map((stage) => {
              const expanded = expandedStageId === stage.id;
              return (
                <div key={stage.id} className="space-y-3.5">
                  <OnboardingStageCard
                    stageNumber={stage.stage_number}
                    title={stage.title}
                    motto={stage.motto}
                    startDay={stage.start_day}
                    endDay={stage.end_day}
                    completedDays={0}
                    expanded={expanded}
                    onToggle={() =>
                      setExpandedStageId((current) => (current === stage.id ? null : stage.id))
                    }
                  />
                  {expanded && (
                    <aside
                      aria-live="polite"
                      className="min-h-28 rounded-[20px] border border-[#c99a3d]/25 bg-[#0b2744]/95 p-5 text-left shadow-[0_10px_28px_rgba(0,0,0,.18)]"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e2b85e]">
                        Descripción de la etapa {romanize(stage.stage_number)}
                      </p>
                      <h2 className="mt-1 font-display text-lg font-semibold text-[#f5f1e8]">
                        {stage.title}
                      </h2>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#f5f1e8]/78">
                        {stage.description?.trim() ||
                          "Esta etapa aún no tiene una descripción publicada."}
                      </p>
                    </aside>
                  )}
                </div>
              );
            })}
          </section>
          <div className="px-5 sm:px-7">
            <Button
              className="mt-7 min-h-13 w-full bg-[linear-gradient(180deg,#e2b85e,#b98227)] font-semibold text-[#061426] shadow-[0_8px_24px_rgba(0,0,0,.25)] hover:brightness-110"
              size="lg"
              onClick={() => setStep(1)}
            >
              Continuar
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10">
      {step === 1 && (
        <section className="animate-rise">
          <h1 className="font-display text-2xl">Fecha de inicio</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Puedes comenzar hoy o elegir una fecha. Si deseas culminar alrededor del 29 de
            septiembre, solemnidad de los Santos Arcángeles, puedes organizar tu itinerario para
            ello. No es obligatorio.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setStartDate(new Date().toISOString().slice(0, 10))}
            >
              Comenzar hoy
            </Button>
            <div>
              <Label htmlFor="start">Elegir fecha</Label>
              <Input
                id="start"
                type="date"
                className="mt-1"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Fecha prevista de finalización: <span className="text-primary">{end}</span>
            </p>
          </div>
          <Button className="mt-8 w-full" size="lg" onClick={() => setStep(2)}>
            Continuar
          </Button>
        </section>
      )}

      {step === 2 && (
        <section className="animate-rise">
          <h1 className="font-display text-2xl">¿Por qué quieres realizar esta consagración?</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta intención es privada. Solo tú puedes verla.
          </p>
          <Textarea
            className="mt-4 min-h-36"
            maxLength={2000}
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Mi conversión, mi familia, fortalecer mi fe, discernimiento…"
          />
          <Button className="mt-8 w-full" size="lg" onClick={() => setStep(3)}>
            Continuar
          </Button>
        </section>
      )}

      {step === 3 && (
        <section className="animate-rise">
          <h1 className="font-display text-2xl">Antes de comenzar</h1>
          <ul className="mt-4 flex flex-col gap-3 text-[15px] leading-relaxed">
            {[
              "Participa en la Santa Eucaristía.",
              "Acércate al sacramento de la Reconciliación.",
              "Reserva cada día un momento para Dios.",
              "Ten a mano la Sagrada Escritura.",
              "Realiza el propósito diario.",
              "Persevera: si pierdes un día, tu camino continúa.",
            ].map((item) => (
              <li key={item} className="surface-sacred rounded-xl p-3">
                {item}
              </li>
            ))}
          </ul>
          <Button className="mt-8 w-full" size="lg" disabled={busy} onClick={finish}>
            Comenzar mi camino
          </Button>
        </section>
      )}
    </div>
  );
}

const STAGE_ICONS: LucideIcon[] = [BookOpen, Heart, Shield, Wine, Globe2];

function OnboardingStageCard({
  stageNumber,
  title,
  motto,
  startDay,
  endDay,
  completedDays,
  expanded,
  onToggle,
}: {
  stageNumber: number;
  title: string;
  motto?: string | null;
  startDay: number;
  endDay: number;
  completedDays: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const total = endDay - startDay + 1;
  const Icon = STAGE_ICONS[stageNumber - 1] ?? BookOpen;
  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onToggle}
      aria-label={`Etapa ${romanize(stageNumber)}: ${title}`}
      className={`group relative grid h-32 w-full text-left grid-cols-[58px_52px_minmax(0,1fr)_24px] items-stretch overflow-hidden rounded-[20px] border border-[#c99a3d]/20 bg-[linear-gradient(180deg,rgba(13,40,70,.94),rgba(7,28,50,.98))] shadow-[0_10px_28px_rgba(0,0,0,.18)] transition-transform motion-safe:hover:-translate-y-0.5 sm:grid-cols-[68px_58px_minmax(0,1fr)_28px] ${expanded ? "border-[#e2b85e]/70 ring-1 ring-[#e2b85e]/25" : ""}`}
    >
      <div className="flex items-center justify-center pl-2">
        <span className="flex size-12 items-center justify-center rounded-full border border-[#c99a3d]/35 bg-[#061426]/65 text-[#e2b85e] shadow-[0_0_20px_rgba(226,184,94,.1)] sm:size-14">
          <Icon className="size-6 sm:size-7" aria-hidden />
        </span>
      </div>
      <div className="relative flex flex-col items-center justify-center bg-[linear-gradient(90deg,#a87321,#e2b85e_48%,#a87321)] px-1 text-[#061426] shadow-lg">
        <span className="text-[9px] font-bold uppercase tracking-[0.08em]">Etapa</span>
        <span className="font-display text-2xl leading-none">{romanize(stageNumber)}</span>
        <span
          className="absolute inset-x-0 bottom-0 h-3 translate-y-1/2 rotate-45 bg-[#a87321]"
          aria-hidden
        />
      </div>
      <div className="relative z-10 min-w-0 self-center px-3 py-4">
        <h2 className="font-display text-[17px] font-semibold leading-tight text-[#f5f1e8] sm:text-xl">
          {title}
        </h2>
        {motto && (
          <p className="mt-1 line-clamp-2 text-[13px] text-[#8ea6c4] sm:text-sm">{motto}</p>
        )}
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#e2b85e] sm:text-xs">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden />
          Días {startDay}–{endDay} · {completedDays}/{total} completados
        </p>
      </div>
      <div className="flex items-center justify-center pr-2 text-[#c99a3d]">
        <ChevronRight
          className={`size-7 transition-transform ${expanded ? "rotate-90" : ""}`}
          aria-hidden
        />
      </div>
    </button>
  );
}
