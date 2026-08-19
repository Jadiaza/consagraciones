import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Braces,
  CheckCircle2,
  Clipboard,
  FileText,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  WandSparkles,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { DayRelatedContentManager } from "@/components/admin/DayRelatedContentManager";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [dayEditorView, setDayEditorView] = useState<"form" | "json">("form");
  const [dayJson, setDayJson] = useState(() => JSON.stringify(emptyDay, null, 2));
  const [dayJsonError, setDayJsonError] = useState<string | null>(null);
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
    setDayEditorView("form");
    setDayJson(JSON.stringify(emptyDay, null, 2));
    setDayJsonError(null);
  }, [mode, consecrationId]);
  const refresh = async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["admin-stages", consecrationId] }),
      qc.invalidateQueries({ queryKey: ["admin-days", consecrationId] }),
      qc.invalidateQueries({ queryKey: ["admin-dashboard"] }),
      qc.invalidateQueries({ queryKey: [mode, consecrationId] }),
      qc.invalidateQueries({ queryKey: ["day"] }),
      qc.invalidateQueries({ queryKey: ["days"] }),
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
        if (dayJsonError) throw new Error("Corrige el JSON antes de guardar.");
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
          ? await supabase
              .from("consecration_days")
              .update(payload)
              .eq("id", selected)
              .eq("consecration_id", consecrationId)
              .select("id,consecration_id,day_number,status")
              .single()
          : await supabase
              .from("consecration_days")
              .insert(payload)
              .select("id,consecration_id,day_number,status")
              .single();
        if (r.error) throw r.error;
        if (!r.data) throw new Error("Supabase no confirmó el día guardado.");
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
    setDayEditorView("form");
    setDayJson(JSON.stringify(emptyDay, null, 2));
    setDayJsonError(null);
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
    const next = {
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
    };
    setDayForm(next);
    setDayJson(JSON.stringify(next, null, 2));
    setDayJsonError(null);
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
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${selected === item.id ? "border-[#d4af37]/60 bg-[#fef3c7]/55" : "border-slate-200 bg-[#f8fafc] hover:bg-[#eef3f8]"}`}
            >
              <b className="grid size-9 place-items-center rounded-full bg-[#c99c45] text-[#14202b]">
                {mode === "stages"
                  ? "stage_number" in item
                    ? item.stage_number
                    : ""
                  : "day_number" in item
                    ? item.day_number
                    : ""}
              </b>
              <span className="min-w-0 flex-1 text-sm">
                <span className="block truncate font-medium">{item.title}</span>
                {selected === item.id && mode === "stages" && "description" in item && (
                  <span className="mt-1.5 block whitespace-pre-wrap text-xs leading-relaxed text-white/65">
                    {item.description?.trim() || "Sin descripción registrada."}
                  </span>
                )}
              </span>
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
            <>
              <Tabs
                value={dayEditorView}
                onValueChange={(value) => {
                  const next = value as "form" | "json";
                  setDayEditorView(next);
                  if (next === "json") setDayJson(JSON.stringify(dayForm, null, 2));
                }}
              >
                <TabsList className="grid w-full grid-cols-2 border border-slate-200 bg-[#eef3f8] text-slate-600">
                  <TabsTrigger value="form">
                    <FileText className="size-4" />
                    Formulario
                  </TabsTrigger>
                  <TabsTrigger value="json">
                    <Braces className="size-4" />
                    JSON
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="form" className="space-y-4 pt-3">
                  <DayForm form={dayForm} set={setDayForm} stages={stages.data ?? []} />
                </TabsContent>
                <TabsContent value="json" className="space-y-3 pt-3">
                  <div className="rounded-xl border border-[#d4af37]/25 bg-[#fef3c7]/55 p-3 text-xs leading-relaxed text-slate-600">
                    <b className="mb-1 block text-[#8a6200]">Editor estructurado del día</b>
                    Los cambios se sincronizan cuando el JSON es válido. Para dar formato dentro de
                    un texto use <code>## Título</code>, <code>### Subtítulo</code>,{" "}
                    <code>**negrita**</code>, <code>*cursiva*</code>, <code>&gt; cita</code> o{" "}
                    <code>- lista</code>.
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        try {
                          const formatted = JSON.stringify(JSON.parse(dayJson), null, 2);
                          setDayJson(formatted);
                          const parsed = normalizeDayJson(
                            JSON.parse(formatted),
                            (stages.data ?? []).map((stage) => stage.id),
                          );
                          setDayForm(parsed);
                          setDayJsonError(null);
                          toast.success("JSON formateado y validado.");
                        } catch (error) {
                          setDayJsonError(readJsonError(error));
                        }
                      }}
                    >
                      <WandSparkles /> Formatear
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await navigator.clipboard.writeText(dayJson);
                        toast.success("JSON copiado.");
                      }}
                    >
                      <Clipboard /> Copiar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setDayJson(JSON.stringify(dayForm, null, 2));
                        setDayJsonError(null);
                        toast.success("JSON restaurado desde el formulario.");
                      }}
                    >
                      <RotateCcw /> Restaurar
                    </Button>
                    <span className="ml-auto text-xs text-white/45">
                      {dayJson.split("\n").length} líneas · {dayJson.length.toLocaleString("es-CO")}{" "}
                      caracteres
                    </span>
                  </div>
                  <Textarea
                    className={`min-h-[620px] font-mono text-xs leading-relaxed ${
                      dayJsonError
                        ? "border-red-400/60 focus-visible:ring-red-400"
                        : "border-emerald-400/25"
                    }`}
                    spellCheck={false}
                    value={dayJson}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDayJson(value);
                      try {
                        const parsed = normalizeDayJson(
                          JSON.parse(value),
                          (stages.data ?? []).map((stage) => stage.id),
                        );
                        setDayForm(parsed);
                        setDayJsonError(null);
                      } catch (error) {
                        setDayJsonError(readJsonError(error));
                      }
                    }}
                  />
                  {dayJsonError ? (
                    <p role="alert" className="text-sm font-medium text-red-700">
                      {dayJsonError}
                    </p>
                  ) : (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="size-4" /> JSON válido y sincronizado con el
                      formulario.
                    </p>
                  )}
                  <details className="rounded-xl border border-slate-200 bg-[#f8fafc] p-3 text-xs text-slate-600">
                    <summary className="cursor-pointer font-semibold text-[#8a6200]">
                      Ver reglas de los campos JSON
                    </summary>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5">
                      <li>
                        <code>day_number</code>: número entero entre 1 y 33.
                      </li>
                      <li>
                        <code>estimated_minutes</code>: número entero entre 1 y 240.
                      </li>
                      <li>
                        <code>status</code>: solamente <code>draft</code> o <code>published</code>.
                      </li>
                      <li>
                        <code>stage_id</code>: debe corresponder a una etapa existente o ser{" "}
                        <code>none</code>.
                      </li>
                      <li>Los nombres de los campos deben conservarse exactamente.</li>
                    </ul>
                  </details>
                </TabsContent>
              </Tabs>
              {selected ? (
                <DayRelatedContentManager dayId={selected} consecrationId={consecrationId} />
              ) : (
                <div className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-white/55">
                  Guarda primero el día para agregar lecturas, referencias, preguntas, secciones y
                  multimedia.
                </div>
              )}
            </>
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
            <Button
              disabled={save.isPending || Boolean(dayJsonError)}
              className="bg-gradient-to-r from-[#f3c756] to-[#d4af37] text-[#07182a] shadow-sm hover:brightness-105"
            >
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
          <RichTextEditor
            rows={3}
            value={form.objective}
            onChange={(value) => set({ ...form, objective: value })}
          />
        </Field>
        <Field label="Lema">
          <Textarea
            rows={3}
            value={form.motto}
            onChange={(event) => set({ ...form, motto: event.target.value })}
          />
        </Field>
      </div>
      <Field label="Introducción">
        <RichTextEditor
          rows={4}
          value={form.introduction}
          onChange={(value) => set({ ...form, introduction: value })}
        />
      </Field>
      <Field label="Enseñanza">
        <RichTextEditor
          rows={8}
          value={form.teaching}
          onChange={(value) => set({ ...form, teaching: value })}
        />
      </Field>
      <Field label="Enseñanza de la Iglesia">
        <RichTextEditor
          rows={5}
          value={form.church_teaching}
          onChange={(value) => set({ ...form, church_teaching: value })}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Meditación">
          <RichTextEditor
            rows={5}
            value={form.meditation}
            onChange={(value) => set({ ...form, meditation: value })}
          />
        </Field>
        <Field label="Propósito">
          <RichTextEditor
            rows={5}
            value={form.purpose}
            onChange={(value) => set({ ...form, purpose: value })}
          />
        </Field>
      </div>
      <Field label="Oración">
        <RichTextEditor
          rows={5}
          value={form.prayer}
          onChange={(value) => set({ ...form, prayer: value })}
        />
      </Field>
      <Field label="Consagración progresiva">
        <RichTextEditor
          rows={5}
          value={form.progressive_consecration}
          onChange={(value) => set({ ...form, progressive_consecration: value })}
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

const DAY_JSON_KEYS = Object.keys(emptyDay) as Array<keyof typeof emptyDay>;

function normalizeDayJson(value: unknown, allowedStageIds: string[]): typeof emptyDay {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("El contenido debe ser un objeto JSON.");
  }
  const source = value as Record<string, unknown>;
  const unknownKeys = Object.keys(source).filter(
    (key) => !DAY_JSON_KEYS.includes(key as keyof typeof emptyDay),
  );
  if (unknownKeys.length) {
    throw new Error(`Campo desconocido: ${unknownKeys.join(", ")}. Revisa su escritura.`);
  }
  const missingKeys = DAY_JSON_KEYS.filter((key) => !(key in source));
  if (missingKeys.length) {
    throw new Error(`Faltan campos requeridos: ${missingKeys.join(", ")}.`);
  }
  const text = (key: keyof typeof emptyDay) => {
    const current = source[key];
    if (typeof current !== "string") throw new Error(`El campo ${key} debe ser texto.`);
    return current;
  };
  const integer = (key: keyof typeof emptyDay, min: number, max: number) => {
    const current = source[key];
    if (!Number.isInteger(current) || Number(current) < min || Number(current) > max) {
      throw new Error(`El campo ${key} debe ser un número entero entre ${min} y ${max}.`);
    }
    return Number(current);
  };
  const status = text("status");
  if (status !== "draft" && status !== "published") {
    throw new Error('El campo status debe ser "draft" o "published".');
  }
  const stageId = text("stage_id");
  if (stageId !== "none" && !allowedStageIds.includes(stageId)) {
    throw new Error('El campo stage_id no corresponde a una etapa existente; use "none".');
  }
  if (!text("title").trim()) throw new Error("El campo title no puede estar vacío.");
  return {
    stage_id: stageId,
    day_number: integer("day_number", 1, 33),
    title: text("title"),
    subtitle: text("subtitle"),
    objective: text("objective"),
    motto: text("motto"),
    hero_image: text("hero_image"),
    introduction: text("introduction"),
    teaching: text("teaching"),
    church_teaching: text("church_teaching"),
    meditation: text("meditation"),
    purpose: text("purpose"),
    prayer: text("prayer"),
    progressive_consecration: text("progressive_consecration"),
    estimated_minutes: integer("estimated_minutes", 1, 240),
    status,
  };
}

function readJsonError(error: unknown) {
  return error instanceof Error ? error.message : "El JSON no es válido.";
}
