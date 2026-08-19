import { Fragment, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type Block =
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "quote"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "paragraph"; text: string };

export function SacredText({
  children,
  className,
}: {
  children?: string | null;
  className?: string;
}) {
  if (!children?.trim()) return null;
  const blocks = parseBlocks(children);

  return (
    <div className={cn("sacred-text", className)}>
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;
        if (block.kind === "heading") {
          const Heading = block.level === 2 ? "h3" : "h4";
          return (
            <Heading
              key={key}
              className={block.level === 2 ? "sacred-heading" : "sacred-subheading"}
            >
              {renderInline(block.text)}
            </Heading>
          );
        }
        if (block.kind === "quote") {
          return <blockquote key={key}>{renderInline(block.text)}</blockquote>;
        }
        if (block.kind === "list") {
          const List = block.ordered ? "ol" : "ul";
          return (
            <List key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInline(item)}</li>
              ))}
            </List>
          );
        }
        return <p key={key}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}

function parseBlocks(value: string): Block[] {
  const normalized = value.replace(/\r\n?/g, "\n").trim();
  const chunks = normalized.split(/\n\s*\n/);
  const result: Block[] = [];

  for (const chunk of chunks) {
    const lines = chunk
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) continue;

    const allListItems = lines.every((line) => /^[-*•]\s+/.test(line));
    const allNumberedItems = lines.every((line) => /^\d+[.)]\s+/.test(line));
    if (allListItems || allNumberedItems) {
      result.push({
        kind: "list",
        ordered: allNumberedItems,
        items: lines.map((line) =>
          line.replace(allNumberedItems ? /^\d+[.)]\s+/ : /^[-*•]\s+/, ""),
        ),
      });
      continue;
    }

    for (const line of lines) {
      const markdownHeading = line.match(/^(#{1,3})\s+(.+)$/);
      if (markdownHeading) {
        result.push({
          kind: "heading",
          level: markdownHeading[1].length <= 2 ? 2 : 3,
          text: cleanHeading(markdownHeading[2]),
        });
        continue;
      }

      if (isVisualHeading(line)) {
        result.push({ kind: "heading", level: 2, text: cleanHeading(line) });
        continue;
      }
      if (/^>\s?/.test(line)) {
        result.push({ kind: "quote", text: line.replace(/^>\s?/, "") });
        continue;
      }
      result.push({ kind: "paragraph", text: line });
    }
  }
  return result;
}

function isVisualHeading(line: string) {
  const plain = cleanHeading(line);
  if (plain.length < 3 || plain.length > 110) return false;
  if (/^\d+(?:\.\d+)*[.)]?\s+[A-ZÁÉÍÓÚÑ¿¡]/.test(plain)) return true;
  if (/^([IVXLCDM]+|PRIMERO|SEGUNDO|TERCERO|CUARTO|QUINTO)[.:\s-]+/i.test(plain)) return true;
  if (/^\*\*[^*]+\*\*$/.test(line)) return true;
  const letters = plain.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "");
  return letters.length >= 4 && letters === letters.toLocaleUpperCase("es");
}

function cleanHeading(value: string) {
  return value
    .replace(/^\*\*|\*\*$/g, "")
    .replace(/:$/, "")
    .trim();
}

function renderInline(value: string): ReactNode {
  const tokens = value.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }
    return <Fragment key={index}>{token}</Fragment>;
  });
}
