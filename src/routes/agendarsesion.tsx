import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CreditCard, CheckCircle2, Download, X } from "lucide-react";
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
  const [scheduled, setScheduled] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);

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

    const handler = async (e: MessageEvent) => {
      if (!isCalendlyEvent(e)) return;
      const event = (e.data as { event: string }).event;
      if (event === "calendly.event_scheduled") {
        setCapturing(true);
        // Pequeña espera para que el iframe pinte la pantalla de confirmación
        await new Promise((r) => setTimeout(r, 600));
        try {
          if (widgetRef.current) {
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(widgetRef.current, {
              backgroundColor: "#ffffff",
              useCORS: true,
              allowTaint: true,
              scale: window.devicePixelRatio > 1 ? 2 : 1.5,
            });
            setSnapshot(canvas.toDataURL("image/png"));
          }
        } catch (err) {
          console.warn("No se pudo capturar el widget", err);
        }
        setCapturing(false);
        setScheduled(true);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const downloadPdf = async () => {
    if (!snapshot) return;
    const { jsPDF } = await import("jspdf");
    const img = new Image();
    img.src = snapshot;
    await new Promise((r) => (img.onload = r));

    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 32;

    // Encabezado
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(40, 40, 40);
    pdf.text("Confirmación de agendamiento", margin, margin + 6);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Alexander Bonilla — Psicólogo Clínico", margin, margin + 26);
    pdf.text(`Generado: ${new Date().toLocaleString("es-CL")}`, margin, margin + 42);

    // Imagen
    const maxW = pageW - margin * 2;
    const maxH = pageH - margin * 2 - 70;
    const ratio = Math.min(maxW / img.width, maxH / img.height);
    const w = img.width * ratio;
    const h = img.height * ratio;
    pdf.addImage(snapshot, "PNG", (pageW - w) / 2, margin + 60, w, h);

    pdf.save(`agendamiento-${Date.now()}.pdf`);
  };

  const closeModal = () => {
    setScheduled(false);
  };

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

      {capturing && !scheduled && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="rounded-2xl bg-card border border-border/60 px-6 py-4 text-sm text-muted-foreground shadow-xl">
            Capturando tu agendamiento…
          </div>
        </div>
      )}

      {scheduled && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-foreground/50 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-2xl bg-card border border-border/60 rounded-3xl shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              aria-label="Cerrar"
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-secondary/70 hover:bg-secondary text-foreground/70 hover:text-foreground flex items-center justify-center transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6 sm:p-8 md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary text-primary px-4 py-1.5 text-xs mb-4">
                <CheckCircle2 className="h-4 w-4" /> ¡Tu cita fue agendada!
              </div>

              {snapshot && (
                <div className="rounded-2xl overflow-hidden border border-border/60 bg-background mb-5">
                  <img src={snapshot} alt="Captura de tu agendamiento" className="w-full h-auto" />
                </div>
              )}

              <button
                onClick={downloadPdf}
                disabled={!snapshot}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-background text-primary px-6 py-3 text-sm hover:bg-primary/5 transition disabled:opacity-50 mb-8"
              >
                <Download className="h-4 w-4" /> Descargar agendamiento en PDF
              </button>

              <div className="border-t border-border/60 pt-6">
                <h2 className="font-display text-2xl mb-3">¿Ya agendaste?</h2>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
