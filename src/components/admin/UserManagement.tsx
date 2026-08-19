import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Pencil, Search, ShieldCheck, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState, ErrorState, LoadingState } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
type Mode = "users" | "activity";
export function UserManagement({ mode, consecrationId }: { mode: Mode; consecrationId?: string }) {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const data = useQuery({
    queryKey: ["admin-users", consecrationId],
    queryFn: async () => {
      const [p, e, d, c, r, s] = await Promise.all([
        supabase
          .from("profiles")
          .select("id,full_name,display_name,community,created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("user_consecrations")
          .select("id,user_id,consecration_id,start_date,current_day,status,updated_at")
          .order("updated_at", { ascending: false }),
        supabase
          .from("user_day_progress")
          .select("id,user_id,user_consecration_id,day_number,completed,updated_at")
          .order("updated_at", { ascending: false })
          .limit(300),
        supabase.from("consecrations").select("id,title,duration_days"),
        supabase.from("user_roles").select("user_id,role"),
        supabase.from("super_admins").select("user_id"),
      ]);
      const error = [p, e, d, r].find((x) => x.error)?.error;
      if (error) throw error;
      return {
        profiles: p.data ?? [],
        enrollments: e.data ?? [],
        progress: d.data ?? [],
        consecrations: c.data ?? [],
        roles: r.data ?? [],
        superIds: new Set((s.data ?? []).map((x) => x.user_id)),
      };
    },
  });
  const changeRole = useMutation({
    mutationFn: async ({
      id,
      role,
    }: {
      id: string;
      role: "user" | "companion" | "editor" | "admin";
    }) => {
      const { error } = await (supabase.rpc as any)("super_admin_set_user_role", {
        target_user: id,
        next_role: role,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Privilegios actualizados");
    },
    onError: (e) => toast.error(e.message),
  });
  const rows = useMemo(
    () =>
      data.data?.profiles
        .map((p) => {
          const enrollment = data.data.enrollments.find(
            (e) => e.user_id === p.id && (!consecrationId || e.consecration_id === consecrationId),
          );
          const cons = data.data.consecrations.find((c) => c.id === enrollment?.consecration_id);
          const completed = enrollment
            ? data.data.progress.filter(
                (x) => x.user_consecration_id === enrollment.id && x.completed,
              ).length
            : 0;
          return {
            ...p,
            enrollment,
            cons,
            completed,
            percent: cons ? Math.round((completed / cons.duration_days) * 100) : 0,
            role:
              data.data.roles.find((r) => r.user_id === p.id && r.role !== "user")?.role ?? "user",
            superAdmin: data.data.superIds.has(p.id),
          };
        })
        .filter((x) =>
          `${x.full_name} ${x.display_name}`.toLowerCase().includes(q.toLowerCase()),
        ) ?? [],
    [data.data, q, consecrationId],
  );
  if (data.isLoading) return <LoadingState />;
  if (data.error)
    return (
      <ErrorState
        message={`${data.error.message}. Aplica la migración 20260809140000 en Supabase.`}
      />
    );
  if (mode === "activity")
    return (
      <Panel title="Actividad reciente">
        {data.data!.progress.length ? (
          data.data!.progress.slice(0, 40).map((x) => {
            const p = data.data!.profiles.find((v) => v.id === x.user_id);
            return (
              <div key={x.id} className="flex gap-3 border-b border-white/10 py-3">
                <CheckCircle2 className="text-emerald-700" />
                <div className="text-sm">
                  <b>{p?.display_name || p?.full_name || "Usuario"}</b>{" "}
                  {x.completed ? "completó" : "actualizó"} el Día {x.day_number}
                  <p className="text-xs text-[#667085]">
                    {new Date(x.updated_at).toLocaleString("es-CO")}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState title="Sin actividad reciente" />
        )}
      </Panel>
    );
  return (
    <Panel
      title="Usuarios e inscripciones"
      action={
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4" />
          <Input
            className="h-9 w-60 pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar usuario"
          />
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="text-left text-xs uppercase text-[#52657a]">
            <tr>
              <th className="py-3">Usuario</th>
              <th>Consagración</th>
              <th>Día</th>
              <th>Progreso</th>
              <th>Estado</th>
              <th>Privilegios</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((x) => (
              <tr key={x.id}>
                <td className="py-3">
                  <span className="flex items-center gap-2">
                    {x.superAdmin ? <ShieldCheck className="text-[#8a6200]" /> : <UserRound />}
                    <span>
                      {x.display_name || x.full_name || "Sin nombre"}
                      {x.superAdmin && (
                        <small className="block font-medium text-[#8a6200]">Superadministrador</small>
                      )}
                    </span>
                  </span>
                </td>
                <td>{x.cons?.title || "Sin inscripción"}</td>
                <td>{x.enrollment?.current_day || "—"}</td>
                <td>
                  {x.completed} · {x.percent}%
                </td>
                <td>{x.enrollment?.status || "—"}</td>
                <td>
                  {x.superAdmin ? (
                    <b className="text-[#8a6200]">admin</b>
                  ) : (
                    <Select
                      value={x.role}
                      onValueChange={(role) => changeRole.mutate({ id: x.id, role: role as any })}
                    >
                      <SelectTrigger className="h-8 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuario</SelectItem>
                        <SelectItem value="companion">Acompañante</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-sacred rounded-2xl border border-white/10">
      <header className="flex min-h-14 items-center justify-between border-b border-white/10 px-4">
        <h2 className="font-semibold">{title}</h2>
        {action}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
