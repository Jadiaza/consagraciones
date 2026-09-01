import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authHeader = req.headers.get("Authorization");
  if (!url || !serviceKey || !authHeader) return json({ error: "No autorizado" }, 401);

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const { data: actorData, error: actorError } = await admin.auth.getUser(token);
  if (actorError || !actorData.user) return json({ error: "La sesión no es válida" }, 401);
  const actorId = actorData.user.id;
  const { data: marker } = await admin
    .from("super_admins")
    .select("user_id")
    .eq("user_id", actorId)
    .maybeSingle();
  if (!marker) return json({ error: "Solo el superadministrador puede gestionar cuentas" }, 403);

  const payload = await req.json().catch(() => ({}));
  const action = String(payload.action || "list");
  const targetId = String(payload.userId || "");
  if (targetId && targetId === actorId && ["delete", "block"].includes(action)) {
    return json({ error: "No puedes bloquear ni eliminar tu propia cuenta" }, 400);
  }

  const audit = async (event: string, entityId: string | null, metadata: unknown = {}) => {
    await admin.from("audit_logs").insert({
      actor_id: actorId,
      action: event,
      entity_type: "user",
      entity_id: entityId,
      metadata,
    });
  };

  const targetIsSuperAdmin = async () => {
    if (!targetId) return false;
    const { data } = await admin
      .from("super_admins")
      .select("user_id")
      .eq("user_id", targetId)
      .maybeSingle();
    return Boolean(data);
  };

  try {
    if (action === "list") {
      const { data: authData, error } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (error) throw error;
      const [profiles, enrollments, progress, roles, consecrations, superAdmins] =
        await Promise.all([
          admin.from("profiles").select("*"),
          admin.from("user_consecrations").select("*"),
          admin.from("user_day_progress").select("*").order("updated_at", { ascending: false }),
          admin.from("user_roles").select("user_id,role"),
          admin.from("consecrations").select("id,title,duration_days"),
          admin.from("super_admins").select("user_id"),
        ]);
      const dbError = [profiles, enrollments, progress, roles, consecrations, superAdmins].find(
        (x) => x.error,
      )?.error;
      if (dbError) throw dbError;
      return json({
        users: authData.users.map((user) => ({
          id: user.id,
          email: user.email || "",
          authPhone: user.phone || "",
          createdAt: user.created_at,
          lastSignInAt: user.last_sign_in_at || null,
          emailConfirmedAt: user.email_confirmed_at || null,
          bannedUntil: user.banned_until || null,
          profile: profiles.data?.find((p) => p.id === user.id) || null,
          enrollments: enrollments.data?.filter((e) => e.user_id === user.id) || [],
          roles: roles.data?.filter((r) => r.user_id === user.id).map((r) => r.role) || ["user"],
          superAdmin: superAdmins.data?.some((s) => s.user_id === user.id) || false,
        })),
        progress: progress.data || [],
        consecrations: consecrations.data || [],
      });
    }

    if (action === "create") {
      const email = String(payload.email || "")
        .trim()
        .toLowerCase();
      const password = String(payload.password || "");
      const fullName = String(payload.fullName || "").trim();
      if (!email || password.length < 8 || !fullName) {
        return json(
          { error: "Nombre, correo y contraseña de al menos 8 caracteres son obligatorios" },
          400,
        );
      }
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });
      if (error) throw error;
      await admin.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        display_name: String(payload.displayName || fullName).trim(),
        phone: String(payload.phone || "").trim() || null,
        city: String(payload.city || "").trim() || null,
        country: String(payload.country || "").trim() || null,
        parish: String(payload.parish || "").trim() || null,
      });
      if (payload.consecrationId) {
        await admin.from("user_consecrations").insert({
          user_id: data.user.id,
          consecration_id: payload.consecrationId,
          start_date: payload.startDate || new Date().toISOString().slice(0, 10),
          status: "active",
        });
      }
      const role = String(payload.role || "user");
      if (["companion", "editor", "admin"].includes(role)) {
        const { error: roleError } = await admin
          .from("user_roles")
          .insert({ user_id: data.user.id, role });
        if (roleError) throw roleError;
      }
      await audit("user_created", data.user.id, { email });
      return json({ ok: true, userId: data.user.id });
    }

    if (!targetId) return json({ error: "Usuario no especificado" }, 400);

    if (action === "update") {
      const fullName = String(payload.fullName || "").trim();
      const email = String(payload.email || "")
        .trim()
        .toLowerCase();
      if (!fullName || !email) return json({ error: "Nombre y correo son obligatorios" }, 400);
      const { error } = await admin.auth.admin.updateUserById(targetId, {
        email,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });
      if (error) throw error;
      const { error: profileError } = await admin.from("profiles").upsert({
        id: targetId,
        full_name: fullName,
        display_name: String(payload.displayName || fullName).trim(),
        phone: String(payload.phone || "").trim() || null,
        city: String(payload.city || "").trim() || null,
        country: String(payload.country || "").trim() || null,
        parish: String(payload.parish || "").trim() || null,
      });
      if (profileError) throw profileError;
      await audit("user_updated", targetId, { email });
      return json({ ok: true });
    }

    if (action === "password") {
      const password = String(payload.password || "");
      if (password.length < 8)
        return json({ error: "La contraseña debe tener al menos 8 caracteres" }, 400);
      const { error } = await admin.auth.admin.updateUserById(targetId, { password });
      if (error) throw error;
      await audit("user_password_reset", targetId);
      return json({ ok: true });
    }

    if (action === "block" || action === "unblock") {
      if (await targetIsSuperAdmin())
        return json({ error: "No se puede bloquear una cuenta de superadministrador" }, 400);
      const reason = String(payload.reason || "").trim();
      if (!reason) return json({ error: "Debes indicar el motivo" }, 400);
      const { error } = await admin.auth.admin.updateUserById(targetId, {
        ban_duration: action === "block" ? "876000h" : "none",
      });
      if (error) throw error;
      await audit(action === "block" ? "user_blocked" : "user_unblocked", targetId, {
        reason,
      });
      return json({ ok: true });
    }

    if (action === "role") {
      if (await targetIsSuperAdmin())
        return json(
          { error: "Los privilegios del superadministrador no se modifican desde este panel" },
          400,
        );
      const role = String(payload.role || "user");
      if (!["user", "companion", "editor", "admin"].includes(role))
        return json({ error: "Rol inválido" }, 400);
      if (role !== "user") {
        const { error } = await admin
          .from("user_roles")
          .upsert({ user_id: targetId, role }, { onConflict: "user_id,role" });
        if (error) throw error;
      }
      let cleanup = admin.from("user_roles").delete().eq("user_id", targetId).neq("role", "user");
      if (role !== "user") cleanup = cleanup.neq("role", role);
      const { error: cleanupError } = await cleanup;
      if (cleanupError) throw cleanupError;
      await audit("user_role_changed", targetId, { role });
      return json({ ok: true });
    }

    if (action === "delete") {
      if (await targetIsSuperAdmin())
        return json({ error: "No se puede eliminar una cuenta de superadministrador" }, 400);
      if (String(payload.confirmation || "") !== "ELIMINAR")
        return json({ error: "Confirmación inválida" }, 400);
      const reason = String(payload.reason || "").trim();
      if (!reason) return json({ error: "Debes indicar el motivo de eliminación" }, 400);
      const { data: target } = await admin.auth.admin.getUserById(targetId);
      await audit("user_deleted", targetId, { reason, email: target.user?.email || "" });
      const { error } = await admin.auth.admin.deleteUser(targetId);
      if (error) throw error;
      return json({ ok: true });
    }

    return json({ error: "Acción no reconocida" }, 400);
  } catch (error) {
    console.error(error);
    return json(
      { error: error instanceof Error ? error.message : "No fue posible completar la operación" },
      400,
    );
  }
});
