import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.2";

const allowedOrigins = new Set([
  "https://lvj-audios.vercel.app",
  "https://consagraciones.vercel.app",
  "http://localhost:3000",
  "http://localhost:4173",
]);
const encoder = new TextEncoder();
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SEGMENT_SECONDS = 15;

const cors = (req: Request) => {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin)
      ? origin
      : "https://lvj-audios.vercel.app",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
};

const json = (req: Request, body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(req), "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const hash = async (value: string) => {
  const bytes = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const randomText = (length: number, alphabet = CODE_ALPHABET) => {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return [...bytes].map((byte) => alphabet[byte % alphabet.length]).join("");
};

const randomToken = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
};

const normalizeName = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  if (req.method !== "POST") return json(req, { error: "Método no permitido" }, 405);

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return json(req, { error: "Servicio no configurado" }, 500);

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const payload = await req.json().catch(() => ({}));
  const action = String(payload.action || "");

  const requireAdmin = async () => {
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const { data: actorData, error: actorError } = await admin.auth.getUser(token);
    const actorId = actorData.user?.id;
    if (actorError || !actorId) return null;
    const [{ data: roles, error: roleError }, { data: superAdmin, error: superError }] =
      await Promise.all([
        admin.from("user_roles").select("role").eq("user_id", actorId),
        admin.from("super_admins").select("user_id").eq("user_id", actorId).maybeSingle(),
      ]);
    if (roleError || superError) throw roleError || superError;
    return superAdmin || roles?.some((row) => row.role === "admin") ? actorId : null;
  };

  if (action === "adminReport" || action === "adminRegenerateCode") {
    const actorId = await requireAdmin();
    if (!actorId)
      return json(req, { error: "Solo el administrador puede gestionar este reporte." }, 403);

    if (action === "adminRegenerateCode") {
      const accessId = String(payload.accessId || "");
      if (!accessId) return json(req, { error: "Registro no especificado." }, 400);
      const raw = randomText(8);
      const code = `SM-${raw.slice(0, 4)}-${raw.slice(4)}`;
      const { data: access, error: accessError } = await admin
        .from("audio_access_codes")
        .update({
          code_hash: await hash(code),
          code_hint: code.slice(-4),
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", accessId)
        .select("id")
        .single();
      if (accessError) return json(req, { error: "No fue posible generar el código." }, 400);
      await admin.from("audio_access_sessions").delete().eq("access_code_id", access.id);
      await admin.from("audit_logs").insert({
        actor_id: actorId,
        action: "audio_access_code_regenerated",
        entity_type: "audio_access_code",
        entity_id: access.id,
      });
      return json(req, { ok: true, code });
    }

    const [{ data: codes, error: codesError }, { data: progress, error: progressError }] =
      await Promise.all([
        admin
          .from("audio_access_codes")
          .select("id,user_id,user_consecration_id,code_hint,is_active,created_at,last_used_at")
          .order("created_at", { ascending: false }),
        admin
          .from("audio_listener_progress")
          .select(
            "id,user_id,user_consecration_id,day_number,listened_seconds,listened_percent,last_position_seconds,status,completed_at,updated_at",
          )
          .order("updated_at", { ascending: false }),
      ]);
    if (codesError || progressError)
      return json(req, { error: "No fue posible consultar el seguimiento." }, 500);
    const userIds = [...new Set((codes || []).map((row) => row.user_id))];
    const [{ data: profiles }, authResult] = await Promise.all([
      userIds.length
        ? admin
            .from("profiles")
            .select("id,full_name,display_name,phone,city,country,parish")
            .in("id", userIds)
        : Promise.resolve({ data: [] }),
      admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);
    if (authResult.error)
      return json(req, { error: "No fue posible consultar los usuarios." }, 500);
    return json(req, {
      participants: (codes || []).map((access) => {
        const profile = profiles?.find((item) => item.id === access.user_id);
        const user = authResult.data.users.find((item) => item.id === access.user_id);
        return {
          ...access,
          full_name: profile?.full_name || "",
          display_name: profile?.display_name || profile?.full_name || "Peregrino",
          email: user?.email || "",
          phone: profile?.phone || user?.phone || "",
          city: profile?.city || "",
          country: profile?.country || "Colombia",
          parish: profile?.parish || "",
          progress: (progress || []).filter(
            (row) => row.user_consecration_id === access.user_consecration_id,
          ),
        };
      }),
    });
  }

  const fingerprint = await hash(
    `${req.headers.get("x-forwarded-for") || "unknown"}|${req.headers.get("user-agent") || ""}`,
  );

  const checkAttempts = async () => {
    const { data } = await admin
      .from("audio_identification_attempts")
      .select("attempt_count,window_started_at")
      .eq("fingerprint_hash", fingerprint)
      .maybeSingle();
    if (!data) return true;
    const age = Date.now() - new Date(data.window_started_at).getTime();
    return age > 15 * 60_000 || data.attempt_count < 8;
  };

  const failedAttempt = async () => {
    const { data } = await admin
      .from("audio_identification_attempts")
      .select("attempt_count,window_started_at")
      .eq("fingerprint_hash", fingerprint)
      .maybeSingle();
    const expired = !data || Date.now() - new Date(data.window_started_at).getTime() > 15 * 60_000;
    await admin.from("audio_identification_attempts").upsert({
      fingerprint_hash: fingerprint,
      attempt_count: expired ? 1 : data.attempt_count + 1,
      window_started_at: expired ? new Date().toISOString() : data.window_started_at,
      updated_at: new Date().toISOString(),
    });
  };

  const findUserByEmail = async (email: string) => {
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) throw error;
    return data.users.find((user) => user.email?.toLowerCase() === email) || null;
  };

  const createSession = async (accessCodeId: string) => {
    const token = randomToken();
    const { error } = await admin.from("audio_access_sessions").insert({
      access_code_id: accessCodeId,
      token_hash: await hash(token),
      expires_at: new Date(Date.now() + 60 * 86_400_000).toISOString(),
    });
    if (error) throw error;
    return token;
  };

  const sessionContext = async (token: string) => {
    if (token.length < 30) return null;
    const { data: session } = await admin
      .from("audio_access_sessions")
      .select("id,access_code_id,expires_at")
      .eq("token_hash", await hash(token))
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();
    if (!session) return null;
    const { data: access } = await admin
      .from("audio_access_codes")
      .select("id,user_id,user_consecration_id,is_active")
      .eq("id", session.access_code_id)
      .eq("is_active", true)
      .maybeSingle();
    if (!access) return null;
    await Promise.all([
      admin
        .from("audio_access_sessions")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", session.id),
      admin
        .from("audio_access_codes")
        .update({ last_used_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("id", access.id),
    ]);
    return access;
  };

  const participantPayload = async (access: { user_id: string; user_consecration_id: string }) => {
    const [{ data: profile }, { data: progress }, { data: appProgress }] = await Promise.all([
      admin.from("profiles").select("full_name,display_name").eq("id", access.user_id).single(),
      admin
        .from("audio_listener_progress")
        .select(
          "day_number,media_asset_id,listened_seconds,listened_percent,last_position_seconds,status,completed_at,updated_at",
        )
        .eq("user_consecration_id", access.user_consecration_id)
        .order("day_number"),
      admin
        .from("user_day_progress")
        .select("day_number")
        .eq("user_consecration_id", access.user_consecration_id)
        .eq("completed", true),
    ]);
    const completedDays = [
      ...new Set([
        ...(progress || [])
          .filter((row) => row.status === "completed")
          .map((row) => Number(row.day_number)),
        ...(appProgress || []).map((row) => Number(row.day_number)),
      ]),
    ].sort((a, b) => a - b);
    return {
      participant: {
        name: profile?.display_name || profile?.full_name || "Peregrino",
      },
      progress: progress || [],
      completedDays,
    };
  };

  const dayIsUnlocked = async (access: { user_consecration_id: string }, day: number) => {
    if (day === 1) return true;
    const [{ data: audioDays }, { data: appDays }] = await Promise.all([
      admin
        .from("audio_listener_progress")
        .select("day_number")
        .eq("user_consecration_id", access.user_consecration_id)
        .eq("status", "completed")
        .lt("day_number", day),
      admin
        .from("user_day_progress")
        .select("day_number")
        .eq("user_consecration_id", access.user_consecration_id)
        .eq("completed", true)
        .lt("day_number", day),
    ]);
    const completed = new Set([
      ...(audioDays || []).map((row) => Number(row.day_number)),
      ...(appDays || []).map((row) => Number(row.day_number)),
    ]);
    return Array.from({ length: day - 1 }, (_, index) => index + 1).every((item) =>
      completed.has(item),
    );
  };

  try {
    if (action === "identify") {
      if (!(await checkAttempts()))
        return json(req, { error: "Demasiados intentos. Espera 15 minutos." }, 429);
      const email = String(payload.email || "")
        .trim()
        .toLowerCase();
      const suppliedName = normalizeName(String(payload.fullName || ""));
      if (!email || !suppliedName)
        return json(req, { error: "Escribe tu nombre completo y correo registrado." }, 400);

      const user = await findUserByEmail(email);
      const { data: profile } = user
        ? await admin
            .from("profiles")
            .select("full_name,display_name")
            .eq("id", user.id)
            .maybeSingle()
        : { data: null };
      const names = [profile?.full_name, profile?.display_name]
        .filter(Boolean)
        .map((name) => normalizeName(String(name)));
      const { data: enrollment } = user
        ? await admin
            .from("user_consecrations")
            .select("id,user_id")
            .eq("user_id", user.id)
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle()
        : { data: null };

      if (!user || !enrollment || !names.includes(suppliedName)) {
        await failedAttempt();
        return json(req, { error: "No encontramos una inscripción con esos datos." }, 404);
      }

      const raw = randomText(8);
      const code = `SM-${raw.slice(0, 4)}-${raw.slice(4)}`;
      const { data: access, error } = await admin
        .from("audio_access_codes")
        .upsert(
          {
            user_id: user.id,
            user_consecration_id: enrollment.id,
            code_hash: await hash(code),
            code_hint: code.slice(-4),
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_consecration_id" },
        )
        .select("id,user_id,user_consecration_id")
        .single();
      if (error) throw error;
      await admin.from("audio_access_sessions").delete().eq("access_code_id", access.id);
      await admin
        .from("audio_identification_attempts")
        .delete()
        .eq("fingerprint_hash", fingerprint);
      const token = await createSession(access.id);
      return json(req, { ok: true, code, token, ...(await participantPayload(access)) });
    }

    if (action === "resume") {
      if (!(await checkAttempts()))
        return json(req, { error: "Demasiados intentos. Espera 15 minutos." }, 429);
      const email = String(payload.email || "")
        .trim()
        .toLowerCase();
      const code = String(payload.code || "")
        .trim()
        .toUpperCase();
      const user = email ? await findUserByEmail(email) : null;
      const { data: access } = code
        ? await admin
            .from("audio_access_codes")
            .select("id,user_id,user_consecration_id,is_active")
            .eq("code_hash", await hash(code))
            .eq("is_active", true)
            .maybeSingle()
        : { data: null };
      if (!user || !access || access.user_id !== user.id) {
        await failedAttempt();
        return json(req, { error: "El correo o el código no coinciden." }, 404);
      }
      const token = await createSession(access.id);
      return json(req, { ok: true, token, ...(await participantPayload(access)) });
    }

    const token = String(payload.token || "");
    const access = await sessionContext(token);
    if (!access) return json(req, { error: "Tu acceso venció. Identifícate nuevamente." }, 401);

    if (action === "me") {
      return json(req, { ok: true, ...(await participantPayload(access)) });
    }

    if (action === "heartbeat") {
      const mediaAssetId = String(payload.mediaAssetId || "");
      const day = Number(payload.day);
      const duration = Math.max(0, Math.round(Number(payload.duration) || 0));
      const position = Math.max(0, Math.round(Number(payload.position) || 0));
      const segments = [...new Set(Array.isArray(payload.segments) ? payload.segments : [])]
        .map(Number)
        .filter((segment) => Number.isInteger(segment) && segment >= 0)
        .slice(0, 10);
      if (!mediaAssetId || !Number.isInteger(day) || duration < 30)
        return json(req, { error: "Datos de reproducción inválidos." }, 400);
      if (!(await dayIsUnlocked(access, day)))
        return json(req, { error: "Completa primero los días anteriores." }, 403);

      const { data: media } = await admin
        .from("media_assets")
        .select("id,consecration_id,asset_type,consecration_days!inner(day_number)")
        .eq("id", mediaAssetId)
        .eq("asset_type", "podcast")
        .maybeSingle();
      const mediaDay = Number(
        (media?.consecration_days as { day_number?: number } | null)?.day_number,
      );
      const { data: enrollment } = await admin
        .from("user_consecrations")
        .select("consecration_id")
        .eq("id", access.user_consecration_id)
        .single();
      if (!media || mediaDay !== day || media.consecration_id !== enrollment?.consecration_id)
        return json(req, { error: "El audio no corresponde a esta consagración." }, 400);

      const { data: row, error } = await admin
        .from("audio_listener_progress")
        .upsert(
          {
            user_id: access.user_id,
            user_consecration_id: access.user_consecration_id,
            media_asset_id: mediaAssetId,
            day_number: day,
            duration_seconds: duration,
            last_position_seconds: Math.min(position, duration),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_consecration_id,media_asset_id" },
        )
        .select("id,completed_at")
        .single();
      if (error) throw error;

      if (segments.length) {
        const maxSegment = Math.ceil(duration / SEGMENT_SECONDS) - 1;
        await admin.from("audio_listened_segments").upsert(
          segments
            .filter((segment) => segment <= maxSegment)
            .map((segment) => ({ progress_id: row.id, segment_index: segment })),
          { onConflict: "progress_id,segment_index", ignoreDuplicates: true },
        );
      }

      const { count } = await admin
        .from("audio_listened_segments")
        .select("progress_id", { count: "exact", head: true })
        .eq("progress_id", row.id);
      const listenedSeconds = Math.min(duration, (count || 0) * SEGMENT_SECONDS);
      const percent = Math.min(100, Number(((listenedSeconds / duration) * 100).toFixed(2)));
      const completed = percent >= 85;
      const completedAt = completed ? row.completed_at || new Date().toISOString() : null;
      const { data: updated, error: updateError } = await admin
        .from("audio_listener_progress")
        .update({
          listened_seconds: listenedSeconds,
          listened_percent: percent,
          status: completed ? "completed" : listenedSeconds ? "in_progress" : "started",
          completed_at: completedAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id)
        .select(
          "day_number,media_asset_id,listened_seconds,listened_percent,last_position_seconds,status,completed_at,updated_at",
        )
        .single();
      if (updateError) throw updateError;
      return json(req, { ok: true, progress: updated });
    }

    return json(req, { error: "Acción no reconocida" }, 400);
  } catch (error) {
    console.error(error);
    return json(req, { error: "No fue posible completar la operación." }, 500);
  }
});
