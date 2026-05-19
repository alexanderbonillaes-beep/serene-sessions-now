import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-primary">404</h1>
        <h2 className="mt-4 text-xl text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl text-foreground">Algo salió mal</h1>
        <p className="mt-2 text-sm text-muted-foreground">Intenta recargar la página.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Alexander Bonilla - Psicólogo Clínico" },
      { name: "description", content: "Acompañamiento psicológico cercano, humano y basado en evidencia. Terapia online y presencial para niños, adolescentes y adultos jóvenes." },
      { property: "og:title", content: "Alexander Bonilla - Psicólogo Clínico" },
      { property: "og:description", content: "Acompañamiento psicológico cercano, humano y basado en evidencia. Terapia online y presencial para niños, adolescentes y adultos jóvenes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Alexander Bonilla - Psicólogo Clínico" },
      { name: "twitter:description", content: "Acompañamiento psicológico cercano, humano y basado en evidencia. Terapia online y presencial para niños, adolescentes y adultos jóvenes." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/a1530940-14cb-48de-b7ca-2172bf747ddf" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/a1530940-14cb-48de-b7ca-2172bf747ddf" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </QueryClientProvider>
  );
}
