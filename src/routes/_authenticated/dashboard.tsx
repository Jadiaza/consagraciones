import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookOpen, CircleDot, Heart, NotebookPen, Users, Sparkles } from "lucide-react";
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

  return (
    <AppShell>
      <header className="pt-2">
        <h1 className="font-display text-xl">Bienvenido, {displayName || "hermano"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Que los Santos Arcángeles te acompañen siempre.
        </p>
      </header>

      <section className="surface-sacred mt-5 overflow-hidden rounded-2xl">
        <div className="relative h-32">
          <img
            src={angeles}
            alt=""
            aria-hidden
            width={1536}
            height={1024}
            className="size-full object-cover opacity-60"
          />
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-veil)" }}
            aria-hidden
          />
        </div>
        <div className="-mt-10 relative p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Día actual</p>
          <p className="font-display text-2xl">Día {currentDay} de 33</p>
          <p className="mt-1 text-sm text-muted-foreground">{currentDayInfo?.title}</p>
          <Button asChild className="mt-4 w-full" size="lg">
            <Link to="/dia/$dayNumber" params={{ dayNumber: String(currentDay) }}>
              Continuar día
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
