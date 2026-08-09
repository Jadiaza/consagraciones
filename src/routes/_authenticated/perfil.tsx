import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { EmptyState, ProgressCard, SectionTitle } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatLongDate, myConsecrationQuery, myProgressQuery } from "@/lib/consecration";

export const Route = createFileRoute("/_authenticated/perfil")({ component: Perfil });

function Perfil() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, displayName } = useAuth();
  const { data: mine } = useQuery(myConsecrationQuery(user?.id));
  const { data: progress } = useQuery(myProgressQuery(mine?.id));

  const { data: intentions } = useQuery({
    queryKey: ["intentions", user?.id],
    enabled: Boolean(user),
    queryFn: async () => (await supabase.from("user_intentions").select("*").order("created_at")).data ?? [],
  });
  const { data: journal } = useQuery({
    queryKey: ["journal", user?.id],
    enabled: Boolean(user),
    queryFn: async () =>
      (await supabase.from("user_journal_entries").select("*").order("created_at", { ascending: false }).limit(20)).data ?? [],
  });
  const { data: petitions, refetch: refetchPetitions } = useQuery({
    queryKey: ["petitions", user?.id],
    enabled: Boolean(user),
    queryFn: async () => (await supabase.from("user_petitions").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const [petition, setPetition] = useState("");
  const completed = (progress ?? []).filter((p) => p.completed).length;

  const addPetition = async () => {
    if (!user || !petition.trim()) return;
    const { error } = await supabase.from("user_petitions").insert({
      user_id: user.id,
      title: petition.trim().slice(0, 160),
      visibility: "private",
    });
    if (error) toast.error("No fue posible guardar la petición.");
    else {
      setPetition("");
      void refetchPetitions();
    }
  };

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/", replace: true });
  };

  return (
    <AppShell title="Mi consagración">
      <div className="surface-sacred rounded-2xl p-4">
        <p className="font-display text-lg">{displayName}</p>
        <p className="text-sm text-muted-foreground">Mensajero de San Miguel</p>
        {mine && (
          <p className="mt-2 text-xs text-muted-foreground">
            Inicio: {formatLongDate(mine.start_date)} · Finalización prevista: {formatLongDate(mine.expected_end_date)}
          </p>
        )}
      </div>

      <div className="mt-4"><ProgressCard completed={completed} total={33} /></div>

      <SectionTitle hint="Privada, sólo tú puedes verla">Mi intención</SectionTitle>
      {intentions && intentions.length > 0 ? (
        intentions.map((item) => (
          <p key={item.id} className="surface-sacred rounded-2xl p-4 text-[15px] leading-relaxed">{item.content}</p>
        ))
      ) : (
        <EmptyState title="Aún no has escrito tu intención" />
      )}

      <SectionTitle hint="Estrictamente privado">Mi diario</SectionTitle>
      {journal && journal.length > 0 ? (
        <div className="flex flex-col gap-2">
          {journal.map((entry) => (
            <article key={entry.id} className="surface-sacred rounded-2xl p-4">
              <p className="text-xs text-primary">Día {entry.day_number ?? "—"}</p>
              <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed">{entry.content}</p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Tu diario está vacío" description="Escribe desde la pantalla de cada día." />
      )}

      <SectionTitle>Mis peticiones</SectionTitle>
      <div className="flex gap-2">
        <Input value={petition} maxLength={160} onChange={(e) => setPetition(e.target.value)} placeholder="Escribe una petición" />
        <Button onClick={addPetition}>Añadir</Button>
      </div>
      <div className="mt-2 flex flex-col gap-2">
        {(petitions ?? []).map((item) => (
          <p key={item.id} className="surface-sacred rounded-xl p-3 text-sm">{item.title}</p>
        ))}
      </div>

      <SectionTitle>Mi acompañante</SectionTitle>
      <EmptyState
        title="Aún no tienes acompañante asignado"
        description="Cuando se te asigne un acompañante podrás compartir con él sólo lo que autorices."
      />

      <SectionTitle>Certificado</SectionTitle>
      <div className="surface-sacred rounded-2xl border-2 border-primary/40 p-6 text-center">
        <p className="font-display text-lg">Certificado de Consagración</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {completed >= 33
            ? "Has completado los 33 días. Tu certificado está disponible."
            : `Disponible al completar el Día 33 (${completed}/33).`}
        </p>
        <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Mensajeros de San Miguel Arcángel · Escuela de Fe y Misión
          <br />con la colaboración de La Voz de Jesús
        </p>
      </div>

      <Textarea className="sr-only" aria-hidden readOnly value="" />

      <Button className="mt-8 w-full" variant="outline" onClick={signOut}>Cerrar sesión</Button>
    </AppShell>
  );
}
