import { Braces, CheckCircle2, Clipboard, FileText, RotateCcw, WandSparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type JsonRecord = Record<string, unknown>;

export function StructuredContentEditor<T extends JsonRecord>({
  value,
  onChange,
  children,
  title = "Editor estructurado",
  jsonRows = 24,
}: {
  value: T;
  onChange: (value: T) => void;
  children: ReactNode;
  title?: string;
  jsonRows?: number;
}) {
  const [view, setView] = useState<"form" | "json">("form");
  const [json, setJson] = useState(() => JSON.stringify(value, null, 2));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (view === "form") setJson(JSON.stringify(value, null, 2));
  }, [value, view]);

  const parse = (source: string) => {
    const parsed = JSON.parse(source) as unknown;
    const normalized = validateShape(parsed, value) as T;
    onChange(normalized);
    setError(null);
    return normalized;
  };

  return (
    <Tabs
      value={view}
      onValueChange={(next) => {
        const selected = next as "form" | "json";
        if (selected === "json") setJson(JSON.stringify(value, null, 2));
        setView(selected);
      }}
    >
      <TabsList className="grid w-full grid-cols-2 border border-slate-200 bg-[#eef3f8] text-slate-600">
        <TabsTrigger value="form">
          <FileText className="size-4" /> Formulario
        </TabsTrigger>
        <TabsTrigger value="json">
          <Braces className="size-4" /> JSON
        </TabsTrigger>
      </TabsList>
      <TabsContent value="form" className="space-y-4 pt-3">
        {children}
      </TabsContent>
      <TabsContent value="json" className="space-y-3 pt-3">
        <div className="rounded-xl border border-[#d4af37]/25 bg-[#fef3c7]/55 p-3 text-xs leading-relaxed text-slate-600">
          <b className="mb-1 block text-[#8a6200]">{title}</b>
          El JSON se sincroniza con el formulario cuando es válido. Conserva los nombres y tipos de
          los campos. En los textos puedes usar Markdown: <code>## Título</code>,{` `}
          <code>**negrita**</code>, <code>*cursiva*</code>, <code>&gt; cita</code> y{` `}
          <code>- lista</code>.
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              try {
                const formatted = JSON.stringify(JSON.parse(json), null, 2);
                parse(formatted);
                setJson(formatted);
                toast.success("JSON formateado y validado.");
              } catch (currentError) {
                setError(readError(currentError));
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
              await navigator.clipboard.writeText(json);
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
              setJson(JSON.stringify(value, null, 2));
              setError(null);
            }}
          >
            <RotateCcw /> Restaurar
          </Button>
          <span className="ml-auto text-xs text-slate-500">
            {json.split("\n").length} líneas · {json.length.toLocaleString("es-CO")} caracteres
          </span>
        </div>
        <Textarea
          rows={jsonRows}
          className={`font-mono text-xs leading-relaxed ${
            error ? "border-red-400/60 focus-visible:ring-red-400" : "border-emerald-400/40"
          }`}
          spellCheck={false}
          value={json}
          onChange={(event) => {
            const source = event.target.value;
            setJson(source);
            try {
              parse(source);
            } catch (currentError) {
              setError(readError(currentError));
            }
          }}
        />
        {error ? (
          <p role="alert" className="text-sm font-medium text-red-700">
            {error}
          </p>
        ) : (
          <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="size-4" /> JSON válido y sincronizado con el formulario.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}

function validateShape(parsed: unknown, template: JsonRecord): JsonRecord {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("El contenido debe ser un objeto JSON.");
  }
  const source = parsed as JsonRecord;
  const expectedKeys = Object.keys(template);
  const unknown = Object.keys(source).filter((key) => !expectedKeys.includes(key));
  if (unknown.length) throw new Error(`Campos desconocidos: ${unknown.join(", ")}.`);
  const missing = expectedKeys.filter((key) => !(key in source));
  if (missing.length) throw new Error(`Faltan campos: ${missing.join(", ")}.`);
  for (const key of expectedKeys) {
    if (typeof source[key] !== typeof template[key]) {
      throw new Error(`El campo ${key} debe ser de tipo ${typeName(template[key])}.`);
    }
  }
  return source;
}

function typeName(value: unknown) {
  if (typeof value === "string") return "texto";
  if (typeof value === "number") return "número";
  if (typeof value === "boolean") return "booleano";
  return typeof value;
}

function readError(error: unknown) {
  if (error instanceof SyntaxError) return `JSON inválido: ${error.message}`;
  return error instanceof Error ? error.message : "El JSON no es válido.";
}
