import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Headphones, KeyRound, Pencil, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, ErrorState, LoadingState } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type Progress = {
  id: string;
  day_number: number;
  listened_percent: number;
  status: "started" | "in_progress" | "completed";
  completed_at: string | null;
  updated_at: string;
};
type Participant = {
  id: string;
  user_id: string;
  display_name: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  parish: string;
  code_hint: string;
  last_used_at: string | null;
  progress: Progress[];
};
type Form = Pick<
  Participant,
  "full_name" | "display_name" | "email" | "phone" | "city" | "country" | "parish"
>;

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(value),
      )
    : "—";

async function invoke(functionName: string, body: Record<string, unknown>) {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) throw new Error("La sesión administrativa venció. Ingresa nuevamente.");
  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export function AudioTrackingReport() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Participant | null>(null);
  const [reportSelected, setReportSelected] = useState<Participant | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [newCode, setNewCode] = useState("");
  const report = useQuery({
    queryKey: ["admin-audio-tracking"],
    queryFn: async () =>
      (await invoke("audio-tracking", { action: "adminReport" })).participants as Participant[],
    refetchInterval: 30_000,
  });
  const save = useMutation({
    mutationFn: (values: Form & { userId: string }) =>
      invoke("admin-users", { action: "update", ...values }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["admin-audio-tracking"] }),
        qc.invalidateQueries({ queryKey: ["admin-users-complete"] }),
      ]);
      toast.success("Datos del usuario actualizados");
      setSelected(null);
    },
    onError: (error) => toast.error(error.message),
  });
  const regenerate = useMutation({
    mutationFn: (accessId: string) =>
      invoke("audio-tracking", { action: "adminRegenerateCode", accessId }),
    onSuccess: async (data) => {
      setNewCode(data.code);
      await qc.invalidateQueries({ queryKey: ["admin-audio-tracking"] });
      toast.success("Código personal generado");
    },
    onError: (error) => toast.error(error.message),
  });

  if (report.isLoading) return <LoadingState />;
  if (report.error) return <ErrorState message={report.error.message} />;
  const participants = report.data || [];
  if (!participants.length)
    return <EmptyState message="Todavía no hay personas identificadas en la playlist." />;
  const completed = participants.reduce(
    (total, person) => total + person.progress.filter((item) => item.status === "completed").length,
    0,
  );
  const activeToday = participants.filter((person) =>
    person.progress.some((item) => Date.now() - new Date(item.updated_at).getTime() < 86_400_000),
  ).length;

  const openEditor = (person: Participant) => {
    setSelected(person);
    setNewCode("");
    setForm({
      full_name: person.full_name,
      display_name: person.display_name,
      email: person.email,
      phone: person.phone,
      city: person.city,
      country: person.country,
      parish: person.parish,
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric icon={Users} label="Registrados por playlist" value={participants.length} />
        <Metric icon={Headphones} label="Activos últimas 24 horas" value={activeToday} />
        <Metric icon={CheckCircle2} label="Días cumplidos por audio" value={completed} />
      </div>
      <section className="overflow-hidden rounded-2xl border border-[#d9e0e8] bg-white shadow-sm">
        <header className="border-b border-[#e5e9ef] p-4">
          <h2 className="font-display text-xl font-semibold">Personas y avance por audio</h2>
          <p className="mt-1 text-sm text-[#667085]">
            Selecciona una persona para consultar el avance, actualizar sus datos o generar un nuevo
            código.
          </p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-[#f8f6f1] text-left text-xs uppercase tracking-wide text-[#52657a]">
              <tr>
                <th className="px-4 py-3">Peregrino</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Avance</th>
                <th className="px-4 py-3">Última actividad</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0f3]">
              {participants.map((person) => {
                const completedDays = person.progress.filter((item) => item.status === "completed");
                const latest = person.progress[0];
                return (
                  <tr key={person.id} className="hover:bg-[#d8a72e]/5">
                    <td className="px-4 py-4 font-semibold">
                      <button
                        type="button"
                        className="text-left text-[#0b2942] underline decoration-[#d8a72e] decoration-2 underline-offset-4 hover:text-[#9a6b00]"
                        onClick={() => setReportSelected(person)}
                      >
                        {person.display_name}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <span className="block">{person.email}</span>
                      <span className="text-[#667085]">{person.phone || "Sin teléfono"}</span>
                    </td>
                    <td className="px-4 py-4 font-mono">SM-••••-{person.code_hint}</td>
                    <td className="px-4 py-4">
                      <span className="block font-semibold">
                        {completedDays.length} días cumplidos
                      </span>
                      <div
                        className="my-2 h-2 w-36 overflow-hidden rounded-full bg-[#e8e4da]"
                        role="progressbar"
                        aria-label={`Avance de ${person.display_name}`}
                        aria-valuemin={0}
                        aria-valuemax={33}
                        aria-valuenow={completedDays.length}
                      >
                        <div
                          className="h-full rounded-full bg-[#0aa06e] transition-[width]"
                          style={{ width: `${Math.min(100, (completedDays.length / 33) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[#667085]">
                        {latest
                          ? `Día ${latest.day_number}: ${Math.round(latest.listened_percent)} %`
                          : "Sin reproducción"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#667085]">
                      {formatDate(latest?.updated_at || person.last_used_at)}
                    </td>
                    <td className="px-4 py-4">
                      <Button variant="outline" size="sm" onClick={() => openEditor(person)}>
                        <Pencil className="mr-2 size-4" />
                        Gestionar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Datos y acceso a la playlist</DialogTitle>
            <DialogDescription>
              Actualiza los datos personales o reemplaza el código de acceso.
            </DialogDescription>
          </DialogHeader>
          {selected && form && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Nombre completo"
                  value={form.full_name}
                  onChange={(v) => setForm({ ...form, full_name: v })}
                />
                <Field
                  label="Nombre para mostrar"
                  value={form.display_name}
                  onChange={(v) => setForm({ ...form, display_name: v })}
                />
                <Field
                  label="Correo"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                />
                <Field
                  label="Teléfono"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                />
                <Field
                  label="Ciudad"
                  value={form.city}
                  onChange={(v) => setForm({ ...form, city: v })}
                />
                <Field
                  label="País"
                  value={form.country}
                  onChange={(v) => setForm({ ...form, country: v })}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Parroquia o comunidad"
                    value={form.parish}
                    onChange={(v) => setForm({ ...form, parish: v })}
                  />
                </div>
              </div>
              <div className="rounded-xl border border-[#e5d7b7] bg-[#fffaf0] p-4">
                <Label>Código personal</Label>
                <p className="mt-2 font-mono text-lg font-semibold">
                  {newCode || `SM-••••-${selected.code_hint}`}
                </p>
                <p className="mt-1 text-xs text-[#667085]">
                  El código completo solo se muestra al generarlo. El anterior dejará de funcionar.
                </p>
                <Button
                  className="mt-3"
                  variant="outline"
                  onClick={() => regenerate.mutate(selected.id)}
                  disabled={regenerate.isPending}
                >
                  <KeyRound className="mr-2 size-4" />
                  Generar nuevo código
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cancelar
            </Button>
            <Button
              className="bg-[#d8a72e] text-[#13263b]"
              disabled={!selected || !form || save.isPending}
              onClick={() => selected && form && save.mutate({ ...form, userId: selected.user_id })}
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(reportSelected)}
        onOpenChange={(open) => !open && setReportSelected(null)}
      >
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Seguimiento de audios · {reportSelected?.display_name}</DialogTitle>
            <DialogDescription>
              Avance registrado en la playlist y fecha de finalización de cada audio.
            </DialogDescription>
          </DialogHeader>
          {reportSelected && <AudioJourney progress={reportSelected.progress} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportSelected(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AudioJourney({ progress }: { progress: Progress[] }) {
  const byDay = new Map(progress.map((item) => [item.day_number, item]));
  const completedDays = progress.filter((item) => item.status === "completed").length;
  const overallPercent = Math.round((completedDays / 33) * 100);

  return (
    <div className="rounded-xl border border-[#e5e9ef] p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <Label>Seguimiento de audios</Label>
          <p className="mt-1 text-sm text-[#667085]">
            {completedDays} de 33 días cumplidos · {overallPercent} % del camino
          </p>
        </div>
        <strong className="text-2xl text-[#0b2942]">{overallPercent} %</strong>
      </div>
      <div
        className="mt-3 h-3 overflow-hidden rounded-full bg-[#e8e4da]"
        role="progressbar"
        aria-label="Progreso general de audios"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={overallPercent}
      >
        <div
          className="h-full rounded-full bg-[#0aa06e] transition-[width]"
          style={{ width: `${overallPercent}%` }}
        />
      </div>
      <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-11">
        {Array.from({ length: 33 }, (_, index) => {
          const day = index + 1;
          const item = byDay.get(day);
          const completed = item?.status === "completed";
          const started = Boolean(item) && !completed;
          const percent = Math.round(item?.listened_percent || 0);
          return (
            <div
              key={day}
              className={`grid aspect-square min-h-10 place-items-center rounded-lg border text-xs font-semibold ${
                completed
                  ? "border-[#0aa06e] bg-[#0aa06e] text-white"
                  : started
                    ? "border-[#d8a72e] bg-[#fff4cf] text-[#815b00]"
                    : "border-[#ddd8cc] bg-[#faf9f6] text-[#667085]"
              }`}
              title={
                completed
                  ? `Día ${day}: cumplido`
                  : started
                    ? `Día ${day}: ${percent} % escuchado`
                    : `Día ${day}: sin iniciar`
              }
            >
              <span>{day}</span>
              {started && <small className="-mt-1 text-[9px] leading-none">{percent}%</small>}
            </div>
          );
        })}
      </div>
      {completedDays > 0 && (
        <div className="mt-5 overflow-hidden rounded-xl border border-[#e5e9ef]">
          <div className="bg-[#f8f6f1] px-4 py-2 text-sm font-semibold text-[#0b2942]">
            Finalización de los audios
          </div>
          <div className="divide-y divide-[#edf0f3]">
            {progress
              .filter((item) => item.status === "completed")
              .sort((a, b) => a.day_number - b.day_number)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm"
                >
                  <span className="font-semibold text-[#0b2942]">
                    Audio del día {item.day_number}
                  </span>
                  <span className="text-[#667085]">
                    {formatDate(item.completed_at || item.updated_at)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#667085]">
        <span className="flex items-center gap-1.5">
          <i className="size-2.5 rounded-full bg-[#0aa06e]" /> Cumplido
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-2.5 rounded-full bg-[#d8a72e]" /> En progreso
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-2.5 rounded-full border border-[#bbb5a8] bg-[#faf9f6]" /> Sin iniciar
        </span>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Headphones;
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
