import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Layers3, Lock, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { AudioPlayer } from "@/components/app/AudioPlayer";
import { DayReadingNavigation } from "@/components/app/DayReadingNavigation";
import { MeditationCard } from "@/components/app/MeditationTimer";
import { ReadingToolbar, type ReadingPreferences } from "@/components/app/ReadingToolbar";
import { SacredText } from "@/components/app/SacredText";
import {
  DoctrineCard,
  ErrorState,
  LoadingState,
  PrayerCard,
  ScriptureCard,
  SectionTitle,
} from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  dayQuery,
  myConsecrationQuery,
  myProgressQuery,
  nextAvailableDay,
} from "@/lib/consecration";
import { MediaService } from "@/lib/media-service";
import { applyAppTheme, READING_PREFERENCES_KEY } from "@/lib/app-theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dia/$dayNumber")({ component: DiaPage });

const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  size: 17,
  theme: "dark",
  font: "serif",
  align: "left",
  spacing: "comfortable",
};

function DiaPage() {
  const { dayNumber } = Route.useParams();
  const n = Number(dayNumber);
  const { user } = useAuth();
  const { data: mine } = useQuery(myConsecrationQuery(user?.id));
  const { data, isLoading, error } = useQuery(dayQuery(n, mine?.consecration_id));
  const {
    data: progress,
    isLoading: progressLoading,
    refetch,
  } = useQuery(myProgressQuery(mine?.id));

  const [preferences, setPreferences] = useState<ReadingPreferences>(DEFAULT_READING_PREFERENCES);
  const [showReadingTools, setShowReadingTools] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(true);
  const [activeSection, setActiveSection] = useState("preparacion");
  const [slideDirection, setSlideDirection] = useState<"forward" | "backward">("forward");
  const [journal, setJournal] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(READING_PREFERENCES_KEY);
      if (saved) {
        const next = { ...DEFAULT_READING_PREFERENCES, ...JSON.parse(saved) };
        setPreferences(next);
        applyAppTheme(next.theme);
      }
    } catch {
      // Keep safe defaults when storage is unavailable or contains invalid data.
    }
  }, []);

  useEffect(() => {
    setShowMobileSummary(true);
    setActiveSection("preparacion");
  }, [n]);

  const savePreferences = (next: ReadingPreferences) => {
    setPreferences(next);
    applyAppTheme(next.theme);
    try {
      window.localStorage.setItem(READING_PREFERENCES_KEY, JSON.stringify(next));
    } catch {
      // Reading preferences remain active for the current session.
    }
  };

  const resetPreferences = () => savePreferences(DEFAULT_READING_PREFERENCES);

  const record = (progress ?? []).find((p) => p.day_number === n);
  const availableThrough = nextAvailableDay(progress);

  const upsert = async (patch: Record<string, unknown>) => {
    if (!user || !mine) return;
    const { error: err } = await supabase
      .from("user_day_progress")
      .upsert(
        { user_id: user.id, user_consecration_id: mine.id, day_number: n, ...patch },
        { onConflict: "user_consecration_id,day_number" },
      );
    if (err) toast.error("No fue posible guardar.");
    else void refetch();
  };

  const saveJournal = async () => {
    if (!user || !journal.trim()) return;
    setSaving(true);
    const { error: err } = await supabase.from("user_journal_entries").insert({
      user_id: user.id,
      user_consecration_id: mine?.id ?? null,
      day_number: n,
      content: journal.trim().slice(0, 5000),
    });
    setSaving(false);
    if (err) toast.error("No fue posible guardar tu diario.");
    else {
      setJournal("");
      toast.success("Guardado en tu diario privado.");
    }
  };

  if (isLoading || progressLoading)
    return (
      <AppShell title={`Día ${n}`}>
        <LoadingState />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={`Día ${n}`}>
        <ErrorState message={(error as Error).message} />
      </AppShell>
    );
  if (!data)
    return (
      <AppShell title={`Día ${n}`}>
        <ErrorState message="Este día aún no está publicado." />
      </AppShell>
    );

  if (n > availableThrough)
    return (
      <AppShell title={`Día ${n}`} back>
        <div className="surface-sacred rounded-2xl p-5 text-center">
          <Lock className="mx-auto size-8 text-primary" aria-hidden />
          <h1 className="mt-3 font-display text-xl">Día bloqueado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Completa el Día {availableThrough} para continuar tu camino.
          </p>
          <Button asChild className="mt-5 w-full">
            <Link to="/dia/$dayNumber" params={{ dayNumber: String(availableThrough) }}>
              Ir al Día {availableThrough}
            </Link>
          </Button>
        </div>
      </AppShell>
    );
  const { day, sections, scripture, doctrine, questions, media } = data;
  const podcast = media.find((m) => m.asset_type === "podcast");
  const navigationSections = [
    { id: "preparacion", label: "Preparación" },
    { id: "palabra", label: "Palabra" },
    ...(day.teaching || sections.length || day.church_teaching || doctrine.length
      ? [{ id: "ensenanza", label: "Enseñanza" }]
      : []),
    { id: "meditacion", label: "Meditación" },
    ...(day.purpose ? [{ id: "proposito", label: "Propósito" }] : []),
    ...(day.prayer || day.progressive_consecration ? [{ id: "oracion", label: "Oración" }] : []),
    { id: "diario", label: "Diario" },
  ];
  const selectSection = (id: string) => {
    const currentIndex = navigationSections.findIndex((section) => section.id === activeSection);
    const nextIndex = navigationSections.findIndex((section) => section.id === id);
    setSlideDirection(nextIndex >= currentIndex ? "forward" : "backward");
    setActiveSection(id);
    window.requestAnimationFrame(() => {
      if (window.matchMedia("(min-width: 1025px)").matches) {
        document
          .getElementById(`panel-${id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        document
          .querySelector(".reading-day-header")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  return (
    <AppShell
      title={`Día ${n} de 33`}
      back
      action={
        <button
          type="button"
          className="rounded-full border border-primary/25 p-2 text-primary transition hover:bg-primary/10"
          aria-label="Mostrar preferencias de lectura"
          aria-expanded={showReadingTools}
          onClick={() => setShowReadingTools((value) => !value)}
        >
          <SlidersHorizontal className="size-4" aria-hidden />
        </button>
      }
      className="day-reader-shell"
    >
      <div
        data-mobile-summary={showMobileSummary}
        className={cn(
          "reading-surface",
          `reading-theme-${preferences.theme}`,
          `reading-font-${preferences.font}`,
          `reading-align-${preferences.align}`,
          `reading-spacing-${preferences.spacing}`,
        )}
        style={{ fontSize: `${preferences.size}px` }}
      >
        <header className="reading-day-header">
          <p className="reading-eyebrow">Día {n} de 33</p>
          <h1>{day.title}</h1>
          {day.subtitle && <p className="reading-subtitle">{day.subtitle}</p>}
          {day.motto && <blockquote className="reading-motto">«{day.motto}»</blockquote>}
        </header>

        {showReadingTools && (
          <ReadingToolbar
            preferences={preferences}
            onChange={savePreferences}
            onClose={() => setShowReadingTools(false)}
            onReset={resetPreferences}
          />
        )}

        <section className="day-mobile-summary" aria-label="Resumen del día">
          <p className="day-mobile-summary__badge">
            Día {n} de 33 · {day.estimated_minutes} minutos
          </p>
          <h2>{day.title}</h2>
          {day.subtitle && <p className="day-mobile-summary__subtitle">{day.subtitle}</p>}

          <SectionTitle>Resumen</SectionTitle>
          <SacredText children={day.objective || day.introduction} />

          <SectionTitle>Centro espiritual</SectionTitle>
          <div className="day-mobile-summary__center">
            <SacredText children={day.motto || "¿Quién como Dios? ¡Nadie como Dios!"} />
          </div>

          <p className="day-mobile-summary__status">
            Contenido preparado para acompañarte en oración, formación y consagración.
          </p>

          <div className="day-mobile-summary__actions">
            <Button
              onClick={() => {
                selectSection("preparacion");
                setShowMobileSummary(false);
              }}
            >
              Continuar el día <ChevronRight aria-hidden />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                selectSection("palabra");
                setShowMobileSummary(false);
              }}
            >
              Leer la Palabra <BookOpen aria-hidden />
            </Button>
            <Button variant="outline" onClick={() => setShowMobileSummary(false)}>
              Ver secciones <Layers3 aria-hidden />
            </Button>
          </div>
        </section>

        <div className="day-reading-content" data-mobile-hidden={showMobileSummary}>
          <DayReadingNavigation
            sections={navigationSections}
            active={activeSection}
            onSelect={selectSection}
          />

          <div className="day-sections">
            <section
              id="panel-preparacion"
              role="tabpanel"
              data-active={activeSection === "preparacion"}
              className={cn(
                "day-section-panel",
                activeSection === "preparacion" && `slide-${slideDirection}`,
              )}
              aria-labelledby="tab-preparacion"
            >
              {day.objective && (
                <div className="surface-sacred rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-primary">
                    Objetivo del día
                  </p>
                  <SacredText className="mt-2" children={day.objective} />
                </div>
              )}
              {day.introduction && (
                <>
                  <SectionTitle hint="Ponte en la presencia de Dios">1 · Preparación</SectionTitle>
                  <SacredText children={day.introduction} />
                </>
              )}
            </section>

            <section
              id="panel-palabra"
              role="tabpanel"
              data-active={activeSection === "palabra"}
              className={cn(
                "day-section-panel",
                activeSection === "palabra" && `slide-${slideDirection}`,
              )}
              aria-labelledby="tab-palabra"
            >
              {scripture.length > 0 && (
                <>
                  <SectionTitle>2 · Palabra de Dios</SectionTitle>
                  <div className="flex flex-col gap-3">
                    {scripture.map((s) => (
                      <ScriptureCard
                        key={s.id}
                        citation={s.citation}
                        passage={s.passage}
                        commentary={s.commentary}
                      />
                    ))}
                  </div>
                </>
              )}
              <SectionTitle>3 · Escuchar el podcast</SectionTitle>
              <AudioPlayer
                src={MediaService.url(podcast ?? null)}
                title={`Día ${n} · ${day.title}`}
                subtitle={`${day.estimated_minutes} min aprox.`}
                initialPosition={record?.audio_position_seconds ?? 0}
                onPosition={(seconds) => {
                  if (seconds % 15 === 0) void upsert({ audio_position_seconds: seconds });
                }}
              />
            </section>

            <section
              id="panel-ensenanza"
              role="tabpanel"
              data-active={activeSection === "ensenanza"}
              className={cn(
                "day-section-panel",
                activeSection === "ensenanza" && `slide-${slideDirection}`,
              )}
              aria-labelledby="tab-ensenanza"
            >
              {day.teaching && (
                <>
                  <SectionTitle>4 · Enseñanza</SectionTitle>
                  <SacredText children={day.teaching} />
                </>
              )}
              {sections.map((section) => (
                <section key={section.id}>
                  <SectionTitle>{section.title || "Contenido complementario"}</SectionTitle>
                  {section.body && <SacredText children={section.body} />}
                </section>
              ))}
              {(day.church_teaching || doctrine.length > 0) && (
                <>
                  <SectionTitle>5 · La Iglesia nos enseña</SectionTitle>
                  {day.church_teaching && (
                    <SacredText className="mb-3" children={day.church_teaching} />
                  )}
                  <div className="flex flex-col gap-3">
                    {doctrine.map((d) => (
                      <DoctrineCard
                        key={d.id}
                        referenceType={d.reference_type}
                        author={d.author}
                        work={d.work}
                        reference={d.reference}
                        excerpt={d.excerpt}
                      />
                    ))}
                  </div>
                </>
              )}
            </section>

            <section
              id="panel-meditacion"
              role="tabpanel"
              data-active={activeSection === "meditacion"}
              className={cn(
                "day-section-panel",
                activeSection === "meditacion" && `slide-${slideDirection}`,
              )}
              aria-labelledby="tab-meditacion"
            >
              <SectionTitle>6 · Meditación</SectionTitle>
              <MeditationCard text={day.meditation} />
              {questions.length > 0 && (
                <>
                  <SectionTitle hint="Responde con calma, en silencio">
                    7 · Examen espiritual
                  </SectionTitle>
                  <ol className="flex flex-col gap-2">
                    {questions.map((q) => (
                      <li key={q.id} className="surface-sacred rounded-xl p-4 leading-relaxed">
                        {q.question}
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </section>

            {day.purpose && (
              <section
                id="panel-proposito"
                role="tabpanel"
                data-active={activeSection === "proposito"}
                className={cn(
                  "day-section-panel",
                  activeSection === "proposito" && `slide-${slideDirection}`,
                )}
                aria-labelledby="tab-proposito"
              >
                <SectionTitle>8 · Propósito del día</SectionTitle>
                <div className="surface-sacred rounded-2xl p-4">
                  <SacredText children={day.purpose} />
                  <Button
                    className="mt-4 w-full"
                    variant={record?.purpose_accepted ? "outline" : "default"}
                    onClick={() => void upsert({ purpose_accepted: true })}
                  >
                    {record?.purpose_accepted ? "Propósito asumido" : "Asumir este propósito"}
                  </Button>
                  {record?.purpose_accepted && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground">¿Pudiste vivirlo?</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {["Sí", "En parte", "Hoy me costó"].map((option) => (
                          <Button
                            key={option}
                            size="sm"
                            variant={record?.purpose_outcome === option ? "default" : "outline"}
                            onClick={() => void upsert({ purpose_outcome: option })}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            <section
              id="panel-oracion"
              role="tabpanel"
              data-active={activeSection === "oracion"}
              className={cn(
                "day-section-panel",
                activeSection === "oracion" && `slide-${slideDirection}`,
              )}
              aria-labelledby="tab-oracion"
            >
              {day.prayer && (
                <>
                  <SectionTitle>9 · Oración</SectionTitle>
                  <PrayerCard body={day.prayer} />
                </>
              )}
              <SectionTitle>10 · Coronilla de San Miguel</SectionTitle>
              <Button asChild variant="outline" className="w-full">
                <Link to="/coronilla">Rezar la Coronilla</Link>
              </Button>
              {day.progressive_consecration && (
                <>
                  <SectionTitle>11 · Consagración progresiva</SectionTitle>
                  <PrayerCard body={day.progressive_consecration} />
                </>
              )}
            </section>

            <section
              id="panel-diario"
              role="tabpanel"
              data-active={activeSection === "diario"}
              className={cn(
                "day-section-panel",
                activeSection === "diario" && `slide-${slideDirection}`,
              )}
              aria-labelledby="tab-diario"
            >
              <SectionTitle hint="Estrictamente privado">12 · Diario espiritual</SectionTitle>
              <div className="surface-sacred rounded-2xl p-4">
                <p className="text-sm text-muted-foreground">
                  ¿Qué me habló Dios hoy? ¿Qué debo cambiar? ¿Qué gracia quiero pedir? ¿Por quién
                  quiero orar?
                </p>
                <Textarea
                  className="mt-3 min-h-32"
                  maxLength={5000}
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                />
                <Button
                  className="mt-3 w-full"
                  variant="outline"
                  disabled={saving}
                  onClick={saveJournal}
                >
                  Guardar en mi diario
                </Button>
              </div>
              <Button
                className="mt-8 h-13 w-full text-base"
                size="lg"
                onClick={() => {
                  void upsert({ completed: true, completed_at: new Date().toISOString() });
                  toast.success("Día completado. Tu camino continúa.");
                }}
              >
                {record?.completed ? "Día completado" : "He completado este día"}
              </Button>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
