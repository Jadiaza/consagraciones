import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Mail, Lock, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import sanMiguel from "@/assets/san-miguel-hero.jpg";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Modo = "login" | "registro" | "recuperar";

const searchSchema = z.object({
  modo: z.enum(["login", "registro", "recuperar"]).catch("login"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Iniciar sesión · Consagración 33 días" },
      {
        name: "description",
        content:
          "Accede a tu camino de consagración a los Santos Arcángeles y continúa desde cualquier dispositivo.",
      },
      { property: "og:title", content: "Iniciar sesión · Consagración 33 días" },
      {
        property: "og:description",
        content: "Tu camino quedará guardado para que puedas continuar.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { modo } = Route.useSearch();
  const navigate = useNavigate();
  const { session } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [remember, setRemember] = useState(true);
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [emailSent, setEmailSent] = useState<null | "confirm" | "reset">(null);

  useEffect(() => {
    if (!session?.user) return;
    let active = true;
    void supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .then(({ data }) => {
        if (!active) return;
        const isStaff = data?.some(({ role }) => role === "admin" || role === "editor");
        void navigate({ to: isStaff ? "/admin" : "/dashboard", replace: true });
      });
    return () => {
      active = false;
    };
  }, [session, navigate]);

  const setModo = (next: Modo) => void navigate({ to: "/auth", search: { modo: next } });
  const authRedirectUrl = () => `${window.location.origin}/auth?modo=login`;

  const goToLogin = () => {
    setEmailSent(null);
    setPassword("");
    setConfirm("");
    setModo("login");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (modo === "recuperar") {
        const parsed = z.string().trim().email().max(255).safeParse(email);
        if (!parsed.success) throw new Error("Introduce un correo electrónico válido.");
        const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        if (error) throw error;
        setEmailSent("reset");
        return;
      }

      if (modo === "registro") {
        const schema = z.object({
          fullName: z.string().trim().min(3, "Escribe tu nombre completo.").max(120),
          email: z.string().trim().email("Correo electrónico no válido.").max(255),
          password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.").max(72),
        });
        const parsed = schema.safeParse({ fullName, email, password });
        if (!parsed.success)
          throw new Error(parsed.error.issues[0]?.message ?? "Revisa los datos.");
        if (password !== confirm) throw new Error("Las contraseñas no coinciden.");
        if (!terms) throw new Error("Debes aceptar los términos y la política de privacidad.");

        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password,
          options: {
            emailRedirectTo: authRedirectUrl(),
            data: { full_name: parsed.data.fullName },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setEmailSent("confirm");
          return;
        }
        void navigate({ to: "/onboarding", replace: true });
        return;
      }

      const { data: login, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", login.user.id);
      const isStaff = roles?.some(({ role }) => role === "admin" || role === "editor");
      void navigate({ to: isStaff ? "/admin" : "/dashboard", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ha ocurrido un error.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: authRedirectUrl() },
    });
    if (error) {
      setBusy(false);
      toast.error(error.message || "No fue posible iniciar sesión con Google.");
    }
  };

  const resendConfirmation = async () => {
    const parsed = z.string().trim().email().safeParse(email);
    if (!parsed.success) {
      toast.error("Introduce nuevamente tu correo electrónico.");
      setEmailSent(null);
      setModo("registro");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: parsed.data,
        options: { emailRedirectTo: authRedirectUrl() },
      });
      if (error) throw error;
      toast.success("Correo de confirmación reenviado. Revisa también la carpeta de spam.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No fue posible reenviar el correo.");
    } finally {
      setBusy(false);
    }
  };

  const title =
    modo === "registro"
      ? "Crear cuenta"
      : modo === "recuperar"
        ? "Recuperar contraseña"
        : "Iniciar sesión";

  return (
    <div className="relative min-h-screen">
      <img
        src={sanMiguel}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover object-top opacity-15"
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-12 pt-10">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
          ← Volver
        </Link>

        <div className="mt-6 text-center">
          <h1 className="font-display text-2xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {modo === "registro"
              ? "Únete al camino de consagración."
              : modo === "recuperar"
                ? "Te enviaremos un enlace para restablecer tu contraseña."
                : "Bienvenido de nuevo."}
          </p>
        </div>

        {emailSent ? (
          <div className="surface-sacred mt-8 rounded-2xl p-6 text-center">
            <Mail className="mx-auto size-6 text-primary" aria-hidden />
            <p className="mt-3 font-display">Revisa tu correo</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {emailSent === "confirm"
                ? "Te enviamos un enlace para confirmar tu cuenta. Al confirmarla podrás comenzar tu camino."
                : "Te enviamos un enlace para restablecer tu contraseña."}
            </p>
            {emailSent === "confirm" && (
              <Button
                variant="outline"
                className="mt-5 w-full"
                onClick={resendConfirmation}
                disabled={busy}
              >
                {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
                Reenviar correo de confirmación
              </Button>
            )}
            <Button
              variant="outline"
              className={emailSent === "confirm" ? "mt-3 w-full" : "mt-5 w-full"}
              onClick={goToLogin}
            >
              Volver al inicio de sesión
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
            {modo === "registro" && (
              <Field icon={<UserRound className="size-4" />} label="Nombre completo">
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={120}
                  autoComplete="name"
                  placeholder="Nombre completo"
                  className="border-0 bg-transparent px-0 focus-visible:ring-0"
                />
              </Field>
            )}

            <Field icon={<Mail className="size-4" />} label="Correo electrónico">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                autoComplete="email"
                placeholder="Correo electrónico"
                className="border-0 bg-transparent px-0 focus-visible:ring-0"
              />
            </Field>

            {modo !== "recuperar" && (
              <Field icon={<Lock className="size-4" />} label="Contraseña">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={72}
                  autoComplete={modo === "registro" ? "new-password" : "current-password"}
                  placeholder="Contraseña"
                  className="border-0 bg-transparent px-0 focus-visible:ring-0"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </Field>
            )}

            {modo === "registro" && (
              <Field icon={<Lock className="size-4" />} label="Confirmar contraseña">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  maxLength={72}
                  autoComplete="new-password"
                  placeholder="Confirmar contraseña"
                  className="border-0 bg-transparent px-0 focus-visible:ring-0"
                />
              </Field>
            )}

            {modo === "login" && (
              <div className="flex items-center justify-between px-1 text-sm">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
                  Recordarme
                </label>
                <button type="button" className="text-primary" onClick={() => setModo("recuperar")}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {modo === "registro" && (
              <label className="flex items-start gap-2 px-1 text-sm text-muted-foreground">
                <Checkbox
                  className="mt-0.5"
                  checked={terms}
                  onCheckedChange={(v) => setTerms(Boolean(v))}
                  aria-label="Acepto los términos y la política de privacidad"
                />
                <span>
                  Acepto los <span className="text-primary underline">Términos y Condiciones</span>{" "}
                  y la <span className="text-primary underline">Política de Privacidad</span>.
                </span>
              </label>
            )}

            <Button type="submit" size="lg" className="mt-2 h-12" disabled={busy}>
              {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
              {modo === "registro"
                ? "Crear mi cuenta"
                : modo === "recuperar"
                  ? "Enviar enlace"
                  : "Iniciar sesión"}
            </Button>

            {modo === "registro" && (
              <p className="text-center text-xs text-muted-foreground">
                Tu camino quedará guardado para que puedas continuar desde cualquier dispositivo.
              </p>
            )}

            {modo !== "recuperar" && (
              <>
                <div className="my-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />o continúa con
                  <span className="h-px flex-1 bg-border" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12"
                  onClick={handleGoogle}
                  disabled={busy}
                >
                  Continuar con Google
                </Button>
              </>
            )}
          </form>
        )}

        {!emailSent && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {modo === "registro" ? (
              <>
                ¿Ya tienes cuenta?{" "}
                <button className="text-primary" onClick={() => setModo("login")}>
                  Iniciar sesión
                </button>
              </>
            ) : (
              <>
                ¿No tienes cuenta?{" "}
                <button className="text-primary" onClick={() => setModo("registro")}>
                  Regístrate
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-sacred flex items-center gap-3 rounded-xl px-4">
      <span className="text-muted-foreground" aria-hidden>
        {icon}
      </span>
      <Label className="sr-only">{label}</Label>
      <div className="flex flex-1 items-center gap-2 py-1">{children}</div>
    </div>
  );
}
