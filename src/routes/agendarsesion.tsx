import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { CreditCard, MessageCircle } from "lucide-react";
import { PAYMENT_URL, WHATSAPP_NUMBER } from "@/lib/contact";

const RECEIPT_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola Alexander, te envío el comprobante de pago de mi sesión para confirmar."
)}`;


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
    const handler = (e: MessageEvent) => {
      const data = e.data as { event?: string } | null;
      if (
        data &&
        typeof data === "object" &&
        data.event === "calendly.event_scheduled"
      ) {
        setTimeout(() => {
          paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 3000);

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

      <section className="w-full px-0 sm:px-4 py-8 md:py-12">
        <div
          ref={widgetRef}
          className="calendly-inline-widget w-full h-[1000px] md:h-[900px]"
          data-url="https://calendly.com/alexander-bonillaes/1hr?primary_color=4db6ac&hide_gdpr_banner=1"
          style={{ minWidth: 280 }}
        />
      </section>

      <section ref={paymentRef} className="px-4 sm:px-6 pb-16 md:pb-20 scroll-mt-24">
        <div className="mx-auto max-w-2xl text-center rounded-3xl border border-border/60 bg-card p-8 md:p-10">
          <h2 className="font-display text-2xl md:text-3xl mb-3">¿Ya agendaste?</h2>
          <p className="text-muted-foreground mb-6">
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

          <div className="mt-8 pt-6 border-t border-border/60">
            <p className="text-sm font-medium text-foreground mb-2">¿Ya pagaste?</p>
            <p className="text-sm text-muted-foreground mb-4">
              Envíame el comprobante de pago por WhatsApp para confirmar tu sesión.
            </p>
            <a
              href={RECEIPT_WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background text-primary px-6 py-3 text-sm hover:bg-primary/5 transition"
            >
              <MessageCircle className="h-4 w-4" /> Enviar comprobante por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
