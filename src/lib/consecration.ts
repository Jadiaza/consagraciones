import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CONSECRATION_SLUG = "santos-arcangeles-33-dias";

export async function fetchConsecration(consecrationId?: string) {
  let query = supabase.from("consecrations").select("*");
  query = consecrationId ? query.eq("id", consecrationId) : query.eq("slug", CONSECRATION_SLUG);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
}

export const consecrationQuery = (consecrationId?: string) =>
  queryOptions({
    queryKey: ["consecration", consecrationId ?? CONSECRATION_SLUG],
    queryFn: () => fetchConsecration(consecrationId),
  });

export const publishedConsecrationsQuery = () =>
  queryOptions({
    queryKey: ["published-consecrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consecrations")
        .select("*")
        .eq("status", "published")
        .order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

export const stagesQuery = (consecrationId?: string) =>
  queryOptions({
    queryKey: ["stages", consecrationId ?? CONSECRATION_SLUG],
    queryFn: async () => {
      const consecration = await fetchConsecration(consecrationId);
      if (!consecration) return [];
      const { data, error } = await supabase
        .from("consecration_stages")
        .select("*")
        .eq("consecration_id", consecration.id)
        .order("stage_number");
      if (error) throw error;
      return data ?? [];
    },
  });

export const daysQuery = (consecrationId?: string) =>
  queryOptions({
    queryKey: ["days", consecrationId ?? CONSECRATION_SLUG],
    queryFn: async () => {
      const consecration = await fetchConsecration(consecrationId);
      if (!consecration) return [];
      const { data, error } = await supabase
        .from("consecration_days")
        .select("id, day_number, title, subtitle, stage_id, estimated_minutes, hero_image")
        .eq("consecration_id", consecration.id)
        .eq("status", "published")
        .order("day_number");
      if (error) throw error;
      return data ?? [];
    },
  });

export const dayQuery = (dayNumber: number, consecrationId?: string) =>
  queryOptions({
    queryKey: ["day", consecrationId ?? CONSECRATION_SLUG, dayNumber],
    queryFn: async () => {
      const consecration = await fetchConsecration(consecrationId);
      if (!consecration) return null;
      const { data: day, error } = await supabase
        .from("consecration_days")
        .select("*")
        .eq("consecration_id", consecration.id)
        .eq("day_number", dayNumber)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      if (!day) return null;
      const [scripture, doctrine, questions, sections, media, stage] = await Promise.all([
        supabase.from("scripture_references").select("*").eq("day_id", day.id).order("sort_order"),
        supabase.from("doctrinal_references").select("*").eq("day_id", day.id).order("sort_order"),
        supabase.from("examination_questions").select("*").eq("day_id", day.id).order("sort_order"),
        supabase
          .from("consecration_day_sections")
          .select("*")
          .eq("day_id", day.id)
          .order("sort_order"),
        supabase.from("media_assets").select("*").eq("day_id", day.id),
        day.stage_id
          ? supabase.from("consecration_stages").select("*").eq("id", day.stage_id).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      return {
        day,
        stage: stage.data ?? null,
        scripture: scripture.data ?? [],
        doctrine: doctrine.data ?? [],
        questions: questions.data ?? [],
        sections: sections.data ?? [],
        media: media.data ?? [],
      };
    },
  });

export const prayersQuery = (consecrationId?: string) =>
  queryOptions({
    queryKey: ["prayers", consecrationId ?? CONSECRATION_SLUG],
    queryFn: async () => {
      const consecration = await fetchConsecration(consecrationId);
      if (!consecration) return [];
      const { data, error } = await supabase
        .from("prayers")
        .select("*")
        .eq("consecration_id", consecration.id)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

export const resourcesQuery = (consecrationId?: string) =>
  queryOptions({
    queryKey: ["resources", consecrationId ?? "all"],
    queryFn: async () => {
      let query = supabase.from("resources").select("*").eq("status", "published");
      if (consecrationId) query = query.eq("consecration_id", consecrationId);
      const { data, error } = await query.order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

export const myConsecrationQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["my-consecration", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_consecrations")
        .select("*")
        .eq("user_id", userId!)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const myProgressQuery = (id: string | undefined) =>
  queryOptions({
    queryKey: ["my-progress", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_day_progress")
        .select("*")
        .eq("user_consecration_id", id!)
        .order("day_number");
      if (error) throw error;
      return data ?? [];
    },
  });

export function nextAvailableDay(
  progress: Array<{ day_number: number; completed: boolean }> | null | undefined,
) {
  const completed = new Set(
    (progress ?? []).filter((row) => row.completed).map((row) => row.day_number),
  );
  for (let day = 1; day <= 33; day += 1) {
    if (!completed.has(day)) return day;
  }
  return 33;
}
export const RESOURCE_CATEGORIES = [
  { key: "oraciones", label: "Oraciones" },
  { key: "biblia", label: "Biblia" },
  { key: "san-miguel", label: "San Miguel" },
  { key: "san-gabriel", label: "San Gabriel" },
  { key: "san-rafael", label: "San Rafael" },
  { key: "catequesis", label: "Catequesis" },
  { key: "combate-espiritual", label: "Combate espiritual" },
  { key: "vida-sacramental", label: "Vida sacramental" },
  { key: "maria", label: "María, Reina de los Ángeles" },
  { key: "eucaristia", label: "Eucaristía" },
  { key: "formacion", label: "Formación" },
];
export function stageAccent(n: number | null | undefined) {
  return `var(--stage-${n && n >= 1 && n <= 4 ? n : 5})`;
}
export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}
export function formatLongDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(`${value}T00:00:00`) : value;
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}
