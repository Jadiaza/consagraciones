import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, CalendarDays, ChevronLeft, CircleDot, Home, User } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

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
    <header className="sticky top-0 z-30 flex h-[calc(56px+env(safe-area-inset-top))] items-end gap-2 border-b border-[#c99a3d]/12 bg-[#04101f]/92 px-3 pb-2 backdrop-blur-xl">
      {back ? (
        <button
          type="button"
          aria-label="Volver"
          onClick={() => void navigate({ to: "..", replace: false })}
          className="flex size-10 items-center justify-center rounded-full text-[#f5f1e8]/85 transition hover:bg-[#e2b85e]/10 hover:text-[#e2b85e] focus-visible:outline-2 focus-visible:outline-[#e2b85e]"
        >
          <ChevronLeft className="size-5" />
        </button>
      ) : (
        <span className="size-10" aria-hidden />
      )}
      <h1 className="flex-1 truncate pb-2 text-center font-display text-base tracking-wide text-[#f5f1e8]">
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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#c99a3d]/15 bg-[#04101f]/96 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-2xl">
        {NAV.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              aria-label={label}
              className="flex min-h-16 flex-col items-center justify-center gap-1 py-2 text-[11px] text-[#b8c2d1] transition-colors hover:text-[#f5f1e8] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#e2b85e]"
              activeProps={{ className: "!text-[#e2b85e]" }}
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
  return (
    <div className="relative min-h-dvh text-foreground">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,154,61,.08),transparent_28rem)]"
        aria-hidden
      />
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
