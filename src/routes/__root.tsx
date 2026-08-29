import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { applyAppTheme, loadStoredAppTheme } from "@/lib/app-theme";
import { applyReadingPreferences, loadReadingPreferences } from "@/lib/reading-preferences";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

function getAppAssetSignature(root: ParentNode): string {
  const assets = [
    ...Array.from(
      root.querySelectorAll<HTMLScriptElement>("script[src]"),
      (node) => node.getAttribute("src") ?? "",
    ),
    ...Array.from(
      root.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href]'),
      (node) => node.getAttribute("href") ?? "",
    ),
  ]
    .filter((url) => url.includes("/assets/"))
    .map((url) => new URL(url, window.location.origin).pathname);

  return assets.sort().join("|");
}

async function clearTechnicalCache(): Promise<void> {
  if ("caches" in window) {
    const cacheNames = await window.caches.keys();
    await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
  }

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.update()));
  }
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Consagración 33 días a los Santos Arcángeles" },
      {
        name: "description",
        content:
          "Camino espiritual de 33 días con San Miguel, San Gabriel y San Rafael: Palabra de Dios, formación, oración y consagración a Jesucristo.",
      },
      { name: "theme-color", content: "#101a33" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Consagración 33" },
      { property: "og:title", content: "Consagración 33 días a los Santos Arcángeles" },
      {
        property: "og:description",
        content:
          "¿Quién como Dios? ¡Nadie como Dios! Un camino de fe, conversión, santidad y misión.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Cinzel:wght@400;500;600;700&family=EB+Garamond:wght@400;500;600;700&family=Karla:wght@300;400;500;600;700&family=Literata:opsz,wght@7..72,400;7..72,500;7..72,600;7..72,700&display=swap",
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const syncPreferences = () => {
      applyAppTheme(loadStoredAppTheme());
      applyReadingPreferences(loadReadingPreferences());
    };
    syncPreferences();
    window.addEventListener("storage", syncPreferences);
    return () => window.removeEventListener("storage", syncPreferences);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      void router.invalidate();
      if (event !== "SIGNED_OUT") void queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  useEffect(() => {
    let checking = false;
    let active = true;

    const checkForNewVersion = async () => {
      if (checking || !navigator.onLine) return;
      checking = true;

      try {
        const currentSignature = getAppAssetSignature(document);
        const checkUrl = new URL(window.location.href);
        checkUrl.searchParams.set("__app_version_check", Date.now().toString());

        const response = await fetch(checkUrl, {
          cache: "no-store",
          credentials: "same-origin",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!response.ok || !active) return;

        const latestDocument = new DOMParser().parseFromString(await response.text(), "text/html");
        const latestSignature = getAppAssetSignature(latestDocument);

        if (currentSignature && latestSignature && currentSignature !== latestSignature && active) {
          await clearTechnicalCache();
          window.location.reload();
        }
      } catch {
        // A temporary network failure must not interrupt the user's spiritual journey.
      } finally {
        checking = false;
      }
    };

    const checkWhenReturning = () => {
      if (document.visibilityState === "visible") void checkForNewVersion();
    };

    void checkForNewVersion();
    window.addEventListener("focus", checkForNewVersion);
    document.addEventListener("visibilitychange", checkWhenReturning);
    const interval = window.setInterval(() => void checkForNewVersion(), 60_000);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", checkForNewVersion);
      document.removeEventListener("visibilitychange", checkWhenReturning);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
