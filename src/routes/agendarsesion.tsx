import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { CreditCard } from "lucide-react";
import { PAYMENT_URL } from "@/lib/contact";

export const Route = createFileRoute("/agendarsesion")({
  head: () => ({
    meta: [
      { title: "Agendar sesión — Reserva tu cita | Alexander Bonilla" },
      { name: "description", content: "Reserva tu sesión de terapia con Alexander Bonilla de forma rápida y sencilla a través de Calendly." },
      { property: "og:title", content: "Agendar sesión — Alexander Bonilla" },
      { property: "og:description", content: "Reserva tu sesión de terapia presencial." },
    ],
    links: [{ rel: "canonical", href: "/agendarsesion" }],
  }),
  component: AgendarSesion,
});

function AgendarSesion() {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!widgetRef.current) return;
    const existing = document.getElementById("calendly-widget-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "calendly-widget-script";
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      <section className="bg-gradient-warm py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-4">Reservas</p>
          <h1 className="font-display text-4xl md:text-5xl text-balance">Agenda tu sesión</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Selecciona el día y horario que mejor te acomode. Te espero con calidez y profesionalismo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div
          ref={widgetRef}
          className="calendly-inline-widget"
          data-url="https://calendly.com/alexander-bonillaes/1hr?primary_color=4db6ac"
          style={{ minWidth: 320, height: 700 }}
        />
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <div className="rounded-3xl bg-card border border-border/60 p-8 md:p-10">
          <h2 className="font-display text-2xl mb-3">¿Ya agendaste?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Realiza el pago de tu sesión de forma segura a través de Flow. Te enviaré la confirmación una vez procesado.
          </p>
          <a
            href={PAYMENT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm hover:opacity-90 transition"
          >
            <CreditCard className="h-4 w-4" /> Pagar sesión
          </a>
        </div>
      </section>
    </>
  );
}
