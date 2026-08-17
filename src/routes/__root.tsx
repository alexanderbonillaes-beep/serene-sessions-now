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
import { PrivacyBanner } from "@/components/site/PrivacyBanner";
import { Toaster } from "@/components/ui/sonner";

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

const SITE_URL = "https://www.psalexanderbonilla.cl";
const DEFAULT_TITLE = "Psicólogo en La Serena, Coquimbo y Ovalle | Alexander Bonilla";
const DEFAULT_DESC = "Psicólogo clínico en La Serena, Coquimbo, Ovalle y Vicuña. Terapia para ansiedad, depresión, autoestima y neurodivergencias. Online y presencial.";
const OG_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/a1530940-14cb-48de-b7ca-2172bf747ddf";

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "MedicalBusiness", "Psychologist"],
  name: "Alexander Bonilla — Psicólogo Clínico",
  image: OG_IMAGE,
  url: SITE_URL,
  telephone: "+56972337319",
  email: "ps.alexanderbonilla@gmail.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Balmaceda 2195, Edificio Portal las Higueras Of. 401",
    addressLocality: "La Serena",
    addressRegion: "Coquimbo",
    addressCountry: "CL",
  },
  geo: { "@type": "GeoCoordinates", latitude: -29.9027, longitude: -71.2519 },
  areaServed: [
    { "@type": "City", name: "La Serena" },
    { "@type": "City", name: "Coquimbo" },
    { "@type": "City", name: "Ovalle" },
    { "@type": "City", name: "Vicuña" },
    { "@type": "AdministrativeArea", name: "Región de Coquimbo" },
    { "@type": "Country", name: "Chile" },
  ],
  openingHoursSpecification: [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "17:30",
    closes: "21:30",
  }],
  sameAs: ["https://instagram.com/psalebonilla"],
  medicalSpecialty: ["Psychiatric", "Psychotherapy"],
  paymentAccepted: ["Particular", "Fonasa", "Isapre", "Transferencia", "Tarjeta"],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: DEFAULT_TITLE },
      { name: "description", content: DEFAULT_DESC },
      { name: "keywords", content: "psicólogo La Serena, psicólogo Coquimbo, psicólogo Ovalle, psicólogo Vicuña, psicólogo Chile, psicólogo Fonasa, psicólogo Isapre, psicólogo particular, terapia psicológica La Serena, psicoterapia infantil La Serena, psicólogo adolescentes Coquimbo, psicólogo adultos jóvenes, psicólogo ansiedad, psicólogo depresión, psicólogo autoestima, psicólogo neurodivergencia, psicólogo TEA, psicólogo TDAH, terapia online Chile, psicólogo cerca de mí, terapia de pareja La Serena, psicólogo familiar Coquimbo, consejería en sexualidad, psicólogo clínico Chile" },
      { name: "author", content: "Alexander Bonilla" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "geo.region", content: "CL-CO" },
      { name: "geo.placename", content: "La Serena, Coquimbo, Chile" },
      { name: "geo.position", content: "-29.9027;-71.2519" },
      { name: "ICBM", content: "-29.9027, -71.2519" },
      { property: "og:title", content: DEFAULT_TITLE },
      { property: "og:description", content: DEFAULT_DESC },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_CL" },
      { property: "og:site_name", content: "Alexander Bonilla — Psicólogo Clínico" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: DEFAULT_TITLE },
      { name: "twitter:description", content: DEFAULT_DESC },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify(ORG_JSONLD),
    }],
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
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
