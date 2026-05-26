import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CreditCard, CheckCircle2 } from "lucide-react";
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
  const paymentRef = useRef<HTMLDivElement>(null);
  const [scheduled, setScheduled] = useState(false);

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

  useEffect(() => {
    const isCalendlyEvent = (e: MessageEvent) =>
      typeof e.data === "object" &&
      e.data !== null &&
      "event" in e.data &&
      typeof (e.data as { event: string }).event === "string" &&
      (e.data as { event: string }).event.indexOf("calendly.") === 0;

    const handler = (e: MessageEvent) => {
      if (!isCalendlyEvent(e)) return;
      const event = (e.data as { event: string }).event;
      if (event === "calendly.event_scheduled") {
        setScheduled(true);
        setTimeout(() => {
          paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 400);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <>
      <section className="bg-gradient-warm py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-4">Reservas</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-balance">Agenda tu sesión</h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Selecciona el día y horario que mejor te acomode. Te espero con calidez y profesionalismo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8 md:py-12">
        <div
          ref={widgetRef}
          className="calendly-inline-widget h-[1000px] md:h-[750px]"
          data-url="https://calendly.com/alexander-bonillaes/1hr?primary_color=4db6ac"
          style={{ minWidth: 280 }}
        />
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 md:pb-24 text-center">
        <div
          ref={paymentRef}
          className={`rounded-3xl bg-card border p-6 sm:p-8 md:p-10 transition-all duration-500 ${
            scheduled ? "border-primary shadow-2xl ring-4 ring-primary/20" : "border-border/60"
          }`}
        >
          {scheduled && (
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary text-primary px-4 py-1.5 text-xs mb-4">
              <CheckCircle2 className="h-4 w-4" /> ¡Tu cita fue agendada!
            </div>
          )}
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
