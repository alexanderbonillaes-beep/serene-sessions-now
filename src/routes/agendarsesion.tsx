import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CreditCard, MessageCircle, ArrowLeftRight, Copy, Check } from "lucide-react";
import { PAYMENT_URL, WHATSAPP_NUMBER } from "@/lib/contact";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TRANSFER_DETAILS: Record<string, string> = {
  Nombre: "Alexander De Jesus Bonilla Espinoza",
  Rut: "18.631.788-2",
  Banco: "Banco Estado",
  "Tipo de cuenta": "Vista/Rut",
  "N° Cuenta": "18631788",
};

const RECEIPT_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola Alexander, te envío el comprobante de pago de mi sesión para confirmar."
)}`;




export const Route = createFileRoute("/agendarsesion")({
  head: () => ({
    meta: [
      { title: "Agendar sesión de psicología — La Serena, Coquimbo, Online | Alexander Bonilla" },
      { name: "description", content: "Reserva tu sesión de psicoterapia con Alexander Bonilla. Atención presencial en La Serena y online en todo Chile. Particular, Fonasa e Isapre. Pago seguro por Flow o transferencia." },
      { property: "og:title", content: "Agendar sesión — Psicólogo Alexander Bonilla" },
      { property: "og:description", content: "Reserva tu sesión presencial u online. Particular, Fonasa, Isapre." },
      { property: "og:url", content: "https://www.psalexanderbonilla.cl/agendarsesion" },
    ],
    links: [{ rel: "canonical", href: "https://www.psalexanderbonilla.cl/agendarsesion" }],
  }),
  component: AgendarSesion,
});

function AgendarSesion() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyTransfer = async () => {
    const text = Object.entries(TRANSFER_DETAILS)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

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
            Realiza el pago de tu sesión de forma segura a través de Flow o Transferencia. Si prefieres pagar en efectivo, indícalo por WhatsApp.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={PAYMENT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm hover:opacity-90 transition"
            >
              <CreditCard className="h-4 w-4" /> Pagar sesión
            </a>

            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background text-primary px-6 py-3 text-sm hover:bg-primary/5 transition cursor-pointer"
                >
                  <ArrowLeftRight className="h-4 w-4" /> Transferencia
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Datos para transferencia</DialogTitle>
                  <DialogDescription>
                    Usa estos datos para realizar la transferencia bancaria.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-2 rounded-lg border border-border/60 bg-muted/30 p-4 text-left">
                  <dl className="space-y-2 text-sm">
                    {Object.entries(TRANSFER_DETAILS).map(([k, v]) => (
                      <div key={k} className="flex flex-col sm:flex-row sm:justify-between sm:gap-4">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="font-medium text-foreground break-all">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTransfer}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm hover:opacity-90 transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Datos copiados
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copiar datos
                    </>
                  )}
                </button>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Recuerda enviar el comprobante por WhatsApp para confirmar.
                </p>
              </DialogContent>
            </Dialog>
          </div>

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
