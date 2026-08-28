import type { User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { validateContact, validateEmail, validatePassword } from "@/lib/account-validation";

type Profile = { full_name: string | null; community: string | null };

export function AccountSettings({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const profile = useQuery({
    queryKey: ["account-profile", user.id],
    enabled: open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name,community")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!busy) setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button className="mt-3" variant="outline">
          Editar mis datos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Mis datos y seguridad</DialogTitle>
          <DialogDescription>
            Actualiza tus datos personales sin perder tu progreso.
          </DialogDescription>
        </DialogHeader>
        {profile.isPending && <p role="status">Cargando tus datos…</p>}
        {profile.isError && (
          <div role="alert">
            No se pudieron cargar tus datos.{" "}
            <Button variant="outline" onClick={() => void profile.refetch()}>
              Reintentar
            </Button>
          </div>
        )}
        {open && profile.data && !profile.isError && (
          <AccountForms
            key={user.id}
            user={user}
            profile={profile.data}
            busy={busy}
            onBusy={setBusy}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AccountForms({
  user,
  profile,
  busy,
  onBusy,
}: {
  user: User;
  profile: Profile;
  busy: boolean;
  onBusy: (value: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const lock = useRef(false);
  const [name, setName] = useState(profile.full_name ?? user.user_metadata["full_name"] ?? "");
  // A contact number is metadata, never an SMS login identity.
  const [phone, setPhone] = useState(
    typeof user.user_metadata["contact_phone"] === "string"
      ? user.user_metadata["contact_phone"]
      : "",
  );
  const [community, setCommunity] = useState(profile.community ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const hasPasswordProvider = user.app_metadata.providers?.includes("email");

  const run = async (action: () => Promise<string>) => {
    if (lock.current) return;
    lock.current = true;
    onBusy(true);
    setMessage("");
    setErrorMessage("");
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || data.user?.id !== user.id)
        throw new Error("Tu sesión cambió o expiró. Vuelve a iniciar sesión.");
      setMessage(await action());
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No fue posible guardar. Intenta nuevamente.",
      );
    } finally {
      lock.current = false;
      onBusy(false);
    }
  };

  const saveContact = () =>
    run(async () => {
      const values = validateContact(name, phone, community);
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: values.fullName,
          contact_phone: values.contactPhone,
        },
      });
      if (authError) throw authError;
      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: values.fullName,
          display_name: values.fullName,
          community: values.community || null,
        })
        .eq("id", user.id)
        .select("id")
        .single();
      if (error || !data)
        throw new Error(
          "Nombre y teléfono guardados en tu cuenta, pero no se pudo sincronizar el perfil y la comunidad. Pulsa Guardar datos para reintentar.",
        );
      await queryClient.invalidateQueries({ queryKey: ["account-profile", user.id] });
      return "Datos personales actualizados.";
    });

  const saveEmail = () =>
    run(async () => {
      const nextEmail = validateEmail(email, user.email ?? "");
      const { data, error } = await supabase.auth.updateUser(
        { email: nextEmail },
        {
          emailRedirectTo: `${window.location.origin}/perfil`,
        },
      );
      if (error) throw error;
      return data.user?.email === nextEmail
        ? "Correo actualizado. Utiliza el nuevo correo para ingresar."
        : "Solicitud enviada. Revisa el correo actual y el nuevo y sigue los enlaces de confirmación. Hasta completarla, ingresa con tu correo actual.";
    });

  const savePassword = () =>
    run(async () => {
      validatePassword(password, confirmation);
      if (hasPasswordProvider && !currentPassword) throw new Error("Escribe tu contraseña actual.");
      if (currentPassword && password === currentPassword)
        throw new Error("Elige una contraseña diferente de la actual.");
      const { error } = await supabase.auth.updateUser({
        password,
        ...(currentPassword ? { current_password: currentPassword } : {}),
        data: { must_change_password: false },
      });
      if (error) throw error;
      setPassword("");
      setConfirmation("");
      setCurrentPassword("");
      return "Contraseña actualizada. Utilízala en tu próximo ingreso.";
    });

  return (
    <div className="space-y-6">
      <div aria-live="polite" className="text-sm">
        {message && <p role="status">{message}</p>}
        {errorMessage && (
          <p role="alert" className="text-destructive">
            {errorMessage}
          </p>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void saveContact();
        }}
      >
        <fieldset disabled={busy} className="space-y-3">
          <legend className="mb-2 font-semibold">Datos personales</legend>
          <div>
            <Label htmlFor="account-name">Nombre completo</Label>
            <Input
              id="account-name"
              autoComplete="name"
              required
              maxLength={160}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="account-phone">Teléfono / WhatsApp (opcional)</Label>
            <Input
              id="account-phone"
              type="tel"
              autoComplete="tel"
              maxLength={25}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Puedes dejarlo vacío. No es necesario para ingresar.
            </p>
          </div>
          <div>
            <Label htmlFor="account-community">Parroquia o comunidad (opcional)</Label>
            <Input
              id="account-community"
              maxLength={160}
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
            />
          </div>
          <Button type="submit">Guardar datos</Button>
        </fieldset>
      </form>
      <form
        className="border-t pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          void saveEmail();
        }}
      >
        <fieldset disabled={busy} className="space-y-3">
          <legend className="mb-2 font-semibold">Correo de acceso</legend>
          <p className="break-all text-sm">Correo actual: {user.email}</p>
          {user.new_email && (
            <p className="break-all text-sm">Pendiente de confirmar: {user.new_email}</p>
          )}
          <div>
            <Label htmlFor="account-email">Nuevo correo</Label>
            <Input
              id="account-email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            El cambio puede requerir confirmación en ambos correos. Si no tienes acceso al anterior,
            contacta al administrador.
          </p>
          <Button type="submit" variant="outline">
            Solicitar cambio de correo
          </Button>
        </fieldset>
      </form>
      <form
        className="border-t pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          void savePassword();
        }}
      >
        <fieldset disabled={busy} className="space-y-3">
          <legend className="mb-2 font-semibold">Contraseña</legend>
          {hasPasswordProvider && (
            <div>
              <Label htmlFor="account-current-password">Contraseña actual</Label>
              <Input
                id="account-current-password"
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          )}
          <div>
            <Label htmlFor="account-password">Nueva contraseña</Label>
            <Input
              id="account-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="account-confirm-password">Confirmar nueva contraseña</Label>
            <Input
              id="account-confirm-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Al menos 8 caracteres. Si se solicita volver a iniciar sesión, hazlo antes de
            reintentar.
          </p>
          <Button type="submit" variant="outline">
            Cambiar contraseña
          </Button>
        </fieldset>
      </form>
    </div>
  );
}
