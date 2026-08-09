import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

type Value = string | number | boolean;
type Form = Record<string, Value>;
type Field = {
  key: string;
  label: string;
  kind?: "text" | "textarea" | "number" | "url" | "checkbox" | "select";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
};
type Config = {
  table:
    | "scripture_references"
    | "doctrinal_references"
    | "examination_questions"
    | "consecration_day_sections"
    | "media_assets";
  title: string;
  singular: string;
  fields: Field[];
  defaults: Form;
  label: (row: Record<string, unknown>) => string;
  orderBy?: string;
  extra?: (consecrationId: string) => Record<string, unknown>;
};

const configs: Config[] = [
  {
    table: "scripture_references",
    title: "Palabra de Dios",
    singular: "lectura bíblica",
    orderBy: "sort_order",
    defaults: { citation: "", passage: "", commentary: "", sort_order: 0 },
    label: (row) => String(row.citation || "Lectura sin cita"),
    fields: [
      { key: "citation", label: "Cita bíblica", required: true },
      { key: "passage", label: "Texto bíblico", kind: "textarea" },
      { key: "commentary", label: "Comentario", kind: "textarea" },
      { key: "sort_order", label: "Orden", kind: "number" },
    ],
  },
  {
    table: "doctrinal_references",
    title: "Referencias doctrinales",
    singular: "referencia doctrinal",
    orderBy: "sort_order",
    defaults: {
      reference_type: "catecismo",
      author: "",
      work: "",
      reference: "",
      excerpt: "",
      commentary: "",
      source_url: "",
      sort_order: 0,
    },
    label: (row) => String(row.reference || row.work || row.author || "Referencia doctrinal"),
    fields: [
      {
        key: "reference_type",
        label: "Tipo",
        kind: "select",
        required: true,
        options: [
          { value: "catecismo", label: "Catecismo" },
          { value: "magisterio", label: "Magisterio" },
          { value: "santo", label: "Santo / autor espiritual" },
          { value: "concilio", label: "Concilio" },
          { value: "otro", label: "Otro" },
        ],
      },
      { key: "author", label: "Autor" },
      { key: "work", label: "Obra" },
      { key: "reference", label: "Referencia" },
      { key: "excerpt", label: "Extracto", kind: "textarea" },
      { key: "commentary", label: "Comentario", kind: "textarea" },
      { key: "source_url", label: "URL de la fuente", kind: "url" },
      { key: "sort_order", label: "Orden", kind: "number" },
    ],
  },
  {
    table: "examination_questions",
    title: "Examen espiritual",
    singular: "pregunta",
    orderBy: "sort_order",
    defaults: { question: "", sort_order: 0 },
    label: (row) => String(row.question || "Pregunta sin texto"),
    fields: [
      { key: "question", label: "Pregunta", kind: "textarea", required: true },
      { key: "sort_order", label: "Orden", kind: "number" },
    ],
  },
  {
    table: "consecration_day_sections",
    title: "Secciones adicionales",
    singular: "sección",
    orderBy: "sort_order",
    defaults: { section_type: "reflection", title: "", body: "", sort_order: 0 },
    label: (row) => String(row.title || row.section_type || "Sección"),
    fields: [
      {
        key: "section_type",
        label: "Tipo de sección",
        kind: "select",
        required: true,
        options: [
          { value: "reflection", label: "Reflexión" },
          { value: "practice", label: "Práctica" },
          { value: "notice", label: "Aviso" },
          { value: "reading", label: "Lectura" },
          { value: "custom", label: "Personalizada" },
        ],
      },
      { key: "title", label: "Título" },
      { key: "body", label: "Contenido", kind: "textarea" },
      { key: "sort_order", label: "Orden", kind: "number" },
    ],
  },
  {
    table: "media_assets",
    title: "Multimedia",
    singular: "archivo multimedia",
    defaults: {
      asset_type: "podcast",
      provider: "cloudflare_r2",
      storage_key: "",
      public_url: "",
      mime_type: "",
      file_size: 0,
      width: 0,
      height: 0,
      duration_seconds: 0,
      alt_text: "",
      is_downloadable: false,
    },
    extra: (consecrationId) => ({ consecration_id: consecrationId }),
    label: (row) => String(row.alt_text || row.public_url || row.storage_key || "Multimedia"),
    fields: [
      {
        key: "asset_type",
        label: "Tipo",
        kind: "select",
        required: true,
        options: [
          { value: "podcast", label: "Podcast" },
          { value: "audio", label: "Audio" },
          { value: "video", label: "Video" },
          { value: "image", label: "Imagen" },
          { value: "document", label: "Documento" },
        ],
      },
      { key: "provider", label: "Proveedor", required: true },
      { key: "storage_key", label: "Clave o ruta del archivo", required: true },
      { key: "public_url", label: "URL pública", kind: "url" },
      { key: "mime_type", label: "Tipo MIME" },
      { key: "file_size", label: "Tamaño en bytes", kind: "number" },
      { key: "width", label: "Ancho en píxeles", kind: "number" },
      { key: "height", label: "Alto en píxeles", kind: "number" },
      { key: "duration_seconds", label: "Duración en segundos", kind: "number" },
      { key: "alt_text", label: "Descripción accesible" },
      { key: "is_downloadable", label: "Permitir descarga", kind: "checkbox" },
    ],
  },
];

export function DayRelatedContentManager({
  dayId,
  consecrationId,
}: {
  dayId: string;
  consecrationId: string;
}) {
  return (
    <div className="space-y-4 border-t border-white/10 pt-6">
      <div>
        <h3 className="font-display text-xl text-[#e2b85e]">Contenido complementario</h3>
        <p className="text-sm text-white/60">
          Estos registros alimentan directamente la pantalla pública de este día.
        </p>
      </div>
      {configs.map((config, index) => (
        <RelatedEditor
          key={config.table}
          config={config}
          dayId={dayId}
          consecrationId={consecrationId}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}

function RelatedEditor({
  config,
  dayId,
  consecrationId,
  defaultOpen,
}: {
  config: Config;
  dayId: string;
  consecrationId: string;
  defaultOpen: boolean;
}) {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>({ ...config.defaults });
  const [busy, setBusy] = useState(false);
  const client = supabase as unknown as { from: (table: string) => any };
  const queryKey = ["admin-day-related", config.table, dayId];
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      let request = client.from(config.table).select("*").eq("day_id", dayId);
      if (config.orderBy) request = request.order(config.orderBy);
      const { data, error } = await request;
      if (error) throw error;
      return (data ?? []) as Array<Record<string, unknown>>;
    },
  });

  const reset = () => {
    setSelectedId(null);
    setForm({ ...config.defaults });
  };
  const edit = (row: Record<string, unknown>) => {
    setSelectedId(String(row.id));
    const next = { ...config.defaults };
    for (const field of config.fields) {
      const value = row[field.key];
      next[field.key] = (value ?? config.defaults[field.key]) as Value;
    }
    setForm(next);
  };
  const save = async () => {
    for (const field of config.fields) {
      if (field.required && !String(form[field.key] ?? "").trim()) {
        toast.error(`Completa el campo: ${field.label}.`);
        return;
      }
    }
    setBusy(true);
    try {
      const payload: Record<string, unknown> = { day_id: dayId, ...config.extra?.(consecrationId) };
      for (const field of config.fields) {
        const value = form[field.key];
        payload[field.key] =
          field.kind === "number"
            ? Number(value || 0)
            : field.kind === "checkbox"
              ? Boolean(value)
              : String(value ?? "").trim() || null;
      }
      const request = selectedId
        ? client.from(config.table).update(payload).eq("id", selectedId)
        : client.from(config.table).insert(payload);
      const { error } = await request;
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.invalidateQueries({ queryKey: ["day"] });
      reset();
      toast.success(`${config.singular} guardada.`);
    } catch (error) {
      toast.error(readMessage(error));
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!selectedId || !confirm(`¿Eliminar esta ${config.singular}?`)) return;
    setBusy(true);
    try {
      const { error } = await client.from(config.table).delete().eq("id", selectedId);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.invalidateQueries({ queryKey: ["day"] });
      reset();
      toast.success("Registro eliminado.");
    } catch (error) {
      toast.error(readMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <details defaultOpen={defaultOpen} className="rounded-xl border border-white/10 bg-[#071d34]/55">
      <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-[#f5f1e8]">
        {config.title}{" "}
        <span className="ml-2 text-xs text-white/45">({query.data?.length ?? 0})</span>
      </summary>
      <div className="grid gap-4 border-t border-white/10 p-4 lg:grid-cols-[.8fr_1.2fr]">
        <div className="space-y-2">
          <Button type="button" size="sm" variant="outline" onClick={reset}>
            <Plus /> Nuevo
          </Button>
          {query.isLoading && <p className="text-sm text-white/55">Cargando…</p>}
          {query.error && <p className="text-sm text-red-300">{readMessage(query.error)}</p>}
          {query.data?.map((row) => (
            <button
              key={String(row.id)}
              type="button"
              onClick={() => edit(row)}
              className={`flex w-full items-center gap-2 rounded-lg border p-3 text-left text-sm ${selectedId === row.id ? "border-[#d6a642] bg-[#d6a642]/10" : "border-white/10"}`}
            >
              <span className="min-w-0 flex-1 truncate">{config.label(row)}</span>
              <Pencil className="size-4 shrink-0" />
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {config.fields.map((field) => (
            <EditorField
              key={field.key}
              field={field}
              value={form[field.key]}
              setValue={(value) => setForm({ ...form, [field.key]: value })}
            />
          ))}
          <div className="flex justify-between pt-2">
            {selectedId ? (
              <Button type="button" variant="destructive" disabled={busy} onClick={remove}>
                <Trash2 /> Eliminar
              </Button>
            ) : (
              <span />
            )}
            <Button
              type="button"
              disabled={busy}
              className="bg-[#c99a3d] text-[#061426]"
              onClick={save}
            >
              <Save /> Guardar
            </Button>
          </div>
        </div>
      </div>
    </details>
  );
}

function EditorField({
  field,
  value,
  setValue,
}: {
  field: Field;
  value: Value;
  setValue: (value: Value) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {field.label}
        {field.required ? " *" : ""}
      </Label>
      {field.kind === "textarea" ? (
        <Textarea
          rows={4}
          value={String(value ?? "")}
          onChange={(event) => setValue(event.target.value)}
        />
      ) : field.kind === "select" ? (
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={String(value ?? "")}
          onChange={(event) => setValue(event.target.value)}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.kind === "checkbox" ? (
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => setValue(event.target.checked)}
          />{" "}
          Sí
        </label>
      ) : (
        <Input
          type={field.kind === "number" ? "number" : field.kind === "url" ? "url" : "text"}
          value={String(value ?? "")}
          onChange={(event) =>
            setValue(field.kind === "number" ? Number(event.target.value) : event.target.value)
          }
        />
      )}
    </div>
  );
}

function readMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "No fue posible completar la operación.";
}
