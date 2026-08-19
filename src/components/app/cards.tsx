import { Link } from "@tanstack/react-router";
import { Check, ChevronRight, Loader2, WifiOff, AlertTriangle, Inbox, Lock } from "lucide-react";
import type { ReactNode } from "react";

import { Progress } from "@/components/ui/progress";
import { SacredText } from "@/components/app/SacredText";
import { cn } from "@/lib/utils";
import { stageAccent } from "@/lib/consecration";

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-3 mt-8 first:mt-0">
      <h2 className="font-display text-lg text-primary">{children}</h2>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function StageCard({
  stageNumber,
  title,
  motto,
  startDay,
  endDay,
  completedDays,
  locked,
}: {
  stageNumber: number;
  title: string;
  motto?: string | null;
  startDay: number;
  endDay: number;
  completedDays: number;
  locked?: boolean;
}) {
  const total = endDay - startDay + 1;
  return (
    <div className="surface-sacred flex items-center gap-3 rounded-2xl p-4">
      <span
        aria-hidden
        className="h-14 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: stageAccent(stageNumber) }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">
          Etapa {romanize(stageNumber)}
        </p>
        <p className="truncate font-display text-base">{title}</p>
        {motto && <p className="truncate text-sm text-muted-foreground">{motto}</p>}
        <p className="mt-1 text-xs text-muted-foreground">
          Días {startDay}–{endDay} · {completedDays}/{total} completados
        </p>
      </div>
      {locked ? (
        <Lock className="size-4 text-muted-foreground" aria-label="Aún no iniciada" />
      ) : completedDays === total ? (
        <Check className="size-5 text-primary" aria-label="Etapa completada" />
      ) : null}
    </div>
  );
}

export function DayCard({
  dayNumber,
  title,
  completed,
  available,
}: {
  dayNumber: number;
  title: string;
  completed: boolean;
  available: boolean;
}) {
  const content = (
    <>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
          completed
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-muted-foreground",
        )}
      >
        {dayNumber}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm">{title}</span>
      {available ? (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      ) : (
        <Lock className="size-4 shrink-0 text-muted-foreground" aria-label="Día bloqueado" />
      )}
    </>
  );

  if (!available) {
    return (
      <div
        aria-disabled="true"
        className="surface-sacred flex cursor-not-allowed items-center gap-3 rounded-xl p-3 opacity-60"
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      to="/dia/$dayNumber"
      params={{ dayNumber: String(dayNumber) }}
      className="surface-sacred flex items-center gap-3 rounded-xl p-3 transition-colors hover:border-primary/50"
    >
      {content}
    </Link>
  );
}

export function ProgressCard({ completed, total }: { completed: number; total: number }) {
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="surface-sacred rounded-2xl p-4">
      <div className="flex items-baseline justify-between">
        <p className="font-display text-sm">Mi progreso</p>
        <p className="text-sm text-primary">{percent}%</p>
      </div>
      <Progress value={percent} className="mt-3 h-2" />
      <p className="mt-2 text-xs text-muted-foreground">
        {completed} / {total} días completados
      </p>
    </div>
  );
}

export function ScriptureCard({
  citation,
  passage,
  commentary,
}: {
  citation: string;
  passage?: string | null;
  commentary?: string | null;
}) {
  return (
    <blockquote className="rounded-2xl border-l-2 border-primary bg-secondary/40 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-primary">{citation}</p>
      {passage && <SacredText className="mt-2 italic" children={`«${passage}»`} />}
      {commentary && <SacredText className="mt-2 text-muted-foreground" children={commentary} />}
    </blockquote>
  );
}

const DOCTRINE_LABEL: Record<string, string> = {
  scripture: "Sagrada Escritura",
  catechism: "Catecismo",
  magisterium: "Magisterio",
  church_father: "Padres de la Iglesia",
  church_doctor: "Doctores de la Iglesia",
  saint: "Santos",
  liturgy: "Liturgia",
  book: "Lectura",
};

export function DoctrineCard({
  referenceType,
  author,
  work,
  reference,
  excerpt,
}: {
  referenceType: string;
  author?: string | null;
  work?: string | null;
  reference?: string | null;
  excerpt?: string | null;
}) {
  return (
    <div className="surface-sacred rounded-2xl p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-primary">
        {DOCTRINE_LABEL[referenceType] ?? referenceType}
      </p>
      {excerpt && <SacredText className="mt-2" children={excerpt} />}
      <p className="mt-2 text-xs text-muted-foreground">
        {[author, work, reference].filter(Boolean).join(" · ")}
      </p>
    </div>
  );
}

export function PrayerCard({
  title,
  body,
  response,
}: {
  title?: string;
  body: string;
  response?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-secondary/30 p-4">
      {title && <p className="font-display text-sm text-primary">{title}</p>}
      <SacredText className="mt-2" children={body} />
      {response && <p className="mt-2 text-[15px] font-medium text-primary">{response}</p>}
    </div>
  );
}

export function ResourceCard({
  title,
  summary,
  onClick,
}: {
  title: string;
  summary?: string | null;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="surface-sacred flex w-full items-center gap-3 rounded-2xl p-4 text-left transition-colors hover:border-primary/50"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-sm">{title}</span>
        {summary && (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{summary}</span>
        )}
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
    </button>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="surface-sacred flex flex-col items-center gap-2 rounded-2xl p-8 text-center">
      <Inbox className="size-6 text-muted-foreground" aria-hidden />
      <p className="font-display">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

export function LoadingState({ label = "Preparando…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
      <Loader2 className="size-5 animate-spin" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="surface-sacred flex flex-col items-center gap-2 rounded-2xl p-8 text-center">
      <AlertTriangle className="size-6 text-destructive" aria-hidden />
      <p className="font-display">No pudimos cargar este contenido</p>
      <p className="text-sm text-muted-foreground">
        {message ?? "Intenta nuevamente en unos momentos."}
      </p>
    </div>
  );
}

export function OfflineState() {
  return (
    <div className="surface-sacred flex flex-col items-center gap-2 rounded-2xl p-8 text-center">
      <WifiOff className="size-6 text-muted-foreground" aria-hidden />
      <p className="font-display">Sin conexión</p>
      <p className="text-sm text-muted-foreground">
        Tu camino continúa. Vuelve a intentarlo cuando tengas conexión.
      </p>
    </div>
  );
}

export function romanize(n: number) {
  return ["", "I", "II", "III", "IV", "V", "VI", "VII"][n] ?? String(n);
}
