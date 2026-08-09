import { ArrowRight } from "lucide-react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import sanMiguel from "@/assets/san-miguel-hero.jpg";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Consagración de 33 días a los Santos Arcángeles" },
      {
        name: "description",
        content:
          "San Miguel, San Gabriel y San Rafael. Un camino de fe, conversión, combate espiritual, santidad y misión hacia Jesucristo.",
      },
      { property: "og:title", content: "Consagración de 33 días a los Santos Arcángeles" },
      {
        property: "og:description",
        content: "¿Quién como Dios? ¡Nadie como Dios! Comienza tu camino de 33 días.",
      },
    ],
  }),
  component: Bienvenida,
});

function Bienvenida() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setSplash(false), 1800);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!splash && !loading && session) void navigate({ to: "/dashboard", replace: true });
  }, [splash, loading, session, navigate]);

  if (splash) {
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#061426] px-6 text-center text-[#f7f2e7]">
        <img
          src={sanMiguel}
          alt=""
          aria-hidden
          width={1024}
          height={1536}
          className="absolute inset-0 size-full object-cover object-top opacity-45"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,20,38,.08),rgba(6,20,38,.7)_65%,#061426)]"
          aria-hidden
        />
        <div className="animate-rise relative">
          <p className="text-xs uppercase tracking-[0.42em] text-[#e4bd68]">Consagración</p>
          <p className="font-display text-6xl text-[#f3d58e]">33 días</p>
          <p className="mt-3 font-display text-sm tracking-[0.2em]">A LOS SANTOS ARCÁNGELES</p>
          <p className="mt-8 font-display text-lg text-[#e4bd68]">«¿Quién como Dios?»</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#061426] text-[#f7f2e7]">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(228,189,104,.16),transparent_38%),linear-gradient(135deg,#0b2442,#061426_65%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[520px] flex-col pb-[calc(24px+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)] shadow-2xl shadow-black/50">
        <div className="relative min-h-[48dvh] flex-1 overflow-hidden">
          <img
            src={sanMiguel}
            alt="San Miguel Arcángel con espada y escudo entre nubes de luz"
            width={1024}
            height={1536}
            className="absolute inset-0 size-full object-cover object-top"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_30%,rgba(6,20,38,.18)_50%,rgba(6,20,38,.86)_78%,#061426_96%)]"
            aria-hidden
          />
        </div>

        <section className="relative z-10 -mt-24 px-6 text-center sm:px-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-[#e4bd68]">
            Consagración
          </p>
          <h1 className="mt-1 font-display uppercase leading-none">
            <span className="block text-[clamp(2.8rem,15vw,4.5rem)] text-[#f5d991] drop-shadow-lg">
              33 días
            </span>
            <span className="mt-1 block text-[11px] tracking-[0.24em] text-[#f7f2e7]/90">
              A los Santos Arcángeles
            </span>
            <span className="mt-4 block text-[clamp(1.65rem,8vw,2.35rem)] tracking-[0.08em]">
              San Miguel
            </span>
          </h1>
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#f7f2e7]/75">
            San Gabriel · San Rafael
          </p>

          <div className="mx-auto mt-4 flex max-w-xs items-center gap-3 text-[#d7ab51]" aria-hidden>
            <span className="h-px flex-1 bg-current opacity-35" />
            <span className="size-1 rotate-45 bg-current" />
            <span className="h-px flex-1 bg-current opacity-35" />
          </div>
          <p className="mt-3 font-display text-sm uppercase tracking-[0.15em] text-[#e4bd68]">
            ¿Quién como Dios?
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#f7f2e7]/55">
            Nadie como Dios
          </p>
          <p className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-[#f7f2e7]/80">
            Un camino de fe, conversión, combate espiritual, santidad y misión.
          </p>

          <nav aria-label="Acciones de bienvenida" className="mt-6 flex flex-col gap-3">
            <Link
              to="/auth"
              search={{ modo: "registro" }}
              className="flex min-h-13 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#e4bd68,#b98227)] px-5 text-sm font-semibold text-[#061426] shadow-[0_8px_24px_rgba(0,0,0,.25)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5d991]"
            >
              Comenzar mi consagración
            </Link>
            <Link
              to="/auth"
              search={{ modo: "login" }}
              className="flex min-h-13 items-center justify-center rounded-xl border border-[#e4bd68]/65 bg-[#061426]/35 px-5 text-sm font-semibold text-[#f7f2e7] backdrop-blur-sm transition hover:border-[#e4bd68] hover:bg-[#e4bd68]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5d991]"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/recursos"
              className="mx-auto flex min-h-11 items-center gap-2 px-3 text-sm text-[#f7f2e7]/80 transition hover:text-[#e4bd68] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#f5d991]"
            >
              Conocer la consagración <ArrowRight className="size-4" aria-hidden />
            </Link>
          </nav>
        </section>
      </div>
    </main>
  );
}
