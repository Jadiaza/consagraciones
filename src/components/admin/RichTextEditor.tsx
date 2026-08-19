import { Bold, Eye, Heading2, Heading3, Italic, List, ListOrdered, Quote } from "lucide-react";
import { useRef, useState } from "react";

import { SacredText } from "@/components/app/SacredText";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Format = "heading-2" | "heading-3" | "bold" | "italic" | "quote" | "bullet" | "number";

export function RichTextEditor({
  value,
  onChange,
  rows = 5,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  const applyFormat = (format: Format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const lineStart = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
    const lineEndIndex = value.indexOf("\n", end);
    const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
    let from = start;
    let to = end;
    let replacement = selected;

    if (format === "bold" || format === "italic") {
      const marker = format === "bold" ? "**" : "*";
      replacement = `${marker}${selected || "texto"}${marker}`;
    } else {
      from = lineStart;
      to = lineEnd;
      const lines = value.slice(lineStart, lineEnd).split("\n");
      const prefix =
        format === "heading-2"
          ? "## "
          : format === "heading-3"
            ? "### "
            : format === "quote"
              ? "> "
              : format === "bullet"
                ? "- "
                : "1. ";
      replacement = lines
        .map((line, index) => {
          const clean = line.replace(/^(#{1,3}|>|[-*•]|\d+[.)])\s+/, "");
          return format === "number" ? `${index + 1}. ${clean}` : `${prefix}${clean}`;
        })
        .join("\n");
    }

    const next = `${value.slice(0, from)}${replacement}${value.slice(to)}`;
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(from, from + replacement.length);
    });
  };

  const tools: Array<{ format: Format; label: string; icon: typeof Bold }> = [
    { format: "heading-2", label: "Título", icon: Heading2 },
    { format: "heading-3", label: "Subtítulo", icon: Heading3 },
    { format: "bold", label: "Negrita", icon: Bold },
    { format: "italic", label: "Cursiva", icon: Italic },
    { format: "quote", label: "Cita", icon: Quote },
    { format: "bullet", label: "Lista", icon: List },
    { format: "number", label: "Lista numerada", icon: ListOrdered },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-input">
      <div className="flex flex-wrap items-center gap-1 border-b border-white/8 bg-[#101f2d]/65 p-2">
        {tools.map(({ format, label, icon: Icon }) => (
          <button
            key={format}
            type="button"
            title={label}
            aria-label={label}
            className="inline-flex size-8 items-center justify-center rounded-md text-white/65 transition hover:bg-white/[.06] hover:text-[#d9b86f]"
            onClick={() => applyFormat(format)}
          >
            <Icon className="size-4" aria-hidden />
          </button>
        ))}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className={cn("ml-auto h-8 text-xs", preview && "text-[#e2b85e]")}
          onClick={() => setPreview((current) => !current)}
        >
          <Eye className="size-4" />
          {preview ? "Editar" : "Vista previa"}
        </Button>
      </div>
      {preview ? (
        <div className="min-h-32 bg-[#101f2d] p-4 text-[#eef2f5]">
          {value.trim() ? (
            <SacredText children={value} />
          ) : (
            <p className="text-sm text-white/45">No hay contenido para previsualizar.</p>
          )}
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          className="rounded-none border-0 bg-white text-[#172536] placeholder:text-slate-500 focus-visible:ring-0"
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}
