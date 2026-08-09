import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

type Mode = "stages" | "days";
const emptyStage = {
  stage_number: 1,
  title: "",
  motto: "",
  description: "",
  start_day: 1,
  end_day: 7,
  accent_color: "",
  hero_image: "",
};
const emptyDay = {
  stage_id: "none",
  day_number: 1,
  title: "",
  subtitle: "",
  objective: "",
  motto: "",
  hero_image: "",
  introduction: "",
  teaching: "",
  church_teaching: "",
  meditation: "",
  purpose: "",
  prayer: "",
  progressive_consecration: "",
  estimated_minutes: 25,
  status: "draft",
};

export function StageDayManager({ mode, consecrationId }: { mode: Mode; consecrationId: string }) {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [stageForm, setStageForm] = useState(emptyStage);
  const [dayForm, setDayForm] = useState(emptyDay);
  const stages = useQuery({
    queryKey: ["admin-stages", consecrationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consecration_stages")
        .select("*")
        .eq("consecration_id", consecrationId)
        .order("stage_number");
      if (error) throw error;
      return data ?? [];
    },
  });
  const days = useQuery({
    queryKey: ["admin-days", consecrationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consecration_days")
        .select("*")
        .eq("consecration_id", consecrationId)
        .order("day_number");
      if (error) throw error;
      return data ?? [];
    },
  });
  useEffect(() => {
    setSelected(null);
    setStageForm(emptyStage);
    setDayForm(emptyDay);
  }, [mode, consecrationId]);
  const refresh = async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["admin-stages", consecrationId] }),
      qc.invalidateQueries({ queryKey: ["admin-days", consecrationId] }),
      qc.invalidateQueries({ queryKey: ["admin-dashboard"] }),
      qc.invalidateQueries({ queryKey: [mode, consecrationId] }),
    ]);
  };
  const save = useMutation({
    mutationFn: async () => {
      if (mode === "stages") {
        if (!stageForm.title.trim()) throw new Error("Escribe el título de la etapa.");
        const payload = {
          ...stageForm,
          consecration_id: consecrationId,
          title: stageForm.title.trim(),
          motto: stageForm.motto.trim() || null,
          description: stageForm.description.trim() || null,
          accent_color: stageForm.accent_color.trim() || null,
          hero_image: stageForm.hero_image.trim() || null,
        };
        const r = selected
          ? await supabase.from("consecration_stages").update(payload).eq("id", selected)
          : await supabase.from("consecration_stages").insert(payload);
        if (r.error) throw r.error;
      } else {
        if (!dayForm.title.trim()) throw new Error("Escribe el título del día.");
        const nullable = (v: string) => v.trim() || null;
        const payload = {
          ...dayForm,
          consecration_id: consecrationId,
          stage_id: dayForm.stage_id === "none" ? null : dayForm.stage_id,
          title: dayForm.title.trim(),
          subtitle: nullable(dayForm.subtitle),
          objective: nullable(dayForm.objective),
          motto: nullable(dayForm.motto),
          hero_image: nullable(dayForm.hero_image),
          introduction: nullable(dayForm.introduction),
          teaching: nullable(dayForm.teaching),
          church_teaching: nullable(dayForm.church_teaching),
          meditation: nullable(dayForm.meditation),
          purpose: nullable(dayForm.purpose),
          prayer: nullable(dayForm.prayer),
          progressive_consecration: nullable(dayForm.progressive_consecration),
          published_at: dayForm.status === "published" ? new Date().toISOString() : null,
        };
        const r = selected
          ? await supabase.from("consecration_days").update(payload).eq("id", selected)
          : await supabase.from("consecration_days").insert(payload);
        if (r.error) throw r.error;
      }
    },
    onSuccess: async () => {
      await refresh();
      reset();
      toast.success(mode === "stages" ? "Etapa guardada" : "Día guardado");
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async () => {
      if (!selected) return;
      const r =
        mode === "stages"
          ? await supabase.from("consecration_stages").delete().eq("id", selected)
          : await supabase.from("consecration_days").delete().eq("id", selected);
      if (r.error) throw r.error;
    },
    onSuccess: async () => {
      await refresh();
      reset();
      toast.success("Registro eliminado");
    },
    onError: (e) => toast.error(e.message),
  });
  function reset() {
    setSelected(null);
    setStageForm(emptyStage);
    setDayForm(emptyDay);
  }
  function chooseStage(item: typeof stages.data extends Array<infer T> ? T : never) {
    setSelected(item.id);
    setStageForm({
      stage_number: item.stage_number,
      title: item.title,
      motto: item.motto ?? "",
      description: item.description ?? "",
      start_day: item.start_day,
      end_day: item.end_day,
      accent_color: item.accent_color ?? "",
      hero_image: item.hero_image ?? "",
    });
  }
  function chooseDay(item: typeof days.data extends Array<infer T> ? T : never) {
    setSelected(item.id);
    setDayForm({
      stage_id: item.stage_id ?? "none",
      day_number: item.day_number,
      title: item.title,
      subtitle: item.subtitle ?? "",
      objective: item.objective ?? "",
      motto: item.motto ?? "",
      hero_image: item.hero_image ?? "",
      introduction: item.introduction ?? "",
      teaching: item.teaching ?? "",
      church_teaching: item.church_teaching ?? "",
      meditation: item.meditation ?? "",
      purpose: item.purpose ?? "",
      prayer: item.prayer ?? "",
      progressive_consecration: item.progressive_consecration ?? "",
      estimated_minutes: item.estimated_minutes,
      status: item.status,
    });
  }
  const list = mode === "stages" ? stages.data : days.data;
  return (
    <div className="grid gap-5 xl:grid-cols-[.72fr_1.28fr]">
      <section className="surface-sacred rounded-2xl border border-white/10">
        <header className="flex items-center justify-between border-b border-white/10 p-4">
          <h2 className="font-semibold">{mode === "stages" ? "Etapas" : "Días y enseñanzas"}</h2>
          <Button size="sm" variant="outline" onClick={reset}>
            <Plus />
            Nuevo
          </Button>
        </header>
        <div className="max-h-[720px] space-y-2 overflow-auto p-4">
          {list?.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                mode === "stages" ? chooseStage(item as never) : chooseDay(item as never)
              }
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${selected === item.id ? "border-[#d6a642] bg-[#d6a642]/10" : "border-white/10"}`}
            >
              <b className="grid size-9 place-items-center rounded-full bg-[#c99a3d] text-[#061426]">
                {mode === "stages"
                  ? "stage_number" in item
                    ? item.stage_number
                    : ""
                  : "day_number" in item
                    ? item.day_number
                    : ""}
              </b>
              <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
              <Pencil className="size-4" />
            </button>
          ))}
        </div>
      </section>
      <section className="surface-sacred rounded-2xl border border-white/10">
        <header className="border-b border-white/10 p-4">
          <h2 className="font-semibold">
            {selected ? "Editar" : "Crear"} {mode === "stages" ? "etapa" : "día"}
          </h2>
        </header>
        <form
          className="space-y-4 p-4"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          {mode === "stages" ? (
            <StageForm form={stageForm} set={setStageForm} />
          ) : (
            <DayForm form={dayForm} set={setDayForm} stages={stages.data ?? []} />
          )}
          <div className="flex justify-between pt-2">
            {selected ? (
              <Button
                type="button"
                variant="destructive"
                disabled={remove.isPending}
                onClick={() =>
                  confirm("¿Eliminar este registro definitivamente?") && remove.mutate()
                }
              >
                <Trash2 />
                Eliminar
              </Button>
            ) : (
              <span />
            )}
            <Button disabled={save.isPending} className="bg-[#c99a3d] text-[#061426]">
              <Save />
              Guardar
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
function StageForm({
  form,
  set,
}: {
  form: typeof emptyStage;
  set: (v: typeof emptyStage) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Etapa">
          <Input
            type="number"
            min={1}
            value={form.stage_number}
            onChange={(e) => set({ ...form, stage_number: Number(e.target.value) })}
          />
        </Field>
        <Field label="Día inicial">
          <Input
            type="number"
            min={1}
            value={form.start_day}
            onChange={(e) => set({ ...form, start_day: Number(e.target.value) })}
          />
        </Field>
        <Field label="Día final">
          <Input
            type="number"
            min={1}
            value={form.end_day}
            onChange={(e) => set({ ...form, end_day: Number(e.target.value) })}
          />
        </Field>
      </div>
      <Field label="Título">
        <Input value={form.title} onChange={(e) => set({ ...form, title: e.target.value })} />
      </Field>
      <Field label="Lema">
        <Input value={form.motto} onChange={(e) => set({ ...form, motto: e.target.value })} />
      </Field>
      <Field label="Descripción">
        <Textarea
          rows={5}
          value={form.description}
          onChange={(e) => set({ ...form, description: e.target.value })}
        />
      </Field>
      <Field label="URL de imagen">
        <Input
          type="url"
          value={form.hero_image}
          onChange={(e) => set({ ...form, hero_image: e.target.value })}
        />
      </Field>
      <Field label="Color identificador">
        <Input
          placeholder="stage-1 o #c99a3d"
          value={form.accent_color}
          onChange={(e) => set({ ...form, accent_color: e.target.value })}
        />
      </Field>
    </>
  );
}
function DayForm({
  form,
  set,
  stages,
}: {
  form: typeof emptyDay;
  set: (v: typeof emptyDay) => void;
  stages: Array<{ id: string; stage_number: number; title: string }>;
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Número">
          <Input
            type="number"
            min={1}
            value={form.day_number}
            onChange={(e) => set({ ...form, day_number: Number(e.target.value) })}
          />
        </Field>
        <Field label="Etapa">
          <Select value={form.stage_id} onValueChange={(v) => set({ ...form, stage_id: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin etapa</SelectItem>
              {stages.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.stage_number}. {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Estado">
          <Select value={form.status} onValueChange={(v) => set({ ...form, status: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field label="Título">
        <Input value={form.title} onChange={(e) => set({ ...form, title: e.target.value })} />
      </Field>
      <Field label="Subtítulo">
        <Input value={form.subtitle} onChange={(e) => set({ ...form, subtitle: e.target.value })} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Objetivo">
          <Textarea
            rows={3}
            value={form.objective}
            onChange={(e) => set({ ...form, objective: e.target.value })}
          />
        </Field>
        <Field label="Lema">
          <Textarea
            rows={3}
            value={form.motto}
            onChange={(e) => set({ ...form, motto: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Introducción">
        <Textarea
          rows={4}
          value={form.introduction}
          onChange={(e) => set({ ...form, introduction: e.target.value })}
        />
      </Field>
      <Field label="Enseñanza">
        <Textarea
          rows={8}
          value={form.teaching}
          onChange={(e) => set({ ...form, teaching: e.target.value })}
        />
      </Field>
      <Field label="Enseñanza de la Iglesia">
        <Textarea
          rows={5}
          value={form.church_teaching}
          onChange={(e) => set({ ...form, church_teaching: e.target.value })}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Meditación">
          <Textarea
            rows={5}
            value={form.meditation}
            onChange={(e) => set({ ...form, meditation: e.target.value })}
          />
        </Field>
        <Field label="Propósito">
          <Textarea
            rows={5}
            value={form.purpose}
            onChange={(e) => set({ ...form, purpose: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Oración">
        <Textarea
          rows={5}
          value={form.prayer}
          onChange={(e) => set({ ...form, prayer: e.target.value })}
        />
      </Field>
      <Field label="Consagración progresiva">
        <Textarea
          rows={5}
          value={form.progressive_consecration}
          onChange={(e) => set({ ...form, progressive_consecration: e.target.value })}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="URL de imagen">
          <Input
            type="url"
            value={form.hero_image}
            onChange={(e) => set({ ...form, hero_image: e.target.value })}
          />
        </Field>
        <Field label="Duración estimada">
          <Input
            type="number"
            min={1}
            value={form.estimated_minutes}
            onChange={(e) => set({ ...form, estimated_minutes: Number(e.target.value) })}
          />
        </Field>
      </div>
    </>
  );
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
