import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import { EmptyState, ErrorState, LoadingState } from "@/components/app/cards";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type Summary = Tables<"admin_user_progress_summary">;
type TrackingStatus = "all" | "on_track" | "behind" | "inactive" | "completed";

const PAGE_SIZE = 25;
const statusLabels: Record<string, string> = {
  on_track: "Al día",
  behind: "Avanza lentamente",
  inactive: "Sin actividad reciente",
  completed: "Completó",
};
const statusStyles: Record<string, string> = {
  on_track: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  behind: "bg-amber-50 text-amber-800 ring-amber-200",
  inactive: "bg-rose-50 text-rose-800 ring-rose-200",
  completed: "bg-sky-50 text-sky-800 ring-sky-200",
};
const chartConfig = {
  completed: { label: "Días completados", color: "#c99a3d" },
} satisfies ChartConfig;

export function ActivityReport({ consecrationId }: { consecrationId?: string }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TrackingStatus>("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Summary | null>(null);

  const summary = useQuery({
    queryKey: ["admin-activity-summary", consecrationId, search, status, page],
    queryFn: async () => {
      let query = supabase
        .from("admin_user_progress_summary")
        .select("*", { count: "exact" })
        .order("last_activity_at", { ascending: false, nullsFirst: false })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
      if (consecrationId) query = query.eq("consecration_id", consecrationId);
      if (search.trim()) query = query.ilike("user_name", `%${search.trim()}%`);
      if (status !== "all") query = query.eq("tracking_status", status);
      const { data, error, count } = await query;
      if (error) throw error;
      return { rows: data ?? [], count: count ?? 0 };
    },
    placeholderData: (previous) => previous,
  });

  const metrics = useQuery({
    queryKey: ["admin-activity-metrics", consecrationId],
    queryFn: async () => {
      const count = async (filters: { status?: string; since?: string }) => {
        let query = supabase
          .from("admin_user_progress_summary")
          .select("enrollment_id", { count: "exact", head: true });
        if (consecrationId) query = query.eq("consecration_id", consecrationId);
        if (filters.status) query = query.eq("tracking_status", filters.status);
        if (filters.since) query = query.gte("last_activity_at", filters.since);
        const result = await query;
        if (result.error) throw result.error;
        return result.count ?? 0;
      };
      const now = new Date();
      const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const sevenDays = new Date(now.getTime() - 7 * 86_400_000).toISOString();
      const [today, last7, inactive, completed] = await Promise.all([
        count({ since: startToday }),
        count({ since: sevenDays }),
        count({ status: "inactive" }),
        count({ status: "completed" }),
      ]);
      return { today, last7, inactive, completed };
    },
  });

  const totalPages = Math.max(1, Math.ceil((summary.data?.count ?? 0) / PAGE_SIZE));
  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Activity} label="Activos hoy" value={metrics.data?.today} />
        <MetricCard icon={Users} label="Activos últimos 7 días" value={metrics.data?.last7} />
        <MetricCard
          icon={AlertTriangle}
          label="Sin actividad 7 días"
          value={metrics.data?.inactive}
        />
        <MetricCard
          icon={CheckCircle2}
          label="Consagraciones completadas"
          value={metrics.data?.completed}
        />
      </div>

      <section className="surface-sacred overflow-hidden rounded-2xl border border-white/10">
        <header className="flex flex-col gap-3 border-b border-white/10 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold">Seguimiento por usuario</h2>
            <p className="text-sm text-[#667085]">
              Una fila por inscripción. Selecciona un nombre para consultar su reporte.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-[#667085]" />
              <Input
                className="h-9 w-full pl-9 sm:w-64"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Buscar por nombre"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as TrackingStatus);
                setPage(0);
              }}
            >
              <SelectTrigger className="h-9 w-full sm:w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="on_track">Al día</SelectItem>
                <SelectItem value="behind">Avanza lentamente</SelectItem>
                <SelectItem value="inactive">Sin actividad reciente</SelectItem>
                <SelectItem value="completed">Completó</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {summary.isLoading ? (
          <LoadingState />
        ) : summary.error ? (
          <ErrorState message={summary.error.message} />
        ) : summary.data?.rows.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-[#f8f6f1] text-left text-xs uppercase tracking-wide text-[#52657a]">
                  <tr>
                    <th className="px-4 py-3">Usuario</th>
                    <th className="px-4 py-3">Día actual</th>
                    <th className="px-4 py-3">Progreso</th>
                    <th className="px-4 py-3">Última actividad</th>
                    <th className="px-4 py-3">Ritmo</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {summary.data.rows.map((row) => (
                    <tr
                      key={row.enrollment_id}
                      className="cursor-pointer transition hover:bg-[#c99a3d]/5"
                      onClick={() => setSelected(row)}
                    >
                      <td className="px-4 py-4">
                        <button className="flex items-center gap-3 text-left font-semibold hover:text-[#8a6200]">
                          <span className="grid size-9 place-items-center rounded-full bg-[#0b2942] text-white">
                            <UserRound className="size-4" />
                          </span>
                          <span>
                            {row.user_name}
                            <small className="block font-normal text-[#667085]">
                              {row.community || row.consecration_title}
                            </small>
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        {row.current_day} de {row.duration_days}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex min-w-40 items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e8e4da]">
                            <div
                              className="h-full rounded-full bg-[#c99a3d]"
                              style={{ width: `${row.progress_percent ?? 0}%` }}
                            />
                          </div>
                          <b>{row.progress_percent ?? 0}%</b>
                        </div>
                      </td>
                      <td className="px-4 py-4">{relativeDate(row.last_activity_at)}</td>
                      <td className="px-4 py-4">{row.completed_last_7d ?? 0} días esta semana</td>
                      <td className="px-4 py-4">
                        <StatusBadge status={row.tracking_status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-sm">
              <span className="text-[#667085]">{summary.data.count} inscripciones</span>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-lg border p-2 disabled:opacity-40"
                  disabled={page === 0}
                  onClick={() => setPage((value) => value - 1)}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span>
                  {page + 1} / {totalPages}
                </span>
                <button
                  className="rounded-lg border p-2 disabled:opacity-40"
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((value) => value + 1)}
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <EmptyState
            title="No encontramos actividad"
            description="Prueba otro nombre, estado o consagración."
          />
        )}
      </section>

      <UserProgressDialog summary={selected} close={() => setSelected(null)} />
    </div>
  );
}

function UserProgressDialog({ summary, close }: { summary: Summary | null; close: () => void }) {
  const detail = useQuery({
    queryKey: ["admin-user-progress-detail", summary?.enrollment_id],
    enabled: Boolean(summary?.enrollment_id),
    queryFn: async () => {
      const [progress, stages] = await Promise.all([
        supabase
          .from("user_day_progress")
          .select(
            "id,day_number,completed,completed_at,updated_at,purpose_accepted,purpose_outcome",
          )
          .eq("user_consecration_id", summary!.enrollment_id!)
          .order("day_number"),
        supabase
          .from("consecration_stages")
          .select("id,title,stage_number,start_day,end_day")
          .eq("consecration_id", summary!.consecration_id!)
          .order("stage_number"),
      ]);
      if (progress.error) throw progress.error;
      if (stages.error) throw stages.error;
      return { progress: progress.data ?? [], stages: stages.data ?? [] };
    },
  });

  const completed = new Set(
    detail.data?.progress.filter((item) => item.completed).map((item) => item.day_number) ?? [],
  );
  const weekly = useMemo(() => buildWeeklyData(detail.data?.progress ?? []), [detail.data]);
  const stageData =
    detail.data?.stages.map((stage) => {
      const total = stage.end_day - stage.start_day + 1;
      let done = 0;
      for (let day = stage.start_day; day <= stage.end_day; day += 1) {
        if (completed.has(day)) done += 1;
      }
      return { ...stage, total, done, percent: Math.round((done / total) * 100) };
    }) ?? [];
  const pieData = [
    { name: "Completados", value: summary?.completed_days ?? 0, fill: "#c99a3d" },
    {
      name: "Pendientes",
      value: Math.max((summary?.duration_days ?? 0) - (summary?.completed_days ?? 0), 0),
      fill: "#e8e4da",
    },
  ];

  return (
    <Dialog open={Boolean(summary)} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto bg-[#f7f6f2] p-0">
        {summary && (
          <>
            <DialogHeader className="border-b bg-[#071f33] p-6 text-left text-white">
              <DialogTitle className="font-display text-2xl">{summary.user_name}</DialogTitle>
              <DialogDescription className="text-white/70">
                {summary.consecration_title} · Inicio {formatDate(summary.start_date)}
              </DialogDescription>
              <div className="pt-2">
                <StatusBadge status={summary.tracking_status} />
              </div>
            </DialogHeader>
            {detail.isLoading ? (
              <LoadingState />
            ) : detail.error ? (
              <ErrorState message={detail.error.message} />
            ) : (
              <div className="space-y-5 p-6">
                <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
                  <ReportCard title="Progreso general">
                    <ChartContainer config={chartConfig} className="mx-auto h-44 max-w-52">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          innerRadius={52}
                          outerRadius={72}
                          strokeWidth={0}
                        >
                          {pieData.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                    <div className="-mt-24 mb-12 text-center">
                      <b className="text-3xl">{summary.progress_percent ?? 0}%</b>
                      <span className="block text-xs text-[#667085]">
                        {summary.completed_days} de {summary.duration_days} días
                      </span>
                    </div>
                  </ReportCard>
                  <ReportCard title="Actividad semanal">
                    <ChartContainer config={chartConfig} className="h-56 w-full">
                      <BarChart data={weekly} margin={{ left: -20, right: 8 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="completed"
                          fill="var(--color-completed)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </ReportCard>
                </div>

                <ReportCard title="Camino de 33 días">
                  <div className="grid grid-cols-7 gap-2 sm:grid-cols-11">
                    {Array.from(
                      { length: summary.duration_days ?? 0 },
                      (_, index) => index + 1,
                    ).map((day) => (
                      <div
                        key={day}
                        title={`Día ${day}: ${completed.has(day) ? "completado" : "pendiente"}`}
                        className={cn(
                          "grid aspect-square place-items-center rounded-lg border text-xs font-semibold",
                          completed.has(day) && "border-emerald-600 bg-emerald-600 text-white",
                          day === summary.current_day &&
                            !completed.has(day) &&
                            "border-[#c99a3d] bg-[#f4dfaa] text-[#684900]",
                          !completed.has(day) &&
                            day !== summary.current_day &&
                            "border-[#dedbd2] bg-white text-[#667085]",
                        )}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </ReportCard>

                <div className="grid gap-4 lg:grid-cols-2">
                  <ReportCard title="Progreso por etapas">
                    <div className="space-y-4">
                      {stageData.map((stage) => (
                        <div key={stage.id}>
                          <div className="mb-1 flex justify-between text-sm">
                            <span>{stage.title}</span>
                            <b>{stage.percent}%</b>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-[#e8e4da]">
                            <div
                              className="h-full rounded-full bg-[#0b2942]"
                              style={{ width: `${stage.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ReportCard>
                  <ReportCard title="Actividad reciente">
                    <div className="max-h-64 space-y-1 overflow-y-auto">
                      {[...(detail.data?.progress ?? [])]
                        .filter((item) => item.completed)
                        .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
                        .map((item) => (
                          <div key={item.id} className="flex gap-3 border-b py-3 text-sm">
                            <CheckCircle2 className="size-5 shrink-0 text-emerald-700" />
                            <div>
                              <b>Completó el Día {item.day_number}</b>
                              <p className="text-xs text-[#667085]">
                                {formatDateTime(item.updated_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </ReportCard>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: number | undefined;
}) {
  return (
    <div className="surface-sacred flex items-center gap-4 rounded-2xl border border-white/10 p-4">
      <span className="grid size-11 place-items-center rounded-xl bg-[#0b2942] text-[#edc85b]">
        <Icon className="size-5" />
      </span>
      <div>
        <b className="text-2xl">{value ?? "—"}</b>
        <p className="text-sm text-[#667085]">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const key = status ?? "inactive";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        statusStyles[key] ?? statusStyles["inactive"],
      )}
    >
      {statusLabels[key] ?? "Sin actividad"}
    </span>
  );
}

function ReportCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#dedbd2] bg-white p-4 shadow-sm">
      <h3 className="mb-4 font-semibold text-[#172033]">{title}</h3>
      {children}
    </section>
  );
}

function buildWeeklyData(progress: Array<{ completed: boolean; updated_at: string }>) {
  const now = new Date();
  return Array.from({ length: 5 }, (_, index) => {
    const weeksAgo = 4 - index;
    const end = new Date(now.getTime() - weeksAgo * 7 * 86_400_000);
    const start = new Date(end.getTime() - 7 * 86_400_000);
    return {
      label: weeksAgo === 0 ? "Esta semana" : `Hace ${weeksAgo} sem.`,
      completed: progress.filter((item) => {
        const date = new Date(item.updated_at);
        return item.completed && date >= start && date < end;
      }).length,
    };
  });
}

function relativeDate(value: string | null) {
  if (!value) return "Sin actividad";
  const diff = Date.now() - Date.parse(value);
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return "Hoy";
  if (days === 1) return "Ayer";
  return `Hace ${days} días`;
}

function formatDate(value: string | null) {
  return value ? new Date(`${value}T12:00:00`).toLocaleDateString("es-CO") : "—";
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
}
