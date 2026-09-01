import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  CheckCircle2,
  KeyRound,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

type Mode = "users" | "activity";
type AppRole = "user" | "companion" | "editor" | "admin";
type Enrollment = {
  id: string;
  consecration_id: string;
  current_day: number;
  status: string;
  start_date: string;
};
type AdminUser = {
  id: string;
  email: string;
  authPhone: string;
  createdAt: string;
  lastSignInAt: string | null;
  emailConfirmedAt: string | null;
  bannedUntil: string | null;
  profile: Record<string, string | null> | null;
  enrollments: Enrollment[];
  roles: AppRole[];
  superAdmin: boolean;
};
type AdminData = {
  users: AdminUser[];
  progress: Array<{
    id: string;
    user_id: string;
    user_consecration_id: string;
    day_number: number;
    completed: boolean;
    updated_at: string;
  }>;
  consecrations: Array<{ id: string; title: string; duration_days: number }>;
};

const blank = {
  fullName: "",
  displayName: "",
  email: "",
  phone: "",
  city: "",
  country: "Colombia",
  parish: "",
  password: "acceso123",
  role: "user" as AppRole,
  consecrationId: "",
  startDate: new Date().toISOString().slice(0, 10),
};
async function adminAction(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("admin-users", { body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export function UserManagement({ mode, consecrationId }: { mode: Mode; consecrationId?: string }) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(blank);
  const [temporaryPassword, setTemporaryPassword] = useState("acceso123");
  const [reason, setReason] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const query = useQuery<AdminData>({
    queryKey: ["admin-users-complete"],
    queryFn: () => adminAction({ action: "list" }),
  });
  const mutation = useMutation({
    mutationFn: adminAction,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-users-complete"] });
      toast.success("Usuario actualizado");
    },
    onError: (error) => toast.error(error.message),
  });

  const rows = useMemo(
    () =>
      (query.data?.users || [])
        .map((user) => {
          const enrollment = user.enrollments.find(
            (item) => !consecrationId || item.consecration_id === consecrationId,
          );
          const consecration = query.data?.consecrations.find(
            (item) => item.id === enrollment?.consecration_id,
          );
          const completed = enrollment
            ? query.data?.progress.filter(
                (item) => item.user_consecration_id === enrollment.id && item.completed,
              ).length || 0
            : 0;
          return {
            user,
            enrollment,
            consecration,
            completed,
            percent: consecration ? Math.round((completed / consecration.duration_days) * 100) : 0,
          };
        })
        .filter((row) => !consecrationId || row.enrollment)
        .filter(({ user }) =>
          `${user.profile?.full_name || ""} ${user.email} ${user.profile?.phone || user.authPhone || ""}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
    [query.data, consecrationId, search],
  );

  if (query.isLoading) return <LoadingState />;
  if (query.error) return <ErrorState message={query.error.message} />;
  if (mode === "activity") return <Activity data={query.data!} consecrationId={consecrationId} />;

  const open = (user: AdminUser) => {
    setSelected(user);
    setCreating(false);
    setReason("");
    setConfirmation("");
    setTemporaryPassword("acceso123");
    setForm({
      ...blank,
      fullName: user.profile?.full_name || "",
      displayName: user.profile?.display_name || "",
      email: user.email,
      phone: user.profile?.phone || user.authPhone || "",
      city: user.profile?.city || "",
      country: user.profile?.country || "Colombia",
      parish: user.profile?.parish || "",
      role: user.roles.find((r) => r !== "user") || "user",
      consecrationId: user.enrollments[0]?.consecration_id || "",
      startDate: user.enrollments[0]?.start_date || blank.startDate,
    });
  };
  const close = () => {
    setSelected(null);
    setCreating(false);
  };
  const save = async () => {
    if (creating) await mutation.mutateAsync({ action: "create", ...form });
    else if (selected) {
      await mutation.mutateAsync({ action: "update", userId: selected.id, ...form });
      if (!selected.superAdmin)
        await mutation.mutateAsync({ action: "role", userId: selected.id, role: form.role });
    }
    close();
  };

  return (
    <>
      <Panel
        title={`Usuarios registrados · ${rows.length}`}
        action={
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4" />
              <Input
                className="h-9 w-64 pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre, correo o teléfono"
              />
            </div>
            <Button
              className="bg-[#d8a72e] text-[#13263b]"
              onClick={() => {
                setForm({ ...blank, consecrationId: consecrationId || "" });
                setCreating(true);
              }}
            >
              <Plus className="mr-2 size-4" />
              Agregar
            </Button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="text-left text-xs uppercase text-[#52657a]">
              <tr>
                <th className="py-3">Usuario</th>
                <th>Contacto</th>
                <th>Consagración</th>
                <th>Día</th>
                <th>Progreso</th>
                <th>Estado</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {rows.map(({ user, enrollment, consecration, completed, percent }) => (
                <tr
                  key={user.id}
                  onClick={() => open(user)}
                  className="cursor-pointer hover:bg-[#d8a72e]/10"
                >
                  <td className="py-3">
                    <span className="flex items-center gap-2">
                      {user.superAdmin ? <ShieldCheck className="text-[#8a6200]" /> : <UserRound />}
                      <span>
                        <b>
                          {user.profile?.display_name || user.profile?.full_name || "Sin nombre"}
                        </b>
                        <small className="block text-[#667085]">{user.email}</small>
                      </span>
                    </span>
                  </td>
                  <td>{user.profile?.phone || user.authPhone || "—"}</td>
                  <td>{consecration?.title || "Sin inscripción"}</td>
                  <td>{enrollment?.current_day || "—"}</td>
                  <td>
                    {completed} · {percent}%
                  </td>
                  <td
                    className={
                      user.bannedUntil
                        ? "font-semibold text-red-700"
                        : "font-semibold text-emerald-700"
                    }
                  >
                    {user.bannedUntil ? "Bloqueado" : enrollment?.status || "Activo"}
                  </td>
                  <td>
                    {user.superAdmin
                      ? "Superadministrador"
                      : user.roles.find((r) => r !== "user") || "Usuario"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && (
            <EmptyState
              title="No hay coincidencias"
              description="Prueba otro término de búsqueda."
            />
          )}
        </div>
      </Panel>
      <Dialog open={creating || !!selected} onOpenChange={(value) => !value && close()}>
        <DialogContent className="max-h-[92dvh] max-w-4xl overflow-y-auto bg-[#f7f6f2] text-[#16263a]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {creating ? "Agregar usuario" : "Ficha integral del usuario"}
            </DialogTitle>
            <DialogDescription>
              Administra datos, acceso y privilegios desde una sola pantalla.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre completo">
              <Input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </Field>
            <Field label="Nombre para mostrar">
              <Input
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              />
            </Field>
            <Field label="Correo">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
            <Field label="Teléfono">
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Field>
            <Field label="Ciudad">
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </Field>
            <Field label="País">
              <Input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </Field>
            <Field label="Parroquia o comunidad">
              <Input
                value={form.parish}
                onChange={(e) => setForm({ ...form, parish: e.target.value })}
              />
            </Field>
            <Field label="Privilegios">
              <Select
                value={form.role}
                disabled={selected?.superAdmin}
                onValueChange={(v) => setForm({ ...form, role: v as AppRole })}
              >
                <SelectTrigger className="bg-white text-[#16263a] [&>span]:block [&>span]:overflow-visible [&>span]:text-[#16263a]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white text-[#16263a]">
                  <SelectItem className="focus:bg-[#f3e8c8] focus:text-[#16263a]" value="user">
                    Usuario
                  </SelectItem>
                  <SelectItem className="focus:bg-[#f3e8c8] focus:text-[#16263a]" value="companion">
                    Acompañante
                  </SelectItem>
                  <SelectItem className="focus:bg-[#f3e8c8] focus:text-[#16263a]" value="editor">
                    Editor
                  </SelectItem>
                  <SelectItem className="focus:bg-[#f3e8c8] focus:text-[#16263a]" value="admin">
                    Administrador
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
            {creating && (
              <>
                <Field label="Contraseña provisional">
                  <Input
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </Field>
                <Field label="Consagración">
                  <Select
                    value={form.consecrationId || "none"}
                    onValueChange={(v) =>
                      setForm({ ...form, consecrationId: v === "none" ? "" : v })
                    }
                  >
                    <SelectTrigger className="bg-white text-[#16263a] [&>span]:block [&>span]:overflow-visible [&>span]:text-[#16263a]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-[#16263a]">
                      <SelectItem className="focus:bg-[#f3e8c8] focus:text-[#16263a]" value="none">
                        Sin inscripción
                      </SelectItem>
                      {query.data?.consecrations.map((c) => (
                        <SelectItem
                          className="focus:bg-[#f3e8c8] focus:text-[#16263a]"
                          key={c.id}
                          value={c.id}
                        >
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </>
            )}
          </div>
          {!creating && selected && (
            <div className="space-y-4">
              <div className="grid gap-3 rounded-xl border bg-white p-4 text-sm sm:grid-cols-3">
                <Info label="Correo confirmado" value={selected.emailConfirmedAt ? "Sí" : "No"} />
                <Info
                  label="Último ingreso"
                  value={
                    selected.lastSignInAt
                      ? new Date(selected.lastSignInAt).toLocaleString("es-CO")
                      : "Sin ingreso"
                  }
                />
                <Info
                  label="Creación"
                  value={new Date(selected.createdAt).toLocaleDateString("es-CO")}
                />
              </div>
              <section className="rounded-xl border bg-white p-4">
                <b>Contraseña provisional</b>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={temporaryPassword}
                    onChange={(e) => setTemporaryPassword(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      mutation.mutate({
                        action: "password",
                        userId: selected.id,
                        password: temporaryPassword,
                      })
                    }
                  >
                    <KeyRound className="mr-2 size-4" />
                    Restablecer
                  </Button>
                </div>
              </section>
              {!selected.superAdmin && (
                <section className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <b className="text-red-900">Seguridad y depuración</b>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Motivo obligatorio"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      disabled={!reason}
                      onClick={() =>
                        mutation.mutate({
                          action: selected.bannedUntil ? "unblock" : "block",
                          userId: selected.id,
                          reason,
                        })
                      }
                    >
                      <Ban className="mr-2 size-4" />
                      {selected.bannedUntil ? "Desbloquear" : "Bloquear acceso"}
                    </Button>
                    <Input
                      className="max-w-44"
                      value={confirmation}
                      onChange={(e) => setConfirmation(e.target.value)}
                      placeholder="Escribe ELIMINAR"
                    />
                    <Button
                      variant="destructive"
                      disabled={!reason || confirmation !== "ELIMINAR"}
                      onClick={async () => {
                        await mutation.mutateAsync({
                          action: "delete",
                          userId: selected.id,
                          reason,
                          confirmation,
                        });
                        close();
                      }}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Eliminar definitivamente
                    </Button>
                  </div>
                </section>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancelar
            </Button>
            <Button
              className="bg-[#d8a72e] text-[#13263b]"
              disabled={mutation.isPending}
              onClick={save}
            >
              {creating ? "Crear usuario" : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Activity({ data, consecrationId }: { data: AdminData; consecrationId?: string }) {
  const activity = data.progress
    .filter(
      (p) =>
        !consecrationId ||
        data.users
          .find((u) => u.id === p.user_id)
          ?.enrollments.some(
            (e) => e.id === p.user_consecration_id && e.consecration_id === consecrationId,
          ),
    )
    .slice(0, 40);
  return (
    <Panel title="Actividad reciente">
      {activity.length ? (
        activity.map((p) => {
          const u = data.users.find((x) => x.id === p.user_id);
          return (
            <div key={p.id} className="flex gap-3 border-b border-black/10 py-3">
              <CheckCircle2 className="text-emerald-700" />
              <div className="text-sm">
                <b>{u?.profile?.display_name || u?.profile?.full_name || u?.email}</b>{" "}
                {p.completed ? "completó" : "actualizó"} el Día {p.day_number}
                <small className="block text-[#667085]">
                  {new Date(p.updated_at).toLocaleString("es-CO")}
                </small>
              </div>
            </div>
          );
        })
      ) : (
        <EmptyState title="Sin actividad reciente" description="Aún no hay avances registrados." />
      )}
    </Panel>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <small className="block text-[#667085]">{label}</small>
      <span>{value}</span>
    </div>
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
      <header className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
        <h2 className="font-semibold">{title}</h2>
        {action}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
