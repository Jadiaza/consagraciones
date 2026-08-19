import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  FileText,
  Gauge,
  Layers3,
  LogOut,
  Menu,
  Pencil,
  Plus,
  HandHeart,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  X,
  Users,
  Activity,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { EmptyState, ErrorState, LoadingState } from "@/components/app/cards";
import { StageDayManager } from "@/components/admin/StageDayManager";
import { UserManagement } from "@/components/admin/UserManagement";
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
import { RESOURCE_CATEGORIES } from "@/lib/consecration";

type Section =
  | "dashboard"
  | "consecrations"
  | "stages"
  | "days"
  | "prayers"
  | "resources"
  | "users"
  | "activity";
type ContentKind = "prayers" | "resources";
type Consecration = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  duration_days: number;
  status: string;
  created_at: string;
};
type Stage = {
  id: string;
  consecration_id: string;
  stage_number: number;
  title: string;
  motto: string | null;
  start_day: number;
  end_day: number;
};
type Day = {
  id: string;
  consecration_id: string;
  stage_id: string | null;
  day_number: number;
  title: string;
  status: string;
};
type Item = Record<string, unknown> & { id: string; title: string; sort_order: number };
const EMPTY = {
  title: "",
  body: "",
  slug: "",
  kind: "prayer",
  response: "",
  category: "oraciones",
  summary: "",
  external_url: "",
  status: "draft",
  sort_order: 0,
};
const EMPTY_CONSECRATION = {
  title: "",
  subtitle: "",
  slug: "",
  duration_days: 33,
  status: "draft",
  description: "",
};

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) throw redirect({ to: "/auth", search: { modo: "login" as const } });
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", auth.user.id);
    if (!data?.some(({ role }) => role === "admin" || role === "editor"))
      throw redirect({ to: "/dashboard" });
  },
  component: AdminPage,
});

function AdminPage() {
  const qc = useQueryClient();
  const [section, setSection] = useState<Section>("dashboard");
  const [menu, setMenu] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [modal, setModal] = useState(false);
  const [newForm, setNewForm] = useState(EMPTY_CONSECRATION);
  const data = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const results = await Promise.all([
        supabase
          .from("consecrations")
          .select("id,title,subtitle,slug,duration_days,status,created_at")
          .order("created_at"),
        supabase
          .from("consecration_stages")
          .select("id,consecration_id,stage_number,title,motto,start_day,end_day")
          .order("stage_number"),
        supabase
          .from("consecration_days")
          .select("id,consecration_id,stage_id,day_number,title,status")
          .order("day_number"),
        supabase.from("prayers").select("id,consecration_id,title,sort_order"),
        supabase.from("resources").select("id,consecration_id,title,sort_order"),
      ]);
      const error = results.find((r) => r.error)?.error;
      if (error) throw error;
      return {
        consecrations: (results[0].data ?? []) as Consecration[],
        stages: (results[1].data ?? []) as Stage[],
        days: (results[2].data ?? []) as Day[],
        prayers: results[3].data ?? [],
        resources: results[4].data ?? [],
      };
    },
  });
  useEffect(() => {
    if (!selectedId && data.data?.consecrations[0]) setSelectedId(data.data.consecrations[0].id);
  }, [data.data, selectedId]);
  const selected = data.data?.consecrations.find((c) => c.id === selectedId);
  const stages = data.data?.stages.filter((s) => s.consecration_id === selectedId) ?? [];
  const days = data.data?.days.filter((d) => d.consecration_id === selectedId) ?? [];
  const createConsecration = useMutation({
    mutationFn: async () => {
      if (!newForm.title.trim()) throw new Error("Escribe el nombre.");
      const payload = {
        ...newForm,
        title: newForm.title.trim(),
        slug: newForm.slug.trim() || slugify(newForm.title),
        subtitle: newForm.subtitle.trim() || null,
        description: newForm.description.trim() || null,
        published_at: newForm.status === "published" ? new Date().toISOString() : null,
      };
      const { error } = await supabase.from("consecrations").insert(payload);
      if (error) throw error;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-dashboard"] });
      setModal(false);
      setNewForm(EMPTY_CONSECRATION);
      toast.success("Consagración creada");
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="admin-shell min-h-dvh bg-[#f4f7fb] text-[#111827]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(212,175,55,.08),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)]" />
      <Sidebar
        open={menu}
        section={section}
        close={() => setMenu(false)}
        select={(s) => {
          setSection(s);
          setMenu(false);
        }}
      />
      <main className="relative min-h-dvh lg:pl-[244px]">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-[#07182a]/95 px-4 text-white backdrop-blur lg:hidden">
          <button onClick={() => setMenu(true)}>
            <Menu />
          </button>
          <ShieldCheck className="text-[#d6a642]" />
          <b>Administración</b>
        </header>
        <div className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[.2em] text-[#c8a35a]">
                Centro de contenidos
              </p>
              <h1 className="font-display text-3xl font-semibold">{titles[section]}</h1>
              <p className="mt-1 text-sm text-[#9cb0c7]">
                Gestiona todas las consagraciones de la plataforma.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger className="w-[270px] border-white/15 bg-white/[.05]">
                  <SelectValue placeholder="Selecciona una consagración" />
                </SelectTrigger>
                <SelectContent>
                  {data.data?.consecrations.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => setModal(true)}
                className="bg-gradient-to-r from-[#f3c756] to-[#d4af37] text-[#07182a] shadow-sm hover:brightness-105"
              >
                <Plus />
                Nueva consagración
              </Button>
            </div>
          </div>
          {data.isLoading && <LoadingState />}
          {data.error && <ErrorState message={data.error.message} />}{" "}
          {data.data && section === "dashboard" && (
            <Dashboard data={data.data} selected={selected} stages={stages} go={setSection} />
          )}{" "}
          {data.data && section === "consecrations" && (
            <Consecrations
              items={data.data.consecrations}
              selected={selectedId}
              choose={setSelectedId}
              add={() => setModal(true)}
            />
          )}{" "}
          {section === "stages" && selectedId && (
            <StageDayManager mode="stages" consecrationId={selectedId} />
          )}{" "}
          {section === "days" && selectedId && (
            <StageDayManager mode="days" consecrationId={selectedId} />
          )}{" "}
          {section === "users" && (
            <UserManagement mode="users" consecrationId={selectedId || undefined} />
          )}
          {section === "activity" && (
            <UserManagement mode="activity" consecrationId={selectedId || undefined} />
          )}
          {(section === "prayers" || section === "resources") && selectedId && (
            <ContentManager kind={section} consecrationId={selectedId} />
          )}
        </div>
      </main>
      {modal && (
        <Modal title="Nueva consagración" close={() => setModal(false)}>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              createConsecration.mutate();
            }}
          >
            <Field label="Nombre">
              <Input
                value={newForm.title}
                onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
              />
            </Field>
            <Field label="Subtítulo">
              <Input
                value={newForm.subtitle}
                onChange={(e) => setNewForm({ ...newForm, subtitle: e.target.value })}
              />
            </Field>
            <Field label="Identificador">
              <Input
                placeholder="Se genera automáticamente"
                value={newForm.slug}
                onChange={(e) => setNewForm({ ...newForm, slug: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Duración">
                <Input
                  type="number"
                  min={1}
                  value={newForm.duration_days}
                  onChange={(e) =>
                    setNewForm({ ...newForm, duration_days: Number(e.target.value) })
                  }
                />
              </Field>
              <Field label="Estado">
                <Select
                  value={newForm.status}
                  onValueChange={(status) => setNewForm({ ...newForm, status })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicada</SelectItem>
                    <SelectItem value="archived">Archivada</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Descripción">
              <Textarea
                rows={4}
                value={newForm.description}
                onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
              />
            </Field>
            <Button
              disabled={createConsecration.isPending}
              className="w-full bg-[#c99a3d] text-[#061426]"
            >
              <Save />
              Guardar
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}

const titles: Record<Section, string> = {
  dashboard: "Panel de administración",
  consecrations: "Consagraciones",
  stages: "Etapas",
  days: "Días y enseñanzas",
  prayers: "Gestión de oraciones",
  resources: "Gestión de recursos",
  users: "Usuarios e inscripciones",
  activity: "Actividad reciente",
};
function Sidebar({
  open,
  section,
  select,
  close,
}: {
  open: boolean;
  section: Section;
  select: (s: Section) => void;
  close: () => void;
}) {
  const links: Array<[Section, string, typeof Gauge]> = [
    ["dashboard", "Dashboard", Gauge],
    ["consecrations", "Consagraciones", BookOpen],
    ["stages", "Etapas", Layers3],
    ["days", "Días / Enseñanzas", CalendarDays],
    ["prayers", "Oraciones", HandHeart],
    ["resources", "Recursos", FileText],
    ["users", "Usuarios", Users],
    ["activity", "Actividad", Activity],
  ];
  return (
    <>
      <button
        onClick={close}
        className={`fixed inset-0 z-30 bg-black/70 lg:hidden ${open ? "block" : "hidden"}`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[244px] flex-col border-r border-white/10 bg-[radial-gradient(circle_at_30%_0%,rgba(212,175,55,.20),transparent_28%),linear-gradient(180deg,#061826_0%,#0b2b49_100%)] text-white shadow-xl transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-24 items-center gap-3 border-b border-white/10 px-5">
          <span className="grid size-12 place-items-center rounded-xl border border-[#c99a3d]/40 bg-[#c99a3d]/10">
            <ShieldCheck className="text-[#d9ac4c]" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-[#d9ac4c]">Consagración</p>
            <p className="font-display text-xl">33 días</p>
            <p className="text-[10px] text-[#9cb0c7]">ADMINISTRADOR</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={close}>
            <X />
          </button>
        </div>
        <nav className="flex-1 p-3">
          <p className="mb-2 px-3 text-[10px] uppercase tracking-widest text-[#7890a6]">General</p>
          {links.slice(0, 2).map(Link)}
          <p className="mb-2 mt-6 px-3 text-[10px] uppercase tracking-widest text-[#7890a6]">
            Contenido
          </p>
          {links.slice(2, 6).map(Link)}
          <p className="mb-2 mt-6 px-3 text-[10px] uppercase tracking-widest text-[#7890a6]">
            Sistema
          </p>
          {links.slice(6).map(Link)}
        </nav>
        <button
          onClick={() => supabase.auth.signOut().then(() => location.assign("/"))}
          className="flex items-center gap-3 border-t border-white/10 p-5 text-sm text-[#b7c5d3]"
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </button>
      </aside>
    </>
  );
  function Link([key, label, Icon]: [Section, string, typeof Gauge]) {
    return (
      <button
        key={key}
        onClick={() => select(key)}
        className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${section === key ? "translate-x-0.5 bg-gradient-to-r from-[#f3c756] to-[#d4af37] text-[#061826]" : "text-white/85 hover:bg-white/[.07]"}`}
      >
        <Icon className="size-[18px]" />
        {label}
      </button>
    );
  }
}

type AdminData = {
  consecrations: Consecration[];
  stages: Stage[];
  days: Day[];
  prayers: Array<Record<string, unknown>>;
  resources: Array<Record<string, unknown>>;
};
function Dashboard({
  data,
  selected,
  stages,
  go,
}: {
  data: AdminData;
  selected?: Consecration;
  stages: Stage[];
  go: (s: Section) => void;
}) {
  const stats: [
    [typeof BookOpen, string, number, string],
    [typeof Layers3, string, number, string],
    [typeof CalendarDays, string, number, string],
    [typeof HandHeart, string, number, string],
  ] = [
    [
      BookOpen,
      "Consagraciones activas",
      data.consecrations.filter((c) => c.status === "published").length,
      `${data.consecrations.length} en total`,
    ],
    [Layers3, "Etapas configuradas", data.stages.length, "En todas las consagraciones"],
    [
      CalendarDays,
      "Días publicados",
      data.days.filter((d) => d.status === "published").length,
      `${data.days.length} días cargados`,
    ],
    [
      HandHeart,
      "Oraciones y recursos",
      data.prayers.length + data.resources.length,
      "Contenido disponible",
    ],
  ];
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([Icon, label, value, sub]) => (
          <Panel key={label} bare>
            <div className="flex items-center gap-4 p-5">
              <span className="grid size-12 place-items-center rounded-xl border border-[#d6a642]/30 bg-[#d6a642]/10">
                <Icon className="text-[#e0ad45]" />
              </span>
              <div>
                <p className="text-xs text-[#b5c3d1]">{label}</p>
                <p className="text-2xl font-semibold">{value}</p>
                <p className="text-xs text-[#8fa3b8]">{sub}</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr_.7fr]">
        <Panel
          title="Consagraciones"
          action={
            <button onClick={() => go("consecrations")} className="text-xs text-[#e0ad45]">
              Ver todas
            </button>
          }
        >
          {data.consecrations.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 border-b border-white/10 py-3 last:border-0"
            >
              <span className="grid size-11 place-items-center rounded-lg bg-[#c99a3d]/15">
                <BookOpen className="text-[#e0ad45]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{c.title}</p>
                <p className="text-xs text-[#8fa3b8]">
                  {c.duration_days} días ·{" "}
                  {data.stages.filter((s) => s.consecration_id === c.id).length} etapas
                </p>
              </div>
              <Status value={c.status} />
            </div>
          ))}
        </Panel>
        <Panel
          title={`Etapas${selected ? ` · ${selected.title}` : ""}`}
          action={
            <button onClick={() => go("stages")} className="text-xs text-[#e0ad45]">
              Ver etapas
            </button>
          }
        >
          {stages.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 border-b border-white/10 py-3 last:border-0"
            >
              <b className="grid size-8 place-items-center rounded-full bg-[#c99a3d] text-[#061426]">
                {s.stage_number}
              </b>
              <div className="flex-1">
                <p className="text-sm">{s.title}</p>
                <p className="text-xs text-[#8fa3b8]">
                  Días {s.start_day}–{s.end_day}
                </p>
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="Acciones rápidas">
          {[
            [HandHeart, "Gestionar oraciones", "prayers"],
            [FileText, "Gestionar recursos", "resources"],
            [CalendarDays, "Revisar días", "days"],
          ].map(([Icon, label, target]) => {
            const I = Icon as typeof HandHeart;
            return (
              <button
                key={label as string}
                onClick={() => go(target as Section)}
                className="flex w-full items-center gap-3 border-b border-white/10 py-4 last:border-0"
              >
                <I className="text-[#d8ad50]" />
                <span className="flex-1 text-left text-sm">{label as string}</span>
                <ChevronRight className="size-4" />
              </button>
            );
          })}
        </Panel>
      </div>
    </div>
  );
}
function Consecrations({
  items,
  selected,
  choose,
  add,
}: {
  items: Consecration[];
  selected: string;
  choose: (id: string) => void;
  add: () => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((c) => (
        <button
          key={c.id}
          onClick={() => choose(c.id)}
          className={`surface-sacred overflow-hidden p-0 text-left transition hover:-translate-y-1 ${selected === c.id ? "ring-2 ring-[#d6a642]" : ""}`}
        >
          <div className="h-28 bg-[radial-gradient(circle_at_75%_10%,rgba(220,174,76,.45),transparent_35%),linear-gradient(135deg,#123c60,#07182b)] p-5">
            <BookOpen className="size-10 text-[#e8c36e]" />
          </div>
          <div className="p-5">
            <div className="flex gap-2">
              <h2 className="flex-1 font-display text-xl">{c.title}</h2>
              <Status value={c.status} />
            </div>
            <p className="mt-2 min-h-10 text-sm text-[#9cb0c7]">{c.subtitle || "Sin subtítulo"}</p>
            <p className="mt-4 border-t border-white/10 pt-3 text-xs text-[#c3cfda]">
              {c.duration_days} días · {c.slug}
            </p>
          </div>
        </button>
      ))}
      <button
        onClick={add}
        className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-[#c99a3d]/50 text-[#d8ad50]"
      >
        <span className="flex flex-col items-center gap-3">
          <Plus className="size-10" />
          Crear consagración
        </span>
      </button>
    </div>
  );
}
function Stages({ items, days }: { items: Stage[]; days: Day[] }) {
  return (
    <Panel title="Etapas de la consagración">
      {items.length ? (
        items.map((s) => (
          <div
            key={s.id}
            className="grid items-center gap-4 border-b border-white/10 py-4 last:border-0 sm:grid-cols-[48px_1fr_auto_auto]"
          >
            <b className="grid size-10 place-items-center rounded-full bg-[#c99a3d] text-[#061426]">
              {s.stage_number}
            </b>
            <div>
              <p>{s.title}</p>
              <p className="text-sm text-[#8fa3b8]">{s.motto || "Sin lema"}</p>
            </div>
            <span className="text-sm text-[#d8ad50]">
              Días {s.start_day}–{s.end_day} · {days.filter((d) => d.stage_id === s.id).length}{" "}
              temas
            </span>
            <Pencil className="size-4" />
          </div>
        ))
      ) : (
        <EmptyState title="No hay etapas configuradas" />
      )}
    </Panel>
  );
}
function Days({ items, stages }: { items: Day[]; stages: Stage[] }) {
  const [q, setQ] = useState("");
  return (
    <Panel
      title="Días y enseñanzas"
      action={
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-[#8fa3b8]" />
          <Input
            className="h-9 w-56 bg-white/[.04] pl-9"
            placeholder="Buscar"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-sm">
          <thead className="text-left text-xs uppercase text-[#8398ad]">
            <tr>
              <th className="py-3">Día</th>
              <th>Título</th>
              <th>Etapa</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {items
              .filter((d) => d.title.toLowerCase().includes(q.toLowerCase()))
              .map((d) => (
                <tr key={d.id}>
                  <td className="py-3 text-[#dcb052]">{d.day_number}</td>
                  <td>{d.title}</td>
                  <td className="text-[#9cb0c7]">
                    {stages.find((s) => s.id === d.stage_id)?.title || "Sin etapa"}
                  </td>
                  <td>
                    <Status value={d.status} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function ContentManager({ kind, consecrationId }: { kind: ContentKind; consecrationId: string }) {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const content = useQuery({
    queryKey: ["admin-content", kind, consecrationId],
    queryFn: async () => {
      const r =
        kind === "prayers"
          ? await supabase
              .from("prayers")
              .select("*")
              .eq("consecration_id", consecrationId)
              .order("sort_order")
          : await supabase
              .from("resources")
              .select("*")
              .eq("consecration_id", consecrationId)
              .order("sort_order");
      if (r.error) throw r.error;
      return (r.data ?? []) as Item[];
    },
  });
  const save = useMutation({
    mutationFn: async () => {
      if (!form.title.trim() || !form.body.trim()) throw new Error("Escribe título y contenido.");
      let r;
      if (kind === "prayers") {
        const p = {
          consecration_id: consecrationId,
          title: form.title.trim(),
          body: form.body.trim(),
          slug: form.slug.trim() || slugify(form.title),
          kind: form.kind,
          response: form.response.trim() || null,
          sort_order: form.sort_order,
        };
        r = selected
          ? await supabase.from("prayers").update(p).eq("id", selected)
          : await supabase.from("prayers").insert(p);
      } else {
        const p = {
          consecration_id: consecrationId,
          title: form.title.trim(),
          body: form.body.trim(),
          summary: form.summary.trim() || null,
          category: form.category,
          external_url: form.external_url.trim() || null,
          status: form.status,
          sort_order: form.sort_order,
        };
        r = selected
          ? await supabase.from("resources").update(p).eq("id", selected)
          : await supabase.from("resources").insert(p);
      }
      if (r.error) throw r.error;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-content", kind, consecrationId] });
      await qc.invalidateQueries({ queryKey: ["admin-dashboard"] });
      setSelected(null);
      setForm(EMPTY);
      toast.success("Contenido guardado");
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const r =
        kind === "prayers"
          ? await supabase.from("prayers").delete().eq("id", id)
          : await supabase.from("resources").delete().eq("id", id);
      if (r.error) throw r.error;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-content", kind, consecrationId] });
      setSelected(null);
      setForm(EMPTY);
      toast.success("Contenido eliminado");
    },
  });
  function choose(i: Item) {
    setSelected(i.id);
    setForm({
      ...EMPTY,
      title: i.title,
      body: String(i.body ?? ""),
      slug: String(i.slug ?? ""),
      kind: String(i.kind ?? "prayer"),
      response: String(i.response ?? ""),
      category: String(i.category ?? "oraciones"),
      summary: String(i.summary ?? ""),
      external_url: String(i.external_url ?? ""),
      status: String(i.status ?? "draft"),
      sort_order: i.sort_order,
    });
  }
  return (
    <div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]">
      <Panel
        title={kind === "prayers" ? "Oraciones" : "Recursos"}
        action={
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelected(null);
              setForm(EMPTY);
            }}
          >
            <Plus />
            Nuevo
          </Button>
        }
      >
        {content.isLoading && <LoadingState />}
        {content.error && <ErrorState message={content.error.message} />}
        <div className="max-h-[650px] space-y-2 overflow-auto">
          {content.data?.map((i) => (
            <button
              key={i.id}
              onClick={() => choose(i)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${selected === i.id ? "border-[#d6a642] bg-[#d6a642]/10" : "border-white/10"}`}
            >
              <span className="flex-1 truncate text-sm">{i.title}</span>
              <small className="text-[#8fa3b8]">#{i.sort_order}</small>
              <ChevronRight className="size-4" />
            </button>
          ))}
        </div>
      </Panel>
      <Panel title={selected ? "Editar contenido" : "Nuevo contenido"}>
        <form
          className="space-y-4"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <Field label="Título">
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          {kind === "prayers" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Identificador">
                  <Input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  />
                </Field>
                <Field label="Tipo">
                  <Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prayer">Oración</SelectItem>
                      <SelectItem value="opening">Inicial</SelectItem>
                      <SelectItem value="closing">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Respuesta">
                <Input
                  value={form.response}
                  onChange={(e) => setForm({ ...form, response: e.target.value })}
                />
              </Field>
            </>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Categoría">
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RESOURCE_CATEGORIES.map((c) => (
                        <SelectItem key={c.key} value={c.key}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Estado">
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v })}
                  >
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
              <Field label="Resumen">
                <Textarea
                  rows={2}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                />
              </Field>
              <Field label="Enlace externo">
                <Input
                  type="url"
                  value={form.external_url}
                  onChange={(e) => setForm({ ...form, external_url: e.target.value })}
                />
              </Field>
            </>
          )}
          <Field label="Contenido">
            <Textarea
              rows={12}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </Field>
          <Field label="Orden">
            <Input
              className="w-28"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
          </Field>
          <div className="flex justify-between">
            {selected ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => confirm("¿Eliminar definitivamente?") && remove.mutate(selected)}
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
      </Panel>
    </div>
  );
}
function Panel({
  title,
  action,
  bare = false,
  children,
}: {
  title?: string;
  action?: ReactNode;
  bare?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="surface-sacred rounded-2xl border border-slate-200 bg-white">
      {!bare && (title || action) && (
        <header className="flex min-h-14 items-center justify-between gap-3 border-b border-white/10 px-4">
          <h2 className="font-semibold">{title}</h2>
          {action}
        </header>
      )}
      <div className={bare ? "" : "p-4"}>{children}</div>
    </section>
  );
}
function Status({ value }: { value: string }) {
  return (
    <span
      className={`rounded-md px-2 py-1 text-[10px] ${value === "published" ? "bg-emerald-500/15 text-emerald-300" : value === "draft" ? "bg-amber-500/15 text-amber-300" : "bg-slate-500/20 text-slate-300"}`}
    >
      {value === "published" ? "Activa" : value === "draft" ? "Borrador" : "Inactiva"}
    </span>
  );
}
function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white text-[#111827] shadow-2xl">
        <header className="flex justify-between border-b border-white/10 p-5">
          <h2 className="font-display text-xl">{title}</h2>
          <button onClick={close}>
            <X />
          </button>
        </header>
        <div className="max-h-[80dvh] overflow-auto p-5">{children}</div>
      </div>
    </div>
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
function slugify(v: string) {
  return v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
