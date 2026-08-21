import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookOpen, CircleDot, Clock3, Heart, NotebookPen, Users, Sparkles } from "lucide-react";
import { useEffect } from "react";

import angeles from "@/assets/angeles.jpg";
import { AppShell } from "@/components/app/AppShell";
import { LoadingState, ProgressCard, StageCard, romanize } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { daysQuery, myConsecrationQuery, myProgressQuery, stagesQuery } from "@/lib/consecration";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function Dashboard() {
  const navigate = useNavigate();
  const { user, displayName } = useAuth();
  const { data: mine, isLoading } = useQuery(myConsecrationQuery(user?.id));
  const { data: progress } = useQuery(myProgressQuery(mine?.id));
  const { data: days } = useQuery(daysQuery(mine?.consecration_id));
  const { data: stages } = useQuery(stagesQuery(mine?.consecration_id));

  useEffect(() => {
    if (!isLoading && user && mine === null) void navigate({ to: "/onboarding", replace: true });
  }, [isLoading, mine, user, navigate]);

  if (isLoading || !mine)
    return (
      <AppShell>
        <LoadingState />
      </AppShell>
    );

  const completed = (progress ?? []).filter((p) => p.completed).map((p) => p.day_number);
  const currentDay = Math.min(33, (completed.length ? Math.max(...completed) : 0) + 1);
  const currentDayInfo = (days ?? []).find((d) => d.day_number === currentDay);
  const currentStage = (stages ?? []).find(
    (s) => currentDay >= s.start_day && currentDay <= s.end_day,
  );
  const currentDayImage = currentDayInfo?.hero_image?.trim() || angeles;

  return (
    <AppShell>
      <header className="pt-2">
        <h1 className="font-display text-xl">Bienvenido, {displayName || "hermano"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Que los Santos Arcángeles te acompañen siempre.
        </p>
      </header>

      <section className="surface-sacred group relative mt-5 min-h-[20rem] overflow-hidden rounded-[1.75rem] border-primary/20 shadow-[0_18px_45px_-22px_rgba(84,55,11,0.55)]">
        <div className="absolute inset-0">
          <img
            src={currentDayImage}
            alt={`Portada del día ${currentDay}: ${currentDayInfo?.title || "Consagración"}`}
            width={1536}
            height={1024}
            className="size-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            onError={(event) => {
              if (event.currentTarget.src !== angeles) event.currentTarget.src = angeles;
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(22,16,9,.92) 0%, rgba(22,16,9,.78) 48%, rgba(22,16,9,.24) 78%, rgba(22,16,9,.12) 100%), linear-gradient(0deg, rgba(22,16,9,.72) 0%, transparent 48%)",
            }}
            aria-hidden
          />
        </div>
        <div className="relative flex min-h-[20rem] max-w-[84%] flex-col justify-end p-5 text-white sm:max-w-[68%] sm:p-7">
          <p className="inline-flex w-fit rounded-full border border-white/25 bg-black/25 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#f5c969] backdrop-blur-sm">
            Día actual
          </p>
          <p className="mt-3 font-display text-[2.35rem] font-semibold leading-none drop-shadow-sm">
            Día {currentDay}{" "}
            <span className="text-xl font-normal text-white/80">de 33</span>
          </p>
          <p className="mt-3 text-lg font-semibold leading-snug text-white drop-shadow-sm">
            {currentDayInfo?.title || "Continúa tu camino de consagración"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/80">
            {currentStage && <span>Etapa {romanize(currentStage.stage_number)}</span>}
            {currentDayInfo?.estimated_minutes && (
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-3.5" aria-hidden />
                {currentDayInfo.estimated_minutes} minutos
              </span>
            )}
          </div>
          <Button asChild className="mt-5 w-full bg-[#d7a53e] text-[#201507] hover:bg-[#e5b956]" size="lg">
            <Link to="/dia/$dayNumber" params={{ dayNumber: String(currentDay) }}>
              Continuar mi camino
            </Link>
          </Button>
        </div>
      </section>

      <div className="mt-4">
        <ProgressCard completed={completed.length} total={33} />
      </div>

      {currentStage && (
        <div className="mt-4">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Etapa actual · Etapa {romanize(currentStage.stage_number)}
          </p>
          <StageCard
            stageNumber={currentStage.stage_number}
            title={currentStage.title}
            motto={currentStage.motto}
            startDay={currentStage.start_day}
            endDay={currentStage.end_day}
            completedDays={
              completed.filter((d) => d >= currentStage.start_day && d <= currentStage.end_day)
                .length
            }
          />
        </div>
      )}

      <div className="mt-5 grid grid-cols-3 gap-2">
        <Shortcut to="/coronilla" icon={<CircleDot className="size-5" />} label="Coronilla" />
        <Shortcut to="/dias" icon={<Sparkles className="size-5" />} label="Los 33 días" />
        <Shortcut to="/recursos" icon={<BookOpen className="size-5" />} label="Recursos" />
        <Shortcut to="/perfil" icon={<Heart className="size-5" />} label="Mi intención" />
        <Shortcut to="/perfil" icon={<NotebookPen className="size-5" />} label="Mi diario" />
        <Shortcut to="/perfil" icon={<Users className="size-5" />} label="Acompañamiento" />
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Si perdiste un día, tu camino continúa. Retoma tranquilamente donde quedaste.
      </p>
    </AppShell>
  );
}

function Shortcut({
  to,
  icon,
  label,
}: {
  to: "/coronilla" | "/dias" | "/recursos" | "/perfil";
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="surface-sacred flex flex-col items-center gap-1.5 rounded-xl p-3 text-center text-xs"
    >
      <span className="text-primary" aria-hidden>
        {icon}
      </span>
      {label}
    </Link>
  );
}
