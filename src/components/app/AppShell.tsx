import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, CalendarDays, ChevronLeft, CircleDot, Home, User } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const LVJ_ORIGINS = new Set([
  "https://lavozdejesus.vercel.app",
  "https://lavozdejesus.co",
  "https://www.lavozdejesus.co",
]);

function useLvjIntegration() {
  const [integrated, setIntegrated] = useState(false);
  const [returnUrl, setReturnUrl] = useState("https://lavozdejesus.vercel.app/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") !== "lvjprayer") return;

    setIntegrated(true);

    const requestedReturn = params.get("return");
    if (!requestedReturn) return;

    try {
      const url = new URL(requestedReturn, window.location.origin);
      if (LVJ_ORIGINS.has(url.origin)) {
        setReturnUrl(url.toString());
      }
    } catch {
      // Mantiene el destino seguro por defecto.
    }
  }, []);

  return { integrated, returnUrl };
}

function LvJIntegrationBar({ returnUrl }: { returnUrl: string }) {
  return (
    <div className="lvj-integration-bar sticky top-0 z-50 flex min-h-12 items-center justify-between gap-3 border-b px-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="lvj-integration-bar__mark flex size-8 shrink-0 items-center justify-center rounded-full border">
          ✦
        </span>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em]">
            LVJPRAYER
          </p>
          <p className="truncate text-[11px] opacity-80">Estás dentro de Consagraciones</p>
        </div>
      </div>
      <a
        href={returnUrl}
        className="lvj-integration-bar__back inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:opacity-90 focus-visible:outline-2"
      >
        <ArrowLeft className="size-4" aria-hidden />
        <span>Volver a LVJPRAYER</span>
      </a>
    </div>
  );
}

export function SpiritualHeader({
  title,
  back,
  action,
}: {
  title?: string | undefined;
  back?: boolean | undefined;
  action?: ReactNode | undefined;
}) {
  const navigate = useNavigate();
  return (
    <header className="spiritual-header sticky top-0 z-30 flex h-[calc(56px+env(safe-area-inset-top))] items-end gap-2 border-b px-3 pb-2 backdrop-blur-xl">
      {back ? (
        <button
          type="button"
          aria-label="Volver"
          onClick={() => void navigate({ to: "..", replace: false })}
          className="spiritual-header__button flex size-10 items-center justify-center rounded-full transition focus-visible:outline-2"
        >
          <ChevronLeft className="size-5" />
        </button>
      ) : (
        <span className="size-10" aria-hidden />
      )}
      <h1 className="spiritual-header__title flex-1 truncate pb-2 text-center font-display text-base tracking-wide">
        {title}
      </h1>
      <span className="flex min-w-10 justify-end pb-1">{action}</span>
    </header>
  );
}

const NAV = [
  { to: "/dashboard", label: "Inicio", icon: Home },
  { to: "/dias", label: "Días", icon: CalendarDays },
  { to: "/coronilla", label: "Coronilla", icon: CircleDot },
  { to: "/recursos", label: "Recursos", icon: BookOpen },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNavigation() {
  return (
    <nav
      aria-label="Navegación principal"
      className="bottom-navigation fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-2xl">
        {NAV.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              aria-label={label}
              className="bottom-navigation__link flex min-h-16 flex-col items-center justify-center gap-1 py-2 text-[11px] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2"
              activeProps={{ className: "is-active" }}
            >
              <Icon className="size-5" aria-hidden />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AppShell({
  children,
  title,
  back,
  action,
  hideNav,
  className,
}: {
  children: ReactNode;
  title?: string | undefined;
  back?: boolean | undefined;
  action?: ReactNode | undefined;
  hideNav?: boolean | undefined;
  className?: string | undefined;
}) {
  const { integrated, returnUrl } = useLvjIntegration();

  return (
    <div className="app-shell relative min-h-dvh text-foreground">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,154,61,.08),transparent_28rem)]"
        aria-hidden
      />
      {integrated && <LvJIntegrationBar returnUrl={returnUrl} />}
      {(title || back || action) && <SpiritualHeader title={title} back={back} action={action} />}
      <main
        className={cn(
          "relative mx-auto w-full max-w-2xl px-4 pt-4 pb-[calc(112px+env(safe-area-inset-bottom))]",
          className,
        )}
      >
        {children}
      </main>
      {!hideNav && <BottomNavigation />}
    </div>
  );
}
