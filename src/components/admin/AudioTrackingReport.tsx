import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock3, Headphones, Users } from "lucide-react";

import { EmptyState, ErrorState, LoadingState } from "@/components/app/cards";
import { supabase } from "@/integrations/supabase/client";

type AudioRow = {
  id: string;
  user_name: string;
  day_number: number;
  listened_seconds: number;
  listened_percent: number;
  last_position_seconds: number;
  status: "started" | "in_progress" | "completed";
  completed_at: string | null;
  updated_at: string;
};

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(value),
      )
    : "—";

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
};

export function AudioTrackingReport() {
  const report = useQuery({
    queryKey: ["admin-audio-tracking"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("audio-tracking", {
        body: { action: "adminReport" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return (data?.rows || []) as AudioRow[];
    },
    refetchInterval: 30_000,
  });

  if (report.isLoading) return <LoadingState />;
  if (report.error) return <ErrorState message={report.error.message} />;
  const rows = report.data || [];
  if (!rows.length)
    return <EmptyState message="Todavía no hay reproducciones identificadas en la playlist." />;

  const people = new Set(rows.map((row) => row.user_name)).size;
  const completed = rows.filter((row) => row.status === "completed").length;
  const activeToday = new Set(
    rows
      .filter((row) => Date.now() - new Date(row.updated_at).getTime() < 86_400_000)
      .map((row) => row.user_name),
  ).size;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric icon={Users} label="Peregrinos identificados" value={people} />
        <Metric icon={Headphones} label="Activos últimas 24 horas" value={activeToday} />
        <Metric icon={CheckCircle2} label="Días cumplidos por audio" value={completed} />
      </div>
      <section className="overflow-hidden rounded-2xl border border-[#d9e0e8] bg-white shadow-sm">
        <header className="border-b border-[#e5e9ef] p-4">
          <h2 className="font-display text-xl font-semibold">Seguimiento de audios</h2>
          <p className="mt-1 text-sm text-[#667085]">
            El cumplimiento se registra al escuchar al menos el 85 % sin contar los saltos.
          </p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-[#f8f6f1] text-left text-xs uppercase tracking-wide text-[#52657a]">
              <tr>
                <th className="px-4 py-3">Peregrino</th>
                <th className="px-4 py-3">Día</th>
                <th className="px-4 py-3">Escuchado</th>
                <th className="px-4 py-3">Tiempo validado</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Última actividad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0f3]">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-4 font-semibold">{row.user_name}</td>
                  <td className="px-4 py-4">Día {row.day_number}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-[#e8e4da]">
                        <div
                          className="h-full rounded-full bg-[#c99a3d]"
                          style={{ width: `${Math.min(100, row.listened_percent)}%` }}
                        />
                      </div>
                      <span>{Math.round(row.listened_percent)} %</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">{formatDuration(row.listened_seconds)}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.status === "completed"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {row.status === "completed" ? "Cumplido por audio" : "En proceso"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[#667085]">{formatDate(row.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-[#d9e0e8] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-[#0b2942] text-[#f3c756]">
          <Icon className="size-5" />
        </span>
        <div>
          <strong className="block text-2xl">{value}</strong>
          <span className="text-sm text-[#667085]">{label}</span>
        </div>
      </div>
    </div>
  );
}
