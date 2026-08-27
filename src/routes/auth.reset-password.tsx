import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Restablecer contraseña · Consagración 33 días" },
      { name: "description", content: "Define una nueva contraseña para tu cuenta." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Restablecer contraseña" },
      { property: "og:description", content: "Define una nueva contraseña para tu cuenta." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const parsed = z.string().min(8, "La contraseña debe tener al menos 8 caracteres.").max(72).safeParse(password);
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);
      if (password !== confirm) throw new Error("Las contraseñas no coinciden.");
      const { data: currentUser } = await supabase.auth.getUser();
      const { error } = await supabase.auth.updateUser({
        password,
        data: {
          ...(currentUser.user?.user_metadata ?? {}),
          must_change_password: false,
        },
      });
      if (error) throw error;
      toast.success("Contraseña actualizada.");
      void navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No fue posible actualizar la contraseña.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <h1 className="text-center font-display text-2xl">Nueva contraseña</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Escribe la nueva contraseña para tu cuenta.
      </p>
      <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
        <div>
          <Label htmlFor="password">Nueva contraseña</Label>
          <Input
            id="password"
            type="password"
            className="mt-1"
            value={password}
            maxLength={72}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="confirm">Confirmar contraseña</Label>
          <Input
            id="confirm"
            type="password"
            className="mt-1"
            value={confirm}
            maxLength={72}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <Button type="submit" size="lg" disabled={busy}>
          Guardar contraseña
        </Button>
      </form>
    </div>
  );
}
